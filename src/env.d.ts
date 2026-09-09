/// <reference types="astro/client" />

interface Env {
  LEAD_ROUTER_URL?: string;
  LEAD_ROUTER_TOKEN?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App { interface Locals extends Runtime {} }
