import { ServiceError, getContext, requireAuth } from "@getcronit/pylon";
import { Coder } from "../controller/coder";
import { Samba } from "../controller/samba";

export class PasswordUpdater {
  @requireAuth()
  static async updatePassword(password: string) {
    // Pylon v3 exposes the OIDC claims under `auth.user` (AuthState), not on
    // the auth object directly.
    const auth = getContext().get("auth")!;
    const username = auth.user?.preferred_username;
    const email = auth.user?.email;
    const firstName = auth.user?.given_name;
    const lastName = auth.user?.family_name;

    console.log(username, email, firstName, lastName, password);

    if (!username) {
      throw new ServiceError(`No username provided`, {
        code: "NO_USERNAME_PROVIDED_FOR_UPDATE_INTERNAL_PASSWORD",
        statusCode: 401,
      });
    } else if (!email) {
      throw new ServiceError(`No email provided`, {
        code: "NO_EMAIL_PROVIDED_FOR_UPDATE_INTERNAL_PASSWORD",
        statusCode: 401,
      });
    } else if (!firstName) {
      throw new ServiceError(`No first name provided`, {
        code: "NO_FIRST_NAME_PROVIDED_FOR_UPDATE_INTERNAL_PASSWORD",
        statusCode: 401,
      });
    }

    console.info(`Updating password for ${auth.user?.sub}`);

    const coderRes = await Coder.updatePassword(username, password);
    const sambaRes = await Samba.createOrUpdateUser(
      username,
      password,
      email,
      firstName,
      lastName
    );

    return {
      coder: coderRes.message,
      samba: sambaRes,
    };
  }
}
