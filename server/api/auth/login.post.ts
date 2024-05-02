// handler for signup
export default defineEventHandler(async (event) => {
  // get the username and password from the body
  const body = await readBody(event);
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/login/`, {
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
      } else if (response.status == 400) {
        const error = createError({
          statusCode: response.status,
          message: "Incorrect Username or Password",
          statusMessage: "Incorrect Username or Password",
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
