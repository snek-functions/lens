import { logger } from "@snek-at/function";
import ip from "ip";

import {
  connect as connectInsecure,
  createServer as createInsecureServer,
} from "net";
import { connect as connectSecure } from "tls";

type NetworkScannerDiscovery = Array<{
  host: string;
  ports: Array<{ port: number; isSecure: boolean }>;
}>;

export class NetworkScanner {
  private networks: string[];
  private portList: number[];
  private results: Record<string, Array<{ port: number; isSecure: boolean }>>;

  constructor(networks: string[], portList: number[]) {
    this.networks = networks;
    this.portList = portList;
    this.results = {};

    logger.info(
      `Initializing network scanner with networks [${networks}] and ports [${portList}]`
    );
  }

  private get discovery(): NetworkScannerDiscovery {
    return Object.entries(this.results).map(([host, ports]) => ({
      host,
      ports,
    }));
  }

  async scanNetworks() {
    const promises: Promise<void>[] = [];

    this.networks.forEach((network) => {
      const networkAddress = ip.cidrSubnet(network).networkAddress;
      const numHosts = ip.cidrSubnet(network).numHosts;

      for (let i = 1; i <= numHosts; i++) {
        const host = ip.fromLong(ip.toLong(networkAddress) + i);

        this.results[host] = [];

        this.portList.forEach((port) => {
          const promise = this.checkPort(host, port);
          promises.push(promise);
        });
      }
    });

    await Promise.all(promises);

    // Remove hosts without open ports for isSecure
    this.networks.forEach((network) => {
      Object.entries(this.results).forEach(([host, ports]) => {
        if (ports.length === 0) {
          delete this.results[host];
        }
      });
    });

    return this.discovery;
  }

  private async checkPort(host: string, port: number): Promise<void> {
    const connect = (isSecure: boolean) => {
      return new Promise<boolean>((resolve) => {
        const socket = isSecure
          ? connectSecure({
              host,
              port,
              rejectUnauthorized: false,
            })
          : connectInsecure({
              host,
              port,
            });

        socket.setTimeout(1000);

        socket.on(isSecure ? "secureConnect" : "connect", () => {
          this.results[host].push({ port, isSecure });

          socket.destroy();
          resolve(true);
        });

        socket.on("timeout", () => {
          socket.destroy();
          resolve(false);
        });

        socket.on("error", (msg) => {
          socket.destroy();
          resolve(false);
        });
      });
    };

    const isSecureConnection = await connect(true);

    if (!isSecureConnection) {
      await connect(false);
    }

    return Promise.resolve();
  }
}
