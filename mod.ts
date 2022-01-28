import { serve } from 'https://deno.land/std@0.123.0/http/server.ts';

import { get } from './db.ts';
import * as responses from './responses.ts';

import isDev from './_dev.ts';

const handler = async (req: Request) => {
  const fragments = new URL(req.url).pathname.split('/').filter((a) => !!a);

  if (fragments.length === 0) {
    // root url
    return responses.redirect('https://ryanccn.dev');
  }

  if (fragments.length >= 2) {
    // more than 1 piece of path
    return responses.notFound();
  }

  if (req.method !== 'GET') {
    return responses.notAllowed();
  }

  const timeA = performance.now();
  const res = await get(fragments[0]);
  const timeB = performance.now();

  if (!res) {
    // no redirect exists for such an id
    return responses.notFound();
  }

  // ok
  return responses.redirect(res, timeB - timeA);
};

if (isDev) console.log('listening at port 3001');
await serve(handler, { port: 3001 });
