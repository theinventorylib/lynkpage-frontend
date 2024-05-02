// handler for signup
export default defineEventHandler(async (event) => {
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // get the username and password from the body
  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/user/`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Cookie: `${event.headers.get("access")}`,
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else if (response.status == 403) {
        const error = createError({
          statusCode: response.status,
          message: "User is not authenticated",
          statusMessage: "User is not authenticated",
        });
        return error;
      } else {
        throw createError({
          statusCode: response.status,
          statusMessage: response.statusText,
        });
      }
    })
    .catch((error) => {
      throw createError({
        statusCode: error.status,
        statusMessage: error.statusMessage,
      });
    });
  return response;
});
