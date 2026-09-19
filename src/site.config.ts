// Site-wide settings that are not translated. Edit freely.
// The three visual directions. All share the same content and components;
// they differ in src/styles/themes.css.
export const themes = ['cover', 'brass', 'spotlight'] as const;
export type Theme = (typeof themes)[number];

export const site = {
  name: 'Vann Rivers',
  // The look visitors get by default.
  theme: 'cover' as Theme,
  // Demo only: shows the A / B / C style switcher at the bottom of the page.
  // Once the client has chosen, set `theme` above and turn this off.
  themeSwitcher: true,
  email: 'booking@example.com',
  // The booking form posts to the Cloudflare Worker route handled in
  // worker/booking.ts. See "预约表单" in the README for its settings.
  formEndpoint: '/api/booking',
  // Optional bot check. Paste a Cloudflare Turnstile site key to switch it on
  // (and set TURNSTILE_SECRET in the Pages project). Leave empty to disable.
  turnstileSiteKey: '',
  // Chat buttons in the contact section. Remove a line to hide that button.
  chat: {
    telegram: 'your_telegram_username', // t.me/<username>, without @
    whatsapp: '85500000000', // country code + number, digits only
  } as { telegram?: string; whatsapp?: string },
  socials: [
    { label: 'YouTube', href: 'https://youtube.com/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'Spotify', href: 'https://open.spotify.com/' },
  ],
} as const;
