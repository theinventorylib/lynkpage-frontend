// handler for signup
export default defineEventHandler(async (event) => {
  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // using fetch
  const response = await fetch(
    `${apiUrl}api/v1/portfolio/personal/categories/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${event.headers.get("access")}`,
        "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
      },
    },
  )
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
