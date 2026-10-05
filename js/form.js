/*
 * דף הצהרת הבריאות שהלקוחה ממלאת מהקישור (form.html?f=hair).
 * בסיום ההצהרה נשלחת ל"תיבת הדואר" בענן, והאפליקציה של סימה אוספת אותה משם.
 */
(function () {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const MINOR_AGE = 16;
  const form = Forms.formById(new URLSearchParams(location.search).get('f'));
  const root = $('#form');
  const preview = new URLSearchParams(location.search).get('preview') === '1'; // צפייה של סימה מהאפליקציה: בלי שליחה

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  if (!form) {
    root.innerHTML = `<div class="card empty"><span class="emoji">🤔</span>הקישור לא תקין.<br>כדאי לבקש קישור חדש.</div>`;
    return;
  }
  document.title = form.title;

  /* ---------- מצב, כולל טיוטה שנשמרת בטלפון של הלקוחה ---------- */
  const DRAFT_KEY = 'sima-form-draft-' + form.id;
  const blank = () => ({
    details: { name: '', idNum: '', birth: '', marital: '', address: '', email: '', phone: '', phone2: '' },
    answers: form.questions.map(() => ({ yes: null, details: '' })),
    healthOk: false,
    consentOk: false,
    guardian: { name: '', relation: '' },
  });
  let st = blank();
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d && d.answers && d.answers.length === form.questions.length) st = { ...st, ...d, details: { ...st.details, ...d.details }, guardian: { ...st.guardian, ...d.guardian } };
  } catch (e) { /* אין טיוטה */ }
  const saveDraft = () => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(st)); } catch (e) { /* לא חשוב */ } };
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* לא חשוב */ } };

  function ageFrom(birth) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return null;
    const [y, m, d] = birth.split('-').map(Number);
    const now = new Date();
    let age = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
    return age >= 0 && age < 120 ? age : null;
  }
  const isMinor = () => { const a = ageFrom(st.details.birth); return a != null && a < MINOR_AGE; };

  /* ---------- תצוגה ---------- */
  const field = (key, label, type = 'text', extra = '') => `
    <div class="field">
      <label for="d-${key}">${label}</label>
      <input id="d-${key}" type="${type}" data-detail="${key}" value="${esc(st.details[key])}" ${extra}>
    </div>`;

  function render() {
    root.innerHTML = `
      ${preview ? `<div class="preview-bar"><a class="back-btn" href="./">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'}<span>חזרה לאפליקציה</span></a><span>תצוגה בלבד, ההצהרה לא תישלח</span></div>` : ''}
      <header class="form-head">
        <p class="form-biz">${esc(Forms.BUSINESS)}</p>
        <h1>${esc(form.title)}</h1>
        <p class="sub">יש למלא את כל הפרטים, לענות על השאלות ולחתום בסוף. זה לוקח כמה דקות, והפרטים נשמרים גם אם יוצאים מהדף באמצע.</p>
      </header>

      <section class="card" id="sec-details">
        <h2>פרטים אישיים</h2>
        ${field('name', 'שם ושם משפחה *', 'text', 'autocomplete="name"')}
        ${field('idNum', 'תעודת זהות *', 'text', 'inputmode="numeric" autocomplete="off" class="ltr"')}
        ${field('birth', 'תאריך לידה *', 'date', 'class="ltr"')}
        <div class="field">
          <span class="field-label">מצב משפחתי</span>
          <div class="seg-tabs two" id="marital">
            ${['נשוי/אה', 'רווק/ה'].map((m) => `<button type="button" data-marital="${m}" class="${st.details.marital === m ? 'on' : ''}" aria-pressed="${st.details.marital === m}">${m}</button>`).join('')}
          </div>
        </div>
        ${field('phone', 'טלפון נייד *', 'tel', 'inputmode="tel" autocomplete="tel" class="ltr"')}
        ${field('phone2', 'טלפון נוסף', 'tel', 'inputmode="tel" class="ltr"')}
        ${field('address', 'כתובת', 'text', 'autocomplete="street-address"')}
        ${field('email', 'דוא״ל', 'email', 'inputmode="email" autocomplete="email" class="ltr"')}
      </section>

      <section class="card" id="sec-questions">
        <h2>שאלון רפואי</h2>
        <p class="settings-note">יש לסמן כן או לא בכל שאלה. אם התשובה כן, נא לפרט.</p>
        ${form.questions.map((q, i) => {
          const a = st.answers[i];
          return `<div class="q" data-q="${i}">
            <p class="q-text"><b>${i + 1}.</b> ${esc(q)}</p>
            <div class="yn">
              <button type="button" data-yn="1" class="${a.yes === true ? 'on yes' : ''}" aria-pressed="${a.yes === true}">כן</button>
              <button type="button" data-yn="0" class="${a.yes === false ? 'on' : ''}" aria-pressed="${a.yes === false}">לא</button>
            </div>
            <textarea class="q-details" data-qd="${i}" placeholder="אם כן, פרט/י" ${a.yes === true ? '' : 'hidden'}>${esc(a.details)}</textarea>
          </div>`;
        }).join('')}
      </section>

      <section class="card" id="sec-health">
        <h2>${esc(form.health.title)}</h2>
        <p>${esc(form.health.intro)}</p>
        <ol class="legal">${form.health.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <label class="check-row"><input type="checkbox" id="healthOk" ${st.healthOk ? 'checked' : ''}><span>${esc(form.health.confirm)}</span></label>
      </section>

      <section class="card" id="sec-consent">
        <h2>${esc(form.consent.title)}</h2>
        <ol class="legal">${form.consent.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <p class="settings-note">${esc(form.consent.footnote)}</p>
        <label class="check-row"><input type="checkbox" id="consentOk" ${st.consentOk ? 'checked' : ''}><span>${esc(form.consent.confirm)}</span></label>
      </section>

      <section class="card" id="sec-guardian" ${isMinor() ? '' : 'hidden'}>
        <h2>אישור הורה / אפוטרופוס</h2>
        <p class="settings-note">המטופל/ת מתחת לגיל ${MINOR_AGE}, ולכן נדרשת גם חתימה של הורה או אפוטרופוס.</p>
        <div class="field"><label for="g-name">שם האפוטרופוס *</label><input id="g-name" type="text" data-guardian="name" value="${esc(st.guardian.name)}"></div>
        <div class="field"><label for="g-rel">סוג קרבה *</label><input id="g-rel" type="text" data-guardian="relation" value="${esc(st.guardian.relation)}" placeholder="למשל: אמא"></div>
        <div class="field">
          <span class="field-label">חתימת האפוטרופוס *</span>
          <div class="sig-box"><canvas id="sigGuardian"></canvas><button type="button" class="link-btn sig-clear" data-clear="guardian">ניקוי</button></div>
        </div>
      </section>

      <section class="card" id="sec-sign">
        <h2>חתימה</h2>
        <p class="settings-note">יש לחתום עם האצבע בתוך המסגרת.</p>
        <div class="sig-box"><canvas id="sigClient"></canvas><button type="button" class="link-btn sig-clear" data-clear="client">ניקוי</button></div>
        <p class="settings-note" style="margin-top:8px">תאריך: ${new Date().toLocaleDateString('he-IL')}</p>
      </section>

      <button type="button" class="btn" id="submit">שליחת ההצהרה</button>
      <p class="settings-note" style="text-align:center;margin-top:10px">הפרטים נשלחים רק אל ${esc(Forms.BUSINESS)}.</p>`;

    pads.client = makePad($('#sigClient'));
    if (isMinor()) pads.guardian = makePad($('#sigGuardian'));
  }

  /* ---------- חתימה באצבע ---------- */
  const pads = {};
  function makePad(canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let last = null;
    let empty = true;
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1f2a5a';
    const pt = (e) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      drawing = true;
      last = pt(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* לא נתמך */ }
      ctx.beginPath();
      ctx.arc(last.x, last.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      empty = false;
      canvas.closest('.sig-box').classList.remove('invalid');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const p = pt(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    });
    const stop = () => { drawing = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    return {
      clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); empty = true; },
      isEmpty: () => empty,
      toData: () => canvas.toDataURL('image/png'),
    };
  }

  /* ---------- אירועים ---------- */
  root.addEventListener('input', (e) => {
    const t = e.target;
    t.classList.remove('invalid');
    if (t.dataset.detail) {
      st.details[t.dataset.detail] = t.value;
      if (t.dataset.detail === 'birth') updateGuardian();
    } else if (t.dataset.qd != null) {
      st.answers[Number(t.dataset.qd)].details = t.value;
    } else if (t.dataset.guardian) {
      st.guardian[t.dataset.guardian] = t.value;
    }
    saveDraft();
  });

  root.addEventListener('change', (e) => {
    if (e.target.id === 'healthOk') st.healthOk = e.target.checked;
    if (e.target.id === 'consentOk') st.consentOk = e.target.checked;
    if (e.target.type === 'checkbox') e.target.closest('.check-row').classList.remove('invalid');
    if (e.target.dataset.detail === 'birth') updateGuardian();
    saveDraft();
  });

  root.addEventListener('click', (e) => {
    const yn = e.target.closest('[data-yn]');
    if (yn) {
      const box = yn.closest('.q');
      const i = Number(box.dataset.q);
      const yes = yn.dataset.yn === '1';
      st.answers[i].yes = yes;
      $$('[data-yn]', box).forEach((b) => {
        const on = b === yn;
        b.classList.toggle('on', on);
        b.classList.toggle('yes', on && yes);
        b.setAttribute('aria-pressed', on);
      });
      box.classList.remove('invalid');
      const ta = $('.q-details', box);
      ta.hidden = !yes;
      if (yes && !ta.value) ta.focus();
      saveDraft();
      return;
    }
    const mar = e.target.closest('[data-marital]');
    if (mar) {
      st.details.marital = st.details.marital === mar.dataset.marital ? '' : mar.dataset.marital;
      $$('#marital button').forEach((b) => {
        const on = b.dataset.marital === st.details.marital;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      saveDraft();
      return;
    }
    const clr = e.target.closest('[data-clear]');
    if (clr && pads[clr.dataset.clear]) { pads[clr.dataset.clear].clear(); return; }
    if (e.target.closest('#submit')) send();
  });

  function updateGuardian() {
    const sec = $('#sec-guardian');
    const minor = isMinor();
    if (sec.hidden === !minor) return;
    sec.hidden = !minor;
    if (minor && !pads.guardian) pads.guardian = makePad($('#sigGuardian'));
  }

  /* ---------- בדיקה ושליחה ---------- */
  function validate() {
    const bad = [];
    const mark = (el) => { if (el) { el.classList.add('invalid'); bad.push(el); } };
    const d = st.details;
    if (d.name.trim().split(/\s+/).length < 2) mark($('#d-name'));
    if (!/^\d{5,9}$/.test(d.idNum.replace(/\D/g, '')) || /[^\d\s-]/.test(d.idNum)) mark($('#d-idNum'));
    if (ageFrom(d.birth) == null) mark($('#d-birth'));
    if (d.phone.replace(/\D/g, '').length < 9) mark($('#d-phone'));
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) mark($('#d-email'));
    st.answers.forEach((a, i) => {
      const box = $(`.q[data-q="${i}"]`);
      if (a.yes == null) mark(box);
      else if (a.yes && !a.details.trim()) mark($('.q-details', box));
    });
    if (!st.healthOk) mark($('#healthOk').closest('.check-row'));
    if (!st.consentOk) mark($('#consentOk').closest('.check-row'));
    if (isMinor()) {
      if (!st.guardian.name.trim()) mark($('#g-name'));
      if (!st.guardian.relation.trim()) mark($('#g-rel'));
      if (!pads.guardian || pads.guardian.isEmpty()) mark($('#sigGuardian').closest('.sig-box'));
    }
    if (pads.client.isEmpty()) mark($('#sigClient').closest('.sig-box'));
    return bad;
  }

  let sending = false;
  async function send() {
    if (sending) return;
    if (preview) { toast('זו תצוגה בלבד, ההצהרה לא נשלחת'); return; }
    const bad = validate();
    if (bad.length) {
      bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast(bad.length === 1 ? 'חסר פרט אחד, סימנתי אותו באדום' : `חסרים ${bad.length} פרטים, סימנתי אותם באדום`);
      return;
    }
    if (!Cloud.configured()) {
      toast('הטופס עוד לא מחובר. נא לפנות לסימה.');
      return;
    }
    sending = true;
    const btn = $('#submit');
    btn.textContent = 'שולח…';
    btn.classList.add('disabled');
    const minor = isMinor();
    const payload = {
      v: 1,
      formId: form.id,
      formTitle: form.title,
      submittedAt: new Date().toISOString(),
      details: {
        ...st.details,
        name: st.details.name.trim().replace(/\s+/g, ' '),
        idNum: st.details.idNum.replace(/\D/g, ''),
        email: st.details.email.trim(),
      },
      age: ageFrom(st.details.birth),
      answers: form.questions.map((q, i) => ({ q, yes: st.answers[i].yes, details: st.answers[i].yes ? st.answers[i].details.trim() : '' })),
      healthOk: true,
      consentOk: true,
      signature: pads.client.toData(),
      guardian: minor ? { name: st.guardian.name.trim(), relation: st.guardian.relation.trim(), signature: pads.guardian.toData() } : null,
    };
    try {
      await Cloud.submit(form.id, payload);
      clearDraft();
      const first = payload.details.name.split(' ')[0];
      root.innerHTML = `<div class="card empty form-done"><span class="emoji">🌸</span>
        <h1>תודה ${esc(first)}!</h1>
        <p>ההצהרה נשלחה בהצלחה אל ${esc(Forms.BUSINESS)}.<br>אפשר לסגור את הדף.</p></div>`;
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      toast('השליחה לא הצליחה. נא לבדוק את החיבור לאינטרנט ולנסות שוב.');
      btn.textContent = 'שליחת ההצהרה';
      btn.classList.remove('disabled');
    } finally {
      sending = false;
    }
  }

  render();
})();
