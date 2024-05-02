export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = body;
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // using fetch
  const response = await fetch(
    `${apiUrl}api/v1/account/registration/verify-email/`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
      },
      body: JSON.stringify(key),
    },
  )
    .then((response) => {
      if (response.status == 200) {
        return response;
      } else if (response.status == 404) {
        const error = createError({
          statusCode: response.status,
          message: "Key is invalid or expired",
          statusMessage: "Key is invalid or expired",
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
