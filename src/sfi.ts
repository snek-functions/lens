import { defineService, logger } from "@snek-at/function";
import { UserService } from "./services/user.service";

export default defineService(
  {
    Query: {
      allUser: UserService.allUser,
      user: UserService.user,
    },
    Mutation: {
      userCreate: UserService.userCreate,
      userUpdate: UserService.userUpdate,
      userDelete: UserService.userDelete,
    },
  },
  {
    configureApp(app) {
      logger.info("Configuring app");
      return app;
    },
  }
);
