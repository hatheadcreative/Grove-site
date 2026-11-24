import { esc, attr, qs, ICON } from './util.mjs';
import { logo } from './layout.mjs';
import { eyebrow, pageHeader, sectionHead, ctaBand, ctaButton, playStrip, marquee, instrumentCards, freeTrialCard, teacherCard, bookingForm } from './partials.mjs';

/* ---------------- HOME ---------------- */
export const home = ({ site, instruments, teachers, tuition }) => {
  const h = site.home;
  const heroArt = `<svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none">
    <g class="spin"><circle cx="1050" cy="430" r="520" fill="none" stroke="#00AD6B" stroke-opacity="0.28" stroke-width="2" stroke-dasharray="900 2400"></circle></g>
    <g class="spin-rev"><circle cx="1050" cy="430" r="400" fill="none" stroke="#00AD6B" stroke-opacity="0.16" stroke-width="1.5" stroke-dasharray="600 1900"></circle></g>
    <path class="arc" d="M-40 760 C 260 620, 520 640, 760 760" fill="none" stroke="#00AD6B" stroke-opacity="0.35" stroke-width="2"></path>
  </svg>`;
  const stat = (big, small, green) => `<li style="display: flex; flex-direction: column"><strong style="font-size: 30px; font-weight: 700; line-height: 1.1${green ? '; color: #00AD6B' : ''}">${big}</strong><span style="color: #9FB1A8; font-size: 14px">${small}</span></li>`;
  const hero = `<section style="position: relative; padding: 72px 0 96px; overflow: hidden">
  ${heroArt}
  <div class="wrap hero-grid" style="position: relative">
    <div style="display: flex; flex-direction: column; gap: 30px">
      ${eyebrow(h.eyebrow)}
      <h1 class="display hero-h" style="font-size: 104px">
        <span class="rise d1" style="display: block">${esc(h.headline[0])}</span>
        <span class="rise d2" style="display: block">${esc(h.headline[1])}</span>
        <span class="rise d3 g" style="display: block">${esc(h.headline[2])}</span>
      </h1>
      <p class="rise d4" style="margin: 0; max-width: 520px; font-size: 20px; color: #C3D0CA">${esc(h.intro)}</p>
      <div class="rise d5" style="display: flex; flex-wrap: wrap; gap: 14px">
        <a class="btn btn-primary beat" href="/book/">${esc(h.primaryCta)} ${ICON.arrow}</a>
        <a class="btn btn-ghost" href="/programs/">${esc(h.secondaryCta)}</a>
      </div>
      <ul class="rise d6" style="list-style: none; margin: 8px 0 0; padding: 22px 0 0; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; gap: 36px">
        ${stat(instruments.length, 'instruments')}${stat('5', 'ensembles &amp; choirs')}${stat('$' + tuition.lessons[0].price, 'lessons from')}${stat('Free', 'trial lesson', true)}
      </ul>
    </div>
    <div style="position: relative">
      <div class="leaf-in" style="position: relative; aspect-ratio: 1 / 1; border-radius: 50% 0 50% 0; overflow: hidden; background: #13221B">
        <img class="photo" src="/assets/img/hero.jpg" alt="A Grove teacher guiding a young student's hand on the guitar" style="object-position: 55% 40%">
      </div>
      <div class="mark-in" style="position: absolute; left: -28px; bottom: -28px; width: 128px; height: 128px; border-radius: 50% 0 50% 0; background: #0D1813; display: grid; place-items: center; box-shadow: 0 0 0 8px #0D1813">${logo(84)}</div>
    </div>
  </div>
</section>`;

  const programs = `<section aria-labelledby="prog-h" style="padding: 120px 0">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 48px">
    ${sectionHead('prog-h', 'Pick your<br><span class="g">sound.</span>', 'Private, one-on-one lessons in 30, 45 or 60 minutes. Classical, jazz, pop or contemporary, built around your goals and your pace. Press play to hear each one.')}
    <div class="g4">
        ${instrumentCards(instruments)}
        ${freeTrialCard()}
    </div>
    <a class="btn btn-ghost" href="/programs/" style="align-self: flex-start">All programs &amp; how lessons work ${ICON.arrow}</a>
  </div>
</section>`;

  const ensTeaser = `<section aria-labelledby="ens-h" style="padding: 40px 0 120px">
  <div class="wrap split">
    <div class="tile drift" style="aspect-ratio: 4 / 5; border-radius: 50% 0 50% 0">
      <img class="photo" src="/assets/img/guitar.jpg" alt="Close-up of a student strumming an acoustic guitar" loading="lazy" style="object-position: 50% 45%">
    </div>
    <div class="reveal" style="display: flex; flex-direction: column; gap: 28px">
      <h2 id="ens-h" class="display sec-h" style="font-size: 76px">Better<br><span class="g">together.</span></h2>
      <p style="margin: 0; color: #C3D0CA; max-width: 480px">Groups are formed by age, experience and instrument, so everyone plays with people at their level. This is where friendships (and bands) start.</p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px">
        ${['Music Makers · 6–12', 'Ukulele Ensemble · 8+', 'Guitar Ensemble', 'Pop/Rock Band', 'Ganbare Choir'].map((x) => `<a class="pill" href="/programs/#ensembles" style="text-decoration: none">${esc(x)}</a>`).join('\n        ')}
      </div>
      <a class="btn btn-ghost" href="/programs/#ensembles" style="align-self: flex-start">Explore ensembles ${ICON.arrow}</a>
    </div>
  </div>
</section>`;

  const priceCard = (label, big, small, extra = '') => `<div class="price reveal"><span style="color: #9FB1A8">${label}</span><span class="display${extra}" style="font-size: 56px">${big}</span><span style="color: #9FB1A8; font-size: 15px">${small}</span></div>`;
  const money = (p) => { const [d, c] = p.split('.'); return `$${d}<span style="font-size: 28px">.${c}</span>`; };
  const tuitionStrip = `<section aria-labelledby="tui-h" style="padding: 104px 0; background: #0A130F">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 40px">
    ${sectionHead('tui-h', 'Simple, honest<br><span class="g">tuition.</span>', '', `<a class="btn btn-ghost" href="/tuition/">Tuition &amp; FAQ ${ICON.arrow}</a>`)}
    <div class="g4">
      ${priceCard('First lesson', 'Free', 'trial for new students', ' g')}
      ${tuition.lessons.map((l) => priceCard(`${l.minutes} minutes`, money(l.price), 'per lesson')).join('\n      ')}
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 10px">
      ${['Billed monthly', '5% sibling discount', 'Financial assistance available', 'Ensembles from $12.50'].map((p) => `<span class="pill"><span class="g">●</span>${esc(p)}</span>`).join('\n      ')}
    </div>
  </div>
</section>`;

  const preview = `<section aria-labelledby="team-h" style="padding: 120px 0">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 40px">
    ${sectionHead('team-h', `${teachers.length} teachers.<br><span class="g">Real musicians.</span>`, 'Performers, recording artists and lifelong educators, and some of them started right here as Grove students.')}
    <div class="g3">
        ${teachers.slice(0, 5).map(teacherCard).join('\n        ')}
        <a class="teacher" href="/teachers/" style="text-decoration: none; color: #0D1813">
          <div class="portrait" style="background: #00AD6B; display: flex; flex-direction: column; justify-content: space-between; padding: 26px">
            <span style="font-weight: 600; font-size: 14px">+${teachers.length - 5} more</span>
            <span class="display" style="font-size: 54px">Meet<br><span style="color: #FFFFFF">all ${teachers.length}.</span></span>
            <span style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600">See every teacher ${ICON.arrow}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; color: #FFFFFF">
            <h3 style="margin: 0; font-size: 20px; font-weight: 600; line-height: 1.2">The whole team</h3>
            <p style="margin: 0; color: #9FB1A8; font-size: 14px">Filter by instrument</p>
          </div>
        </a>
    </div>
  </div>
</section>`;

  const fig = (src, alt, pos, label, style) => `<figure class="tile grow" style="position: relative; margin: 0; ${style}">
        <img class="photo" src="${src}" alt="${attr(alt)}" loading="lazy" style="object-position: ${pos}">
        <figcaption class="pill" style="position: absolute; left: 18px; bottom: 18px; background: rgba(13,24,19,0.78); color: #FFFFFF">${label}</figcaption>
      </figure>`;
  const recital = `<section aria-labelledby="com-h" style="padding: 40px 0 120px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 48px">
    ${sectionHead('com-h', 'Every student<br>gets a <span class="g">stage.</span>', "Recitals and community performances all year long. Here's a look at the Spring Recital 2026.")}
    <div class="g3" style="align-items: start; gap: 20px">
      ${fig('/assets/img/recital-piano.jpg', "A young student's hands playing a grand piano in warm light", '40% 45%', 'Piano', 'height: 620px')}
      ${fig('/assets/img/recital-guitar.jpg', 'A student performing classical guitar at a microphone', '55% 40%', 'Guitar', 'height: 620px; margin-top: 96px').replace('class="tile grow"', 'class="tile grow drift"')}
      ${fig('/assets/img/recital-voice.jpg', 'A young singer in a lace dress performing at a microphone', '30% 0%', 'Voice', 'height: 520px')}
    </div>
    <span class="pill" style="align-self: flex-start"><span class="g">●</span>Full recital gallery coming soon</span>
  </div>
</section>`;

  return hero + playStrip() + marquee() + programs + ensTeaser + tuitionStrip + preview + recital +
    ctaBand('Your first lesson<br>is <span style="color: #FFFFFF">on us.</span>', "Book a free trial and we'll match you with the right teacher. No commitment, no pressure.");
};

