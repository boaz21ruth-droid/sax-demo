// Cloudflare Worker entry. The site itself is static: files in dist/ are served
// straight from Cloudflare's asset store and never reach this code. Only
// requests that match no file land here, which is how /api/booking is handled.
import { handleBooking, type BookingEnv } from './booking';

interface Env extends BookingEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/booking') return handleBooking(request, env);
    return env.ASSETS.fetch(request); // the asset store's own 404
  },
};
