import { logger } from "@snek-at/function";
import ip from "ip";
import * as net from "net";

type NetworkScannerDiscovery = Array<{
  host: string;
  ports: number[];
}>;

export class NetworkScanner {
  private networks: string[];
  private portList: number[];
  private results: Record<string, number[]>;

  private autoDiscoveryInterval: NodeJS.Timeout | null = null;

  constructor(networks: string[], portList: number[]) {
    this.networks = networks;
    this.portList = portList;
    this.results = {};

    logger.info(
      `Initializing network scanner with networks [${networks}] and ports [${portList}]`
    );
  }

  get discovery(): NetworkScannerDiscovery {
    return Object.entries(this.results).map(([host, ports]) => ({
      host,
      ports,
    }));
  }

  get isAutoDiscoveryRunning(): boolean {
    return this.autoDiscoveryInterval !== null;
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

    // Remove hosts without open ports for each network
    this.networks.forEach((network) => {
      Object.entries(this.results).forEach(([host, ports]) => {
        if (ports.length === 0) {
          delete this.results[host];
        }
      });
    });

    console.log(this.results);
  }

  async startAutoDiscovery(cb: (discovery: NetworkScannerDiscovery) => void) {
    logger.info("Discover networks on startup");
    await this.scanNetworks();

    cb(this.discovery);

    logger.info("Discovery networks every 5 minutes");
    this.autoDiscoveryInterval = setInterval(async () => {
      logger.info("Starting network scan");
      await this.scanNetworks();
      logger.info("Network scan completed");

      cb(this.discovery);
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  stopAutoDiscovery() {
    if (this.autoDiscoveryInterval !== null) {
      clearInterval(this.autoDiscoveryInterval);
      this.autoDiscoveryInterval = null;
    }
  }

  // Destructor (optional, depending on your use case)
  // This will be automatically called when the object is garbage collected
  // Make sure you're using the appropriate destructor syntax based on your environment (e.g., Node.js or browser)
  // For Node.js, you can use "destroy" event on the "this" object, or override the "destroy" method
  destroy() {
    console.log("Destroying network scanner");
    this.stopAutoDiscovery();
  }

  private async checkPort(host: string, port: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(1000); // Adjust timeout as needed

      socket.on("connect", () => {
        this.results[host].push(port); // Store open port in results
        socket.end();
        resolve();
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();
        resolve();
      });

      socket.connect(port, host);
    });
  }
}
