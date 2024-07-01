import { GraphQLError } from "graphql";
import { spawnChild } from "../utils";

export class Coder {
  // Function to get user ID by login name
  static async getUserIdByLoginName(loginName: string): Promise<string> {
    //const url = `${this.host}/management/v1/global/users/_by_login_name?loginName=${loginName}`;
    const url = `${process.env.ZITADEL_HOST}/management/v1/global/users/_by_login_name?loginName=${loginName}`;
    const apiKey = process.env.ZITADEL_API_KEY ?? "API_KEY";

    const response: Response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const data = (await response.json()) as any;
      throw new GraphQLError(data.message || "Failed to fetch user ID");
    }

    const data = (await response.json()) as any;
    return data.user.id;
  }

  // Function to update user password
  static async updatePassword(
    loginName: string,
    password: string
  ): Promise<{ message: string }> {
    const userId = await Coder.getUserIdByLoginName(loginName);
    console.log("UserID: " + userId);
    //const url = `${this.host}/management/v1/users/${userId}/password`;
    const url = `${process.env.ZITADEL_HOST}/management/v1/users/${userId}/password`;
    console.log("The Url:" + url);
    const apiKey = process.env.ZITADEL_API_KEY ?? "API_KEY";

    const response: Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        password: password,
        noChangeRequired: true, // Change as needed
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as any;
      throw new GraphQLError(data.message || "Failed to update password");
    }
    const data = await response.json();
    console.log("Result zitadel: " + `${JSON.stringify(data)}`);

    const vaultUrl = `${process.env.VAULT_HOST}/v1/users/${userId}/samba`;
    console.log("The vault Url:" + vaultUrl);
    const vaultKey = process.env.VAULT_UPDATE_KEY ?? "API_KEY";
    console.log("The vault key:" + vaultKey);

    // Properly format the token value
    const token = Buffer.from(
      `username=${loginName},password=${password}`,
      "utf8"
    ).toString("hex");

    const res: string = await spawnChild(
      "bash",
      "../src/internal/update_samba_vault.sh",
      [`${token}`, `${userId}`, `${vaultKey}`]
    );

    //const user = JSON.parse(ew)[0];

    console.log(res);

    return { message: "Password updated successfully." };
  }
}
