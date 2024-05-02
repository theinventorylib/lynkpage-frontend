// handler for signup
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // console.log("bod: ", body);

  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/registration/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      // console.log("res: ", response.statusText)
      if (response.status == 201) {
        return {
          status: response.status,
          statusMessage: "email sent",
        };
      } else if (response.status == 400) {
        const error = createError({
          statusCode: response.status,
          message: response.statusText,
          statusMessage: "Something went wrong, Please check your inputs",
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
