import { logger } from "@snek-at/function";
import { NextFunction, Request, Response } from "express";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { lensService } from "../sfi";

export const lensProxyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [lens, application, serviceId] = req.subdomains;

  logger.info(`Received request for ${lens}/${application}/${serviceId}`);

  if (lens !== "lens" || application === undefined || serviceId === undefined) {
    next();
    return;
  }

  try {
    // Make sure that the service is actually available
    const services = await lensService.getServices();
    const service = services.find((s) => s.id === serviceId);

    if (service === undefined) {
      res.status(404).send(`Service ${serviceId} not found`);
      return;
    }

    let target: string;

    if (service.port === 443) {
      target = `https://${service.host}`;
    } else if (service.port === 80) {
      target = `http://${service.host}`;
    } else {
      target = `http://${service.host}:${service.port}`;
    }

    logger.info(`Proxying request to ${target}`);

    return createProxyMiddleware({
      target,
      xfwd: true,
      secure: false,
      changeOrigin: true,
      // autoRewrite: false,
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
        // Remove X-Frame-Options header from response
        res.removeHeader("X-Frame-Options");
        res.setHeader("X-Lens", "true");

        return buffer;
      }),
    })(req, res, next);
  } catch (error) {
    logger.error(`Error processing request: ${error.message}`);
    res.status(500).send("Internal Server Error");
    return;
  }
};
