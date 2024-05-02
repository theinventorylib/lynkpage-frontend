// import { FormData } from "node-fetch-native";
import { MultiPartData } from "h3";
// file manipulations
const FILE_KEYS = ["filename", "type", "data"];
const isFile = (data: MultiPartData) => {
  return (
    Object.keys(data).filter((key) => FILE_KEYS.indexOf(key) !== -1).length ===
    FILE_KEYS.length
  );
};

// parsing multipart data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseMultiPart = (data: MultiPartData[] | any) => {
  const arr = Array.isArray(data) ? data : [data];

  const formData = new FormData();

  arr.forEach((curr) => {
    // Check if it's a file
    if (isFile(curr)) {
      // Create a new FormData entry for the file
      // get curr name before deleting to ensure a file is passed
      const name = curr.name;
      delete curr.name;
      const fileData = new Blob([curr.data], { type: curr.type });
      formData.append(name, fileData, curr.filename);
    } else {
      // It's not a file, so convert data to a UTF-8 string
      const utf8Data = curr.data.toString("utf8");
      // Append the data as a field in FormData
      formData.append(curr.name, utf8Data);
    }
  });

  return formData;
};

// handler for signup
export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  // apiurl
  const apiUrl = useRuntimeConfig().public.apiUrl;

  // fixing form again
  const formData = parseMultiPart(form);

  // using fetch
  const response = await fetch(`${apiUrl}api/v1/account/user/`, {
    method: "PATCH",
    headers: {
      // "Content-Type": "multipart/form-data"
      Cookie: `${event.headers.get("access")}`,
      "X-CLIENT-TOKEN": `${event.headers.get("client-token")}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else if (response.status == 403) {
        const error = createError({
          statusCode: response.status,
          message: "User not authenticated",
          statusMessage: "User not authenticated",
        });
        return error;
      } else if (response.status == 400) {
        const error = createError({
          statusCode: response.status,
          message: response.statusText,
          statusMessage: response.statusText,
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
