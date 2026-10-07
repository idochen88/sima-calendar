/*
 * דף ההצהרה שהלקוחה ממלאת מהקישור (form.html?f=hair / face / pm).
 * בסיום ההצהרה נשלחת ל"תיבת הדואר" בענן, והאפליקציה של סימה אוספת אותה משם.
 * מבנה הטפסים מוגדר ב-forms.js.
 */
(function () {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const params = new URLSearchParams(location.search);
  const form = Forms.formById(params.get('f'));
  const root = $('#form');
  const preview = params.get('preview') === '1'; // צפייה של סימה מהאפליקציה: בלי שליחה

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

  /* ---------- שדות הפרטים האישיים ---------- */
  const FIELDS = {
    name: { label: 'שם ושם משפחה', req: true, attrs: 'autocomplete="name"' },
    idNum: { label: 'תעודת זהות', req: true, attrs: 'inputmode="numeric" autocomplete="off" class="ltr"' },
    birth: { label: 'תאריך לידה', req: true, type: 'date', attrs: 'class="ltr"' },
    marital: { label: 'מצב משפחתי', seg: ['נשוי/אה', 'רווק/ה'] },
    phone: { label: 'טלפון נייד', req: true, type: 'tel', attrs: 'inputmode="tel" autocomplete="tel" class="ltr"' },
    phone2: { label: 'טלפון נוסף', type: 'tel', attrs: 'inputmode="tel" class="ltr"' },
    address: { label: 'כתובת', attrs: 'autocomplete="street-address"' },
    email: { label: 'דוא״ל', type: 'email', attrs: 'inputmode="email" autocomplete="email" class="ltr"' },
    job: { label: 'מקצוע' },
    height: { label: 'גובה (ס״מ)', attrs: 'inputmode="numeric" class="ltr"' },
    weight: { label: 'משקל (ק״ג)', attrs: 'inputmode="decimal" class="ltr"' },
  };

  /* ---------- השאלון כרשימה שטוחה אחת ---------- */
  const ITEMS = [];
  form.sections.forEach((sec, si) => sec.items.forEach((it) => ITEMS.push({ ...it, si, sec })));
  const guardianAge = form.guardianAge || 0;

  /* ---------- מצב, כולל טיוטה שנשמרת בטלפון של הלקוחה ---------- */
  const DRAFT_KEY = 'sima-form-draft-' + form.id;
  const blank = () => ({
    details: Object.fromEntries(Object.keys(FIELDS).map((k) => [k, ''])),
    answers: ITEMS.map(() => ({ yes: null, details: '', text: '' })),
    agree: {},
    opts: (form.options ? form.options.items : []).map(() => false),
    guardian: { name: '', relation: '' },
  });
  let st = blank();
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d && d.answers && d.answers.length === ITEMS.length) {
      st = { ...st, ...d, details: { ...st.details, ...d.details }, guardian: { ...st.guardian, ...d.guardian } };
    }
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
  const isMinor = () => { const a = ageFrom(st.details.birth); return !!guardianAge && a != null && a < guardianAge; };

  // האם שדה הפירוט של פריט מוצג כרגע
  function detailShown(it, a) {
    if (!it.detail) return false;
    if (it.k === 'check') return a.yes === true;
    return it.detailWhen === 'no' ? a.yes === false : a.yes === true;
  }

  /* ---------- תצוגה ---------- */
  function fieldHTML(key) {
    const f = FIELDS[key];
    if (f.seg) {
      return `<div class="field"><span class="field-label">${f.label}</span>
        <div class="seg-tabs two" id="${key}">${f.seg.map((m) => `<button type="button" data-seg="${key}" data-v="${m}" class="${st.details[key] === m ? 'on' : ''}" aria-pressed="${st.details[key] === m}">${m}</button>`).join('')}</div></div>`;
    }
    return `<div class="field"><label for="d-${key}">${f.label}${f.req ? ' *' : ''}</label>
      <input id="d-${key}" type="${f.type || 'text'}" data-detail="${key}" value="${esc(st.details[key])}" ${f.attrs || ''}></div>`;
  }

  function detailHTML(it, a, i) {
    return `<textarea class="q-details" data-qd="${i}" placeholder="${esc(it.placeholder || 'פרט/י')}" ${detailShown(it, a) ? '' : 'hidden'}>${esc(a.details)}</textarea>`;
  }

  function itemHTML(it, i, num) {
    const a = st.answers[i];
    if (it.k === 'yn') {
      return `<div class="q" data-q="${i}">
        <p class="q-text">${num ? `<b>${num}.</b> ` : ''}${esc(it.q)}</p>
        <div class="yn">
          <button type="button" data-yn="1" class="${a.yes === true ? 'on yes' : ''}" aria-pressed="${a.yes === true}">כן</button>
          <button type="button" data-yn="0" class="${a.yes === false ? 'on' : ''}" aria-pressed="${a.yes === false}">לא</button>
        </div>${detailHTML(it, a, i)}</div>`;
    }
    if (it.k === 'check') {
      return `<div class="chk-item${it.detail || it.q.length > 22 ? ' wide' : ''}" data-q="${i}">
        <label class="chk"><input type="checkbox" data-ck="${i}" ${a.yes ? 'checked' : ''}><span>${esc(it.q)}</span></label>
        ${detailHTML(it, a, i)}</div>`;
    }
    return `<div class="field" data-q="${i}"><label for="t-${i}">${esc(it.q)}${it.required ? ' *' : ''}</label>
      <textarea id="t-${i}" class="q-text-input" data-qt="${i}">${esc(a.text)}</textarea></div>`;
  }

  function sectionHTML(sec, si) {
    let n = 0;
    let html = '';
    let checks = [];
    const flush = () => { if (checks.length) { html += `<div class="chk-grid">${checks.join('')}</div>`; checks = []; } };
    ITEMS.forEach((it, i) => {
      if (it.si !== si) return;
      if (it.k === 'check') { checks.push(itemHTML(it, i)); return; }
      flush();
      html += itemHTML(it, i, sec.numbered && it.k === 'yn' ? ++n : 0);
    });
    flush();
    return `<section class="card" id="sec-${si}"><h2>${esc(sec.title)}</h2>${sec.note ? `<p class="settings-note">${esc(sec.note)}</p>` : ''}${html}</section>`;
  }

  function agreementHTML(ag) {
    return `<section class="card" id="sec-ag-${ag.key}">
      <h2>${esc(ag.title)}</h2>
      ${ag.intro ? `<p>${esc(ag.intro)}</p>` : ''}
      ${ag.items ? `<ol class="legal">${ag.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : ''}
      ${(ag.text || []).map((t) => `<p class="legal-p">${esc(t)}</p>`).join('')}
      ${ag.footnote ? `<p class="settings-note">${esc(ag.footnote)}</p>` : ''}
      <label class="check-row"><input type="checkbox" data-agree="${ag.key}" ${st.agree[ag.key] ? 'checked' : ''}><span>${esc(ag.confirm)}</span></label>
    </section>`;
  }

  function render() {
    root.innerHTML = `
      ${preview ? `<div class="preview-bar"><a class="back-btn" href="./">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'}<span>חזרה לאפליקציה</span></a><span>תצוגה בלבד, ההצהרה לא תישלח</span></div>` : ''}
      <header class="form-head">
        <p class="form-biz">${esc(Forms.BUSINESS)}</p>
        <h1>${esc(form.title)}</h1>
        <p class="sub">יש למלא את הפרטים, לענות על השאלות ולחתום בסוף. זה לוקח כמה דקות, והפרטים נשמרים גם אם יוצאים מהדף באמצע.</p>
      </header>

      <section class="card" id="sec-details">
        <h2>פרטים אישיים</h2>
        ${form.personal.map(fieldHTML).join('')}
      </section>

      ${form.sections.map(sectionHTML).join('')}
      ${form.agreements.map(agreementHTML).join('')}

      ${form.options ? `<section class="card" id="sec-options">
        <h2>${esc(form.options.title)}</h2>
        <p class="settings-note">${esc(form.options.note)}</p>
        ${form.options.items.map((t, i) => `<label class="check-row soft"><input type="checkbox" data-opt="${i}" ${st.opts[i] ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}
      </section>` : ''}

      <section class="card" id="sec-guardian" ${isMinor() ? '' : 'hidden'}>
        <h2>אישור הורה / אפוטרופוס</h2>
        <p class="settings-note">המטופל/ת מתחת לגיל ${guardianAge}, ולכן נדרשת גם חתימה של הורה או אפוטרופוס.</p>
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
  const itemBox = (el) => el.closest('[data-q]');

  function refreshDetail(i) {
    const box = $(`[data-q="${i}"]`);
    const ta = box && $('.q-details', box);
    if (!ta) return;
    const show = detailShown(ITEMS[i], st.answers[i]);
    ta.hidden = !show;
    if (show && !ta.value) ta.focus();
  }

  root.addEventListener('input', (e) => {
    const t = e.target;
    t.classList.remove('invalid');
    if (t.dataset.detail) {
      st.details[t.dataset.detail] = t.value;
      if (t.dataset.detail === 'birth') updateGuardian();
    } else if (t.dataset.qd != null) {
      st.answers[Number(t.dataset.qd)].details = t.value;
    } else if (t.dataset.qt != null) {
      st.answers[Number(t.dataset.qt)].text = t.value;
    } else if (t.dataset.guardian) {
      st.guardian[t.dataset.guardian] = t.value;
    }
    saveDraft();
  });

  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.ck != null) {
      const i = Number(t.dataset.ck);
      st.answers[i].yes = t.checked;
      refreshDetail(i);
    } else if (t.dataset.agree) {
      st.agree[t.dataset.agree] = t.checked;
    } else if (t.dataset.opt != null) {
      st.opts[Number(t.dataset.opt)] = t.checked;
    }
    if (t.type === 'checkbox' && t.closest('.check-row')) t.closest('.check-row').classList.remove('invalid');
    if (t.dataset.detail === 'birth') updateGuardian();
    saveDraft();
  });

  root.addEventListener('click', (e) => {
    const yn = e.target.closest('[data-yn]');
    if (yn) {
      const box = itemBox(yn);
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
      refreshDetail(i);
      saveDraft();
      return;
    }
    const seg = e.target.closest('[data-seg]');
    if (seg) {
      const k = seg.dataset.seg;
      st.details[k] = st.details[k] === seg.dataset.v ? '' : seg.dataset.v;
      $$(`[data-seg="${k}"]`).forEach((b) => {
        const on = b.dataset.v === st.details[k];
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
    form.personal.forEach((k) => {
      const f = FIELDS[k];
      const v = (d[k] || '').trim();
      if (k === 'name') { if (v.split(/\s+/).length < 2) mark($('#d-name')); return; }
      if (k === 'idNum') { if (!/^\d{5,9}$/.test(v.replace(/\D/g, '')) || /[^\d\s-]/.test(v)) mark($('#d-idNum')); return; }
      if (k === 'birth') { if (ageFrom(v) == null) mark($('#d-birth')); return; }
      if (k === 'phone') { if (v.replace(/\D/g, '').length < 9) mark($('#d-phone')); return; }
      if (k === 'email') { if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) mark($('#d-email')); return; }
      if (f.req && !v) mark($(`#d-${k}`));
    });
    ITEMS.forEach((it, i) => {
      const a = st.answers[i];
      const box = $(`[data-q="${i}"]`);
      if (it.k === 'yn' && a.yes == null) mark(box);
      else if (it.detail === 'req' && detailShown(it, a) && !a.details.trim()) mark($('.q-details', box));
      else if (it.k === 'text' && it.required && !a.text.trim()) mark($('.q-text-input', box));
    });
    form.agreements.forEach((ag) => { if (!st.agree[ag.key]) mark($(`[data-agree="${ag.key}"]`).closest('.check-row')); });
    if (isMinor()) {
      if (!st.guardian.name.trim()) mark($('#g-name'));
      if (!st.guardian.relation.trim()) mark($('#g-rel'));
      if (!pads.guardian || pads.guardian.isEmpty()) mark($('#sigGuardian').closest('.sig-box'));
    }
    if (pads.client.isEmpty()) mark($('#sigClient').closest('.sig-box'));
    return bad;
  }

  // התשובה מסמנת "כדאי לעבור עליה" בכרטיס של סימה?
  function isAlert(it, a) {
    if (it.k === 'text' || it.flag === false) return false;
    if (it.flag === 'no') return a.yes === false;
    return a.yes === true;
  }

  function buildAnswers() {
    return ITEMS.map((it, i) => {
      const a = st.answers[i];
      const out = { q: it.q, kind: it.k, section: it.sec.title };
      if (it.k === 'text') return { ...out, text: a.text.trim() };
      return { ...out, yes: a.yes === true, details: detailShown(it, a) ? a.details.trim() : '', alert: isAlert(it, a) };
    });
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
    const details = {};
    form.personal.forEach((k) => { details[k] = (st.details[k] || '').trim(); });
    details.name = details.name.replace(/\s+/g, ' ');
    if ('idNum' in details) details.idNum = details.idNum.replace(/\D/g, '');
    const payload = {
      v: 2,
      formId: form.id,
      formTitle: form.title,
      submittedAt: new Date().toISOString(),
      details,
      age: ageFrom(st.details.birth),
      answers: buildAnswers(),
      agreements: form.agreements.map((ag) => ({ key: ag.key, title: ag.title, ok: true })),
      options: form.options ? form.options.items.map((label, i) => ({ label, yes: !!st.opts[i] })) : [],
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
