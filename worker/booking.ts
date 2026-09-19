// POST /api/booking
// Receives the contact form and emails it to the artist through Resend
// (https://resend.com). Settings live in the Cloudflare Worker
// (Settings → Variables and Secrets), not in the code:
//
//   RESEND_API_KEY    (secret)  API key from Resend
//   BOOKING_TO                  where enquiries are delivered, e.g. booking@artist.com
//   BOOKING_FROM                verified sender, e.g. "Website <website@artist.com>"
//   TURNSTILE_SECRET  (secret)  optional; when set, a valid Turnstile token is required

export interface BookingEnv {
  RESEND_API_KEY?: string;
  BOOKING_TO?: string;
  BOOKING_FROM?: string;
  TURNSTILE_SECRET?: string;
}

const LIMITS = { name: 120, email: 200, type: 40, date: 10, message: 4000 } as const;
const TYPES = ['performance', 'lessons', 'other'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function handleBooking(request: Request, env: BookingEnv): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }
  const field = (name: string) => String(form.get(name) ?? '').trim();

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (field('website')) return json(200, { ok: true });

  const data = {
    name: field('name'),
    email: field('email'),
    type: field('type'),
    date: field('date'),
    message: field('message'),
    language: field('language').slice(0, 5),
  };
  const invalid =
    !data.name ||
    !data.message ||
    !EMAIL.test(data.email) ||
    !TYPES.includes(data.type) ||
    (data.date !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) ||
    (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some((key) => data[key].length > LIMITS[key]);
  if (invalid) return json(422, { ok: false, error: 'invalid' });

  if (env.TURNSTILE_SECRET) {
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: field('cf-turnstile-response'),
        remoteip: request.headers.get('cf-connecting-ip') ?? '',
      }),
    });
    const result = (await check.json()) as { success: boolean };
    if (!result.success) return json(403, { ok: false, error: 'challenge_failed' });
  }

  if (!env.RESEND_API_KEY || !env.BOOKING_TO || !env.BOOKING_FROM) {
    return json(503, { ok: false, error: 'not_configured' });
  }

  const text = [
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    `For:      ${data.type}`,
    `Date:     ${data.date || 'not given'}`,
    `Language: ${data.language || 'unknown'}`,
    '',
    data.message,
  ].join('\n');

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.BOOKING_FROM,
      to: [env.BOOKING_TO],
      reply_to: data.email,
      subject: `Booking enquiry: ${data.name} (${data.type}${data.date ? `, ${data.date}` : ''})`,
      text,
    }),
  });
  if (!send.ok) {
    console.error('Resend error', send.status, await send.text());
    return json(502, { ok: false, error: 'send_failed' });
  }
  return json(200, { ok: true });
}
