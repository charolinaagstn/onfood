import * as AuthSession from "expo-auth-session";
import { fetchAPI } from "./fetch";

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signUp, setActive } = await startOAuthFlow({
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "gowez",
        path: "oauth-native-callback",
      }),
    });

    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });

      if (signUp?.createdUserId) {
        try {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name:
                [signUp.firstName, signUp.lastName].filter(Boolean).join(" ") ||
                signUp.emailAddress,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        } catch (error) {
          console.warn("Failed to sync OAuth user", error);
        }
      }

      return {
        success: true,
        code: "success",
        message: "You have successfully authenticated",
      };
    }

    return {
      success: false,
      code: "oauth_cancelled",
      message: "OAuth flow was cancelled or did not create a session",
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      code: error?.code ?? "oauth_error",
      message:
        error?.errors?.[0]?.longMessage ||
        error?.message ||
        "Google OAuth failed",
    };
  }
};
