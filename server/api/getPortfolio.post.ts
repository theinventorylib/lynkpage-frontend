// handler for signup
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // get the username and password from the body
  const { username } = body;
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // put the username in the url
  const url = apiUrl + "api/v1/portfolio/" + username + "";
  // using fetch
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else if (response.status == 404) {
        const error = createError({
          statusCode: response.status,
          message: "User does not exist",
          statusMessage: "User does not exist",
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
