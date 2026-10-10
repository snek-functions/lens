import { ServiceError } from "@getcronit/pylon";

const PASSWORD_CHANGE_DISABLED =
  "Die Passwortänderung über lens ist vorübergehend abgeschaltet, sie " +
  "wandert in die Anmeldung von accounts.photonq.org.";

/**
 * The password change of the old lens, switched off.
 *
 * It took `preferred_username` from the caller's claims and set the password
 * of that login on Zitadel #1 (its REST management API) and the CIFS
 * credential in Vault. Nothing tied that login on Zitadel #1 to the caller,
 * no role was asked for, and organization registration on
 * accounts.photonq.org is open. Anybody could register a user under another
 * person's login name and take over that person's account on Zitadel #1 and
 * the Samba share behind it.
 *
 * The password change moves into the sign-in of accounts.photonq.org. Until
 * then every caller is refused, signed in or not, and nothing reaches
 * Zitadel #1 or Vault. The mutation stays in the schema with its argument
 * and result type, since gatsby-jaen-lens still calls it and shows the
 * message. The old lens answered 500 to every request with a token, so no
 * working path is lost.
 */
export class PasswordUpdater {
  // The parameter name and the declared result keep
  // `updateInternalPassword(password: String!): UpdateInternalPassword!`
  // in the generated schema.
  static async updatePassword(
    password: string,
  ): Promise<{ coder: string; samba: string }> {
    console.info("Refused updateInternalPassword, it is switched off");

    throw new ServiceError(PASSWORD_CHANGE_DISABLED, {
      statusCode: 503,
      code: "PASSWORD_CHANGE_DISABLED",
    });
  }
}
