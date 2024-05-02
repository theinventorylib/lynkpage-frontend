// handler for signup
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;
  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/validate/email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
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
