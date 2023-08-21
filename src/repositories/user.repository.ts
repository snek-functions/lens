// repositories/users.repository.ts

import { User, users } from "../data/users";

export function createUser(user: { name: string; email: string }): User {
  const lastUser = users[users.length - 1];
  const newUserId = lastUser.id + 1;
  const newUser = { id: newUserId, ...user };
  users.push(newUser);
  return newUser;
}

export function getUsers(): User[] {
  return users;
}

export function getUserById(userId: number): User | undefined {
  return users.find((user) => user.id === userId);
}

export function updateUser(
  userId: number,
  user: {
    name: string;
    email: string;
  }
): User | undefined {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { id: userId, ...user };
    return users[index];
  }
  return undefined;
}

export function deleteUser(userId: number): boolean {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
}
