import { DBFetchError, EnvVarsError } from './_errors.ts';
import isDev from './_dev.ts';

let SUPABASE_KEY = Deno.env.get('SUPABASE_KEY');
let REST_PREFIX = Deno.env.get('REST_PREFIX');

if (isDev) {
  const dotenv = (await import('https://deno.land/x/dotenv@v3.1.0/mod.ts'))
    .config({
      path: '.env.local',
    });

  console.log('loaded environment vars from `.env.local`');

  SUPABASE_KEY = dotenv.SUPABASE_KEY;
  REST_PREFIX = dotenv.REST_PREFIX;
}

if (!SUPABASE_KEY || !REST_PREFIX) {
  throw new EnvVarsError('missing environment variables!');
}

const commonHeaders = {
  'apikey': SUPABASE_KEY,
  'authorization': `Bearer ${SUPABASE_KEY}`,
  'x-client-info': 'supabase-js/1.22.6',
  'content-type': 'application/json',
  'prefer': 'return=representation',
};

interface DBResult {
  f: string;
  t: string;
  clicks: number;
}

export const get = async (f: string) => {
  const a = performance.now();

  const u = `${REST_PREFIX}?select=${
    encodeURIComponent('"f", "t", "clicks"')
  }&f=eq.${encodeURIComponent(f)}`;

  if (isDev) console.log(`[get] fetching ${u}`);

  const r = await fetch(
    u,
    { headers: commonHeaders },
  );
  if (!r.ok && r.status !== 404) {
    throw new DBFetchError(`[get] failed with status code ${r.status}`);
  }

  const data: DBResult = (await r.json())[0];

  const b = performance.now();

  return { data, ok: r.ok, latency: b - a };
};

export const click = async (f: string, originalClicks: number) => {
  const a = performance.now();

  const u = `${REST_PREFIX}?f=eq.${encodeURIComponent(f)}`;
  if (isDev) console.log(`[click] fetching ${u}`);

  const r = await fetch(u, {
    headers: commonHeaders,
    body: JSON.stringify({ clicks: originalClicks + 1 }),
    method: 'PATCH',
  });
  if (!r.ok && r.status !== 404) {
    console.log(await r.json());
    throw new DBFetchError(`[click] failed with status code ${r.status}`);
  }

  const data: DBResult = await r.json();

  const b = performance.now();

  return { data, ok: r.ok, latency: b - a };
};
