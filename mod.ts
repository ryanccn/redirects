/// <reference types="./deploy.d.ts" />

import { click, getRedirect } from './db.ts';
import * as responses from './responses.ts';

addEventListener('fetch', async (event: FetchEvent) => {
  const req = event.request;

  const fragments = new URL(req.url).pathname.split('/').filter((a) => !!a);

  if (fragments.length === 0) {
    // root url
    event.respondWith(responses.redirect('https://ryanccn.dev'));
    return;
  }

  if (fragments.length >= 2) {
    // more than 1 piece of path
    event.respondWith(responses.notFound());
    return;
  }

  if (req.method !== 'GET') {
    event.respondWith(responses.notAllowed());
    return;
  }

  const dbRes = await getRedirect(fragments[0]);

  if (!dbRes.ok || !dbRes.data) {
    // no redirect exists for such an id
    event.respondWith(responses.notFound());
    return;
  }

  // ok
  event.respondWith(responses.redirect(dbRes.data.t, dbRes.latency));
  await click(fragments[0]);

  return;
});
