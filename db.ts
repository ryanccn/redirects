import isDev from './_dev.ts';

let SUPABASE_KEY = Deno.env.get('SUPABASE_KEY');
let REST_PREFIX = Deno.env.get('REST_PREFIX');

if (isDev) {
  const dotenv = (await import('https://deno.land/x/dotenv@v3.1.0/mod.ts'))
    .config({
      path: '.env.local',
    });

  SUPABASE_KEY = dotenv.SUPABASE_KEY;
  REST_PREFIX = dotenv.REST_PREFIX;
}

if (!SUPABASE_KEY || !REST_PREFIX) {
  throw new ReferenceError('missing environment variables!');
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

export const getRedirect = async (f: string) => {
  const a = Date.now();
  const u = `${REST_PREFIX}?select=${
    encodeURIComponent('"t", "clicks"')
  }&f=eq.${encodeURIComponent(f)}`;

  if (isDev) console.log(`[getRedirect] fetching ${u}`);

  const r = await fetch(
    u,
    { headers: commonHeaders },
  );
  const b = Date.now();

  const data: DBResult = (await r.json())[0];
  if (data) data.f = f;

  return { data, ok: r.ok, latency: b - a };
};

export const click = async (f: string) => {
  const a = Date.now();

  const r1 = await getRedirect(f);

  const u2 = `${REST_PREFIX}?f=eq.${encodeURIComponent(f)}`;
  if (isDev) console.log(`[click] fetching ${u2}`);

  const r2 = await fetch(u2, {
    headers: commonHeaders,
    body: JSON.stringify({ clicks: (r1.data.clicks ?? 0) + 1 }),
    method: 'PATCH',
  });

  const data: DBResult = await r2.json();

  const b = Date.now();

  return { data, ok: r2.ok, latency: b - a };
};
