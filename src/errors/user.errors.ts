// errors/user.errors.ts
import { ServiceError } from "@snek-at/function";

export class UserNotFoundError extends ServiceError {
  constructor(id: string) {
    const message = `User with ID '${id}' was not found. Please double-check the ID and try again.`;

    super(message, {
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message,
    });
  }
}
