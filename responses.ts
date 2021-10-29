export const redirect = (url: string, latency?: number) => {
  return new Response(`Redirecting you to ${url}...`, {
    headers: {
      location: url,
      'X-Database-Latency': ((latency ?? 0) / 1000).toFixed(2) + 's',
      'Content-Type': 'text/plain',
    },

    status: 302,
  });
};

export const notFound = () => {
  return new Response('404 Not Found!', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
};

export const notAllowed = () => {
  return new Response('405 Method Not Allowed!', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
};

export const badRequest = () => {
  return new Response('400 Bad Request!', {
    status: 400,
    headers: { 'Content-Type': 'text/plain' },
  });
};

export const unauthorized = () => {
  return new Response('401 Unauthorized!', {
    status: 401,
    headers: { 'Content-Type': 'text/plain' },
  });
};
