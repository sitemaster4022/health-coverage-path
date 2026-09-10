/// <reference types="astro/client" />

interface Env {
  DB?: import('@cloudflare/workers-types').D1Database;
  LEAD_ROUTER_URL?: string;
  LEAD_ROUTER_TOKEN?: string;
  TEST_SUBMISSION_TOKEN?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App { interface Locals extends Runtime {} }
