// Grove Music School: zero-dependency static build.
// Reads content/*.json, renders pages with lib/*.mjs, copies src/assets, writes dist/.
// Later, swap loadContent() to fetch from Sanity; templates stay the same.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { page } from './lib/layout.mjs';
import { home, programs, teachersIndex, tuitionPage, book, teacherPage } from './lib/pages.mjs';

const OUT = 'dist';
const read = (f) => JSON.parse(readFileSync(join('content', f), 'utf8'));

function loadContent() {
  return {
    site: read('site.json'),
    teachers: read('teachers.json'),
    instruments: read('instruments.json'),
    ensembles: read('ensembles.json'),
    tuition: read('tuition.json')
  };
}

function write(path, html) {
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const c = loadContent();
// Fingerprint CSS/JS so every deploy busts browser caches.
const fp = (f) => createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 10);
c.site.assetVersion = fp('src/assets/css/site.css') + fp('src/assets/js/site.js');
const { site } = c;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('src/assets', join(OUT, 'assets'), { recursive: true });

write('index.html', page({ site, title: 'Grove Music School | Music lessons in Toronto', description: 'Private music lessons and ensembles for all ages in Toronto. Piano, voice, guitar, violin, bass, drums and ukulele. Book a free trial lesson.', body: home(c) }));
write('programs/index.html', page({ site, active: 'Programs', title: 'Programs | Grove Music School', description: 'Private lessons on seven instruments plus group classes and ensembles for every age.', body: programs(c) }));
write('teachers/index.html', page({ site, active: 'Teachers', title: 'Our Teachers | Grove Music School', description: `Meet Grove's ${c.teachers.length} teachers: performers, recording artists and lifelong educators.`, body: teachersIndex(c) }));
write('tuition/index.html', page({ site, active: 'Tuition', title: `Tuition ${c.tuition.year} | Grove Music School`, description: 'Lesson prices, ensemble fees, discounts, financial assistance and answers to common questions.', body: tuitionPage(c) }));
write('book/index.html', page({ site, active: 'Contact', title: 'Book a Free Trial | Grove Music School', description: 'Book a free trial lesson or register for the 2026/27 school year. Contact Grove Music School.', body: book(c) }));

c.teachers.forEach((t, i, all) => {
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const { header, body } = teacherPage({ t, prev, next });
  write(`teachers/${t.slug}/index.html`, page({ site, title: `${t.name} | Grove Music School`, description: t.intro, body, simpleHeader: header, bodyClass: 't-page' }));
});

write('robots.txt', site.staging ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n');
write('404.html', page({ site, title: 'Page not found | Grove Music School', body: `<section class="ph"><div class="wrap" style="display:flex;flex-direction:column;gap:24px"><h1 class="display hero-h" style="font-size:104px">Wrong<br><span class="g">note.</span></h1><p style="margin:0;color:#C3D0CA;font-size:20px">That page doesn't exist. Let's get you back on track.</p><a class="btn btn-primary" href="/" style="align-self:flex-start">Back to home</a></div></section>` }));

console.log(`Built ${5 + c.teachers.length + 1} pages into ${OUT}/`);
