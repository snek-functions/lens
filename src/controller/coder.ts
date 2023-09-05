import { GraphQLError } from "graphql";

import { spawnChild } from "../utils";

export class Coder {
  // Fields
  host: string;
  login: string;

  // Constructor
  constructor(server: { host: string }) {
    this.host = server.host;
  }
  // Getter/Setter
  // Methods
  /**
 * Function to update user password
 *
 * @param username - The username of the user
 * @param password - The new password for the user
 * @returns Promise resolving to Response object
 */
  static async updatePassword(username: string, password: string): Promise<{ message: string }> {
    const url = `https://31302e3135322e3138332e3133353a38303830.photonq.lens.atsnek.com/api/v2/users/${username}/password`;
    const apiKey = process.env.CODER_API_KEY ?? 'API_KEY';

    const response: Response = await fetch(url, {
      method: 'PUT', // using PUT method to update the data
      headers: {
        'Content-Type': 'application/json',
        'Coder-Session-Token': apiKey, // auth token
      },
      body: JSON.stringify({ password }), // convert password to JSON string
    });

    // "Users without password login type cannot change their password.",
    // "Invalid password.",
    // "Internal error with passwords.",
    // "New password cannot match old password.",
    // "Internal error hashing new password.",
    // "Internal error hashing new password.",
    // "Internal error updating user's password."
    if (!response.ok) {
      const data = await response.json()

      throw new GraphQLError(data.message);
    }

    // data.message = "Password updated successfully."
    return { message: "Password updated successfully." };
  }
}