import { GraphQLError } from "graphql";

import { spawnChild } from "../utils";

export class Samba {
  // Fields
  host: string;

  // Constructor
  constructor(server: { host: string }) {
    this.host= server.host;
  }
  // Getter/Setter
  // Methods
  static async createOrUpdateUser(username: string, password: string, email: string, firstName?: string, lastName?: string): Promise<string> {
    const res: string = await spawnChild(
      "bash",
      "../src/internal/create_or_update_samba_user.sh",
      [
        `'${username}'`,
        `'${password}'`,
        `'${email}'`,
        `'${firstName}'`,
        `'${lastName}'`,
      ]
    );

    //const user = JSON.parse(ew)[0];

    console.log(res);
    return res;
  }

  static async updatePassword(username: string, password: string): Promise<string> {
    const res: string = await spawnChild(
      "bash",
      "../src/internal/update_samba_password.sh",
      [
        `'${username}'`,
        `'${password}'`,
      ]
    );

    //const user = JSON.parse(ew)[0];

    console.log(res);
    return res;

    // if (user.userId !== "007") {
    //   if (await hash.verify(password, user.passwordHash)) {
    //     return {
    //       userId: user.userId.toString(),
    //     };
    //   }

    //   throw new GraphQLError("Wrong password");
    // }

    // throw new GraphQLError("Wrong login");

    //throw new Error(`Unable to authenticate: ${login}`)
  }
}