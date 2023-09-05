import { decorator, logger } from "@snek-at/function";
import {
  requireAdminForResource,
  requireAuthForResource,
} from "@snek-functions/jwt";
import dotenv from "dotenv";

dotenv.config();

const RESOURCE_ID = process.env.RESOURCE_ID;

if (!RESOURCE_ID) {
  throw new Error(
    `RESOURCE_ID is not set, this is required for running this function.`
  );
}

/**
 * A decorator that checks if the user is a user on lens.
 */
export const requireAuthOnLens = decorator(async (context) => {
  return await requireAuthForResource(context, [RESOURCE_ID]);
});

/**
 * A decorator that checks if the user is an admin on lens.
 */
export const requireAdminOnLens = decorator(async (context) => {
  return await requireAdminForResource(context, [RESOURCE_ID]);
});
