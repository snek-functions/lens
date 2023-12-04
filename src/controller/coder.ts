import { GraphQLError } from "graphql";

export class Coder {
  // Fields
  host: string;

  // Constructor
  // constructor(server: { host: string }) {
  //   this.host = server.host;
  // }
  
  // Methods

  // Function to get user ID by login name
  static async getUserIdByLoginName(loginName: string): Promise<string> {
    //const url = `${this.host}/management/v1/global/users/_by_login_name?loginName=${loginName}`;
    const url = `${process.env.ZITADEL_HOST}/management/v1/global/users/_by_login_name?loginName=${loginName}`;
    const apiKey = process.env.ZITADEL_API_KEY ?? 'API_KEY';

    const response: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new GraphQLError(data.message || "Failed to fetch user ID");
    }

    const data = await response.json();
    return data.user.id;
  }

  // Function to update user password
  static async updatePassword(loginName: string, password: string): Promise<{ message: string }> {
    const userId = await Coder.getUserIdByLoginName(loginName);
    //const url = `${this.host}/management/v1/users/${userId}/password`;
    const url = `${process.env.ZITADEL_HOST}management/v1/users/${userId}/password`;

    const apiKey = process.env.ZITADEL_API_KEY ?? 'API_KEY';

    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        password: password,
        noChangeRequired: true // Change as needed
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new GraphQLError(data.message || "Failed to update password");
    }

    return { message: "Password updated successfully." };
  }
}
