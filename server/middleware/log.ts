import { IncomingHttpHeaders } from "http";

const formatLog = (
  method: string | undefined,
  url: URL,
  headers?: IncomingHttpHeaders,
  statusCode?: number,
): string => {
  return (
    `${headers?.["x-forwarded-for"]} - - [${new Date().toUTCString()}] ` +
    `"${method} ` +
    `${url} HTTP/1.1"` +
    ` ${statusCode} -`
  );
};

export default defineEventHandler((event) => {
  const req = event.node.req;
  const res = event.node.res;
  const reqUrl = getRequestURL(event);
  const reqMethod = req.method;
  //   const reqHeaders = req.headers;
  const resCode = res.statusCode;

  // Log relevant information with formatted output
  const log = formatLog(reqMethod, reqUrl, req.headers, resCode);
  // eslint-disable-next-line no-console
  console.log(log);
});
