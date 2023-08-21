// services/user.service.ts
import { withContext } from "@snek-at/function";

import * as userRepository from "../repositories/user.repository";
import { UserNotFoundError } from "../errors/user.errors";

export class UserService {
  static userCreate = withContext(() => (name: string, email: string) => {
    const user = userRepository.createUser({ name, email });

    return user;
  });

  static allUser = withContext(() => () => {
    const users = userRepository.getUsers();

    return users;
  });

  static user = withContext(() => (userId: number) => {
    const user = userRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId.toString());
    }

    return user;
  });

  static userUpdate = withContext(
    () => (userId: number, name: string, email: string) => {
      const user = userRepository.updateUser(userId, { name, email });

      if (!user) {
        throw new UserNotFoundError(userId.toString());
      }

      return user;
    }
  );

  static userDelete = withContext(() => (userId: number) => {
    const success = userRepository.deleteUser(userId);

    return success;
  });
}
