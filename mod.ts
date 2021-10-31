import { listenAndServe } from 'https://deno.land/std@0.113.0/http/server.ts';

import { click, get } from './db.ts';
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

  const res1 = await get(fragments[0]);

  if (!res1.ok || !res1.data) {
    // no redirect exists for such an id
    return responses.notFound();
  }

  // ok
  const res2 = await click(fragments[0], res1.data.clicks);
  return responses.redirect(res1.data.t, res1.latency + res2.latency);
};

if (isDev) console.log('listening at port 8080');
await listenAndServe(':8080', handler);
