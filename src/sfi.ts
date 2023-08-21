import { defineService } from "@snek-at/function";
import dotenv from "dotenv";

import { lensProxyMiddleware } from "./middlewares/lens-proxy-middleware";
import { Lens } from "./services/lens.service";

dotenv.config();

export const lensService = new Lens();

export default defineService(
  {
    Query: {
      allService: lensService.getServices,
    },
    Mutation: {
      serviceLableUpdate: lensService.updateServiceLabel,
    },
  },
  {
    configureApp(app) {
      if (!lensService.isAutoDiscoveryRunning) {
        lensService.stopAutoDiscovery();
      }

      lensService.startAutoDiscovery();

      app.use("/", lensProxyMiddleware);

      return app;
    },
  }
);
