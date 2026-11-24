import { esc, ICON } from './util.mjs';
import { MARK_PATH } from './logo.mjs';

export const logo = (size = 40) =>
  `<svg width="${size}" height="${size}" viewBox="207.5 314.9 138.2 138.2" aria-hidden="true"><path fill="#00AD6B" d="${MARK_PATH}"></path></svg>`;

const NAV = [
  ['Programs', '/programs/'],
  ['Teachers', '/teachers/'],
  ['Tuition', '/tuition/'],
  ['Contact', '/book/#contact']
];

const overlay = () => `<div class="lt" aria-hidden="true">
  <div class="lt-cover"></div>
  <div class="lt-ring"></div>
  <svg class="lt-mark" viewBox="207.5 314.9 138.2 138.2"><path fill="#00AD6B" d="${MARK_PATH}"></path></svg>
</div>`;

const header = (active) => `<a class="skip" href="#main">Skip to content</a>
<header style="position: sticky; top: 0; z-index: 50; background: rgba(13,24,19,0.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.06)">
  <div class="wrap" style="display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 80px">
    <a href="/" aria-label="Grove Music School home" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: #FFFFFF">
      ${logo(40)}
      <span class="brand-text" style="font-weight: 600; font-size: 18px; line-height: 1.02; letter-spacing: -0.01em">Grove<br>Music School</span>
    </a>
    <nav class="navlinks" aria-label="Main" style="display: flex; align-items: center; gap: 26px">
      ${NAV.map(([n, h]) => `<a class="navlink" href="${h}"${n === active ? ' aria-current="page"' : ''}>${n}</a>`).join('\n      ')}
    </nav>
    <div style="display: flex; align-items: center; gap: 10px">
      <button class="sound hide-sm" type="button" data-sound-toggle aria-pressed="true" aria-label="Toggle sound">${ICON.soundOn}${ICON.soundOff}<span data-sound-label>Sound on</span></button>
      <a class="btn btn-primary btn-sm" href="/book/">Book a free trial</a>
      <button class="sound menu-btn" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">${ICON.menu}</button>
    </div>
  </div>
  <nav id="mobile-nav" aria-label="Mobile" class="wrap" hidden style="display: flex; flex-direction: column; padding-bottom: 18px">
    ${NAV.map(([n, h]) => `<a class="navlink" href="${h}"${n === active ? ' aria-current="page"' : ''}>${n}</a>`).join('\n    ')}
  </nav>
</header>`;

const footer = (site) => `<footer style="padding: 88px 0 40px; border-top: 1px solid rgba(255,255,255,0.08)">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 56px">
    <p class="display" style="font-size: 56px">Music. Community. <span class="g">Growth.</span></p>
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px">
      <div style="display: flex; flex-direction: column; gap: 6px; color: #C3D0CA">
        <strong style="color: #FFFFFF">${esc(site.name)}</strong>
        <span>${esc(site.address.join(', '))}</span>
        <a href="${site.phoneHref}" style="color: #C3D0CA">${esc(site.phone)}</a>
        <a href="mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}" style="color: #C3D0CA">${esc(site.email)}</a>
      </div>
      <nav aria-label="Footer" style="display: flex; flex-wrap: wrap; gap: 8px 28px; align-items: flex-start">
        <a class="navlink" href="/programs/">Programs</a>
        <a class="navlink" href="/teachers/">Teachers</a>
        <a class="navlink" href="/tuition/">Tuition</a>
        <a class="navlink" href="/book/">Book a lesson</a>
        <a class="navlink" href="/book/#contact">Contact</a>
        <a class="navlink" href="${site.teacherLogin}">Teacher Login</a>
      </nav>
      <div class="footer-social" style="display: flex; gap: 10px">
        <a class="sound" href="${site.instagram}" aria-label="Grove on Instagram" style="text-decoration: none">${ICON.instagram}</a>
        <a class="sound" href="${site.facebook}" aria-label="Grove on Facebook" style="text-decoration: none">${ICON.facebook}</a>
      </div>
    </div>
    <p style="margin: 0; color: #7F918A; font-size: 13px">© ${new Date().getFullYear()} ${esc(site.name)} · Instrument samples from <a href="https://github.com/nbrosowsky/tonejs-instruments" style="color: #7F918A">tonejs-instruments</a> by Nicholaus Brosowsky, <a href="https://creativecommons.org/licenses/by/3.0/" style="color: #7F918A">CC BY 3.0</a>, trimmed and levelled.</p>
  </div>
</footer>`;

export const page = ({ site, title, description = '', active = '', body, bodyClass = '', simpleHeader = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.staging ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="/assets/img/hero.jpg">
<meta name="theme-color" content="#0D1813">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="preload" href="/assets/fonts/OpenSauceSans-Bold.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script src="/assets/js/site.js" defer></script>
</head>
<body class="${bodyClass}" style="margin: 0; background: #0D1813">
<div class="page">
${overlay()}
${simpleHeader || header(active)}
<main id="main">
${body}
</main>
${footer(site)}
</div>
</body>
</html>
`;
