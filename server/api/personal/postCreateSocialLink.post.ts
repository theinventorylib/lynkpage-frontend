// handler for signup
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/social_links/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${event.headers.get("access")}`,
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else if (response.status == 403) {
        const error = createError({
          statusCode: response.status,
          message: "User not authenticated",
          statusMessage: "User not authenticated",
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
