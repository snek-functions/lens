import { defineService, logger } from "@snek-at/function";
import dotenv from "dotenv";
import httpProxy from "http-proxy";

import { Lens } from "./services/lens.service";
import { LensService } from "./repositories/lens.repository";

dotenv.config();

export const lensService = new Lens();

const buildProxy = (service: LensService) => {
  const portocol = service.isSecure ? "https" : "http";

  const proxyOptions = {
    target: `${portocol}://${service.host}:${service.port}`, // Replace with your actual web service URL
    secure: false,
    ws: true,
  };

  const proxy = httpProxy.createProxyServer(proxyOptions);

  proxy.on("proxyRes", (proxyRes, req, res) => {
    // Add X-Lens header to response
    proxyRes.headers["X-Lens"] = "true";
    // Add X-Frame-Options header to response
    delete proxyRes.headers["x-frame-options"];
  });

  return proxy;
};

const serviceMap = new Map<
  string,
  {
    proxy: httpProxy;
    service: LensService;
  }
>();

const fqdnProxyMap = new Map<
  string,
  {
    proxy: httpProxy;
    service: LensService;
  }
>();

export default defineService(
  {
    Query: {
      allService: lensService.getServices,
    },
    Mutation: {
      serviceMetaUpdate: lensService.updateServiceMeta,
    },
  },
  {
    async configureApp(app) {
      await lensService.start((cb) => {
        logger.info(`Received services: ${JSON.stringify(cb)}`);

        // loop all services
        cb.forEach((service) => {
          // skip if already proxied
          if (serviceMap.has(service.id)) {
            return;
          }

          // build proxy
          const proxy = buildProxy(service);

          // add proxy to serviceMap
          serviceMap.set(service.id, {
            proxy,
            service,
          });

          // add service to fqdnMap
          fqdnProxyMap.set(service.fqdn, {
            proxy,
            service,
          });

          // add proxy to app
          app.use((req, res, next) => {
            const [lens, application, serviceId] = req.subdomains;

            if (
              lens !== "lens" ||
              application === undefined ||
              serviceId === undefined
            ) {
              next();
              return;
            }

            // Make sure that the service is actually available
            console.log("Checking service", service.id, serviceId);
            if (service.id !== serviceId) {
              next();
              return;
            }

            console.log("Proxying request to", service.id, serviceId);

            proxy.web(req, res);
          });
        });
      });

      return app;
    },
    async configureServer(server) {
      server.on("upgrade", async (req, socket, head) => {
        const serverName = req.socket.servername;

        // Find serverName in serviceMap service.fqdn value

        const proxy = fqdnProxyMap.get(serverName)?.proxy;

        if (proxy) {
          proxy.ws(req, socket, head);
        }
      });
    },
  }
);
