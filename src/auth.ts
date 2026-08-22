import {
  authMiddleware,
  createDecorator,
  getContext,
  ServiceError,
} from "@getcronit/pylon";

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
 * Roles, when asked for, are delegated to Pylon's own check so the two stay
 * in step.
 */
export function requireAuth(checks?: { roles?: string[] }) {
  return createDecorator(async () => {
    const ctx = getContext();
    const auth = ctx.get("auth") as { user?: unknown } | undefined;

    if (!auth?.user) {
      throw new ServiceError("Authentication required", {
        statusCode: 401,
        code: "AUTH_REQUIRED",
      });
    }

    if (checks?.roles?.length) {
      await authMiddleware(checks)(ctx as any, async () => {});
    }
  });
}
