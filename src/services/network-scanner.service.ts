import { logger } from "@getcronit/pylon";
import ip from "ip";

import * as http from "http";
import * as https from "https";

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
      console.log(`Scanning network ${network}`);
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

    console.log("Scanning networks...");

    await Promise.all(promises);

    console.log("Network scan complete");

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
        const request = (isSecure ? https : http).request(
          {
            host,
            port,
            method: "HEAD", // Use HEAD method for faster response without full content
            timeout: 1000, // Timeout in milliseconds
            rejectUnauthorized: false, // Ignore SSL certificate errors
          },
          (response) => {
            // If the response is received, the port is open
            console.log(`Port ${port} is open on ${host}`);
            this.results[host].push({ port, isSecure });
            resolve(true);
          }
        );

        request.on("error", (error) => {
          // If an error occurs or the connection times out, the port is closed
          console.error(`Port ${port} is closed on ${host}: ${error.message}`);
          resolve(false);
        });

        request.on("timeout", () => {
          // If the request times out, consider the port closed
          console.error(
            `Timeout occurred while testing port ${port} on ${host}`
          );
          request.abort();
          resolve(false);
        });

        request.end();
      });
    };

    const isSecureConnection = await connect(true);

    if (!isSecureConnection) {
      await connect(false);
    }

    return Promise.resolve();
  }
}
