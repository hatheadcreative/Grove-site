import { esc, attr, qs, ICON } from './util.mjs';
import { MARK_SILHOUETTE } from './logo.mjs';

export const eyebrow = (text, cls = 'rise') =>
  `<p class="${cls}" style="margin: 0; display: flex; align-items: center; gap: 12px; color: #00AD6B; font-weight: 600; font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase"><span style="width: 32px; height: 2px; background: #00AD6B"></span>${esc(text)}</p>`;

export const pageHeader = (eb, titleHtml, intro) => `<section class="ph">
  <svg aria-hidden="true" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none">
    <g class="spin"><circle cx="1180" cy="300" r="420" fill="none" stroke="#00AD6B" stroke-opacity="0.24" stroke-width="2" stroke-dasharray="760 2100"></circle></g>
    <path class="arc" d="M-40 560 C 260 440, 520 460, 760 560" fill="none" stroke="#00AD6B" stroke-opacity="0.3" stroke-width="2"></path>
  </svg>
  <div class="wrap" style="position: relative; display: flex; flex-direction: column; gap: 26px">
    ${eyebrow(eb)}
    <h1 class="display hero-h rise d1" style="font-size: 104px">${titleHtml}</h1>
    <p class="rise d2" style="margin: 0; max-width: 620px; font-size: 20px; color: #C3D0CA">${esc(intro)}</p>
  </div>
</section>`;

export const sectionHead = (id, titleHtml, sub, extra = '') => `<div class="reveal" style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px">
      <h2 id="${id}" class="display sec-h" style="font-size: 76px">${titleHtml}</h2>
      ${sub ? `<p style="margin: 0; max-width: 440px; color: #C3D0CA">${esc(sub)}</p>` : ''}${extra}
    </div>`;

export const ctaBand = (titleHtml, sub, btn = 'Book a free trial', href = '/book/') => `<section style="padding: 0 0 120px">
  <div class="wrap">
    <div class="cta-band reveal">
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 640px">
        <h2 class="display sec-h" style="font-size: 64px">${titleHtml}</h2>
        <p style="margin: 0; font-size: 18px">${esc(sub)}</p>
      </div>
      <a class="btn" href="${href}" style="background: #0D1813; color: #FFFFFF">${esc(btn)} ${ICON.arrow}</a>
    </div>
  </div>
</section>`;

export const keyboard = () => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const whites = []; const blacks = []; let wi = 0; const unit = 100 / 15;
  for (let m = 60; m <= 84; m++) {
    const n = names[m % 12]; const oct = Math.floor(m / 12) - 1;
    if (n.length === 1) {
      whites.push(`<button type="button" class="wkey" data-midi="${m}" aria-label="${n}${oct}">${n === 'C' ? 'C' + oct : n}</button>`); wi++;
    } else {
      blacks.push(`<button type="button" class="bkey" data-midi="${m}" aria-label="${n.replace('#', ' sharp ')}${oct}" style="left: calc(${(wi * unit).toFixed(3)}% - ${(unit * 0.3).toFixed(3)}%); width: ${(unit * 0.6).toFixed(3)}%"></button>`);
    }
  }
  return `<div class="kbd" role="group" aria-label="Playable piano keyboard, two octaves">
        ${whites.join('\n        ')}
        ${blacks.join('\n        ')}
      </div>`;
};

export const playStrip = () => `<section aria-labelledby="play-h" style="padding: 0 0 88px">
  <div class="wrap">
    <div style="background: #13221B; border-radius: 40px 0 40px 0; padding: 40px; display: flex; flex-direction: column; gap: 28px">
      <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px">
        <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px">
          <p style="margin: 0; color: #00AD6B; font-weight: 600; font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase">Go on, try it</p>
          <h2 id="play-h" class="display" style="font-size: 52px">Every musician starts with <span class="g">one note.</span></h2>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px">
          <button class="btn btn-ghost btn-sm" type="button" data-demo>${ICON.play.replace('width="18" height="18"', 'width="16" height="16"')}<span data-demo-label>Hear a demo</span></button>
          <button class="sound" type="button" data-sound-toggle aria-pressed="true" aria-label="Toggle sound">${ICON.soundOn}${ICON.soundOff}<span data-sound-label>Sound on</span></button>
        </div>
      </div>
      <canvas data-wave aria-hidden="true" style="width: 100%; height: 84px; display: block"></canvas>
      ${keyboard()}
      <p style="margin: 0; color: #9FB1A8; font-size: 14px">Tap the keys. Sound only plays when you press something.</p>
    </div>
  </div>
</section>`;

