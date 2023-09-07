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
  services: LensService[] = [];
  repository: LensRepository = new LensRepository();

  constructor() {
    this.name = process.env.LENS_NAME ?? "application";
    const LENS_NETWORKS = process.env.LENS_NETWORKS?.split(",") ?? [];
    const LENS_PORTS = process.env.LENS_PORTS?.split(",").map(Number) ?? [];

    this.networkScanner = new NetworkScanner(LENS_NETWORKS, LENS_PORTS);

    this.getServices = this.getServices.bind(this);
    this.updateService = this.updateService.bind(this);
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
          const fqdn = `${id}.${this.name}.${this.LENS_BASE_DOMAIN}`;

          serviceList.push({
            id,
            fqdn,
            host,
            port: ports[i].port,
            isSecure: ports[i].isSecure,
          });
        }
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
