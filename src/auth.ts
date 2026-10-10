import {
  createDecorator,
  getContext,
  type Plugin,
  ServiceError,
  useAuth,
} from "@getcronit/pylon";
import { HTTPException } from "hono/http-exception";

import { serviceForUrl } from "./service-registry";

/**
 * Pylon's useAuth, limited to the lens API host.
 *
 * Pylon runs plugin middleware for every request before any lens middleware,
 * proxied hosts and WebSocket upgrades included. Unmodified, useAuth answers
 * a non-Bearer Authorization header (the Cockpit and Keel logins through the
 * proxy) with 401 "Invalid token", a foreign Bearer token (the Portainer API)
 * with 401 "Token is not active", and an expired photonq.org session with a
 * 401 that carries no CORS headers, which the browser reports as "Failed to
 * fetch".
 *
 * This plugin leaves a request alone when the first label of its host name
 * is a discovered service id, because such a request belongs to the proxied
 * service and its own login. On every other host it runs useAuth's
 * middleware, and a 401 from it lets the request go on anonymously. Public
 * resolvers such as allService then answer, and guarded resolvers fail inside
 * GraphQL with CORS headers. useAuth's /auth/login, /auth/logout and
 * /auth/callback routes are not registered, since lens signs nobody in.
 */
export function apiHostAuth(args: { issuer: string }): Plugin {
  const { middleware: introspect } = useAuth({ issuer: args.issuer });

  if (!introspect) {
    throw new Error("Pylon's useAuth no longer provides a middleware");
  }

  return {
    middleware: async (ctx, next) => {
      if (!serviceForUrl(ctx.req.url)) {
        // useAuth reads its key through Pylon's getContext(), which replaces
        // ctx.env with the process environment. It does so on the first
        // request after a start, and again after a failed discovery, since
        // only a successful one is cached. hono's upgradeWebSocket, the next
        // lens middleware, looks up the Bun server in ctx.env and threw
        // "server.upgrade is not a function" for such a request, which then
        // answered 500. The request keeps the env it came with.
        const env = ctx.env;

        try {
          await introspect(ctx, async () => {});
        } catch (error) {
          if (!(error instanceof HTTPException) || error.status !== 401) {
            throw error;
          }

          console.info(`Continuing anonymously after ${error.message}`);
        } finally {
          ctx.env = env;
        }
      }

      return next();
    },
  };
}

/**
 * The one roles claim lens trusts, the one of the project named by
 * AUTH_PROJECT_ID (PHOTONQ 268418173034829430 on accounts.photonq.org).
 * Zitadel fills `urn:zitadel:iam:org:project:<projectId>:roles` only from the
 * user's grants on that project, which only the project's owner can give, and
 * actions cannot set any claim under `urn:zitadel:iam`.
 *
 * No other roles claim counts. The generic `urn:zitadel:iam:org:project:roles`
 * holds the roles of whatever project the token's client belongs to, and the
 * claim of another project id holds the roles of that project. Organization
 * registration on accounts.photonq.org is open, so a stranger can own a
 * project with a role keyed `lens:admin`, hold that role, ask for this
 * project in the token audience and present the role in either claim. A role
 * key means something only together with the project that defines it.
 *
 * Pylon's own role check reads `urn:zitadel:iam:org:projects:roles` from the
 * introspection, a spelling Zitadel never emits. Its `auth.user.roles` is
 * therefore always empty and is not read here.
 */
export function projectRolesClaim(projectId: string): string {
  return `urn:zitadel:iam:org:project:${projectId}:roles`;
}

/**
 * The role keys the user holds on the given project. Zitadel shapes a roles
 * claim as `{ "<roleKey>": { "<orgId>": "<orgDomain>" } }`, so the role names
 * are the keys of the claim object. Every other claim is ignored.
 */
export function rolesFromClaims(
  claims: Record<string, unknown>,
  projectId: string,
): string[] {
  const claim = claims[projectRolesClaim(projectId)];

  if (!claim || typeof claim !== "object" || Array.isArray(claim)) return [];

  return Object.keys(claim);
}

/**
 * A required role is held when the project's claim carries it as is or
 * prefixed with the project id (`<projectId>:lens:admin`), the two spellings
 * Pylon accepted. Both are keys of that one claim.
 */
function holdsRole(
  roles: string[],
  required: string,
  projectId: string,
): boolean {
  return (
    roles.includes(required) || roles.includes(`${projectId}:${required}`)
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
 * Roles, when asked for, are read from the roles claim of the AUTH_PROJECT_ID
 * project alone (see projectRolesClaim). Holding any one of the listed roles
 * is enough, as with Pylon's check.
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
      // src/index.ts refuses to start without AUTH_PROJECT_ID. Should it be
      // missing here all the same, no role counts.
      const projectId = process.env.AUTH_PROJECT_ID ?? "";
      const roles = projectId ? rolesFromClaims(auth.user, projectId) : [];

      if (!required.some((role) => holdsRole(roles, role, projectId))) {
        throw new ServiceError("Forbidden", {
          statusCode: 403,
          code: "AUTHORIZATION_REQUIRED",
          details: { missingRoles: required, obtainedRoles: roles },
        });
      }
    }
  });
}
