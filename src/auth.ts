import { createDecorator, getContext, ServiceError } from "@getcronit/pylon";

/**
 * Zitadel spells the project roles claim in several ways: the generic
 * `urn:zitadel:iam:org:project:roles`, its plural, and the project scoped
 * `urn:zitadel:iam:org:project:<projectId>:roles`. Which of them arrive
 * depends on the role assertion settings, so all of them count.
 *
 * Pylon's own role check reads only `urn:zitadel:iam:org:projects:roles`
 * from the introspection, a spelling Zitadel never emits. Its
 * `auth.user.roles` is therefore always empty and its check answers 403 to
 * every lens:admin holder.
 */
const ZITADEL_ROLES_CLAIM_RE = /^urn:zitadel:iam:org:projects?:(\d+:)?roles$/;

/**
 * The role keys in a bag of claims. Zitadel shapes each roles claim as
 * `{ "<roleKey>": { "<orgId>": "<orgDomain>" } }`, so the role names are the
 * keys of the claim object. Anything else under a matching name is ignored.
 */
export function rolesFromClaims(claims: Record<string, unknown>): string[] {
  const roles = new Set<string>();

  for (const [name, claim] of Object.entries(claims)) {
    if (!ZITADEL_ROLES_CLAIM_RE.test(name)) continue;

    if (claim && typeof claim === "object" && !Array.isArray(claim)) {
      for (const role of Object.keys(claim)) roles.add(role);
    }
  }

  return [...roles];
}

/**
 * A required role is held when the user carries it as is or prefixed with
 * the project id (`<AUTH_PROJECT_ID>:lens:admin`), the two spellings Pylon
 * accepted.
 */
function holdsRole(roles: string[], required: string): boolean {
  const projectId = process.env.AUTH_PROJECT_ID;

  return (
    roles.includes(required) ||
    (!!projectId && roles.includes(`${projectId}:${required}`))
  );
}

/**
 * `@requireAuth()` for lens, replacing Pylon's.
 *
 * Pylon's useAuth sets `auth = {openidConfig}` on every request, including
 * one that carries no token, and its authMiddleware only asks whether `auth`
 * is truthy. An anonymous request therefore passes every `@requireAuth()`
 * guard and reaches the resolver. For a service whose resolvers read and
 * write its own state, that is anonymous access. A missing token has to be a
 * 401 before any resolver runs.
 *
 * Roles, when asked for, are read from the user's Zitadel claims. Holding any
 * one of the listed roles is enough, as with Pylon's check.
 */
export function requireAuth(checks?: { roles?: string[] }) {
  return createDecorator(async () => {
    const ctx = getContext();
    const auth = ctx.get("auth") as
      | { user?: Record<string, unknown> }
      | undefined;

    if (!auth?.user) {
      throw new ServiceError("Authentication required", {
        statusCode: 401,
        code: "AUTH_REQUIRED",
      });
    }

    const required = checks?.roles ?? [];

    if (required.length) {
      const roles = rolesFromClaims(auth.user);

      if (!required.some((role) => holdsRole(roles, role))) {
        throw new ServiceError("Forbidden", {
          statusCode: 403,
          code: "AUTHORIZATION_REQUIRED",
          details: { missingRoles: required, obtainedRoles: roles },
        });
      }
    }
  });
}