export const marquee = () => {
  const items = ['Piano', 'Voice', 'Guitar', 'Violin', 'Bass', 'Drums', 'Ukulele', 'Music Makers', 'Pop/Rock Band', 'Ganbare Choir']
    .map((x) => `<span>${esc(x)}</span><span class="g">●</span>`).join('');
  return `<div class="marq-wrap" aria-hidden="true" style="border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 22px 0; overflow: hidden">
  <div class="marq display" style="font-size: 40px; gap: 40px; color: #FFFFFF">${items}${items}</div>
</div>`;
};

export const instrumentCards = (instruments) => instruments.map((it, i) => `<article class="inst reveal" data-inst-card="${it.id}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start">
            <span class="num" style="font-weight: 600; font-size: 14px; color: #00AD6B">0${i + 1}</span>
            <div class="eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px">
            <h3 class="display" style="font-size: 38px">${esc(it.name)}</h3>
            <p class="muted" style="margin: 0; font-size: 15px; line-height: 1.45">${esc(it.line)}</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
            ${it.sound === false ? '<span class="muted" style="font-size: 13px">Recording coming soon</span>' : `<button class="play" type="button" data-play="${it.id}" aria-label="Hear the ${esc(it.name.toLowerCase())}">${ICON.play}</button>`}
            <a href="/book/${qs({ inst: it.name })}" style="color: inherit; font-size: 15px; font-weight: 600">Book a trial</a>
          </div>
        </article>`).join('\n        ');

export const freeTrialCard = () => `<a href="/book/" class="inst" style="background: #00AD6B; color: #0D1813; text-decoration: none">
          <span style="font-weight: 600; font-size: 14px">Not sure yet?</span>
          <h3 class="display" style="font-size: 38px">Your first lesson is <span style="color: #FFFFFF">on us.</span></h3>
          <span style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600">Book a free trial ${ICON.arrow}</span>
        </a>`;

export const teacherInstruments = (t) => (t.levels || []).map((l) => l.instrument === 'Viola' ? 'Violin' : l.instrument);

export const teacherCard = (t) => `<a class="teacher" id="t-${t.slug}" href="/teachers/${t.slug}/" data-insts="${attr(teacherInstruments(t).join('|'))}" style="text-decoration: none; color: #FFFFFF">
          <div style="position: relative">
            <div class="portrait">
              <img class="photo duo" src="${t.photo}" alt="${attr(t.name)}, Grove instructor" loading="lazy" style="object-position: ${t.focus}">
              <img class="photo col" src="${t.photoMono}" alt="" aria-hidden="true" loading="lazy" style="object-position: ${t.focus}">
            </div>
            ${t.badge ? `<span class="float-pill">${esc(t.badge)}</span>` : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px">
            <h3 style="margin: 0; font-size: 20px; font-weight: 600; line-height: 1.2">${esc(t.name)}</h3>
            <p style="margin: 0; color: #9FB1A8; font-size: 14px">${esc(t.eyebrow)}</p>
          </div>
        </a>`;

const chip = (group, value, label, on) =>
  `<button type="button" class="chip${on ? ' on' : ''}" data-group="${group}" data-value="${attr(value)}" aria-pressed="${on ? 'true' : 'false'}">${esc(label)}</button>`;