/* ---------------- PROGRAMS ---------------- */
export const programs = ({ instruments, ensembles }) => {
  const how = [
    ['Consistent scheduling', 'Your weekly time is reserved for you, with no double bookings.', '<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M3 10h18M8 2v4M16 2v4"></path>'],
    ['Focused on you', 'Lessons tailored to your level, taste and pace: classical, jazz, pop and contemporary.', '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="4"></circle>'],
    ['All ages, all levels', 'From first-ever lesson to advanced repertoire, for kids, teens and adults.', '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>'],
    ['Free trial lesson', 'Try it before you commit. Your first private lesson is on us.', '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>']
  ];
  return pageHeader('Lessons & ensembles', 'Programs<span class="g">.</span>', "One-on-one lessons on seven instruments, plus group classes and ensembles for every age. Whatever you want to play, there's a place for you here.") + `
<section aria-labelledby="how-h" style="padding: 96px 0 24px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 32px">
    <h2 id="how-h" class="display reveal" style="font-size: 44px">How lessons <span class="g">work</span></h2>
    <div class="g4">
      ${how.map(([t, d, ic]) => `<div class="how reveal"><span class="ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic}</svg></span><h3 style="margin: 0; font-size: 21px; font-weight: 600">${t}</h3><p style="margin: 0; color: #C3D0CA; font-size: 16px">${d}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section id="private" aria-labelledby="prog-h" style="padding: 96px 0 120px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 48px">
    ${sectionHead('prog-h', 'Private<br><span class="g">lessons.</span>', 'Private, one-on-one lessons in 30, 45 or 60 minutes. Press play to hear each instrument.')}
    <div class="g4">
        ${instrumentCards(instruments)}
        ${freeTrialCard()}
    </div>
  </div>
</section>
<section id="ensembles" aria-labelledby="ensf-h" style="padding: 40px 0 120px; scroll-margin-top: 90px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 40px">
    ${sectionHead('ensf-h', 'Group classes<br>&amp; <span class="g">ensembles.</span>', 'Groups are formed by age, experience and instrument, so everyone plays with people at their level.')}
    <div style="display: flex; flex-direction: column; border-bottom: 1px solid rgba(255,255,255,0.1)">
      ${ensembles.map((e) => `<a class="ens reveal" href="/book/${qs({ inst: 'An ensemble', ens: e.name })}" style="grid-template-columns: minmax(0,1.6fr) minmax(0,1fr) auto auto">
        <div><h3 class="display" style="font-size: 32px">${esc(e.name)}</h3><p style="margin: 6px 0 0; color: #9FB1A8; font-size: 15px; max-width: 520px">${esc(e.description)}</p></div>
        <div class="hide-sm" style="display: flex; flex-direction: column; gap: 2px; font-size: 15px"><span>${esc(e.ages)}</span><span style="color: #9FB1A8">${esc(e.schedule)} · ${esc(e.length)}</span></div>
        <span style="font-weight: 600; white-space: nowrap; font-size: 20px">${esc(e.price)}<span style="color: #9FB1A8; font-weight: 400; font-size: 15px">/class</span></span>
        <svg class="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>
` + ctaBand('Not sure where<br>to <span style="color: #FFFFFF">start?</span>', "Book a free trial and tell us your goals. We'll point you to the right lesson or group.");
};

/* ---------------- TEACHERS INDEX ---------------- */
export const teachersIndex = ({ teachers, site }) => {
  const filters = ['All', 'Piano', 'Voice', 'Guitar', 'Violin', 'Bass', 'Drums', 'Ukulele'];
  return pageHeader('Our team', `${teachers.length} teachers.<br><span class="g">Real musicians.</span>`, 'Performers, recording artists and lifelong educators, and some of them started right here as Grove students. Tap anyone to read their story.') + `
<section aria-label="All teachers" style="padding: 72px 0 120px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 40px">
    <div role="group" aria-label="Filter teachers by instrument" style="display: flex; flex-wrap: wrap; gap: 8px">
      ${filters.map((f, i) => `<button type="button" class="chip${i === 0 ? ' on' : ''}" data-filter="${f}" aria-pressed="${i === 0}">${f}</button>`).join('')}
    </div>
    <p data-filter-count aria-live="polite" style="margin: -16px 0 0; color: #9FB1A8; font-size: 14px">Showing all ${teachers.length} teachers</p>
    <div class="g4" data-team-grid>
        ${teachers.map(teacherCard).join('\n        ')}
        <a class="teacher hire" data-always href="mailto:${site.email}?subject=${encodeURIComponent('Teaching at Grove')}" style="text-decoration: none; color: #0D1813">
          <div class="portrait" style="background: #00AD6B; display: flex; flex-direction: column; justify-content: space-between; padding: 26px">
            <span style="font-weight: 600; font-size: 14px">Music teachers</span>
            <span class="display" style="font-size: 54px">We are<br><span style="color: #FFFFFF">hiring.</span></span>
            <span style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600">Apply now ${ICON.arrow}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; color: #FFFFFF">
            <h3 style="margin: 0; font-size: 20px; font-weight: 600; line-height: 1.2">Join the team</h3>
            <p style="margin: 0; color: #9FB1A8; font-size: 14px">${esc(site.email)}</p>
          </div>
        </a>
    </div>
  </div>
</section>
` + ctaBand('Found your<br><span style="color: #FFFFFF">teacher?</span>', 'Book a free trial and choose a preferred teacher on the form.');
};

/* ---------------- TUITION ---------------- */
export const tuitionPage = ({ tuition, site }) => {
  const money = (p) => { const [d, c] = p.split('.'); return `$${d}<span style="font-size: 36px">.${c}</span>`; };
  return pageHeader(`${tuition.year} school year`, 'Tuition<span class="g">.</span>', "Private lessons are priced per lesson and billed monthly. Your first lesson is free, and there's help available if cost is a barrier.") + `
<section aria-label="Private lesson prices" style="padding: 88px 0 104px">
  <div class="wrap" style="display: flex; flex-direction: column; gap: 48px">
    <div class="g3">
      ${tuition.lessons.map((l) => l.featured
        ? `<div class="price reveal" style="background: #00AD6B; color: #0D1813"><span style="font-weight: 600">${l.minutes}-minute lesson</span><span class="display" style="font-size: 72px">${money(l.price)}</span><span style="font-size: 15px">per lesson · ${esc(l.note)}</span><a class="btn btn-sm" href="/book/${qs({ len: l.minutes })}" style="align-self: flex-start; background: #0D1813; color: #FFFFFF">Start with ${l.minutes}</a></div>`
        : `<div class="price reveal"><span style="color: #9FB1A8; font-weight: 500">${l.minutes}-minute lesson</span><span class="display" style="font-size: 72px">${money(l.price)}</span><span style="color: #9FB1A8; font-size: 15px">per lesson · ${esc(l.note)}</span><a class="btn btn-ghost btn-sm" href="/book/${qs({ len: l.minutes })}" style="align-self: flex-start">Start with ${l.minutes}</a></div>`).join('\n      ')}
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 10px">
      ${tuition.perks.map((p) => `<span class="pill"><span class="g">●</span>${esc(p)}</span>`).join('\n      ')}
    </div>
  </div>
</section>
<section aria-labelledby="et-h" style="padding: 104px 0; background: #0A130F">
  <div class="wrap split2">
    <div class="reveal" style="display: flex; flex-direction: column; gap: 18px">
      <h2 id="et-h" class="display" style="font-size: 56px">Group classes<br>&amp; <span class="g">ensembles</span></h2>
      <p style="margin: 0; color: #C3D0CA; max-width: 380px">Priced per class and billed monthly with private lessons.</p>
      <a class="btn btn-ghost btn-sm" href="/programs/#ensembles" style="align-self: flex-start">About the ensembles</a>
    </div>
    <div role="table" aria-label="Ensemble prices" style="display: flex; flex-direction: column; border-bottom: 1px solid rgba(255,255,255,0.1)">
      <div class="tbl" role="row" style="border-top: 0; padding-bottom: 8px; color: #9FB1A8; font-size: 13px"><span role="columnheader">Class</span><span role="columnheader" class="hide-sm">Ages</span><span role="columnheader" class="hide-sm">Length</span><span role="columnheader" style="text-align: right">Per class</span></div>
      ${tuition.ensembleTable.map((r) => `<div class="tbl reveal" role="row"><span role="cell" style="font-weight: 600; font-size: 19px">${esc(r.name)}</span><span role="cell" class="hide-sm" style="color: #C3D0CA">${esc(r.ages)}</span><span role="cell" class="hide-sm" style="color: #C3D0CA">${esc(r.length)}</span><span role="cell" style="font-weight: 600; font-size: 19px; text-align: right">${esc(r.price)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section aria-labelledby="faq-h" style="padding: 112px 0">
  <div class="wrap split2">
    <div class="reveal faq-side" style="display: flex; flex-direction: column; gap: 18px">
      <h2 id="faq-h" class="display" style="font-size: 64px">Questions,<br><span class="g">answered.</span></h2>
      <p style="margin: 0; color: #C3D0CA; max-width: 360px">Still wondering about something? Call <a href="${site.phoneHref}">${esc(site.phone)}</a> or <a href="mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}">email the director</a>.</p>
    </div>
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1)">
      ${tuition.faq.map((f) => `<details class="faq"><summary>${esc(f.q)}<span class="pm">${ICON.plus}</span></summary><p class="ans" style="margin: 0">${esc(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>
` + ctaBand('Try a lesson<br><span style="color: #FFFFFF">free.</span>', "No commitment. We'll match you with the right teacher.");
};

/* ---------------- BOOK & CONTACT ---------------- */
export const book = ({ site, teachers, ensembles }) => `<section style="position: relative; padding: 72px 0 120px; overflow: hidden">
  <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none">
    <g class="spin"><circle cx="200" cy="260" r="420" fill="none" stroke="#00AD6B" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="760 2100"></circle></g>
  </svg>
  <div class="wrap split2" style="position: relative">
    <div style="display: flex; flex-direction: column; gap: 28px">
      ${eyebrow('Book & contact')}
      <h1 class="display hero-h rise d1" style="font-size: 92px"><span data-book-title>Book your free trial</span><span class="g">.</span></h1>
      <p class="rise d2" style="margin: 0; color: #C3D0CA; font-size: 19px; max-width: 480px">Tell us a little about the student and we'll match them with the right teacher and a time that works. We usually reply within ${esc(site.replyTime)}.</p>
      <div id="contact" style="display: flex; flex-direction: column; gap: 22px; scroll-margin-top: 110px">
        <div class="mapcard reveal" style="min-height: 220px">
          <div class="map-placeholder" aria-hidden="true">
            ${logo(44)}
            <span>Live map embed at launch</span>
          </div>
          <div style="position: relative; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 14px">
            <div><p style="margin: 0; color: #9FB1A8; font-size: 14px">Visit us</p><p style="margin: 2px 0 0; font-size: 19px; font-weight: 600">${site.address.map(esc).join('<br>')}</p></div>
            <a class="btn btn-primary btn-sm" href="${site.directionsUrl}">Get directions</a>
          </div>
        </div>
        <div class="contact-tiles">
          <a class="price" href="${site.phoneHref}" style="text-decoration: none; color: #FFFFFF; padding: 24px; gap: 4px"><span style="color: #9FB1A8; font-size: 14px">Call</span><strong style="font-size: 19px">${esc(site.phone)}</strong></a>
          <a class="price" href="mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}" style="text-decoration: none; color: #FFFFFF; padding: 24px; gap: 4px"><span style="color: #9FB1A8; font-size: 14px">Email the director</span><strong style="font-size: 17px; overflow-wrap: anywhere">${esc(site.email)}</strong></a>
        </div>
        <div class="price" style="padding: 24px; gap: 6px"><span style="color: #00AD6B; font-weight: 600">Need help with tuition?</span><span style="color: #C3D0CA; font-size: 16px">Financial assistance is available. Mention it in the form or contact the director. It's always confidential.</span></div>
      </div>
    </div>
    ${bookingForm({ teachers, ensembles })}
  </div>
</section>`;

/* ---------------- TEACHER DETAIL ---------------- */
export const teacherPage = ({ t, prev, next }) => {
  const words = t.name.split(' ');
  const longest = Math.max(...words.map((w) => w.length + 1));
  const size = Math.min(112, Math.floor(600 / (longest * 0.64)));
  const levelRows = t.roles
    ? `<div class="lvl lvl-h" role="row" style="border-top: 0; padding-bottom: 8px; grid-template-columns: minmax(0,1fr) auto"><span role="columnheader" style="color: #9FB1A8; font-size: 13px; font-weight: 500">Role</span><span role="columnheader" style="color: #9FB1A8; font-size: 13px; font-weight: 500">Where</span></div>` +
      t.roles.map((r) => `<div class="lvl" role="row" style="grid-template-columns: minmax(0,1fr) auto"><span role="rowheader" style="font-weight: 600; font-size: 19px">${esc(r.role)}</span><span role="cell" style="color: #C3D0CA">${esc(r.where)}</span></div>`).join('')
    : `<div class="lvl lvl-h" role="row" style="border-top: 0; padding-bottom: 8px"><span role="columnheader" style="color: #9FB1A8; font-size: 13px; font-weight: 500">Teaches</span>${['Beginner', 'Intermediate', 'Advanced'].map((x) => `<span role="columnheader" style="justify-self: center; color: #9FB1A8; font-size: 13px; font-weight: 500">${x}</span>`).join('')}</div>` +
      t.levels.map((l, i) => l.tbc
        ? `<div class="lvl" role="row"><span role="rowheader" style="font-weight: 600; font-size: 19px">${esc(l.instrument)}</span><span role="cell" style="grid-column: 2 / 5; justify-self: center; color: #9FB1A8; font-size: 14px">[Levels to confirm]</span></div>`
        : `<div class="lvl" role="row"><span role="rowheader" style="font-weight: 600; font-size: 19px">${esc(l.instrument)}</span>${[['Beginner', l.beginner], ['Intermediate', l.intermediate], ['Advanced', l.advanced]].map(([lab, on], k) => `<span role="cell" class="dot${on ? '' : ' off'}" aria-label="${lab}: ${on ? 'yes' : 'no'}" style="animation-delay: ${(1.74 + i * 0.22 + k * 0.06).toFixed(2)}s"></span>`).join('')}</div>`).join('');
  const nb = (q, label, right) => `<a class="nb" href="/teachers/${q.slug}/"${right ? ' style="justify-content: flex-end; text-align: right"' : ''}>
      ${right ? '' : `<span style="color: #00AD6B">${ICON.arrowLeft}</span>`}
      ${right ? `<div><p style="margin: 0; font-size: 13px; color: #9FB1A8">${label}</p><p style="margin: 0; font-weight: 600; font-size: 19px">${esc(q.name)}</p><p class="hide-sm" style="margin: 0; font-size: 14px; color: #9FB1A8">${esc(q.eyebrow)}</p></div><img class="hide-sm" src="${q.photo}" alt="" loading="lazy">` : `<img class="hide-sm" src="${q.photo}" alt="" loading="lazy"><div><p style="margin: 0; font-size: 13px; color: #9FB1A8">${label}</p><p style="margin: 0; font-weight: 600; font-size: 19px">${esc(q.name)}</p><p class="hide-sm" style="margin: 0; font-size: 14px; color: #9FB1A8">${esc(q.eyebrow)}</p></div>`}
      ${right ? `<span style="color: #00AD6B">${ICON.arrow}</span>` : ''}
    </a>`;
  const bookHref = `/book/${qs({ inst: t.bookInstruments[0] === 'Viola' ? 'Violin' : t.bookInstruments[0], teacher: t.bookWithTeacher ? t.name : '' })}`;
  const cta = t.bookWithTeacher ? `Book with ${esc(t.firstName)}` : 'Book a free trial';
  const header = `<a class="skip" href="#main">Skip to content</a>
<header style="position: sticky; top: 0; z-index: 50; background: rgba(13,24,19,0.84); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.06)">
  <div class="wrap" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 76px">
    <a class="back" href="/teachers/#t-${t.slug}">${ICON.arrowLeft}<span class="hide-sm">All teachers</span><span class="show-sm">All</span></a>
    <a href="/" aria-label="Grove Music School home" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #FFFFFF">${logo(36)}<span class="hide-sm" style="font-weight: 600; font-size: 16px; line-height: 1.02">Grove<br>Music School</span></a>
    <a class="btn btn-primary btn-sm" href="${bookHref}"><span class="hide-sm">${cta}</span><span class="show-sm">Book</span></a>
  </div>
</header>`;
  const body = `<section style="position: relative; padding: 64px 0 96px; overflow: hidden">
  <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none">
    <g class="spin"><circle cx="420" cy="460" r="470" fill="none" stroke="#00AD6B" stroke-opacity="0.22" stroke-width="2" stroke-dasharray="820 2200"></circle></g>
  </svg>
  <div class="wrap split-hero" style="position: relative">
    <div class="hero-wrap">
      <div class="hero-portrait">
        <img class="photo" src="${t.photo}" alt="Portrait of ${attr(t.name)}" style="object-position: ${t.focus}">
        <img class="photo bw" src="${t.photoMono}" alt="" aria-hidden="true" style="object-position: ${t.focus}">
      </div>
      ${t.badge ? `<span class="pill-b">${esc(t.badge)}</span>` : ''}
    </div>
    <div style="display: flex; flex-direction: column; gap: 28px">
      ${eyebrow(t.eyebrow, 'rise d1')}
      <h1 class="display name rise d2" style="font-size: ${size}px">${esc(words[0])}<br><span class="g">${esc(words.slice(1).join(' '))}.</span></h1>
      <p class="rise d3" style="margin: 0; font-size: 21px; line-height: 1.5; color: #C3D0CA; max-width: 520px">${esc(t.intro)}</p>
      <div class="rise d4" style="display: flex; flex-wrap: wrap; gap: 10px">
        ${t.sounds.map((s) => `<button type="button" class="hear" data-play="${s.id}" aria-label="${attr(s.label)} (plays a short phrase)"><span class="pb">${ICON.play.replace('width="18" height="18"', 'width="14" height="14"')}</span>${esc(s.label)}</button>`).join('\n        ')}
      </div>
      <div class="rise d5" role="table" aria-label="${t.roles ? `${attr(t.firstName)}'s roles at Grove` : `Instruments and levels ${attr(t.firstName)} teaches`}" style="display: flex; flex-direction: column; border-bottom: 1px solid rgba(255,255,255,0.1)">
        ${levelRows}
      </div>
    </div>
  </div>
</section>
<section aria-labelledby="about-h" style="padding: 40px 0 112px">
  <div class="wrap split2">
    <div class="reveal" style="display: flex; flex-direction: column; gap: 22px; position: sticky; top: 120px">
      <h2 id="about-h" class="display" style="font-size: 64px">About<br><span class="g">${esc(t.firstName)}.</span></h2>
      ${t.bioIsDraft ? '<p style="margin: 0; color: #9FB1A8; font-size: 14px; max-width: 360px">[Draft bio, rewritten from the current site. Swap in approved text before launch.]</p>' : ''}
    </div>
    <div class="reveal" style="display: flex; flex-direction: column; gap: 22px; font-size: 19px; color: #D5DFDA">
      ${t.bio.map((p) => `<p style="margin: 0">${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>
<section aria-labelledby="cred-h" style="padding: 0 0 112px">
  <div class="wrap split2">
    <div class="reveal"><h2 id="cred-h" class="display" style="font-size: 40px">Stages &amp; <span class="g">credits</span></h2></div>
    <div style="display: flex; flex-direction: column; border-bottom: 1px solid rgba(255,255,255,0.1)">
      ${t.credits.map((c) => `<div class="cred-row reveal"><span class="cred">${esc(c.title)}</span><span style="color: #9FB1A8; font-size: 14px; text-align: right">${esc(c.detail)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section style="padding: 0 0 72px">
  <div class="wrap">
    <div class="cta-band reveal">
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 640px">
        <h2 class="display sec-h" style="font-size: 56px">${t.bookWithTeacher ? `Book a free trial<br>with <span style="color: #FFFFFF">${esc(t.firstName)}.</span>` : 'Start your<br><span style="color: #FFFFFF">Grove story.</span>'}</h2>
        <p style="margin: 0; font-size: 18px">${t.bookWithTeacher ? `Your first lesson is free. We'll find a time that works with ${esc(t.firstName)}.` : "Tell us what you'd like to learn and we'll pair you with the right teacher."}</p>
      </div>
      ${ctaButton(cta, bookHref)}
    </div>
  </div>
</section>
<nav aria-label="More teachers" style="padding: 0 0 72px">
  <div class="wrap" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
    ${nb(prev, 'Previous', false)}
    ${nb(next, 'Next', true)}
  </div>
</nav>`;
  return { header, body };
};
