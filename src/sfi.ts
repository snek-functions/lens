import {
  ServiceError,
  defineService,
  logger,
  withContext,
} from "@snek-at/function";
import dotenv from "dotenv";
import httpProxy from "http-proxy";

import { Lens, LensService } from "./services/lens.service";
import { Coder } from "./controller/coder";
import { Samba } from "./controller/samba";
import { requireAdminOnLens, requireAuthOnLens } from "./decorators";
import { sq } from "./clients/origin/src/index";

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
    proxy?: httpProxy;
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
      //sambaPasswordUpdate: Samba.updatePassword,
      //coderPasswordUpdate: Coder.updatePassword,
      updateInternalPassword: withContext(
        (context) => async (password: string) => {
          const token = context.req.headers.authorization;

          if (!token) {
            throw new ServiceError(`No token provided`, {
              code: "NO_TOKEN_PROVIDED_FOR_UPDATE_INTERNAL_PASSWORD",
              statusCode: 401,
              message:
                "This error should never happen, please contact the administrator",
            });
          }

          console.log("\n\n\n vur dem ding");
          const [user, errors] = await sq.query(
            (q) => ({
              username: q.userMe.username,
              email: q.userMe.primaryEmailAddress,
              firstName: q.userMe.details?.firstName ?? undefined,
              lastName: q.userMe.details?.lastName ?? undefined,
            }),
            {
              headers: {
                Authorization: token,
              },
            }
          );
          console.log("noch dem ding\n\n\n");
          logger.info(`Updating password for ${user.username}`);

          if (errors) {
            throw new ServiceError(`Failed to get username: ${errors}`, {
              code: "FETCH_USERNAME_FROM_ORIGIN_FAILED",
              statusCode: 500,
              message: "Failed to get username",
            });
          }

          const coderRes = await Coder.updatePassword(
            user.username,
            password
          );
          console.log("lol\n\n\n");
          const sambaRes = await Samba.createOrUpdateUser(
            user.username,
            password,
            user.email,
            user.firstName,
            user.lastName
          );

          return {
            coder: coderRes.message,
            samba: sambaRes,
          };
        },
        { decorators: [requireAuthOnLens] }
      ),

      // updateInternalPassword: withContext(
      //   (context) => async (password: string) => {
      //     const token = context.req.headers.authorization;

      //     if (!token) {
      //       throw new ServiceError(`No token provided`, {
      //         code: "NO_TOKEN_PROVIDED_FOR_UPDATE_INTERNAL_PASSWORD",
      //         statusCode: 401,
      //         message:
      //           "This error should never happen, please contact the administrator",
      //       });
      //     }

      //     const [username, errors] = await sq.query((q) => q.userMe.username, {
      //       headers: {
      //         Authorization: token,
      //       },
      //     });

      //     logger.info(`Updating password for ${username}`);

      //     if (errors) {
      //       throw new ServiceError(`Failed to get username: ${errors}`, {
      //         code: "FETCH_USERNAME_FROM_ORIGIN_FAILED",
      //         statusCode: 500,
      //         message: "Failed to get username",
      //       });
      //     }

      //     const coderRes = await Coder.updatePassword(username, password);
      //     const sambaRes = await Samba.updatePassword(username, password);

      //     return {
      //       coder: coderRes.message,
      //       samba: sambaRes,
      //     };
      //   },
      //   { decorators: [requireAuthOnLens] }
      // ),

      serviceUpdate: withContext(() => lensService.updateService, {
        decorators: [requireAdminOnLens],
      }),
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

          if (service.redirect) {
            // add proxy to serviceMap
            serviceMap.set(service.id, {
              service,
            });

            // Use redirect instead of proxy

            app.use((req, res, next) => {
              const serviceId = req.subdomains[req.subdomains.length - 1];

              if (serviceId === undefined) {
                next();
                return;
              }

              // Make sure that the service is actually available
              if (service.id !== serviceId) {
                next();
                return;
              }

              console.log("Redirecting request to", service.id, serviceId);

              if (service.redirect) {
                console.log("Redirecting to", service.redirect);

                res.redirect(service.redirect);
              } else {
                res.status(404).send("Not found. Redirect is not set.");
              }
            });
          } else {
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
              const serviceId = req.subdomains[req.subdomains.length - 1];

              if (serviceId === undefined) {
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
          }
        });
      });

      return app;
    },
    async configureServer(server) {
      server.on("upgrade", async (req, socket, head) => {
        const serverName = req.socket.servername;

        console.log("Upgrading", serverName);

        let proxy = fqdnProxyMap.get(serverName)?.proxy;

        if (!proxy) {
          const fqdnWithPort = `${serverName}:${process.env.LENS_PORT}`;

          console.log("Trying to upgrade with LENS_PORT", fqdnWithPort);

          proxy = fqdnProxyMap.get(fqdnWithPort)?.proxy;
        }

        if (proxy) {
          proxy.ws(req, socket, head);
        }
      });
    },
  }
);
