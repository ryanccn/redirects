import {
  auth,
  get as upstashGet,
  // set as upstashSet,
} from 'https://cdn.skypack.dev/@upstash/redis@0.2.1?dts';

import { EnvVarsError, UpstashError } from './_errors.ts';
import isDev from './_dev.ts';

let UPSTASH_REDIS_REST_URL = Deno.env.get('UPSTASH_REDIS_REST_URL');
let UPSTASH_REDIS_REST_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

if (isDev) {
  const dotenv = (await import('https://deno.land/x/dotenv@v3.1.0/mod.ts'))
    .config({
      path: '.env.local',
    });

  console.log('loaded environment vars from `.env.local`');

  UPSTASH_REDIS_REST_URL = dotenv.UPSTASH_REDIS_REST_URL;
  UPSTASH_REDIS_REST_TOKEN = dotenv.UPSTASH_REDIS_REST_TOKEN;
}

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new EnvVarsError('missing environment variables!');
}

auth({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const get = async (key: string): Promise<string | undefined> => {
  const ret = await upstashGet(key);

  if (ret.error) throw new UpstashError(ret.error);

  return ret.data;
};

// export const set = async (key: string, value: string) => {
//   const ret = await upstashSet(key, value);

//   if (ret.error) throw new UpstashError(ret.error);
// };
