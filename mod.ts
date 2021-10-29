import { listenAndServe } from 'https://deno.land/std@0.113.0/http/server.ts';

import { click, getRedirect } from './db.ts';
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

  const dbRes = await getRedirect(fragments[0]);

  if (!dbRes.ok || !dbRes.data) {
    // no redirect exists for such an id
    return responses.notFound();
  }

  // ok
  const clickRes = await click(fragments[0]);
  return responses.redirect(dbRes.data.t, dbRes.latency + clickRes.latency);
};

if (isDev) console.log('listening at port 8080');
await listenAndServe(':8080', handler);
