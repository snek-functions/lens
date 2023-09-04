// import {
//   DUCKDB_ALIAS_PATH,
//   DUCKDB_RESOURCE_PATH,
//   DUCKDB_USER_PATH
// } from '../constants'
import { GraphQLError } from "graphql";

import { spawnChild } from "../utils";

export class Samba {
  // Fields
  host: string;
  login: string;

  // Constructor
  constructor(server: { host: string }) {
    this.host= server.host;
  }
  // Getter/Setter
  // Methods
  static async updatePw(
    username: string,
    password: string
  ) {
    const res = await spawnChild(
      "/env/bash",
      "src/internal/update_samba_password.sh",
      [
        `kleberf`,
        `ciscocisco`,
      ]
    );

    //const user = JSON.parse(ew)[0];

    console.log(res);

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