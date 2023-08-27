import {
  LensService,
  readServices,
  writeServices,
  updateServiceMeta,
} from "../repositories/lens.repository";
import { NetworkScanner } from "./network-scanner.service";

export class Lens {
  LENS_BASE_DOMAIN = process.env.LENS_BASE_DOMAIN ?? "lens.atsnek.com";

  networkScanner: NetworkScanner;
  name: string;
  services: LensService[] = [];

  constructor() {
    this.name = process.env.LENS_NAME ?? "application";
    const LENS_NETWORKS = process.env.LENS_NETWORKS?.split(",") ?? [];
    const LENS_PORTS = process.env.LENS_PORTS?.split(",").map(Number) ?? [];

    this.networkScanner = new NetworkScanner(LENS_NETWORKS, LENS_PORTS);

    this.getServices = this.getServices.bind(this);
    this.updateServiceMeta = this.updateServiceMeta.bind(this);
  }

  async getServices() {
    if (!this.services) {
      this.services = await readServices();
    }

    return this.services;
  }

  async updateServiceMeta(id: string, meta: LensService["meta"]) {
    const newServices = await updateServiceMeta(id, meta);

    this.services = newServices;

    return newServices;
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

      this.services = await writeServices(serviceList);

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
        const services = await buildServiceList();

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
