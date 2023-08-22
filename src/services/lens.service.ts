import {
  LensService,
  readServices,
  updateServiceLabel,
  writeServices,
} from "../repositories/lens.repository";
import { NetworkScanner } from "./network-scanner.service";

export class Lens {
  LENS_BASE_DOMAIN = process.env.LENS_BASE_DOMAIN ?? "lens.atsnek.com";

  networkScanner: NetworkScanner;
  name: string;
  services: LensService[] | undefined = undefined;

  constructor() {
    this.name = process.env.LENS_NAME ?? "application";
    const LENS_NETWORKS = process.env.LENS_NETWORKS?.split(",") ?? [];
    const LENS_PORTS = process.env.LENS_PORTS?.split(",").map(Number) ?? [];

    this.networkScanner = new NetworkScanner(LENS_NETWORKS, LENS_PORTS);

    this.getServices = this.getServices.bind(this);
    this.updateServiceLabel = this.updateServiceLabel.bind(this);
  }

  get isAutoDiscoveryRunning() {
    return this.networkScanner.isAutoDiscoveryRunning;
  }

  async getServices() {
    console.log("this.services", this);
    if (!this.services) {
      this.services = await readServices();
    }

    return this.services;
  }

  async updateServiceLabel(id: string, label: string) {
    const newServices = await updateServiceLabel(id, label);

    this.services = newServices;

    return newServices;
  }

  startAutoDiscovery() {
    this.networkScanner.startAutoDiscovery(async (discovery) => {
      console.log("Doing auto discovery");
      const serviceList: LensService[] = [];

      discovery.forEach(({ host, ports }) => {
        for (let i = 0; i < ports.length; i++) {
          const id = Buffer.from(`${host}:${ports[i]}`).toString("hex");
          const fqdn = `${id}.${this.name}.${this.LENS_BASE_DOMAIN}`;

          serviceList.push({
            id,
            fqdn,
            host,
            port: ports[i],
          });
        }
      });

      this.services = await writeServices(serviceList);
    });
  }

  stopAutoDiscovery() {
    this.networkScanner.stopAutoDiscovery();
  }

  destroy() {
    this.stopAutoDiscovery();
  }
}
