(function () {
  'use strict';

  const L = window.Logic;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = L.formatMoney;
  const uid = () => (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  /* ---------- אייקונים ---------- */
  const I = (() => {
    const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
    return {
      calendar: s('<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
      bell: s('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8"/><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0"/>'),
      chart: s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
      users: s('<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 3.5a4 4 0 0 1 0 8M19 14.5a6 6 0 0 1 3 5.5"/>'),
      gear: s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
      right: s('<path d="m9 5 7 7-7 7"/>'),
      left: s('<path d="m15 5-7 7 7 7"/>'),
      plus: s('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.6"'),
      x: s('<path d="M6 6l12 12M18 6 6 18"/>'),
      check: s('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="2.6"'),
      phone: s('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
      wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
      trash: s('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>'),
      search: s('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
      download: s('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
      upload: s('<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>'),
      save: s('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),
      clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
      note: s('<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4"/>'),
      alert: s('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'),
      edit: s('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>'),
      move: s('<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M9 15h6M13 13l2 2-2 2"/>'),
      bag: s('<path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    };
  })();

  /* ---------- מצב ---------- */
  // הצבעים שאפשר לבחור לסוגי הטיפולים
  const PALETTE = [
    { c: '#E5879F', n: 'ורוד' }, { c: '#F08C7E', n: 'אלמוג' }, { c: '#F2A65A', n: 'כתום' },
    { c: '#DDB443', n: 'חרדל' }, { c: '#86BC7C', n: 'ירוק' }, { c: '#48B39B', n: 'מנטה' },
    { c: '#4BAAD0', n: 'טורקיז' }, { c: '#6C94E0', n: 'כחול' }, { c: '#9C8CDB', n: 'לבנדר' },
    { c: '#C27BC4', n: 'סגול' }, { c: '#B38B6D', n: 'מוקה' }, { c: '#8E9AAF', n: 'אפור' },
  ];
  const DEFAULT_COLORS = { 't-face': '#E5879F', 't-hair': '#9C8CDB', 't-brows': '#B38B6D' };
  const NEUTRAL = '#C9B7AE';
  const ALARM_OPTIONS = [5, 10, 15, 30, 60];

  const DEFAULT_TYPES = [
    { id: 't-face', name: 'טיפול פנים', price: 250, duration: 60, color: '#E5879F', subs: [] },
    { id: 't-hair', name: 'הסרת שיער', price: 150, duration: 30, color: '#9C8CDB', subs: [] },
    { id: 't-brows', name: 'עיצוב גבות', price: 80, duration: 20, color: '#B38B6D', subs: [] },
  ];
  const DEFAULT_SETTINGS = {
    businessName: 'סימה חן קוסמטיקאית מוסמכת',
    template: L.DEFAULT_TEMPLATE,
    treatmentTypes: DEFAULT_TYPES,
    products: [],
    alarmMinutes: 15,
    askCalendar: true,
  };

  // משלים שדות חדשים (צבע, תתי-סוגים, תכשירים) להגדרות שנשמרו בגרסה קודמת
  function normalizeSettings(src) {
    const s = { ...src };
    s.treatmentTypes = (Array.isArray(s.treatmentTypes) ? s.treatmentTypes : []).map((t, i) => ({
      id: String(t.id || 't-' + uid()),
      name: String(t.name || ''),
      price: L.num(t.price),
      duration: Number(t.duration) || 30,
      color: t.color || DEFAULT_COLORS[t.id] || PALETTE[i % PALETTE.length].c,
      subs: (Array.isArray(t.subs) ? t.subs : []).map((x) => ({
        id: String(x.id || 's-' + uid()), name: String(x.name || ''), price: L.num(x.price), duration: Number(x.duration) || 0,
      })),
    }));
    s.products = (Array.isArray(s.products) ? s.products : []).map((p) => ({
      id: String(p.id || 'p-' + uid()), name: String(p.name || ''), price: L.num(p.price),
    }));
    s.alarmMinutes = ALARM_OPTIONS.includes(Number(s.alarmMinutes)) ? Number(s.alarmMinutes) : 15;
    s.askCalendar = s.askCalendar !== false;
    if (typeof s.businessName !== 'string') s.businessName = DEFAULT_SETTINGS.businessName;
    if (typeof s.template !== 'string' || !s.template.trim()) s.template = L.DEFAULT_TEMPLATE;
    return s;
  }

  const typeById = (id) => state.settings.treatmentTypes.find((t) => t.id === id);

  function itemColor(it) {
    if (L.isProduct(it)) return NEUTRAL;
    const t = it.typeId && typeById(it.typeId);
    return (t && t.color) || it.color || NEUTRAL;
  }

  // צבע הטיפול = הצבע של הטיפול הראשון בכרטיס
  function apptColor(a) {
    const it = (a.items || []).find((i) => !L.isProduct(i));
    return it ? itemColor(it) : NEUTRAL;
  }

  function nextFreeColor() {
    const used = new Set(state.settings.treatmentTypes.map((t) => t.color));
    const free = PALETTE.find((p) => !used.has(p.c));
    return (free || PALETTE[state.settings.treatmentTypes.length % PALETTE.length]).c;
  }

  const today = () => L.todayStr();
  const tomorrow = () => L.addDays(today(), 1);

  const state = {
    store: null,
    appts: [],
    settings: null,
    meta: {},
    view: 'calendar',
    dayBack: 'calendar',
    month: L.monthStart(L.todayStr()),
    day: L.todayStr(),
    remDay: null,
    sumTab: 'day',
    sumDate: L.todayStr(),
    clientQuery: '',
    clientFilter: 'all',
    contacts: [],
  };

  const findAppt = (id) => state.appts.find((a) => a.id === id);

  async function saveAppt(a) {
    a.updatedAt = Date.now();
    const i = state.appts.findIndex((x) => x.id === a.id);
    if (i >= 0) state.appts[i] = a; else state.appts.push(a);
    await state.store.putAppointment(a);
  }

  async function saveSettings() {
    await state.store.setKV('settings', state.settings);
  }

  async function saveMeta() {
    await state.store.setKV('meta', state.meta);
  }

  /* ---------- כלים לממשק ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function ask({ title, text, ok = 'אישור', cancel = 'ביטול', danger = false }) {
    return new Promise((resolve) => {
      const wrap = $('#dialogWrap');
      $('#dialog').innerHTML = `
        <h3>${esc(title)}</h3>
        ${text ? `<p>${esc(text)}</p>` : ''}
        <div class="btn-row">
          <button class="btn ${danger ? 'danger' : ''}" data-r="1">${esc(ok)}</button>
          ${cancel ? `<button class="btn ghost" data-r="0">${esc(cancel)}</button>` : ''}
        </div>`;
      wrap.classList.add('open');
      wrap.setAttribute('aria-hidden', 'false');
      const done = (v) => {
        wrap.classList.remove('open');
        wrap.setAttribute('aria-hidden', 'true');
        wrap.onclick = null;
        resolve(v);
      };
      wrap.onclick = (e) => {
        const b = e.target.closest('[data-r]');
        if (b) done(b.dataset.r === '1');
        else if (e.target === wrap && cancel) done(false);
      };
    });
  }

  let sheetOnClose = null;
  function openSheet(html, onClose) {
    const wrap = $('#sheetWrap');
    $('#sheet').innerHTML = html;
    $('#sheet .sheet-body') && ($('#sheet .sheet-body').scrollTop = 0);
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    sheetOnClose = onClose || null;
  }
  function closeSheet() {
    const wrap = $('#sheetWrap');
    if (document.activeElement) document.activeElement.blur();
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    const cb = sheetOnClose;
    sheetOnClose = null;
    if (cb) cb();
  }
  const sheetOpen = () => $('#sheetWrap').classList.contains('open');

  function periodNav(label, sub, prev, next, todayAction, todayLabel = 'חזרה להיום') {
    return `
      <div class="period-nav">
        <button class="icon-btn" data-action="${prev}" aria-label="הקודם">${I.right}</button>
        <div class="period-label">
          <b>${esc(label)}</b>
          ${sub ? `<small>${esc(sub)}</small>` : ''}
          ${todayAction ? `<div><button class="today-link" data-action="${todayAction}">${todayLabel}</button></div>` : ''}
        </div>
        <button class="icon-btn" data-action="${next}" aria-label="הבא">${I.left}</button>
      </div>`;
  }

  const initial = (name) => (String(name || '?').trim()[0] || '?');
  const dayLabel = (d) => d === today() ? 'היום' : d === tomorrow() ? 'מחר'
    : d === L.addDays(today(), -1) ? 'אתמול' : `יום ${L.dayName(d)}`;

  /* ---------- התראת מחר ---------- */
  function tomorrowAlert() {
    const r = L.reminderStatus(state.appts, tomorrow());
    if (!r.total) return '';
    if (!r.needAttention) {
      return `<button class="alert ok" data-action="tab" data-tab="reminders">
        <span class="alert-count">${I.check}</span>
        <span class="alert-text"><b>כל ${r.total === 1 ? 'הלקוחה' : `${r.total} הלקוחות`} של מחר אישרו 🌸</b><span>אפשר לנוח בשקט</span></span>
        ${I.left}</button>`;
    }
    const parts = [];
    if (r.notSent) parts.push(`${r.notSent} בלי תזכורת`);
    if (r.notConfirmed) parts.push(`${r.notConfirmed} טרם אישרו`);
    return `<button class="alert" data-action="tab" data-tab="reminders">
      <span class="alert-count">${r.needAttention}</span>
      <span class="alert-text"><b>${r.needAttention === 1 ? 'לקוחה אחת למחר דורשת' : `${r.needAttention} לקוחות למחר דורשות`} מעקב</b><span>${parts.join(' · ')}</span></span>
      ${I.left}</button>`;
  }

  function backupNudge() {
    if (state.appts.length < 5) return '';
    const last = state.meta.lastBackup;
    const days = last ? Math.floor((Date.now() - last) / 86400000) : null;
    if (days !== null && days < 14) return '';
    return `<button class="backup-nudge" data-action="open-settings">${I.save}
      <span>${days === null ? 'עוד לא נעשה גיבוי לנתונים.' : `הגיבוי האחרון היה לפני ${days} ימים.`} <u>לגיבוי עכשיו</u></span></button>`;
  }

  /* ---------- מסך יומן ---------- */
  function viewCalendar() {
    const t = today();
    const m = state.month;
    const [y, mo] = m.split('-').map(Number);
    const first = L.dayOfWeek(m);
    const days = L.daysInMonth(y, mo);
    const totals = L.dailyTotals(state.appts, m, L.monthEnd(m));
    const colorsByDay = {};
    sortByTime(state.appts.filter((a) => a.date.startsWith(m.slice(0, 8)) && L.isCounted(a)))
      .forEach((a) => { (colorsByDay[a.date] = colorsByDay[a.date] || []).push(apptColor(a)); });
    const monthSum = L.summarize(state.appts, m, L.monthEnd(m));
    const todaySum = L.daySummary(state.appts, t);
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : hour < 21 ? 'ערב טוב' : 'לילה טוב';

    let cells = L.DAY_LETTERS.map((d) => `<div class="cal-wd">${d}</div>`).join('');
    for (let i = 0; i < first; i++) cells += '<div></div>';
    for (let d = 1; d <= days; d++) {
      const ds = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const info = totals[ds];
      const cls = ['cal-day'];
      if (ds === t) cls.push('today');
      if (ds < t) cls.push('past');
      const colors = colorsByDay[ds] || [];
      if (colors.length) cls.push('has');
      if ((first + d - 1) % 7 === 6) cls.push('sat');
      let dots = '';
      if (colors.length) {
        dots = colors.slice(0, 4).map((c) => `<i class="dot" style="background:${c}"></i>`).join('') +
          (colors.length > 4 ? `<span class="more">+${colors.length - 4}</span>` : '');
      }
      const label = `${d} ב${L.MONTH_NAMES[mo - 1]}${info ? `, ${info.count} טיפולים, ${money(info.total)}` : ''}`;
      cells += `<button class="${cls.join(' ')}" data-action="open-day" data-date="${ds}" aria-label="${esc(label)}">
        <span class="n">${d}</span>
        <span class="dots">${dots}</span>
        ${info && info.total ? `<span class="amt">${money(info.total)}</span>` : ''}
      </button>`;
    }

    const isCurMonth = m === L.monthStart(t);
    return `
      <div class="vhead">
        <div class="vhead-title"><h1>${greet}, סימה</h1><p class="sub">יום ${L.dayName(t)}, ${L.longDate(t)}</p></div>
        <button class="icon-btn" data-action="open-settings" aria-label="הגדרות">${I.gear}</button>
      </div>
      ${tomorrowAlert()}
      <button class="today-strip" data-action="open-day" data-date="${t}">
        <span class="ts-date"><b>${Number(t.slice(8))}</b><small>היום</small></span>
        <span class="ts-main"><b>${todaySum.count ? `${todaySum.count} טיפולים היום` : 'אין טיפולים היום'}</b>
          <span>${todaySum.count ? 'לחצי לפירוט היום' : 'לחצי כדי להוסיף טיפול'}</span></span>
        <span class="ts-amt">${todaySum.count ? money(todaySum.total) : ''}</span>
      </button>
      <section class="card cal" id="cal">
        <div class="cal-head">
          <button class="icon-btn" data-action="month-prev" aria-label="החודש הקודם">${I.right}</button>
          <div class="cal-title"><b>${L.monthLabel(m)}</b>
            ${isCurMonth ? '' : '<button class="today-link" data-action="month-today">חזרה להיום</button>'}</div>
          <button class="icon-btn" data-action="month-next" aria-label="החודש הבא">${I.left}</button>
        </div>
        <div class="cal-grid">${cells}</div>
        <div class="legend">
          ${state.settings.treatmentTypes.map((tp) => `<span><i class="dot" style="background:${tp.color}"></i>${esc(tp.name)}</span>`).join('')}
        </div>
        <button class="cal-foot row-btn" data-action="sum-month" data-date="${m}">
          <span>סה״כ ${L.MONTH_NAMES[mo - 1]} · ${monthSum.count} טיפולים</span>
          <b>${money(monthSum.total)}</b>
        </button>
      </section>
      ${backupNudge()}`;
  }

  /* ---------- מסך יום ---------- */
  // הטיפולים בכרטיס, כל אחד עם נקודה בצבע שלו, ואחריהם התכשירים
  function itemChips(a) {
    const tx = (a.items || []).filter((i) => !L.isProduct(i)).map((i) =>
      `<span class="tx-chip"><i class="dot" style="background:${itemColor(i)}"></i>${esc(L.itemLabel(i))}</span>`).join('');
    const pr = L.productNames(a);
    return `<div class="tx-chips">${tx}${pr ? `<span class="tx-chip product">${I.bag}${esc(pr)}</span>` : ''}</div>`;
  }

  function apptActions(a) {
    return `<div class="appt-actions">
      <button data-action="edit-appt" data-id="${a.id}">${I.edit}עריכה</button>
      <button data-action="move-appt" data-id="${a.id}" aria-label="העברה ליום אחר">${I.move}העברה</button>
      ${a.status !== 'cancelled' ? `<button data-action="cal-add" data-id="${a.id}" class="${a.calendarAddedAt ? 'done' : ''}">${I.bell}${a.calendarAddedAt ? 'ביומן ✓' : 'התראה'}</button>` : ''}
    </div>`;
  }

  function apptCard(a, overlapIds) {
    const pay = a.payment ? L.paymentLabel(a.payment) : '';
    const sent = a.reminderSent
      ? `<span class="tag sent">${I.check}תזכורת נשלחה</span>`
      : (a.status !== 'cancelled' && a.date > today() ? '<span class="tag notsent">טרם נשלחה תזכורת</span>' : '');
    return `
      <article class="appt ${a.status}" style="--tc:${apptColor(a)}">
        <button class="appt-body" data-action="edit-appt" data-id="${a.id}">
          <div class="appt-time"><b>${esc(a.time)}</b><small>עד ${L.apptEnd(a)}</small></div>
          <div class="appt-main">
            <div class="appt-name">${esc(a.clientName)} <span class="pill ${a.status}">${L.statusLabel(a.status)}</span></div>
            ${itemChips(a)}
            <div class="appt-meta">
              ${pay ? `<span class="tag">${esc(pay)}</span>` : '<span class="tag">אמצעי תשלום לא צוין</span>'}
              ${sent}
              ${overlapIds.has(a.id) ? `<span class="tag warn">${I.alert}חפיפה</span>` : ''}
            </div>
            ${a.notes ? `<div class="appt-note">${esc(a.notes)}</div>` : ''}
          </div>
          <div class="appt-price">${money(L.apptTotal(a))}</div>
        </button>
        ${statusSeg(a)}
        ${apptActions(a)}
      </article>`;
  }

  function statusSeg(a) {
    return `<div class="status-seg" role="group" aria-label="סטטוס הגעה">
      ${L.STATUSES.map((s) => `<button class="${s.id} ${a.status === s.id ? 'on' : ''}" data-action="set-status" data-id="${a.id}" data-status="${s.id}" aria-pressed="${a.status === s.id}">${s.label}</button>`).join('')}
    </div>`;
  }

  function sortByTime(list) {
    return list.sort((a, b) => L.timeToMin(a.time) - L.timeToMin(b.time));
  }

  function overlapSet(list) {
    const set = new Set();
    list.forEach((a) => {
      if (a.status === 'cancelled') return;
      if (L.findOverlaps(list, a).length) set.add(a.id);
    });
    return set;
  }

  // ארבעת אמצעי התשלום תמיד; מזומן ישן ו"לא צוין" רק כשיש בהם סכום
  function paymentRows(s) {
    const rows = L.PAYMENTS.map((p) => ({ id: p.id, label: p.label, v: s.byPayment[p.id] }));
    L.LEGACY_PAYMENTS.forEach((p) => { if (s.byPayment[p.id]) rows.push({ id: p.id, label: p.label, v: s.byPayment[p.id] }); });
    if (s.byPayment[L.NO_PAYMENT]) rows.push({ id: 'none', label: L.NO_PAYMENT_LABEL, v: s.byPayment[L.NO_PAYMENT] });
    return rows;
  }

  function payTiles(s) {
    const rows = paymentRows(s);
    return `<div class="pay-tiles">${rows.map((r) =>
      `<div class="pay-tile ${r.v ? '' : 'zero'}"><span>${esc(r.label)}</span><b>${money(r.v)}</b></div>`).join('')}</div>`;
  }

  function viewDay() {
    const d = state.day;
    const list = sortByTime(state.appts.filter((a) => a.date === d));
    const s = L.daySummary(state.appts, d);
    const overlaps = overlapSet(list);
    return `
      <div class="vhead">
        <button class="back-btn" data-action="back">${I.right}<span>${state.dayBack === 'calendar' ? 'יומן' : 'חזרה'}</span></button>
        <div class="vhead-title"></div>
      </div>
      ${periodNav(dayLabel(d) === `יום ${L.dayName(d)}` ? `יום ${L.dayName(d)}` : `${dayLabel(d)} · יום ${L.dayName(d)}`,
        L.longDate(d), 'day-prev', 'day-next', d === today() ? '' : 'day-today')}
      <section class="hero">
        <div class="hero-label">הכנסות ${d === today() ? 'היום' : 'ביום הזה'}</div>
        <div class="hero-amt">${money(s.total)}</div>
        <div class="hero-meta">
          <span>${s.count} טיפולים</span>
          ${s.cancelledCount ? `<span>${s.cancelledCount} ביטלו (לא נספרו)</span>` : ''}
        </div>
        ${payTiles(s)}
      </section>
      ${list.length ? list.map((a) => apptCard(a, overlaps)).join('') : `
        <div class="card empty"><span class="emoji">🌿</span>אין טיפולים ביום הזה
          <div style="margin-top:14px"><button class="btn" data-action="new-appt" data-date="${d}">${I.plus}הוספת טיפול</button></div></div>`}`;
  }

  /* ---------- מסך תזכורות ---------- */
  function reminderCard(a) {
    const text = L.fillTemplate(state.settings.template, a, state.settings.businessName);
    const link = L.waLink(a.phone, text);
    let btn;
    if (!link) {
      btn = `<button class="btn disabled">${a.phone ? 'מספר הטלפון לא תקין' : 'אין מספר טלפון'}</button>
        <button class="link-btn" data-action="edit-appt" data-id="${a.id}">להוספת מספר בכרטיס</button>`;
    } else if (a.reminderSent) {
      btn = `<a class="btn wa-done" href="${esc(link)}" target="_blank" rel="noopener" data-action="wa-sent" data-id="${a.id}">${I.check}התזכורת נשלחה · לשלוח שוב</a>`;
    } else {
      btn = `<a class="btn wa" href="${esc(link)}" target="_blank" rel="noopener" data-action="wa-sent" data-id="${a.id}">${I.wa}שלחי תזכורת בוואטסאפ</a>`;
    }
    return `
      <article class="appt rem-card ${a.status}" style="--tc:${apptColor(a)}">
        <button class="rem-top row-btn" data-action="edit-appt" data-id="${a.id}">
          <div class="appt-time"><b>${esc(a.time)}</b><small>עד ${L.apptEnd(a)}</small></div>
          <div class="appt-main">
            <div class="appt-name">${esc(a.clientName)}</div>
            <div class="appt-tx">${esc(L.treatmentNames(a))}</div>
            <div class="appt-tx ltr">${esc(a.phone || '')}</div>
          </div>
          <span class="pill ${a.status}">${L.statusLabel(a.status)}</span>
        </button>
        <div class="rem-actions">
          ${btn}
          ${a.reminderSent ? `<div class="rem-sent-row"><span>נשלחה${a.reminderSentAt ? ` ב-${new Date(a.reminderSentAt).toLocaleString('he-IL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}</span>
            <button class="link-btn" data-action="unsend" data-id="${a.id}">סמני כלא נשלחה</button></div>` : ''}
        </div>
        <div class="field-label" style="padding:0 14px;margin-bottom:6px">הלקוחה ענתה? עדכני:</div>
        ${statusSeg(a)}
        ${apptActions(a)}
      </article>`;
  }

  function viewReminders() {
    const d = state.remDay || tomorrow();
    const r = L.reminderStatus(state.appts, d);
    const cancelled = sortByTime(state.appts.filter((a) => a.date === d && a.status === 'cancelled'));
    const label = d === tomorrow() ? `מחר · יום ${L.dayName(d)}` : `${dayLabel(d)}${dayLabel(d).startsWith('יום') ? '' : ` · יום ${L.dayName(d)}`}`;
    return `
      <div class="vhead"><div class="vhead-title"><h1>תזכורות</h1><p class="sub">שליחת תזכורות ואישורי הגעה</p></div></div>
      ${periodNav(label, L.longDate(d), 'rem-prev', 'rem-next', d === tomorrow() ? '' : 'rem-tomorrow', 'חזרה למחר')}
      ${r.total ? `
        <div class="chips-line">
          <span class="chip-stat">${r.total} טיפולים</span>
          <span class="chip-stat" style="color:${r.notSent ? '#B0661A' : 'var(--green)'}">${r.notSent ? `${r.notSent} בלי תזכורת` : '✓ כולן קיבלו תזכורת'}</span>
          <span class="chip-stat" style="color:${r.notConfirmed ? '#B0661A' : 'var(--green)'}">${r.notConfirmed ? `${r.notConfirmed} טרם אישרו` : '✓ כולן אישרו'}</span>
        </div>
        ${r.list.map(reminderCard).join('')}` : `
        <div class="card empty"><span class="emoji">🌸</span>אין טיפולים ${d === tomorrow() ? 'מחר' : 'ביום הזה'}</div>`}
      ${cancelled.length ? `<div class="card"><h2>ביטלו <small>(${cancelled.length})</small></h2>
        ${cancelled.map((a) => `<button class="history-item" data-action="edit-appt" data-id="${a.id}">
          <span class="hi-date"><b>${esc(a.time)}</b></span>
          <span class="hi-main">${esc(a.clientName)} · <span class="muted">${esc(L.treatmentNames(a))}</span></span>
          <span class="pill cancelled">ביטלה</span></button>`).join('')}</div>` : ''}`;
  }

  /* ---------- מסך סיכומים ---------- */
  function breakdownPayments(s) {
    const rows = paymentRows(s);
    return `<section class="card"><h2>לפי אמצעי תשלום</h2><div class="rows">
      ${rows.map((r) => {
        const pct = s.total ? Math.round((r.v / s.total) * 100) : 0;
        return `<div>
          <div class="row-line ${r.v ? '' : 'zero'}"><span class="lbl"><i class="swatch" style="background:var(--pay-${r.id})"></i>${esc(r.label)}${r.v ? ` <small>${pct}%</small>` : ''}</span><span class="val">${money(r.v)}</span></div>
          <div class="bar"><i style="width:${pct}%;background:var(--pay-${r.id})"></i></div>
        </div>`;
      }).join('')}
    </div></section>`;
  }

  function breakdownTypes(s) {
    if (!s.byType.length) return '';
    const max = Math.max(...s.byType.map((t) => t.total), 1);
    const colorOf = (t) => ((t.typeId && typeById(t.typeId)) || state.settings.treatmentTypes.find((x) => x.name === t.name) || t).color || NEUTRAL;
    return `<section class="card"><h2>לפי סוג טיפול</h2><div class="rows">
      ${s.byType.map((t) => `<div>
        <div class="row-line"><span class="lbl"><i class="swatch" style="background:${colorOf(t)}"></i>${esc(t.name)} <small>× ${t.count}</small></span><span class="val">${money(t.total)}</span></div>
        <div class="bar"><i style="width:${Math.round((t.total / max) * 100)}%;background:${colorOf(t)}"></i></div>
        ${t.subs.length ? `<div class="sub-lines">${t.subs.map((x) =>
          `<div class="row-line"><span class="lbl">${esc(x.name)} <small>× ${x.count}</small></span><span class="val">${money(x.total)}</span></div>`).join('')}</div>` : ''}
      </div>`).join('')}
    </div></section>`;
  }

  function breakdownProducts(s) {
    if (!s.byProduct.length) return '';
    return `<section class="card"><h2>מכירת תכשירים <small>${money(s.productsTotal)}</small></h2><div class="rows">
      ${s.byProduct.map((p) => `<div class="row-line"><span class="lbl">${esc(p.name)} <small>× ${p.count}</small></span><span class="val">${money(p.total)}</span></div>`).join('')}
    </div></section>`;
  }

  function summaryHero(s, label) {
    const avg = s.count ? s.total / s.count : 0;
    return `<section class="hero">
      <div class="hero-label">${esc(label)}</div>
      <div class="hero-amt">${money(s.total)}</div>
      <div class="hero-meta">
        <span>${s.count} טיפולים</span>
        ${s.count ? `<span>ממוצע ${money(Math.round(avg))} לטיפול</span>` : ''}
        ${s.productsTotal ? `<span>מתוכם תכשירים ${money(s.productsTotal)}</span>` : ''}
        ${s.cancelledCount ? `<span>${s.cancelledCount} ביטלו (לא נספרו)</span>` : ''}
      </div>
    </section>`;
  }

  function viewSummary() {
    const tab = state.sumTab;
    const d = state.sumDate;
    const t = today();
    let nav; let body;
    if (tab === 'day') {
      const s = L.daySummary(state.appts, d);
      nav = periodNav(d === t ? `היום · יום ${L.dayName(d)}` : `יום ${L.dayName(d)}`, L.longDate(d), 'sum-prev', 'sum-next', d === t ? '' : 'sum-today');
      body = summaryHero(s, 'סך הכנסות ביום') + breakdownPayments(s) + breakdownTypes(s) + breakdownProducts(s) +
        `<button class="btn secondary" data-action="open-day" data-date="${d}" data-back="summary">לרשימת הטיפולים ביום</button>`;
    } else if (tab === 'week') {
      const s = L.weekSummary(state.appts, d);
      const cur = L.weekStart(t) === s.from;
      nav = periodNav(cur ? 'השבוע' : `שבוע ${L.shortDate(s.from)} – ${L.shortDate(s.to)}`,
        `ראשון ${L.shortDate(s.from)} עד שבת ${L.shortDate(s.to)}`, 'sum-prev', 'sum-next', cur ? '' : 'sum-today');
      const maxDay = Math.max(...s.days.map((x) => x.total), 1);
      body = summaryHero(s, 'סך הכנסות בשבוע') + breakdownPayments(s) + breakdownTypes(s) + breakdownProducts(s) +
        `<section class="card"><h2>לפי ימים</h2><div class="rows">
          ${s.days.map((x) => `<button class="row-btn" data-action="open-day" data-date="${x.from}" data-back="summary">
            <div class="row-line ${x.total ? '' : 'zero'}"><span class="lbl">יום ${L.dayName(x.from)} <small>${L.shortDate(x.from)}${x.count ? ` · ${x.count} טיפולים` : ''}</small></span><span class="val">${money(x.total)}</span></div>
            <div class="bar"><i style="width:${Math.round((x.total / maxDay) * 100)}%"></i></div></button>`).join('')}
        </div></section>`;
    } else {
      const s = L.monthSummary(state.appts, d);
      const cur = L.monthStart(t) === s.from;
      nav = periodNav(L.monthLabel(d), cur ? 'החודש הנוכחי' : '', 'sum-prev', 'sum-next', cur ? '' : 'sum-today');
      const maxW = Math.max(...s.weeks.map((x) => x.total), 1);
      body = summaryHero(s, 'סך הכנסות בחודש') + breakdownPayments(s) + breakdownTypes(s) + breakdownProducts(s) +
        `<section class="card"><h2>לפי שבועות</h2><div class="rows">
          ${s.weeks.map((w, i) => `<button class="row-btn" data-action="sum-week" data-date="${w.from}">
            <div class="row-line ${w.total ? '' : 'zero'}"><span class="lbl">שבוע ${i + 1} <small>${L.shortDate(w.from)}–${L.shortDate(w.to)}${w.count ? ` · ${w.count} טיפולים` : ''}</small></span><span class="val">${money(w.total)}</span></div>
            <div class="bar"><i style="width:${Math.round((w.total / maxW) * 100)}%"></i></div></button>`).join('')}
        </div></section>`;
    }
    return `
      <div class="vhead"><div class="vhead-title"><h1>סיכומים</h1><p class="sub">מחושב אוטומטית · טיפולים שבוטלו לא נספרים</p></div></div>
      <div class="seg-tabs" role="tablist">
        ${[['day', 'יום'], ['week', 'שבוע'], ['month', 'חודש']].map(([id, lbl]) =>
          `<button role="tab" class="${tab === id ? 'on' : ''}" aria-selected="${tab === id}" data-action="sum-tab" data-tab="${id}">${lbl}</button>`).join('')}
      </div>
      ${nav}
      ${body}`;
  }

  /* ---------- מסך לקוחות ---------- */
  // לקוחות שהיו אצלך, ואחריהן אנשי קשר מהטלפון שעוד לא קבעו טיפול
  function peopleIndex() {
    const clients = L.clientsIndex(state.appts).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
    const taken = new Set(clients.map((c) => c.key));
    const contacts = [];
    state.contacts.forEach((c, i) => {
      if (!L.normName(c.name) || taken.has(L.normName(c.name))) return;
      contacts.push({ key: 'contact:' + i, name: c.name, phone: c.phone, visits: 0, total: 0, lastDate: '', appts: [], contact: true });
    });
    contacts.sort((a, b) => a.name.localeCompare(b.name, 'he'));
    return { clients, contacts };
  }

  function findPerson(key) {
    const { clients, contacts } = peopleIndex();
    return clients.find((c) => c.key === key) || contacts.find((c) => c.key === key);
  }

  const CONTACTS_PAGE = 200;

  function clientRow(c) {
    if (c.contact) {
      return `<button class="client-row contact" data-action="open-client" data-key="${esc(c.key)}">
        <span class="avatar soft">${esc(initial(c.name))}</span>
        <span class="cr-main"><b>${esc(c.name)}</b><span class="phone">${esc(c.phone)}</span></span>
        <span class="cr-chev">${I.left}</span>
      </button>`;
    }
    return `<button class="client-row" data-action="open-client" data-key="${esc(c.key)}">
        <span class="avatar">${esc(initial(c.name))}</span>
        <span class="cr-main"><b>${esc(c.name)}</b>
          <span>${c.visits} ביקורים · אחרון ${L.shortDate(c.lastDate)}.${c.lastDate.slice(2, 4)}</span></span>
        <span class="cr-total">${money(c.total)}</span>
      </button>`;
  }

  function clientListHTML() {
    const { clients, contacts } = peopleIndex();
    if (!clients.length && !contacts.length) {
      return `<div class="card empty"><span class="emoji">👩</span>עדיין אין לקוחות.<br>הן יופיעו כאן אחרי שתוסיפי טיפול,
        או אחרי ייבוא אנשי הקשר מהטלפון.
        <div style="margin-top:14px"><button class="btn secondary" data-action="open-settings">ייבוא אנשי קשר</button></div></div>`;
    }
    const q = state.clientQuery;
    const fc = L.searchClients(clients, q);
    const ft = L.searchClients(contacts, q);
    const f = state.clientFilter;
    const chips = contacts.length ? `<div class="filter-chips">
      ${[['all', 'הכול', fc.length + ft.length], ['clients', 'לקוחות', fc.length], ['contacts', 'אנשי קשר', ft.length]].map(([id, lbl, n]) =>
        `<button class="${f === id ? 'on' : ''}" data-action="client-filter" data-f="${id}">${lbl} <small>${n}</small></button>`).join('')}
    </div>` : '';
    let html = chips;
    if (f !== 'contacts' && fc.length) {
      html += (contacts.length ? `<h3 class="list-head">לקוחות שהיו אצלך</h3>` : `<p class="settings-note">${fc.length} לקוחות</p>`) + fc.map(clientRow).join('');
    }
    if (f !== 'clients' && ft.length) {
      html += `<h3 class="list-head">מאנשי הקשר בטלפון</h3>` + ft.slice(0, CONTACTS_PAGE).map(clientRow).join('');
      if (ft.length > CONTACTS_PAGE) html += `<p class="settings-note" style="text-align:center">מוצגים ${CONTACTS_PAGE} מתוך ${ft.length}. הקלידי שם כדי למצוא מישהי מסוימת.</p>`;
    }
    const shown = (f !== 'contacts' ? fc.length : 0) + (f !== 'clients' ? ft.length : 0);
    if (!shown) html += '<div class="card empty">לא נמצאה לקוחה בשם הזה</div>';
    return html;
  }

  function viewClients() {
    return `
      <div class="vhead"><div class="vhead-title"><h1>לקוחות</h1><p class="sub">חיפוש, היסטוריה ואנשי קשר</p></div></div>
      <div class="search">${I.search}
        <input id="clientSearch" type="search" placeholder="חיפוש לפי שם או טלפון" value="${esc(state.clientQuery)}" autocomplete="off" enterkeyhint="search">
      </div>
      <div id="clientList">${clientListHTML()}</div>`;
  }

  function openClient(key) {
    const c = findPerson(key);
    if (!c) return;
    const hist = [...c.appts].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const intl = L.toIntlPhone(c.phone);
    openSheet(`
      <div class="sheet-head">
        <button class="btn ghost" data-action="close-sheet">סגירה</button>
        <h2>${c.contact ? 'איש קשר' : 'כרטיס לקוחה'}</h2>
        <span style="width:80px"></span>
      </div>
      <div class="sheet-body">
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
          <span class="avatar big">${esc(initial(c.name))}</span>
          <div><div style="font-size:22px;font-weight:800">${esc(c.name)}</div>
            <div class="muted ltr">${esc(c.phone || 'אין טלפון')}</div></div>
        </div>
        ${intl ? `<div class="quick-contact" style="margin-bottom:14px">
          <a class="btn secondary" href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">${I.phone}חיוג</a>
          <a class="btn wa" href="https://wa.me/${intl}" target="_blank" rel="noopener">${I.wa}וואטסאפ</a>
        </div>` : ''}
        ${c.contact ? '' : `<div class="stat-grid">
          <div class="stat"><small>ביקורים</small><b>${c.visits}</b></div>
          <div class="stat"><small>סכום כולל</small><b>${money(c.total)}</b></div>
        </div>`}
        <button class="btn" data-action="new-appt-client" data-key="${esc(c.key)}" style="margin-bottom:14px">${I.plus}טיפול חדש ל${esc(c.name)}</button>
        ${c.contact ? '<div class="card empty">עוד לא היו טיפולים 🌸</div>' : `
        <section class="card"><h2>היסטוריית טיפולים <small>(${hist.length})</small></h2>
          ${hist.map((a) => `<button class="history-item" data-action="edit-appt" data-id="${a.id}">
            <span class="hi-date"><b>${L.shortDate(a.date)}${a.date.slice(0, 4) === today().slice(0, 4) ? '' : '.' + a.date.slice(2, 4)}</b><small>${esc(a.time)}</small></span>
            <span class="hi-main"><i class="dot" style="background:${apptColor(a)}"></i> ${esc(L.treatmentNames(a) || L.productNames(a))}${a.notes ? `<br><small class="muted">${esc(a.notes)}</small>` : ''}</span>
            <span style="text-align:center"><span class="hi-price">${money(L.apptTotal(a))}</span><br><span class="pill ${a.status}">${L.statusLabel(a.status)}</span></span>
          </button>`).join('')}
        </section>`}
      </div>`);
  }

  /* ---------- מסך הגדרות ---------- */
  const TEMPLATE_VARS = ['שם', 'שם מלא', 'שעה', 'טיפול', 'יום', 'תאריך', 'עסק'];

  function templatePreview() {
    const sample = {
      clientName: 'דנה', time: '10:30', date: tomorrow(),
      items: [{ name: (state.settings.treatmentTypes[0] || { name: 'טיפול פנים' }).name }],
    };
    return L.fillTemplate(state.settings.template, sample, state.settings.businessName);
  }

  function viewSettings() {
    const st = state.settings;
    const last = state.meta.lastBackup;
    return `
      <div class="vhead">
        <button class="back-btn" data-action="back-settings">${I.right}<span>חזרה</span></button>
        <div class="vhead-title"><h1 style="font-size:24px">הגדרות</h1></div>
      </div>

      <section class="card">
        <h2>סוגי טיפולים, צבעים ומחירים</h2>
        <p class="settings-note">לחצי על העיגול הצבעוני כדי לבחור צבע לטיפול. לכל סוג אפשר להוסיף תתי-סוגים, למשל סוגי טיפולי פנים או אזורים בהסרת שיער, עם מחיר ומשך משלהם.</p>
        <div id="typesList">
          ${st.treatmentTypes.map((t) => `
            <div class="type-card" data-type-id="${t.id}" style="--tc:${t.color}">
              <div class="type-head">
                <button class="color-btn" data-action="pick-color" data-id="${t.id}" aria-label="בחירת צבע ל${esc(t.name)}"></button>
                <input type="text" data-field="name" value="${esc(t.name)}" placeholder="שם הטיפול" aria-label="שם הטיפול">
                <button class="del" data-action="del-type" data-id="${t.id}" aria-label="מחיקת ${esc(t.name)}">${I.trash}</button>
              </div>
              ${t.subs.length ? `<div class="subs">
                <div class="sub-row sub-labels"><span>תת-סוג</span><span>מחיר ₪</span><span>דקות</span><span></span></div>
                ${t.subs.map((sb) => `
                <div class="sub-row" data-sub-id="${sb.id}">
                  <input type="text" data-field="name" value="${esc(sb.name)}" placeholder="למשל: רגליים" aria-label="שם תת-הסוג">
                  <input type="number" inputmode="decimal" min="0" data-field="price" value="${esc(sb.price)}" class="ltr" aria-label="מחיר">
                  <input type="number" inputmode="numeric" min="0" step="5" data-field="duration" value="${esc(sb.duration)}" class="ltr" aria-label="משך בדקות">
                  <button class="del" data-action="del-sub" data-type="${t.id}" data-id="${sb.id}" aria-label="מחיקת ${esc(sb.name)}">${I.x}</button>
                </div>`).join('')}
              </div>` : `<div class="type-nums">
                <label>מחיר ₪<input type="number" inputmode="decimal" min="0" data-field="price" value="${esc(t.price)}" class="ltr"></label>
                <label>משך (דק׳)<input type="number" inputmode="numeric" min="5" step="5" data-field="duration" value="${esc(t.duration)}" class="ltr"></label>
              </div>`}
              <button class="link-btn" data-action="add-sub" data-type="${t.id}">+ הוספת תת-סוג</button>
            </div>`).join('')}
        </div>
        <button class="btn secondary" data-action="add-type" style="margin-top:12px">${I.plus}הוספת סוג טיפול</button>
      </section>

      <section class="card">
        <h2>תכשירים למכירה</h2>
        <p class="settings-note">תכשירים שלקוחות קונות. בטיפול אפשר לבחור אותם, לשנות כמות ומחיר, והם נספרים בהכנסות.</p>
        <div id="productsList">
          ${st.products.length ? st.products.map((pr) => `
            <div class="sub-row prod" data-product-id="${pr.id}">
              <input type="text" data-field="name" value="${esc(pr.name)}" placeholder="למשל: קרם לחות" aria-label="שם התכשיר">
              <input type="number" inputmode="decimal" min="0" data-field="price" value="${esc(pr.price)}" class="ltr" aria-label="מחיר">
              <button class="del" data-action="del-product" data-id="${pr.id}" aria-label="מחיקת ${esc(pr.name)}">${I.x}</button>
            </div>`).join('') : '<p class="muted" style="margin:0 0 4px">עדיין אין תכשירים.</p>'}
        </div>
        <button class="btn secondary" data-action="add-product" style="margin-top:12px">${I.plus}הוספת תכשיר</button>
      </section>

      <section class="card">
        <h2>התראה לפני טיפול</h2>
        <p class="settings-note">האייפון יתריע לפני כל טיפול שהוספת ליומן של האייפון, גם כשהאפליקציה סגורה. בכרטיס של כל טיפול יש כפתור "התראה".</p>
        <div class="field">
          <label for="alarmMin">כמה זמן לפני הטיפול?</label>
          <select id="alarmMin">${ALARM_OPTIONS.map((m) => `<option value="${m}" ${st.alarmMinutes === m ? 'selected' : ''}>${m === 60 ? 'שעה' : `${m} דקות`} לפני</option>`).join('')}</select>
        </div>
        <label class="switch-row">
          <span class="sr-text"><b>לשאול אחרי כל טיפול חדש</b><small>"להוסיף ליומן האייפון?"</small></span>
          <span class="switch"><input id="askCal" type="checkbox" ${st.askCalendar ? 'checked' : ''}><span></span></span>
        </label>
        <button class="btn secondary" data-action="cal-add-upcoming">${I.bell}הוספת כל התורים הקרובים ליומן</button>
      </section>

      <section class="card">
        <h2>הודעת תזכורת בוואטסאפ</h2>
        <div class="field">
          <label for="bizName">שם העסק (לחתימה)</label>
          <input id="bizName" type="text" value="${esc(st.businessName)}">
        </div>
        <div class="field" style="margin-bottom:0">
          <label for="tpl">נוסח ההודעה</label>
          <textarea id="tpl" rows="6">${esc(st.template)}</textarea>
        </div>
        <div class="field-label" style="margin-top:8px">לחצי כדי להוסיף משתנה להודעה:</div>
        <div class="var-chips">${TEMPLATE_VARS.map((v) => `<button data-action="insert-var" data-var="${v}">{${v}}</button>`).join('')}</div>
        <div class="wa-preview-wrap"><small>כך זה ייראה ללקוחה:</small><div class="wa-preview" id="tplPreview">${esc(templatePreview())}</div></div>
        <button class="link-btn" data-action="reset-template">שחזור הנוסח המקורי</button>
      </section>

      <section class="card">
        <h2>אנשי קשר מהטלפון</h2>
        <p class="settings-note">אחרי הייבוא אנשי הקשר יופיעו במסך "לקוחות", וכשמקלידים שם בטיפול חדש הם יוצעו והטלפון יתמלא לבד.</p>
        <div class="kv"><span>אנשי קשר מיובאים</span><b>${state.contacts.length}</b></div>
        ${state.meta.contactsImportedAt ? `<div class="kv"><span>ייבוא אחרון</span><b>${new Date(state.meta.contactsImportedAt).toLocaleDateString('he-IL')}</b></div>` : ''}
        <details class="howto">
          <summary>איך מייצאים את אנשי הקשר מהאייפון?</summary>
          <ol>
            <li>פותחים את אפליקציית <b>אנשי קשר</b>.</li>
            <li>לוחצים על <b>"רשימות"</b> בפינה העליונה.</li>
            <li>לחיצה ארוכה על <b>"כל אנשי הקשר"</b> ← <b>"ייצוא"</b> ← <b>"סיום"</b>.</li>
            <li>בוחרים <b>"שמירה בקבצים"</b> ושומרים.</li>
            <li>חוזרים לכאן, לוחצים <b>"ייבוא אנשי קשר"</b> ובוחרים את הקובץ ששמרת.</li>
          </ol>
        </details>
        <button class="btn" data-action="import-contacts" style="margin-top:12px">${I.users}ייבוא אנשי קשר</button>
        ${state.contacts.length ? '<button class="link-btn" data-action="clear-contacts" style="margin-top:6px">מחיקת אנשי הקשר המיובאים</button>' : ''}
      </section>

      <section class="card">
        <h2>גיבוי הנתונים</h2>
        <p class="settings-note">כל הנתונים שמורים רק בטלפון שלך. מומלץ לייצא גיבוי פעם בשבוע-שבועיים ולשמור אותו ב-iCloud Drive או לשלוח לעצמך בוואטסאפ.</p>
        <div class="kv"><span>טיפולים שמורים</span><b>${state.appts.length}</b></div>
        <div class="kv"><span>גיבוי אחרון</span><b>${last ? new Date(last).toLocaleDateString('he-IL') : 'עדיין לא'}</b></div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn" data-action="export">${I.download}ייצוא גיבוי</button>
          <button class="btn secondary" data-action="import">${I.upload}ייבוא גיבוי</button>
        </div>
      </section>
      <p class="settings-note" style="text-align:center">היומן של סימה · גרסה 1.1</p>`;
  }

  function focusLast(sel) {
    const all = $$(sel);
    const inp = all[all.length - 1];
    if (!inp) return;
    inp.scrollIntoView({ block: 'center' });
    inp.focus();
  }

  function paletteHTML(current) {
    return `<div class="palette">${PALETTE.map((p) =>
      `<button type="button" class="swatch-btn ${p.c === current ? 'on' : ''}" data-color="${p.c}" style="--c:${p.c}" aria-label="${p.n}" aria-pressed="${p.c === current}">
        <i></i><span>${p.n}</span></button>`).join('')}</div>`;
  }

  // דיאלוג כללי עם כפתורי data-r; onClick מקבל כל לחיצה אחרת בתוך הדיאלוג
  function openDialog(html, { onClick, validate } = {}) {
    return new Promise((resolve) => {
      const wrap = $('#dialogWrap');
      $('#dialog').innerHTML = html;
      wrap.classList.add('open');
      wrap.setAttribute('aria-hidden', 'false');
      wrap.onclick = (e) => {
        const b = e.target.closest('[data-r]');
        if (!b) { if (onClick) onClick(e); return; }
        if (b.dataset.r === '1' && validate && !validate()) return;
        wrap.classList.remove('open');
        wrap.setAttribute('aria-hidden', 'true');
        wrap.onclick = null;
        resolve(b.dataset.r === '1');
      };
    });
  }

  function bindPalette(state0, onPick) {
    return (e) => {
      const b = e.target.closest('[data-color]');
      if (!b) return;
      $$('#dialog .swatch-btn').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      onPick(b.dataset.color);
    };
  }

  async function pickColor(current, name) {
    let chosen = current;
    const ok = await openDialog(`
      <h3>צבע ל${esc(name || 'טיפול')}</h3>
      ${paletteHTML(current)}
      <div class="btn-row"><button class="btn" data-r="1">בחירה</button><button class="btn ghost" data-r="0">ביטול</button></div>`,
    { onClick: bindPalette(current, (c) => { chosen = c; }) });
    return ok ? chosen : null;
  }

  /* ---------- טופס טיפול ---------- */
  let form = null;

  function newForm(preset = {}) {
    const now = new Date();
    let time = preset.time;
    if (!time) {
      // השעה העגולה הבאה
      const h = Math.min(now.getHours() + 1, 20);
      time = `${String(h).padStart(2, '0')}:00`;
    }
    return {
      id: null,
      clientName: preset.clientName || '',
      phone: preset.phone || '',
      date: preset.date || today(),
      time,
      items: [],
      duration: 0,
      durationTouched: false,
      payment: '',
      status: 'pending',
      reminderSent: false,
      reminderSentAt: null,
      notes: '',
    };
  }

  function formFromAppt(a) {
    return {
      ...JSON.parse(JSON.stringify(a)),
      duration: L.apptDuration(a),
      durationTouched: true,
    };
  }

  function openApptForm(f) {
    form = f;
    const isEdit = !!f.id;
    const intl = L.toIntlPhone(f.phone);
    openSheet(`
      <div class="sheet-head">
        <button class="btn ghost" data-action="close-sheet">ביטול</button>
        <h2>${isEdit ? 'עריכת טיפול' : 'טיפול חדש'}</h2>
        <button class="btn" data-action="save-appt">שמירה</button>
      </div>
      <div class="sheet-body" id="apptForm">
        <div class="field">
          <label for="fName">שם הלקוחה</label>
          <input id="fName" type="text" value="${esc(f.clientName)}" autocomplete="off" autocapitalize="words" enterkeyhint="next" placeholder="הקלידי שם…">
          <div id="suggest" class="suggest" hidden></div>
          ${canPickContact() ? `<button type="button" class="link-btn" data-action="pick-contact">${'בחירה מאנשי הקשר'}</button>` : ''}
        </div>
        <div class="field">
          <label for="fPhone">טלפון</label>
          <input id="fPhone" type="tel" inputmode="tel" class="ltr" value="${esc(f.phone)}" autocomplete="off" placeholder="050-1234567">
          ${isEdit && intl ? `<div class="quick-contact">
            <a class="btn secondary small" href="tel:${esc(f.phone.replace(/[^\d+]/g, ''))}">${I.phone}חיוג</a>
            <a class="btn wa small" href="https://wa.me/${intl}" target="_blank" rel="noopener">${I.wa}וואטסאפ</a></div>` : ''}
        </div>
        <div class="two-col">
          <div class="field"><label for="fDate">תאריך</label><input id="fDate" type="date" value="${esc(f.date)}"></div>
          <div class="field"><label for="fTime">שעה</label><input id="fTime" type="time" step="300" value="${esc(f.time)}"></div>
        </div>

        <div class="field">
          <span class="field-label">סוג טיפול <small>(אפשר לבחור כמה)</small></span>
          <div class="chips" id="typeChips"></div>
          <div id="subPanel"></div>
        </div>

        <div class="field">
          <span class="field-label">תכשירים שנקנו <small>(לא חובה)</small></span>
          <div class="chips" id="productChips"></div>
        </div>

        <div class="items" id="items"></div>

        <div class="two-col">
          <div class="field"><label for="fDur">משך כולל (דקות)</label>
            <input id="fDur" type="number" inputmode="numeric" min="5" step="5" class="ltr" value="${f.duration || ''}"></div>
          <div class="field"><span class="field-label">שעת סיום</span><div class="input" id="fEnd" style="display:flex;align-items:center;background:var(--beige)">—</div></div>
        </div>
        <div id="overlapWarn"></div>

        <div class="total-box"><span>סה״כ לתשלום</span><b id="fTotal">₪0</b></div>

        <div class="field">
          <span class="field-label">אמצעי תשלום</span>
          <div class="pay-grid" id="payGrid">
            ${L.PAYMENTS.concat(L.LEGACY_PAYMENTS.filter((p) => p.id === f.payment)).map((p) => `<button type="button" class="pay-btn ${f.payment === p.id ? 'on' : ''}" data-action="f-pay" data-pay="${p.id}" aria-pressed="${f.payment === p.id}">${esc(p.label)}</button>`).join('')}
          </div>
        </div>

        <div class="field">
          <span class="field-label">סטטוס אישור הגעה</span>
          <div class="status-seg in-form" id="fStatus">
            ${L.STATUSES.map((s) => `<button type="button" class="${s.id} ${f.status === s.id ? 'on' : ''}" data-action="f-status" data-status="${s.id}" aria-pressed="${f.status === s.id}">${s.label}</button>`).join('')}
          </div>
        </div>

        <label class="switch-row">
          <span class="sr-text"><b>נשלחה תזכורת</b><small>מסומן אוטומטית כששולחים ממסך התזכורות</small></span>
          <span class="switch"><input id="fSent" type="checkbox" ${f.reminderSent ? 'checked' : ''}><span></span></span>
        </label>

        <div class="field">
          <label for="fNotes">הערות <small class="muted">(לא חובה)</small></label>
          <textarea id="fNotes" rows="3" placeholder="רגישויות, העדפות, מה עשינו בפעם הקודמת…">${esc(f.notes)}</textarea>
        </div>

        <button class="btn" data-action="save-appt">${I.check}שמירה</button>
        ${isEdit ? `<button class="btn danger" data-action="delete-appt" style="margin-top:10px">${I.trash}מחיקת הטיפול</button>` : ''}
      </div>`, () => { form = null; });

    renderFormItems();
    bindFormInputs();
  }

  function recalcDuration() {
    if (!form.durationTouched) {
      form.duration = form.items.reduce((s, i) => s + (Number(i.duration) || 0), 0);
      const el = $('#fDur');
      if (el) el.value = form.duration || '';
    }
  }

  function renderFormItems() {
    const types = state.settings.treatmentTypes;
    const sel = form.items;
    const countFor = (tid) => sel.filter((i) => !L.isProduct(i) && i.typeId === tid).length;

    $('#typeChips').innerHTML = types.map((t) => {
      const n = countFor(t.id);
      const hasSubs = t.subs.length > 0;
      const open = form.openType === t.id;
      return `<button type="button" class="chip tchip ${n ? 'on' : ''} ${open ? 'open' : ''}" style="--tc:${t.color}"
        data-action="f-type" data-type="${t.id}" aria-pressed="${!!n}" ${hasSubs ? `aria-expanded="${open}"` : ''}>
        <i class="dot"></i>${esc(t.name || 'ללא שם')}${hasSubs ? `<span class="chev">${n > 1 ? n + ' ' : ''}${open ? '▴' : '▾'}</span>` : ''}</button>`;
    }).join('') + '<button type="button" class="chip add" data-action="f-new-type">+ סוג חדש</button>';

    const ot = form.openType && typeById(form.openType);
    $('#subPanel').innerHTML = ot ? `
      <div class="sub-panel" style="--tc:${ot.color}">
        <div class="sub-title">${esc(ot.name)}: מה עושים? <small>(אפשר כמה)</small></div>
        <div class="chips">
          ${ot.subs.map((sb) => {
            const on = sel.some((i) => i.typeId === ot.id && i.subId === sb.id);
            return `<button type="button" class="chip tchip ${on ? 'on' : ''}" style="--tc:${ot.color}" data-action="f-sub" data-type="${ot.id}" data-sub="${sb.id}" aria-pressed="${on}">
              ${esc(sb.name || 'ללא שם')}<small>${money(sb.price)}</small></button>`;
          }).join('')}
          ${(() => { const on = sel.some((i) => i.typeId === ot.id && !i.subId); return `<button type="button" class="chip tchip ${on ? 'on' : ''}" style="--tc:${ot.color}" data-action="f-sub" data-type="${ot.id}" data-sub="" aria-pressed="${on}">כללי<small>${money(ot.price)}</small></button>`; })()}
          <button type="button" class="chip add" data-action="f-new-sub" data-type="${ot.id}">+ תת-סוג חדש</button>
        </div>
      </div>` : '';

    $('#productChips').innerHTML = state.settings.products.map((pr) => {
      const on = sel.some((i) => L.isProduct(i) && i.productId === pr.id);
      return `<button type="button" class="chip ${on ? 'on' : ''}" data-action="f-product" data-product="${pr.id}" aria-pressed="${on}">
        ${I.bag}${esc(pr.name || 'ללא שם')}<small>${money(pr.price)}</small></button>`;
    }).join('') + '<button type="button" class="chip add" data-action="f-new-product">+ תכשיר חדש</button>';

    $('#items').innerHTML = sel.length ? `<span class="field-label">מה נבחר</span>` + sel.map((it, idx) => `
      <div class="item-row" style="--tc:${itemColor(it)}">
        <i class="dot big"></i>
        <div class="item-name">${esc(L.itemLabel(it))}<small>${L.isProduct(it) ? 'תכשיר' : `${Number(it.duration) || 0} דק׳`}</small></div>
        ${L.isProduct(it) ? `<div class="qty" aria-label="כמות">
          <button type="button" data-action="f-qty" data-idx="${idx}" data-d="1" aria-label="עוד אחד">+</button>
          <b>${L.itemQty(it)}</b>
          <button type="button" data-action="f-qty" data-idx="${idx}" data-d="-1" aria-label="אחד פחות">−</button></div>` : ''}
        <label class="price-input"><span>₪</span><input type="number" inputmode="decimal" min="0" data-item="${idx}" value="${esc(it.price)}" aria-label="מחיר ${esc(L.itemLabel(it))}"></label>
        <button type="button" class="rm" data-action="f-rm-item" data-idx="${idx}" aria-label="הסרת ${esc(L.itemLabel(it))}">${I.x}</button>
      </div>`).join('') : '';
    updateFormTotals();
  }

  function treatmentItem(t, sb) {
    return {
      kind: 'treatment', typeId: t.id, subId: sb ? sb.id : null, name: t.name, sub: sb ? sb.name : '',
      price: sb ? sb.price : t.price, duration: sb ? (sb.duration || t.duration) : t.duration, color: t.color,
    };
  }

  function productItem(pr) {
    return { kind: 'product', productId: pr.id, name: pr.name, price: pr.price, qty: 1, duration: 0 };
  }

  function toggleItem(match, make) {
    const idx = form.items.findIndex(match);
    if (idx >= 0) form.items.splice(idx, 1);
    else form.items.push(make());
    recalcDuration();
    renderFormItems();
  }

  function updateFormTotals() {
    $('#fTotal').textContent = money(L.apptTotal(form));
    const end = form.time && form.duration ? L.apptEnd(form) : '—';
    $('#fEnd').textContent = end;
    const overlaps = L.findOverlaps(state.appts, { ...form, id: form.id || '__new__' });
    $('#overlapWarn').innerHTML = overlaps.length
      ? `<div class="warn-box">⚠️ חפיפה עם ${overlaps.map((o) => `${esc(o.clientName)} (${esc(o.time)}–${L.apptEnd(o)})`).join(', ')}</div>` : '';
  }

  // לקוחות קיימות קודם, אחריהן אנשי קשר מהטלפון שעוד לא היו לקוחות
  function knownPeople() {
    const clients = L.clientsIndex(state.appts).map((c) => ({ name: c.name, phone: c.phone, key: c.key, client: true, lastDate: c.lastDate }));
    const taken = new Set(clients.map((c) => c.key));
    const contacts = state.contacts
      .map((c) => ({ name: c.name, phone: c.phone, key: L.normName(c.name), client: false, lastDate: '' }))
      .filter((c) => !taken.has(c.key));
    return clients.concat(contacts);
  }

  function clientSuggestions(q) {
    const n = L.normName(q);
    if (!n) return [];
    const starts = (p) => L.normName(p.name).startsWith(n) || L.normName(p.name).includes(' ' + n);
    return knownPeople()
      .filter((p) => L.normName(p.name).includes(n) && p.key !== n)
      .sort((a, b) => (starts(b) - starts(a)) || (b.client - a.client) || b.lastDate.localeCompare(a.lastDate))
      .slice(0, 8);
  }

  function fillPhoneFromClient(name) {
    const c = knownPeople().find((x) => x.key === L.normName(name) && x.phone);
    if (c && c.phone && !$('#fPhone').value.trim()) {
      $('#fPhone').value = c.phone;
      form.phone = c.phone;
    }
  }

  let lastSuggestions = [];

  function bindFormInputs() {
    const name = $('#fName');
    const sug = $('#suggest');
    name.addEventListener('input', () => {
      form.clientName = name.value;
      name.classList.remove('invalid');
      lastSuggestions = clientSuggestions(name.value);
      sug.hidden = !lastSuggestions.length;
      sug.innerHTML = lastSuggestions.map((c, i) => `<button type="button" data-i="${i}">
        <b class="sug-name">${esc(c.name)}${c.client ? '' : '<small>מאנשי הקשר</small>'}</b><span>${esc(c.phone)}</span></button>`).join('');
    });
    // pointerdown כדי שהבחירה תיקלט לפני שהשדה מאבד פוקוס
    sug.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      e.preventDefault();
      const c = lastSuggestions[Number(b.dataset.i)];
      if (!c) return;
      name.value = c.name;
      form.clientName = c.name;
      if (c.phone) { $('#fPhone').value = c.phone; form.phone = c.phone; }
      sug.hidden = true;
      $('#fPhone').focus();
    });
    name.addEventListener('blur', () => {
      setTimeout(() => { sug.hidden = true; }, 150);
      fillPhoneFromClient(name.value);
    });
    $('#fPhone').addEventListener('input', (e) => { form.phone = e.target.value; e.target.classList.remove('invalid'); });
    $('#fDate').addEventListener('change', (e) => { form.date = e.target.value; updateFormTotals(); });
    $('#fTime').addEventListener('change', (e) => { form.time = e.target.value; updateFormTotals(); });
    $('#fDur').addEventListener('input', (e) => {
      form.duration = Number(e.target.value) || 0;
      form.durationTouched = e.target.value !== '';
      updateFormTotals();
    });
    $('#fNotes').addEventListener('input', (e) => { form.notes = e.target.value; });
    $('#fSent').addEventListener('change', (e) => {
      form.reminderSent = e.target.checked;
      form.reminderSentAt = e.target.checked ? (form.reminderSentAt || Date.now()) : null;
    });
    $('#items').addEventListener('input', (e) => {
      const idx = e.target.dataset.item;
      if (idx == null) return;
      form.items[idx].price = e.target.value === '' ? '' : Number(e.target.value);
      updateFormTotals();
    });
  }

  // הוספת סוג טיפול / תת-סוג / תכשיר חדש ישירות מתוך הטופס
  async function addFromForm(kind, parent) {
    const title = kind === 'type' ? 'סוג טיפול חדש' : kind === 'sub' ? `תת-סוג ל${parent.name}` : 'תכשיר חדש';
    const hint = kind === 'type' ? 'למשל: פילינג' : kind === 'sub' ? 'למשל: רגליים' : 'למשל: קרם לחות';
    let color = kind === 'type' ? nextFreeColor() : null;
    const ok = await openDialog(`
      <h3>${esc(title)}</h3>
      <div class="field" style="text-align:start"><label for="ntName">שם</label><input id="ntName" type="text" placeholder="${hint}"></div>
      <div class="two-col" style="text-align:start">
        <div class="field"><label for="ntPrice">מחיר ₪</label><input id="ntPrice" type="number" inputmode="decimal" class="ltr" value="${kind === 'sub' ? esc(parent.price) : ''}"></div>
        ${kind === 'product' ? '' : `<div class="field"><label for="ntDur">משך (דק׳)</label><input id="ntDur" type="number" inputmode="numeric" class="ltr" value="${kind === 'sub' ? esc(parent.duration) : 30}"></div>`}
      </div>
      ${kind === 'type' ? `<div class="field-label" style="text-align:start">צבע</div>${paletteHTML(color)}` : ''}
      <div class="btn-row"><button class="btn" data-r="1">הוספה</button><button class="btn ghost" data-r="0">ביטול</button></div>`, {
      onClick: kind === 'type' ? bindPalette(color, (c) => { color = c; }) : null,
      validate: () => {
        if ($('#ntName').value.trim()) return true;
        $('#ntName').classList.add('invalid');
        $('#ntName').focus();
        return false;
      },
    });
    if (!ok) return;
    const name = $('#ntName').value.trim();
    const price = Number($('#ntPrice').value) || 0;
    const duration = $('#ntDur') ? (Number($('#ntDur').value) || 30) : 0;
    if (kind === 'type') {
      const t = { id: 't-' + uid(), name, price, duration, color, subs: [] };
      state.settings.treatmentTypes.push(t);
      form.items.push(treatmentItem(t));
    } else if (kind === 'sub') {
      const sb = { id: 's-' + uid(), name, price, duration };
      parent.subs.push(sb);
      form.items.push(treatmentItem(parent, sb));
      form.openType = parent.id;
    } else {
      const pr = { id: 'p-' + uid(), name, price };
      state.settings.products.push(pr);
      form.items.push(productItem(pr));
    }
    await saveSettings();
    recalcDuration();
    renderFormItems();
    toast(`"${name}" נוסף לרשימה`);
  }

  async function saveForm() {
    // קריאת ערכים אחרונים מהשדות
    form.clientName = $('#fName').value.trim().replace(/\s+/g, ' ');
    form.phone = $('#fPhone').value.trim();
    form.date = $('#fDate').value;
    form.time = $('#fTime').value;
    form.notes = $('#fNotes').value.trim();

    const problems = [];
    if (!form.clientName) { problems.push('שם הלקוחה'); $('#fName').classList.add('invalid'); }
    if (!form.date) problems.push('תאריך');
    if (!form.time) problems.push('שעה');
    if (!form.items.length) problems.push('טיפול או תכשיר');
    if (problems.length) {
      toast(`חסר: ${problems.join(', ')}`);
      return;
    }
    if (form.phone && !L.toIntlPhone(form.phone)) {
      const go = await ask({ title: 'מספר הטלפון נראה לא תקין', text: 'לא יהיה אפשר לשלוח אליו תזכורת בוואטסאפ. לשמור בכל זאת?', ok: 'לשמור', cancel: 'לתקן' });
      if (!go) { $('#fPhone').classList.add('invalid'); $('#fPhone').focus(); return; }
    }
    const cand = { ...form, id: form.id || '__new__' };
    const overlaps = form.status !== 'cancelled' ? L.findOverlaps(state.appts, cand) : [];
    if (overlaps.length) {
      const go = await ask({
        title: 'יש חפיפה בין תורים',
        text: overlaps.map((o) => `${o.clientName} ${o.time}–${L.apptEnd(o)}`).join('\n') + '\nלשמור בכל זאת?',
        ok: 'לשמור בכל זאת', cancel: 'לשנות שעה',
      });
      if (!go) return;
    }

    const existing = form.id ? findAppt(form.id) : null;
    const moved = existing && (existing.date !== form.date || existing.time !== form.time);
    if (moved) {
      // מועד חדש: צריך תזכורת חדשה, וטיפול שבוטל חוזר ל"ממתינה"
      if (form.reminderSent && existing.reminderSent) form.reminderSent = false;
      if (existing.status === 'cancelled' && form.status === 'cancelled') form.status = 'pending';
    }
    const a = {
      id: form.id || uid(),
      clientName: form.clientName,
      phone: form.phone,
      date: form.date,
      time: form.time,
      items: form.items.map(cleanItem),
      duration: form.duration || L.DEFAULT_DURATION,
      payment: form.payment || '',
      status: form.status || 'pending',
      reminderSent: !!form.reminderSent,
      reminderSentAt: form.reminderSent ? (form.reminderSentAt || Date.now()) : null,
      notes: form.notes,
      calendarAddedAt: existing && !moved ? existing.calendarAddedAt || null : null,
      createdAt: existing ? existing.createdAt : Date.now(),
    };
    await saveAppt(a);
    closeSheet();
    toast(existing ? (moved ? `הועבר ליום ${L.dayName(a.date)} ${L.shortDate(a.date)} ב-${a.time}` : 'הטיפול עודכן') : 'הטיפול נשמר 🌸');
    render();
    if (!existing) offerCalendar(a);
    else if (moved) afterMove(existing, a);
  }

  function cleanItem(i) {
    const it = {
      kind: i.kind === 'product' ? 'product' : 'treatment',
      typeId: i.typeId || null,
      name: String(i.name || ''),
      price: L.num(i.price),
      duration: Number(i.duration) || 0,
    };
    if (it.kind === 'product') {
      it.productId = i.productId || null;
      it.qty = L.itemQty(i);
    } else {
      it.subId = i.subId || null;
      it.sub = String(i.sub || '');
      it.color = i.color || '';
    }
    return it;
  }

  async function deleteFromForm() {
    const a = findAppt(form.id);
    if (!a) return;
    const ok = await ask({
      title: 'למחוק את הטיפול?',
      text: `${a.clientName} · ${L.shortDate(a.date)} בשעה ${a.time}\nאי אפשר לבטל את המחיקה.`,
      ok: 'מחיקה', danger: true,
    });
    if (!ok) return;
    state.appts = state.appts.filter((x) => x.id !== a.id);
    await state.store.deleteAppointment(a.id);
    closeSheet();
    toast(a.calendarAddedAt ? 'נמחק. אם הוא ביומן האייפון, מחקי אותו גם שם' : 'הטיפול נמחק');
    render();
  }

  /* ---------- העברת טיפול ליום אחר ---------- */
  async function moveAppt(a) {
    const warn = () => {
      const d = $('#mvDate').value;
      const t = $('#mvTime').value;
      const ov = d && t ? L.findOverlaps(state.appts, { ...a, date: d, time: t, status: 'pending' }) : [];
      $('#mvWarn').innerHTML = ov.length
        ? `<div class="warn-box" style="text-align:start">⚠️ חפיפה עם ${ov.map((o) => `${esc(o.clientName)} (${esc(o.time)}–${L.apptEnd(o)})`).join(', ')}</div>` : '';
    };
    const dialog = openDialog(`
      <h3>העברת טיפול ליום אחר</h3>
      <p>${esc(a.clientName)} · כרגע ביום ${L.dayName(a.date)} ${L.shortDate(a.date)} בשעה ${esc(a.time)}</p>
      <div class="two-col" style="text-align:start">
        <div class="field"><label for="mvDate">תאריך חדש</label><input id="mvDate" type="date" value="${a.date}"></div>
        <div class="field"><label for="mvTime">שעה</label><input id="mvTime" type="time" step="300" value="${esc(a.time)}"></div>
      </div>
      <div id="mvWarn"></div>
      <div class="btn-row"><button class="btn" data-r="1">${I.move}העברה</button><button class="btn ghost" data-r="0">ביטול</button></div>`, {
      validate: () => !!($('#mvDate').value && $('#mvTime').value),
    });
    $('#mvDate').addEventListener('change', warn);
    $('#mvTime').addEventListener('change', warn);
    const ok = await dialog;
    if (!ok) return;
    const date = $('#mvDate').value;
    const time = $('#mvTime').value;
    if (date === a.date && time === a.time) return;
    const moved = {
      ...a, date, time,
      status: a.status === 'cancelled' ? 'pending' : a.status,
      reminderSent: false, reminderSentAt: null, calendarAddedAt: null,
    };
    await saveAppt(moved);
    render();
    toast(`הועבר ליום ${L.dayName(date)} ${L.shortDate(date)} ב-${time}`);
    afterMove(a, moved);
  }

  async function afterMove(before, after) {
    if (before.calendarAddedAt) {
      const ok = await ask({
        title: 'לעדכן ביומן האייפון?',
        text: `המועד הישן (${L.shortDate(before.date)} ב-${before.time}) נשאר ביומן של האייפון, וצריך למחוק אותו שם.\nלהוסיף את המועד החדש עם התראה?`,
        ok: 'הוספת המועד החדש', cancel: 'לא עכשיו',
      });
      if (ok) addToPhoneCalendar([after]);
    } else {
      offerCalendar(after);
    }
  }

  /* ---------- יומן האייפון ---------- */
  const isFuture = (a) => `${a.date}T${a.time}` > `${today()}T${new Date().toTimeString().slice(0, 5)}`;

  async function offerCalendar(a) {
    if (!state.settings.askCalendar || !L.isCounted(a) || !isFuture(a)) return;
    const ok = await ask({
      title: 'להוסיף ליומן האייפון?',
      text: `כך האייפון יתריע ${state.settings.alarmMinutes === 60 ? 'שעה' : `${state.settings.alarmMinutes} דקות`} לפני הטיפול, גם כשהאפליקציה סגורה.`,
      ok: 'הוספה ליומן', cancel: 'לא עכשיו',
    });
    if (ok) addToPhoneCalendar([a]);
  }

  // פותח קובץ ics: באייפון נפתח חלון "הוספה ללוח השנה", במחשב הקובץ יורד
  async function addToPhoneCalendar(list) {
    if (!list.length) return;
    const ics = L.buildICS(list, { alarmMinutes: state.settings.alarmMinutes, businessName: state.settings.businessName });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
    if (apple) {
      window.location.href = url;
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = list.length === 1 ? `tor-${list[0].date}.ics` : 'torim.ics';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    const now = Date.now();
    for (const a of list) {
      const cur = findAppt(a.id);
      if (cur) await saveAppt({ ...cur, calendarAddedAt: now });
    }
    render();
  }

  function upcomingNotInCalendar() {
    const until = L.addDays(today(), 30);
    return sortByTime(state.appts.filter((a) => L.isCounted(a) && !a.calendarAddedAt && isFuture(a) && a.date <= until))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /* ---------- גיבוי ---------- */
  function backupPayload() {
    return {
      app: 'sima-calendar',
      version: 1,
      exportedAt: new Date().toISOString(),
      appointments: state.appts,
      settings: state.settings,
      contacts: state.contacts,
    };
  }

  async function exportBackup() {
    const json = JSON.stringify(backupPayload(), null, 2);
    const name = `sima-backup-${today()}.json`;
    const file = new File([json], name, { type: 'application/json' });
    const touch = navigator.maxTouchPoints > 0;
    try {
      if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'גיבוי היומן' });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      state.meta.lastBackup = Date.now();
      await saveMeta();
      toast('הגיבוי נוצר ✓');
      render();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      console.error(e);
      toast('לא הצלחתי ליצור גיבוי');
    }
  }

  function validDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }

  function sanitizeImported(data) {
    if (!data || !Array.isArray(data.appointments)) throw new Error('bad file');
    const statuses = new Set(L.STATUSES.map((s) => s.id));
    const appts = data.appointments.filter((a) => a && validDate(a.date)).map((a) => ({
      id: String(a.id || uid()),
      clientName: String(a.clientName || '').trim(),
      phone: String(a.phone || ''),
      date: a.date,
      time: /^\d{2}:\d{2}$/.test(a.time) ? a.time : '09:00',
      items: Array.isArray(a.items) ? a.items.filter(Boolean).map(cleanItem) : [],
      duration: Number(a.duration) || L.DEFAULT_DURATION,
      payment: L.ALL_PAYMENTS.some((p) => p.id === a.payment) ? a.payment : '',
      status: statuses.has(a.status) ? a.status : 'pending',
      reminderSent: !!a.reminderSent,
      reminderSentAt: a.reminderSentAt || null,
      notes: String(a.notes || ''),
      calendarAddedAt: a.calendarAddedAt || null,
      createdAt: a.createdAt || Date.now(),
      updatedAt: a.updatedAt || Date.now(),
    }));
    const s = data.settings || {};
    const settings = normalizeSettings({
      ...s,
      treatmentTypes: Array.isArray(s.treatmentTypes) && s.treatmentTypes.length ? s.treatmentTypes : JSON.parse(JSON.stringify(DEFAULT_TYPES)),
    });
    const contacts = Array.isArray(data.contacts)
      ? data.contacts.filter((c) => c && c.name && c.phone).map((c) => ({ name: String(c.name), phone: String(c.phone) }))
      : null;
    return { appointments: appts, settings, contacts };
  }

  async function importBackup(file) {
    let parsed;
    try {
      parsed = sanitizeImported(JSON.parse(await file.text()));
    } catch (e) {
      await ask({ title: 'הקובץ לא תקין', text: 'צריך לבחור קובץ גיבוי שנוצר מהאפליקציה (סיומת json).', ok: 'הבנתי', cancel: '' });
      return;
    }
    const ok = await ask({
      title: 'לשחזר מהגיבוי?',
      text: `בגיבוי יש ${parsed.appointments.length} טיפולים.\nהנתונים הנוכחיים (${state.appts.length} טיפולים) יוחלפו בנתונים מהגיבוי.`,
      ok: 'כן, לשחזר', cancel: 'ביטול', danger: true,
    });
    if (!ok) return;
    state.appts = parsed.appointments;
    state.settings = parsed.settings;
    await state.store.replaceAll({ appointments: state.appts, settings: state.settings, meta: state.meta });
    if (parsed.contacts) {
      state.contacts = parsed.contacts;
      await state.store.setKV('contacts', state.contacts);
    }
    toast(`שוחזרו ${state.appts.length} טיפולים ✓`);
    render();
  }

  /* ---------- אנשי קשר ---------- */
  async function importContacts(file) {
    let list;
    try {
      const text = await file.text();
      if (!/BEGIN:VCARD/i.test(text)) throw new Error('not vcard');
      list = L.parseVCards(text);
    } catch (e) {
      await ask({ title: 'הקובץ לא מתאים', text: 'צריך לבחור את קובץ אנשי הקשר שייצאת מאפליקציית "אנשי קשר" (סיומת vcf).', ok: 'הבנתי', cancel: '' });
      return;
    }
    if (!list.length) {
      await ask({ title: 'לא נמצאו אנשי קשר', text: 'בקובץ אין אנשי קשר עם שם ומספר טלפון.', ok: 'הבנתי', cancel: '' });
      return;
    }
    state.contacts = list;
    state.meta.contactsImportedAt = Date.now();
    await state.store.setKV('contacts', list);
    await saveMeta();
    state.clientFilter = 'all';
    state.clientQuery = '';
    go('clients');
    toast(`יובאו ${list.length} אנשי קשר ✓`);
  }

  // בחירת איש קשר ישירות מהטלפון — רק בדפדפנים שתומכים (לרוב לא בספארי)
  const canPickContact = () => 'contacts' in navigator && 'ContactsManager' in window;

  async function pickContact() {
    try {
      const [c] = await navigator.contacts.select(['name', 'tel'], { multiple: false });
      if (!c) return;
      const name = (c.name && c.name[0]) || '';
      const phone = (c.tel && c.tel[0]) || '';
      if (name) { $('#fName').value = name; form.clientName = name; }
      if (phone) { $('#fPhone').value = phone; form.phone = phone; }
    } catch (e) { /* המשתמשת ביטלה */ }
  }

  /* ---------- ניווט ---------- */
  function go(view) {
    state.view = view;
    render();
    window.scrollTo(0, 0);
  }

  const TAB_OF = { calendar: 'calendar', day: 'calendar', reminders: 'reminders', summary: 'summary', clients: 'clients', settings: 'calendar' };

  function render() {
    const views = { calendar: viewCalendar, day: viewDay, reminders: viewReminders, summary: viewSummary, clients: viewClients, settings: viewSettings };
    $('#view').innerHTML = views[state.view]();
    const tab = TAB_OF[state.view];
    $$('.tab').forEach((t) => {
      const on = t.dataset.tab === tab;
      t.classList.toggle('active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    $('#fab').hidden = !['calendar', 'day', 'clients'].includes(state.view);
    const r = L.reminderStatus(state.appts, tomorrow());
    const badge = $('#remBadge');
    badge.hidden = !r.needAttention;
    badge.textContent = r.needAttention;
    afterRender();
  }

  let tplTimer;
  function afterRender() {
    if (state.view === 'clients') {
      const inp = $('#clientSearch');
      inp.addEventListener('input', () => {
        state.clientQuery = inp.value;
        $('#clientList').innerHTML = clientListHTML();
      });
    }
    if (state.view === 'settings') {
      $('#typesList').addEventListener('change', async (e) => {
        const f = e.target.dataset.field;
        const card = e.target.closest('[data-type-id]');
        const t = card && typeById(card.dataset.typeId);
        if (!t || !f) return;
        const subRow = e.target.closest('[data-sub-id]');
        const obj = subRow ? t.subs.find((x) => x.id === subRow.dataset.subId) : t;
        if (!obj) return;
        obj[f] = f === 'name' ? e.target.value.trim() : (Number(e.target.value) || 0);
        await saveSettings();
        toast('נשמר');
      });
      $('#productsList').addEventListener('change', async (e) => {
        const f = e.target.dataset.field;
        const row = e.target.closest('[data-product-id]');
        const pr = row && state.settings.products.find((x) => x.id === row.dataset.productId);
        if (!pr || !f) return;
        pr[f] = f === 'name' ? e.target.value.trim() : (Number(e.target.value) || 0);
        await saveSettings();
        toast('נשמר');
      });
      $('#alarmMin').addEventListener('change', async (e) => {
        state.settings.alarmMinutes = Number(e.target.value);
        await saveSettings();
        toast('נשמר');
      });
      $('#askCal').addEventListener('change', async (e) => {
        state.settings.askCalendar = e.target.checked;
        await saveSettings();
      });
      $('#bizName').addEventListener('input', (e) => {
        state.settings.businessName = e.target.value;
        $('#tplPreview').textContent = templatePreview();
        clearTimeout(tplTimer);
        tplTimer = setTimeout(saveSettings, 400);
      });
      $('#tpl').addEventListener('input', (e) => {
        state.settings.template = e.target.value;
        $('#tplPreview').textContent = templatePreview();
        clearTimeout(tplTimer);
        tplTimer = setTimeout(saveSettings, 400);
      });
    }
    if (state.view === 'calendar') bindSwipe($('#cal'), () => shiftMonth(1), () => shiftMonth(-1));
    if (state.view === 'day') bindSwipe($('#view'), () => shiftDay(1), () => shiftDay(-1));
  }

  // החלקה ימינה = קדימה (בעברית "הבא" נמצא משמאל)
  function bindSwipe(el, onNext, onPrev) {
    if (!el) return;
    let x0 = null; let y0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx > 0 ? onNext : onPrev)();
    }, { passive: true });
  }

  function shiftMonth(n) { state.month = L.addMonths(state.month, n); render(); }
  function shiftDay(n) { state.day = L.addDays(state.day, n); render(); }

  function shiftSummary(n) {
    const d = state.sumDate;
    state.sumDate = state.sumTab === 'day' ? L.addDays(d, n)
      : state.sumTab === 'week' ? L.addDays(d, 7 * n) : L.addMonths(d, n);
    render();
  }

  async function setStatus(id, status) {
    const a = findAppt(id);
    if (!a || a.status === status) return;
    await saveAppt({ ...a, status });
    toast(status === 'cancelled' && a.calendarAddedAt
      ? `${a.clientName} ביטלה. מחקי את התור גם מיומן האייפון`
      : `${a.clientName}: ${L.statusLabel(status)}`);
    render();
  }

  /* ---------- טיפול בלחיצות ---------- */
  const actions = {
    'tab': (el) => {
      const t = el.dataset.tab;
      if (t === 'reminders') state.remDay = null;
      if (t === 'calendar') state.month = state.view === 'calendar' ? L.monthStart(today()) : state.month;
      go(t);
    },
    'open-settings': () => { state.settingsBack = state.view; go('settings'); },
    'back-settings': () => go(state.settingsBack && state.settingsBack !== 'settings' ? state.settingsBack : 'calendar'),
    'month-prev': () => shiftMonth(-1),
    'month-next': () => shiftMonth(1),
    'month-today': () => { state.month = L.monthStart(today()); render(); },
    'open-day': (el) => {
      state.day = el.dataset.date;
      state.dayBack = el.dataset.back || 'calendar';
      go('day');
    },
    'back': () => {
      if (state.dayBack === 'calendar') state.month = L.monthStart(state.day);
      go(state.dayBack || 'calendar');
    },
    'day-prev': () => shiftDay(-1),
    'day-next': () => shiftDay(1),
    'day-today': () => { state.day = today(); render(); },
    'new-appt': (el) => {
      const date = el.dataset.date || (state.view === 'day' ? state.day : today());
      openApptForm(newForm({ date }));
      setTimeout(() => $('#fName') && $('#fName').focus(), 320);
    },
    'new-appt-client': (el) => {
      const c = findPerson(el.dataset.key);
      if (!c) return;
      openApptForm(newForm({ clientName: c.name, phone: c.phone }));
    },
    'edit-appt': (el) => {
      const a = findAppt(el.dataset.id);
      if (a) openApptForm(formFromAppt(a));
    },
    'close-sheet': () => closeSheet(),
    'save-appt': () => saveForm(),
    'delete-appt': () => deleteFromForm(),
    'f-type': (el) => {
      const t = typeById(el.dataset.type);
      if (!t) return;
      if (t.subs.length) {
        form.openType = form.openType === t.id ? null : t.id;
        renderFormItems();
        return;
      }
      toggleItem((i) => !L.isProduct(i) && i.typeId === t.id, () => treatmentItem(t));
    },
    'f-sub': (el) => {
      const t = typeById(el.dataset.type);
      if (!t) return;
      const sb = el.dataset.sub ? t.subs.find((x) => x.id === el.dataset.sub) : null;
      toggleItem((i) => !L.isProduct(i) && i.typeId === t.id && (i.subId || null) === (sb ? sb.id : null), () => treatmentItem(t, sb));
    },
    'f-product': (el) => {
      const pr = state.settings.products.find((x) => x.id === el.dataset.product);
      if (!pr) return;
      toggleItem((i) => L.isProduct(i) && i.productId === pr.id, () => productItem(pr));
    },
    'f-qty': (el) => {
      const it = form.items[Number(el.dataset.idx)];
      if (!it) return;
      it.qty = Math.max(1, L.itemQty(it) + Number(el.dataset.d));
      renderFormItems();
    },
    'f-new-sub': (el) => { const t = typeById(el.dataset.type); if (t) addFromForm('sub', t); },
    'f-new-product': () => addFromForm('product'),
    'f-rm-item': (el) => {
      form.items.splice(Number(el.dataset.idx), 1);
      recalcDuration();
      renderFormItems();
    },
    'f-new-type': () => addFromForm('type'),
    'f-pay': (el) => {
      form.payment = form.payment === el.dataset.pay ? '' : el.dataset.pay;
      $$('#payGrid .pay-btn').forEach((b) => {
        const on = b.dataset.pay === form.payment;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
    },
    'f-status': (el) => {
      form.status = el.dataset.status;
      $$('#fStatus button').forEach((b) => {
        const on = b.dataset.status === form.status;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      updateFormTotals();
    },
    'set-status': (el) => setStatus(el.dataset.id, el.dataset.status),
    'move-appt': (el) => { const a = findAppt(el.dataset.id); if (a) moveAppt(a); },
    'cal-add': async (el) => {
      const a = findAppt(el.dataset.id);
      if (!a) return;
      if (a.calendarAddedAt) {
        const again = await ask({ title: 'כבר נוסף ליומן', text: 'להוסיף שוב? (ייתכן שיופיע פעמיים ביומן האייפון)', ok: 'להוסיף שוב', cancel: 'ביטול' });
        if (!again) return;
      }
      addToPhoneCalendar([a]);
    },
    'cal-add-upcoming': async () => {
      const list = upcomingNotInCalendar();
      if (!list.length) { toast('כל התורים הקרובים כבר ביומן ✓'); return; }
      const ok = await ask({ title: `להוסיף ${list.length} תורים ליומן האייפון?`, text: 'כל התורים ב-30 הימים הקרובים שעוד לא נוספו, עם התראה לפני כל אחד.', ok: 'הוספה', cancel: 'ביטול' });
      if (ok) addToPhoneCalendar(list);
    },
    'wa-sent': (el) => {
      // הקישור נפתח כרגיל; מסמנים שנשלחה אחרי רגע קצר
      const id = el.dataset.id;
      setTimeout(async () => {
        const a = findAppt(id);
        if (!a) return;
        await saveAppt({ ...a, reminderSent: true, reminderSentAt: Date.now() });
        render();
      }, 400);
      return true;
    },
    'unsend': async (el) => {
      const a = findAppt(el.dataset.id);
      if (!a) return;
      await saveAppt({ ...a, reminderSent: false, reminderSentAt: null });
      render();
    },
    'rem-prev': () => { state.remDay = L.addDays(state.remDay || tomorrow(), -1); render(); },
    'rem-next': () => { state.remDay = L.addDays(state.remDay || tomorrow(), 1); render(); },
    'rem-tomorrow': () => { state.remDay = null; render(); },
    'sum-tab': (el) => { state.sumTab = el.dataset.tab; render(); },
    'sum-prev': () => shiftSummary(-1),
    'sum-next': () => shiftSummary(1),
    'sum-today': () => { state.sumDate = today(); render(); },
    'sum-week': (el) => { state.sumTab = 'week'; state.sumDate = el.dataset.date; go('summary'); },
    'sum-month': (el) => { state.sumTab = 'month'; state.sumDate = el.dataset.date; go('summary'); },
    'open-client': (el) => openClient(el.dataset.key),
    'client-filter': (el) => { state.clientFilter = el.dataset.f; $('#clientList').innerHTML = clientListHTML(); },
    'add-type': async () => {
      state.settings.treatmentTypes.push({ id: 't-' + uid(), name: '', price: 0, duration: 30, color: nextFreeColor(), subs: [] });
      await saveSettings();
      render();
      focusLast('.type-card .type-head [data-field=name]');
    },
    'add-sub': async (el) => {
      const t = typeById(el.dataset.type);
      if (!t) return;
      t.subs.push({ id: 's-' + uid(), name: '', price: t.price, duration: t.duration });
      await saveSettings();
      render();
      focusLast(`[data-type-id="${t.id}"] [data-sub-id] [data-field=name]`);
    },
    'del-sub': async (el) => {
      const t = typeById(el.dataset.type);
      const sb = t && t.subs.find((x) => x.id === el.dataset.id);
      if (!sb) return;
      const ok = await ask({ title: `למחוק את "${sb.name || 'ללא שם'}"?`, text: 'טיפולים שכבר נשמרו לא ישתנו.', ok: 'מחיקה', danger: true });
      if (!ok) return;
      t.subs = t.subs.filter((x) => x.id !== sb.id);
      await saveSettings();
      render();
    },
    'add-product': async () => {
      state.settings.products.push({ id: 'p-' + uid(), name: '', price: 0 });
      await saveSettings();
      render();
      focusLast('#productsList [data-field=name]');
    },
    'del-product': async (el) => {
      const pr = state.settings.products.find((x) => x.id === el.dataset.id);
      if (!pr) return;
      const ok = await ask({ title: `למחוק את "${pr.name || 'ללא שם'}"?`, text: 'טיפולים שכבר נשמרו לא ישתנו.', ok: 'מחיקה', danger: true });
      if (!ok) return;
      state.settings.products = state.settings.products.filter((x) => x.id !== pr.id);
      await saveSettings();
      render();
    },
    'pick-color': async (el) => {
      const t = typeById(el.dataset.id);
      if (!t) return;
      const c = await pickColor(t.color, t.name);
      if (!c || c === t.color) return;
      t.color = c;
      await saveSettings();
      render();
      toast('הצבע נשמר');
    },
    'del-type': async (el) => {
      const t = state.settings.treatmentTypes.find((x) => x.id === el.dataset.id);
      if (!t) return;
      const ok = await ask({ title: `למחוק את "${t.name || 'ללא שם'}"?`, text: 'טיפולים שכבר נשמרו לא ישתנו.', ok: 'מחיקה', danger: true });
      if (!ok) return;
      state.settings.treatmentTypes = state.settings.treatmentTypes.filter((x) => x.id !== t.id);
      await saveSettings();
      render();
    },
    'insert-var': (el) => {
      const ta = $('#tpl');
      const v = `{${el.dataset.var}}`;
      const s = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
      const e = ta.selectionEnd != null ? ta.selectionEnd : ta.value.length;
      ta.value = ta.value.slice(0, s) + v + ta.value.slice(e);
      ta.focus();
      ta.setSelectionRange(s + v.length, s + v.length);
      ta.dispatchEvent(new Event('input'));
    },
    'reset-template': async () => {
      const ok = await ask({ title: 'לשחזר את הנוסח המקורי?', text: 'הנוסח הנוכחי יימחק.', ok: 'שחזור' });
      if (!ok) return;
      state.settings.template = L.DEFAULT_TEMPLATE;
      await saveSettings();
      render();
    },
    'export': () => exportBackup(),
    'import': () => { $('#importFile').value = ''; $('#importFile').click(); },
    'import-contacts': () => { $('#contactsFile').value = ''; $('#contactsFile').click(); },
    'clear-contacts': async () => {
      const ok = await ask({ title: 'למחוק את אנשי הקשר המיובאים?', text: 'הטיפולים והלקוחות לא יימחקו. אפשר לייבא שוב בכל זמן.', ok: 'מחיקה', danger: true });
      if (!ok) return;
      state.contacts = [];
      await state.store.setKV('contacts', []);
      toast('אנשי הקשר נמחקו');
      render();
    },
    'pick-contact': () => pickContact(),
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    // קישורים (וואטסאפ) ממשיכים להיפתח כרגיל
    if (el.tagName !== 'A') e.preventDefault();
    fn(el, e);
  });

  $('#sheetWrap').addEventListener('click', (e) => {
    if (e.target.id === 'sheetWrap') closeSheet();
  });

  $('#contactsFile').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importContacts(f);
  });

  $('#importFile').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importBackup(f);
  });

  // כשחוזרים לאפליקציה (למשל למחרת) — לרענן את "היום" ו"מחר"
  let lastDay = today();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (today() !== lastDay) {
      if (state.day === lastDay) state.day = today();
      if (state.sumDate === lastDay) state.sumDate = today();
      if (state.month === L.monthStart(lastDay)) state.month = L.monthStart(today());
      lastDay = today();
    }
    if (!sheetOpen()) render();
  });

  /* ---------- הפעלה ---------- */
  async function init() {
    $('#fab').innerHTML = I.plus;
    $$('[data-icon]').forEach((el) => { el.innerHTML = I[el.dataset.icon]; });

    state.store = await DB.open();
    const data = await state.store.getAll();
    state.appts = data.appointments || [];
    state.settings = normalizeSettings(Object.assign(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), data.settings || {}));
    state.meta = data.meta || {};
    state.contacts = Array.isArray(data.contacts) ? data.contacts : [];
    await saveSettings();
    render();

    DB.requestPersistence();
    // בפיתוח מקומי בלי מטמון, כדי ששינויים ייראו מיד (אפשר לבדוק אופליין עם ?sw=1)
    const dev = location.hostname === 'localhost' && !/[?&]sw=1/.test(location.search);
    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !dev) {
      navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW', e));
    }
  }

  init().catch((e) => {
    console.error(e);
    $('#view').innerHTML = `<div class="card empty"><span class="emoji">😕</span>משהו השתבש בטעינה.<br>נסי לסגור ולפתוח את האפליקציה.</div>`;
  });

  // לבדיקות
  window.__app = { state, render };
})();
