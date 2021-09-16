/// <reference types="./deploy.d.ts" />

export const redirect = (url: string, latency?: number) => {
  return new Response(`Redirecting you to ${url}...`, {
    headers: {
      location: url,
      'X-Database-Latency': (latency ?? 0).toFixed(2) + 'ms',
    },

    status: 302,
  });
};

export const notFound = () => {
  return new Response('404 Not Found!', { status: 404 });
};

export const notAllowed = () => {
  return new Response('405 Method Not Allowed!', { status: 405 });
};

export const badRequest = () => {
  return new Response('400 Bad Request!', { status: 400 });
};

export const unauthorized = () => {
  return new Response('401 Unauthorized!', { status: 401 });
};
