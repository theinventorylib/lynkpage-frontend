// function to refresh jwt refresh token
async function refreshAccessToken(refreshToken: string) {
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;
  const clientToken = useRuntimeConfig().public.djangoToken;

  try {
    const tokenResponse = await fetch(
      `${apiUrl}api/v1/account/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CLIENT-TOKEN": `${clientToken}`,
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      },
    );
    if (tokenResponse.status === 401) {
      return {
        error: "Token is invalid or expired",
      };
    } else {
      const data = await tokenResponse.json();
      return {
        access: data.access,
        access_expiration: data.access_expiration,
      };
    }
  } catch (error) {
    return {
      error: "RefreshAccessTokenError",
    };
  }
}

export default defineEventHandler(async (event) => {
  // get cookies
  // get the token from the cookie
  const tokenvalue = parseCookies(event).authtoken;
  // get client token from runtime config
  const clientToken = useRuntimeConfig().public.djangoToken;

  // pass the client token to the event
  event.headers.set("client-token", `${clientToken}`);

  const tokenExists = tokenvalue ? tokenvalue : "{}";
  // console.log("tokenExists", tokenExists);
  const newTokenValue = JSON.parse(tokenExists);
  // console.log("newTokenValue", newTokenValue);

  if (newTokenValue.accessToken && newTokenValue.refreshToken) {
    // console.log("tokenvalue", tokenvalue);
    // get the access token from the cookie
    const accessToken = newTokenValue.accessToken;
    // get the refresh token from the cookie
    const refreshToken = newTokenValue.refreshToken;
    // get the access token expiry from the cookie
    const tokenExpiry = new Date(newTokenValue.accessExpiration);
    // get the refresh token expiry from the cookie
    const refreshTokenExpiry = new Date(newTokenValue.refreshExpiration);
    // get the current time
    const currentDate = new Date();
    // check if access token is expired
    if (currentDate >= tokenExpiry) {
      // check if refresh token is expired
      if (currentDate >= refreshTokenExpiry) {
        // if both tokens are expired
        // stop the request and throw error
        const error = createError({
          statusCode: 403,
          message: "User is not authenticated",
          statusMessage: "User is not authenticated",
        });
        throw error;
      } else {
        // if access token is expired but refresh token is not
        // refresh the access token
        const resulttoken = await refreshAccessToken(refreshToken);
        if (resulttoken.error) {
          // if refresh token is expired
          // return error
          // stop the request and throw error
          const error = createError({
            statusCode: 403,
            message: "User is not authenticated",
            statusMessage: "User is not authenticated",
          });
          throw error;
        } else {
          // if refresh token is not expired
          // update cookie and set the access token in the event
          event.headers.set("access", `access_token=${resulttoken.access}`);

          // update the cookie
          // const cookie = useAuthCookie();
          // await cookie.setTokenCookies(
          //   resulttoken.access,
          //   refreshToken,
          //   new Date(resulttoken.access_expiration),
          //   refreshTokenExpiry,
          // );
        }
      }
    } else {
      // if access token is not expired
      // return the access token
      event.headers.set("access", `access_token=${accessToken}`);
    }
  }
});
