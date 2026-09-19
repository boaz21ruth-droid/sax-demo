// Generates the greyscale placeholder "photos" and album covers used by the demo.
// Everything here is drawn from scratch (no third-party imagery). Replace the
// output files in src/assets/ with real photos whenever they are available —
// the site applies its duotone treatment in CSS, so any photo will fit in.
//
//   npm run placeholders
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p) => join(root, p);

const grain = (id = 'g') => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.16 0"/>
  </filter>`;

// A stylised saxophone in a 400x600 box. Abstract on purpose.
const sax = (fill = '#d8d8d8', key = '#ffffff') => `
  <g fill="none" stroke="${fill}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M92 74 L150 52 Q204 40 206 112" stroke-width="13"/>
    <path d="M206 112 L226 420" stroke-width="30"/>
    <path d="M226 420 Q236 522 300 502 Q346 486 340 400" stroke-width="54"/>
  </g>
  <path d="M313 412 L367 412 L402 292 L288 292 Z" fill="${fill}"/>
  <ellipse cx="345" cy="292" rx="58" ry="15" fill="${key}"/>
  <rect x="74" y="64" width="34" height="16" rx="4" transform="rotate(-21 91 72)" fill="#222"/>
  <g fill="${key}">
    <circle cx="190" cy="170" r="9"/><circle cx="193" cy="205" r="9"/>
    <circle cx="196" cy="240" r="9"/><circle cx="240" cy="300" r="11"/>
    <circle cx="244" cy="340" r="11"/><circle cx="248" cy="380" r="11"/>
  </g>`;

const player = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="200" cy="120" r="78" fill="#0c0c0c"/>
    <path d="M40 760 Q40 300 200 250 Q360 300 380 760 Z" fill="#101010"/>
    <path d="M150 170 L250 170 L262 270 L138 270 Z" fill="#0c0c0c"/>
    <g transform="translate(60 150) rotate(14 200 300) scale(0.95)">${sax('#cfcfcf', '#f4f4f4')}</g>
  </g>`;

const stage = ({ w, h, cone = [0.5, 0.35], body = '', tone = 0.28, seed = 0 }) => {
  const [cx, cy] = cone;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${grain()}
    <radialGradient id="spot" cx="${cx}" cy="${cy}" r="0.75">
      <stop offset="0" stop-color="#e9e9e9"/>
      <stop offset="0.35" stop-color="#8d8d8d"/>
      <stop offset="1" stop-color="rgb(${Math.round(tone * 120)},${Math.round(tone * 120)},${Math.round(tone * 120)})"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${Math.round(w / 40)}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#spot)"/>
  <g filter="url(#soft)" opacity="0.55">
    <path d="M${w * (0.15 + seed * 0.1)} 0 L${w * (0.3 + seed * 0.1)} 0 L${w * 0.75} ${h} L${w * 0.2} ${h} Z" fill="#fff"/>
    <circle cx="${w * (0.85 - seed * 0.2)}" cy="${h * 0.12}" r="${w * 0.07}" fill="#fff"/>
    <circle cx="${w * (0.62 - seed * 0.2)}" cy="${h * 0.07}" r="${w * 0.04}" fill="#fff"/>
  </g>
  ${body}
  <rect width="${w}" height="${h}" filter="url(#g)"/>
</svg>`;
};

const product = ({ w, h, rot = 0, scale = 1 }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${grain()}
    <radialGradient id="bg" cx="0.5" cy="0.45" r="0.8">
      <stop offset="0" stop-color="#6f6f6f"/><stop offset="1" stop-color="#141414"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g transform="translate(${w / 2 - 240 * scale} ${h / 2 - 300 * scale}) rotate(${rot} ${240 * scale} ${300 * scale}) scale(${scale})">${sax('#e6e6e6', '#ffffff')}</g>
  <rect width="${w}" height="${h}" filter="url(#g)"/>
</svg>`;

// Album covers: flat geometric compositions in the site palette.
const INK = '#10182B', COBALT = '#2F4BA0', PAPER = '#E9E2D0', ORANGE = '#E8A33D';
const covers = [
  `<rect width="1000" height="1000" fill="${PAPER}"/><rect x="0" y="0" width="1000" height="380" fill="${COBALT}"/>
   <circle cx="700" cy="380" r="240" fill="${ORANGE}"/><rect x="80" y="560" width="300" height="360" fill="${INK}"/>`,
  `<rect width="1000" height="1000" fill="${INK}"/>
   ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${90 + i * 140}" y="${120 + (i % 2) * 90}" width="90" height="${520 + ((i * 37) % 200)}" fill="${i === 3 ? ORANGE : PAPER}"/>`).join('')}`,
  `<rect width="1000" height="1000" fill="${ORANGE}"/><path d="M0 1000 L1000 0 L1000 1000 Z" fill="${INK}"/>
   <circle cx="300" cy="300" r="170" fill="${PAPER}"/>`,
  `<rect width="1000" height="1000" fill="${COBALT}"/><circle cx="500" cy="500" r="380" fill="${INK}"/>
   <circle cx="500" cy="500" r="250" fill="${PAPER}"/><circle cx="500" cy="500" r="36" fill="${ORANGE}"/>`,
];
const cover = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <defs>${grain()}</defs>${inner}<rect width="1000" height="1000" filter="url(#g)" opacity="0.6"/></svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/><rect x="520" width="680" height="630" fill="${COBALT}"/>
  <rect x="520" y="470" width="300" height="160" fill="${ORANGE}"/>
  <g transform="translate(760 40) rotate(12 200 300) scale(0.9)">${sax(PAPER, '#ffffff')}</g>
</svg>`;

