import {
  LensServiceMeta,
  LensRepository,
} from "../repositories/lens.repository";
import { NetworkScanner } from "./network-scanner.service";

// Repository for Lens services (persisted on disk)
export type LensService = {
  id: string;
  meta?: LensServiceMeta;
  fqdn: string;
  host: string;
  port: number;
  isSecure: boolean;
};

export class Lens {
  LENS_BASE_DOMAIN = process.env.LENS_BASE_DOMAIN ?? "lens.atsnek.com";

  networkScanner: NetworkScanner;
  name: string;
  port: number | undefined = undefined;

  externalUrls: string[] = [];

  services: LensService[] = [];
  repository: LensRepository = new LensRepository();

  constructor() {
    this.name = process.env.LENS_NAME ?? "application";
    this.port = Number(process.env.LENS_PORT) ?? undefined;
    const LENS_NETWORKS = process.env.LENS_NETWORKS?.split(",") ?? [];
    const LENS_PORTS = process.env.LENS_PORTS?.split(",").map(Number) ?? [];
    this.externalUrls = process.env.LENS_EXTERNAL_URLS?.split(",") ?? [];

    this.networkScanner = new NetworkScanner(LENS_NETWORKS, LENS_PORTS);

    this.getServices = this.getServices.bind(this);
    this.updateService = this.updateService.bind(this);
  }

  getURI() {
    let url = `${this.name}.${this.LENS_BASE_DOMAIN}`;

    if (this.port) {
      url = `${url}:${this.port}`;
    }

    return url;
  }

  async getServices() {
    const serviceMeta = await this.repository.getServiceMeta();

    // Merge serviceMeta with services
    this.services = this.services.map((service) => {
      return {
        ...service,
        meta: serviceMeta[service.id],
      };
    });

    // Order services by meta.order
    this.services.sort((a, b) => {
      const aOrder = a.meta?.order ?? 0;
      const bOrder = b.meta?.order ?? 0;

      return aOrder - bOrder;
    });

    return this.services;
  }

  async updateService(id: string, meta: LensServiceMeta) {
    await this.repository.updateServiceMeta(id, meta);

    return (await this.getServices()).find((service) => service.id === id);
  }

  autoDiscoveryInterval: NodeJS.Timeout | undefined = undefined;

  async start(cb: (services: LensService[]) => void) {
    const buildServiceList = async () => {
      const serviceList: LensService[] = [];

      const discovery = await this.networkScanner.scanNetworks();

      discovery.forEach(({ host, ports }) => {
        for (let i = 0; i < ports.length; i++) {
          const id = Buffer.from(`${host}:${ports[i].port}`).toString("hex");

          const fqdn = `${id}.${this.getURI()}`;

          serviceList.push({
            id,
            fqdn,
            host,
            port: ports[i].port,
            isSecure: ports[i].isSecure,
          });
        }
      });

      // Process staticUrls
      this.externalUrls.forEach((url) => {
        const externalUrl = new URL(url);

        let port = externalUrl.port;

        if (!port) {
          port = externalUrl.protocol === "https:" ? "443" : "80";
        }

        const id = Buffer.from(`${externalUrl.host}:${port}`).toString("hex");

        serviceList.push({
          id,
          fqdn: externalUrl.toString(),
          host: externalUrl.host,
          port: Number(port),
          isSecure: externalUrl.protocol === "https:",
        });
      });

      this.services = serviceList;

      return serviceList;
    };

    await buildServiceList();

    cb(this.services);

    if (this.autoDiscoveryInterval) {
      clearInterval(this.autoDiscoveryInterval);

      this.autoDiscoveryInterval = undefined;
    }

    this.autoDiscoveryInterval = setInterval(
      async () => {
        await buildServiceList();

        cb(this.services);
      },
      // 5 minutes
      5 * 60 * 1000
    );
  }

  stop() {
    if (this.autoDiscoveryInterval) {
      clearInterval(this.autoDiscoveryInterval);

      this.autoDiscoveryInterval = undefined;
    }
  }

  destroy() {
    this.stop();
  }
}
