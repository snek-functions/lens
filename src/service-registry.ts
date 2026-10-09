import type { LensService } from "./services/lens.service";

/**
 * The discovered services by id, shared by the proxy and the auth plugin.
 *
 * Pylon bundles the exported `config`, and with it the auth plugin, into
 * .pylon/config.js apart from the server bundle. Every module both of them
 * import therefore exists twice at runtime, and a plain module level Map
 * would be filled in one copy and read empty in the other. The map lives on
 * globalThis under a registered symbol instead, which both copies resolve to
 * the same slot.
 */
const SLOT = Symbol.for("@snek-at/lens/services");

type Registry = { services: Map<string, LensService> };

function registry(): Registry {
  const slots = globalThis as unknown as Record<symbol, Registry | undefined>;

  return (slots[SLOT] ??= { services: new Map() });
}

export function setServices(services: LensService[]): void {
  registry().services = new Map(
    services.map((service) => [service.id, service])
  );
}

/**
 * The service a request addresses with the first label of its host name, as
 * in `<serviceId>.<LENS_NAME>.<LENS_BASE_DOMAIN>`. A host name without a dot
 * addresses none, and neither does any label that is not a discovered id.
 */
export function serviceForUrl(url: string): LensService | undefined {
  const labels = new URL(url).hostname.split(".");

  return labels.length > 1 ? registry().services.get(labels[0]) : undefined;
}
