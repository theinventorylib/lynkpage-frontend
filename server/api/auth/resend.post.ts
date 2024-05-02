export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = body;
  // Process a POST request
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // using fetch
  const response = await fetch(
    `${apiUrl}api/v1/account/registration/resend-email/`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
      },
      body: JSON.stringify(email),
    },
  )
    .then((response) => {
      if (response.status == 200) {
        return response;
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