export const bookingForm = ({ teachers, ensembles }) => {
  const insts = ['Piano', 'Voice', 'Guitar', 'Violin', 'Bass Guitar', 'Drums', 'Ukulele', 'An ensemble'];
  const goals = ['Just for fun', 'Learn songs I love', 'Build strong foundations', 'Prepare for exams', 'Perform on stage', 'Play in a band', 'Write my own music'];
  const ensInfo = Object.fromEntries(ensembles.map((e) => [e.name, [e.ages, e.schedule.startsWith('Schedule') || e.schedule.startsWith('[') ? '' : e.schedule, e.length.startsWith('[') ? '' : e.length, e.price + '/class'].filter(Boolean).join(' · ')]));
  return `<div style="background: #13221B; border-radius: 36px 0 36px 0; padding: 36px">
      <form data-booking data-ens-info="${attr(JSON.stringify(ensInfo))}" style="display: flex; flex-direction: column; gap: 30px" novalidate>
        <input type="hidden" name="mode" value="new"><input type="hidden" name="who" value="child"><input type="hidden" name="instrument" value="Piano">
        <input type="hidden" name="ensemble" value="Music Makers"><input type="hidden" name="length" value="30"><input type="hidden" name="goalTags" value="">
        <div role="group" aria-label="Student type" style="display: flex; flex-wrap: wrap; gap: 10px">
          <button type="button" class="seg on" data-group="mode" data-value="new" aria-pressed="true"><strong>New student</strong><span>Start with a free trial</span></button>
          <button type="button" class="seg" data-group="mode" data-value="returning" aria-pressed="false"><strong>Returning student</strong><span>Register for 2026/27</span></button>
        </div>
        <fieldset style="border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px">
          <legend style="padding: 0; margin-bottom: 12px; font-weight: 600; font-size: 18px"><span class="g">1</span>  Who's learning?</legend>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">${chip('who', 'child', 'My child', true)}${chip('who', 'me', 'Myself', false)}</div>
        </fieldset>
        <fieldset style="border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px">
          <legend style="padding: 0; margin-bottom: 12px; font-weight: 600; font-size: 18px"><span class="g">2</span>  What would you like to learn?</legend>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">${insts.map((i, n) => chip('instrument', i, i, n === 0)).join('')}</div>
          <div data-show-when="ensemble" hidden style="display: flex; flex-wrap: wrap; gap: 8px; padding: 14px; border-radius: 18px; background: #0D1813">${ensembles.map((e, n) => chip('ensemble', e.name, e.name, n === 0)).join('')}</div>
          <div data-show-when="private" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
            <span style="color: #9FB1A8; font-size: 15px; margin-right: 6px">Lesson length</span>${['30', '45', '60'].map((l, n) => chip('length', l, l + ' min', n === 0)).join('')}
          </div>
          <p data-price-line style="margin: 0; color: #9FB1A8; font-size: 14px">After your free trial: $28.50 per lesson, billed monthly.</p>
        </fieldset>
        <fieldset style="border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px">
          <legend style="padding: 0; margin-bottom: 12px; font-weight: 600; font-size: 18px"><span class="g">3</span>  What are your goals? <span class="opt">(optional)</span></legend>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">${goals.map((g) => `<button type="button" class="chip" data-toggle="goal" data-value="${attr(g)}" aria-pressed="false">${esc(g)}</button>`).join('')}</div>
          <label class="field">Anything else we should know? Favourite music, past experience, dream songs…<textarea name="goals"></textarea></label>
          <label class="field">Preferred teacher <select name="teacher"><option>No preference</option>${teachers.filter((t) => t.bookWithTeacher).map((t) => `<option>${esc(t.name)}</option>`).join('')}</select></label>
        </fieldset>
        <fieldset style="border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px">
          <legend style="padding: 0; margin-bottom: 12px; font-weight: 600; font-size: 18px"><span class="g">4</span>  Your details</legend>
          <div class="two" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px">
            <label class="field" data-show-when="child">Parent or guardian name<input type="text" name="parent" autocomplete="name" required></label>
            <label class="field">Student's name<input type="text" name="student" required></label>
            <label class="field">Student's age<input type="text" name="age" inputmode="numeric"></label>
            <label class="field">Email<input type="email" name="email" autocomplete="email" required></label>
            <label class="field">Phone<input type="tel" name="phone" autocomplete="tel"></label>
          </div>
        </fieldset>
        <p data-form-error role="alert" hidden style="margin: 0; color: #FFB4A8; font-size: 15px"></p>
        <button class="btn btn-primary beat" type="submit" data-submit-label style="align-self: stretch">Request my free trial</button>
      </form>
      <div data-booking-done role="status" hidden style="display: flex; flex-direction: column; gap: 18px; padding: 24px 0">
        <svg width="72" height="72" viewBox="207.5 314.9 138.2 138.2" aria-hidden="true"><path fill="#00AD6B" d="${MARK_SILHOUETTE}"></path></svg>
        <h3 class="display" style="font-size: 48px">You're <span class="g">in.</span></h3>
        <p data-done-msg style="margin: 0; color: #C3D0CA"></p>
        <p style="margin: 0; color: #7F918A; font-size: 13px">Staging preview: this form doesn't send anything yet.</p>
        <button class="btn btn-ghost btn-sm" type="button" data-booking-reset style="align-self: flex-start">Book another student</button>
      </div>
    </div>`;
};
