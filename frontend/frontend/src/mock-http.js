export function createMockReq({
  method = 'GET',
  url,
  headers = {},
  body = null,
} = {}) {
  return {
    method,
    url,
    headers,
    body,
  };
}
// searchParams
// req.query = Object.fromEntries(url.searchParams.entries());
// const { code, private_access, user_key } = req.query;

export function createMockRes() {
  let statusCode = 200;
  const headers = {};
  let chunks = [];

  const res = {
    statusCode,

    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return headers[name.toLowerCase()];
    },
    getHeaders() {
      return { ...headers };
    },

    write(chunk) {
      if (typeof chunk !== 'string') {
        // Convert to string if it's something else
        chunk = String(chunk);
      }
      chunks.push(chunk);
    },

    end(chunk) {
      res.write(chunk);
    },

    // --- Helpers for inspection ---
    _getStatusCode() {
      return statusCode;
    },
    _getHeaders() {
      return { ...headers };
    },
    _getBody() {
      return Buffer.concat(chunks).toString('utf8');
    },
    _getBuffer() {
      return Buffer.concat(chunks);
    },
  };

  return res;
}