const jobs = [
  ['src/assets/photos/hero.jpg', stage({ w: 1600, h: 2000, cone: [0.55, 0.3], body: player(330, 330, 2.3) })],
  ['src/assets/photos/about.jpg', stage({ w: 1200, h: 1500, cone: [0.4, 0.3], seed: 1, body: player(260, 300, 1.7) })],
  ['src/assets/gear/alto.jpg', product({ w: 1200, h: 1500, rot: 8, scale: 1.9 })],
  ['src/assets/gear/tenor.jpg', product({ w: 1200, h: 900, rot: -64, scale: 1.5 })],
  ['src/assets/gear/soprano.jpg', product({ w: 1200, h: 900, rot: 62, scale: 1.4 })],
  ...[0, 1, 2].map((i) => [
    `src/assets/videos/video-${i + 1}.jpg`,
    stage({ w: 1280, h: 720, cone: [0.3 + i * 0.2, 0.4], seed: i, body: player(380 + i * 120, 120, 0.85) }),
  ]),
  ...[
    [1200, 1500], [1500, 1000], [1200, 1200], [1500, 1000],
    [1200, 1500], [1200, 1200], [1500, 1000], [1200, 1500],
  ].map(([w, h], i) => [
    `src/assets/gallery/live-${i + 1}.jpg`,
    stage({
      w, h, seed: (i % 3) * 0.8, cone: [0.25 + ((i * 0.23) % 0.6), 0.25 + ((i * 0.17) % 0.3)], tone: 0.2 + (i % 4) * 0.08,
      body: i % 3 === 2
        ? `<g transform="translate(${w / 2 - 300} ${h / 2 - 420}) rotate(${i * 9 - 20} 300 420) scale(1.5)">${sax()}</g>`
        : player(w * (0.18 + ((i * 0.13) % 0.3)), h * 0.22, h / 1000),
    }),
  ]),
  ...covers.map((c, i) => [`src/assets/albums/album-${i + 1}.jpg`, cover(c)]),
  ['public/og.jpg', og],
];

for (const [file, svg] of jobs) {
  await mkdir(dirname(out(file)), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(out(file));
  console.log('wrote', file);
}
