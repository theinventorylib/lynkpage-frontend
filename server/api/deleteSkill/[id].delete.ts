// handler for signup
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;
  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/skills/` + id + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${event.headers.get("access")}`,
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
  })
    .then((response) => {
      if (response.status == 204 || response.status == 301) {
        return;
      } else if (response.status == 403) {
        const error = createError({
          statusCode: response.status,
          message: "User not authenticated",
          statusMessage: "User not authenticated",
        });
        return error;
      } else if (response.status == 404) {
        const error = createError({
          statusCode: response.status,
          message: "Skill not found",
          statusMessage: "Skill not found",
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
