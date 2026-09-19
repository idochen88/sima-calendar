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
    };
  })();

  /* ---------- מצב ---------- */
  const DEFAULT_TYPES = [
    { id: 't-face', name: 'טיפול פנים', price: 250, duration: 60 },
    { id: 't-hair', name: 'הסרת שיער', price: 150, duration: 30 },
    { id: 't-brows', name: 'עיצוב גבות', price: 80, duration: 20 },
  ];
  const DEFAULT_SETTINGS = {
    businessName: 'סימה חן קוסמטיקאית מוסמכת',
    template: L.DEFAULT_TEMPLATE,
    treatmentTypes: DEFAULT_TYPES,
  };

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

  function periodNav(label, sub, prev, next, todayAction) {
    return `
      <div class="period-nav">
        <button class="icon-btn" data-action="${prev}" aria-label="הקודם">${I.right}</button>
        <div class="period-label">
          <b>${esc(label)}</b>
          ${sub ? `<small>${esc(sub)}</small>` : ''}
          ${todayAction ? `<div><button class="today-link" data-action="${todayAction}">חזרה להיום</button></div>` : ''}
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
      if (info) cls.push('has');
      if ((first + d - 1) % 7 === 6) cls.push('sat');
      let dots = '';
      if (info) {
        const st = info.statuses;
        dots = st.slice(0, 4).map((s) => `<i class="dot ${s}"></i>`).join('') +
          (st.length > 4 ? `<span class="more">+${st.length - 4}</span>` : '');
      }
      const label = `${d} ב${L.MONTH_NAMES[mo - 1]}${info ? `, ${info.statuses.length} טיפולים, ${money(info.total)}` : ''}`;
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
          <span><i class="dot confirmed"></i>אישרה</span>
          <span><i class="dot pending"></i>ממתינה</span>
          <span><i class="dot cancelled"></i>ביטלה</span>
        </div>
        <button class="cal-foot row-btn" data-action="sum-month" data-date="${m}">
          <span>סה״כ ${L.MONTH_NAMES[mo - 1]} · ${monthSum.count} טיפולים</span>
          <b>${money(monthSum.total)}</b>
        </button>
      </section>
      ${backupNudge()}`;
  }

  /* ---------- מסך יום ---------- */
  function apptCard(a, overlapIds) {
    const pay = a.payment ? L.paymentLabel(a.payment) : '';
    const sent = a.reminderSent
      ? `<span class="tag sent">${I.check}תזכורת נשלחה</span>`
      : (a.status !== 'cancelled' && a.date > today() ? '<span class="tag notsent">טרם נשלחה תזכורת</span>' : '');
    return `
      <article class="appt ${a.status}">
        <button class="appt-body" data-action="edit-appt" data-id="${a.id}">
          <div class="appt-time"><b>${esc(a.time)}</b><small>עד ${L.apptEnd(a)}</small></div>
          <div class="appt-main">
            <div class="appt-name">${esc(a.clientName)}</div>
            <div class="appt-tx">${esc(L.treatmentNames(a))}</div>
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

  function payTiles(s) {
    const rows = L.PAYMENTS.map((p) => ({ label: p.label, v: s.byPayment[p.id] }));
    if (s.byPayment[L.NO_PAYMENT]) rows.push({ label: L.NO_PAYMENT_LABEL, v: s.byPayment[L.NO_PAYMENT] });
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
      <article class="appt rem-card ${a.status}">
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
      </article>`;
  }

  function viewReminders() {
    const d = state.remDay || tomorrow();
    const r = L.reminderStatus(state.appts, d);
    const cancelled = sortByTime(state.appts.filter((a) => a.date === d && a.status === 'cancelled'));
    const label = d === tomorrow() ? `מחר · יום ${L.dayName(d)}` : `${dayLabel(d)}${dayLabel(d).startsWith('יום') ? '' : ` · יום ${L.dayName(d)}`}`;
    return `
      <div class="vhead"><div class="vhead-title"><h1>תזכורות</h1><p class="sub">שליחת תזכורות ואישורי הגעה</p></div></div>
      ${periodNav(label, L.longDate(d), 'rem-prev', 'rem-next', d === tomorrow() ? '' : 'rem-tomorrow')}
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
    const rows = L.PAYMENTS.map((p) => ({ id: p.id, label: p.label, v: s.byPayment[p.id] }));
    if (s.byPayment[L.NO_PAYMENT]) rows.push({ id: 'none', label: L.NO_PAYMENT_LABEL, v: s.byPayment[L.NO_PAYMENT] });
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
    return `<section class="card"><h2>לפי סוג טיפול</h2><div class="rows">
      ${s.byType.map((t) => `<div>
        <div class="row-line"><span class="lbl">${esc(t.name)} <small>× ${t.count}</small></span><span class="val">${money(t.total)}</span></div>
        <div class="bar"><i style="width:${Math.round((t.total / max) * 100)}%"></i></div>
      </div>`).join('')}
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
      body = summaryHero(s, 'סך הכנסות ביום') + breakdownPayments(s) + breakdownTypes(s) +
        `<button class="btn secondary" data-action="open-day" data-date="${d}" data-back="summary">לרשימת הטיפולים ביום</button>`;
    } else if (tab === 'week') {
      const s = L.weekSummary(state.appts, d);
      const cur = L.weekStart(t) === s.from;
      nav = periodNav(cur ? 'השבוע' : `שבוע ${L.shortDate(s.from)} – ${L.shortDate(s.to)}`,
        `ראשון ${L.shortDate(s.from)} עד שבת ${L.shortDate(s.to)}`, 'sum-prev', 'sum-next', cur ? '' : 'sum-today');
      const maxDay = Math.max(...s.days.map((x) => x.total), 1);
      body = summaryHero(s, 'סך הכנסות בשבוע') + breakdownPayments(s) + breakdownTypes(s) +
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
      body = summaryHero(s, 'סך הכנסות בחודש') + breakdownPayments(s) + breakdownTypes(s) +
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
  function clientListHTML() {
    const all = L.clientsIndex(state.appts).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
    const list = L.searchClients(all, state.clientQuery);
    if (!all.length) return '<div class="card empty"><span class="emoji">👩</span>עדיין אין לקוחות.<br>הן יופיעו כאן אחרי שתוסיפי טיפול.</div>';
    if (!list.length) return '<div class="card empty">לא נמצאה לקוחה בשם הזה</div>';
    return `<p class="settings-note">${list.length} לקוחות</p>` + list.map((c) => `
      <button class="client-row" data-action="open-client" data-key="${esc(c.key)}">
        <span class="avatar">${esc(initial(c.name))}</span>
        <span class="cr-main"><b>${esc(c.name)}</b>
          <span>${c.visits} ביקורים · אחרון ${L.shortDate(c.lastDate)}.${c.lastDate.slice(2, 4)}</span></span>
        <span class="cr-total">${money(c.total)}</span>
      </button>`).join('');
  }

  function viewClients() {
    return `
      <div class="vhead"><div class="vhead-title"><h1>לקוחות</h1><p class="sub">חיפוש והיסטוריית טיפולים</p></div></div>
      <div class="search">${I.search}
        <input id="clientSearch" type="search" placeholder="חיפוש לפי שם או טלפון" value="${esc(state.clientQuery)}" autocomplete="off" enterkeyhint="search">
      </div>
      <div id="clientList">${clientListHTML()}</div>`;
  }

  function openClient(key) {
    const c = L.clientsIndex(state.appts).find((x) => x.key === key);
    if (!c) return;
    const hist = [...c.appts].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const intl = L.toIntlPhone(c.phone);
    openSheet(`
      <div class="sheet-head">
        <button class="btn ghost" data-action="close-sheet">סגירה</button>
        <h2>כרטיס לקוחה</h2>
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
        <div class="stat-grid">
          <div class="stat"><small>ביקורים</small><b>${c.visits}</b></div>
          <div class="stat"><small>סכום כולל</small><b>${money(c.total)}</b></div>
        </div>
        <button class="btn" data-action="new-appt-client" data-key="${esc(c.key)}" style="margin-bottom:14px">${I.plus}טיפול חדש ל${esc(c.name)}</button>
        <section class="card"><h2>היסטוריית טיפולים <small>(${hist.length})</small></h2>
          ${hist.map((a) => `<button class="history-item" data-action="edit-appt" data-id="${a.id}">
            <span class="hi-date"><b>${L.shortDate(a.date)}${a.date.slice(0, 4) === today().slice(0, 4) ? '' : '.' + a.date.slice(2, 4)}</b><small>${esc(a.time)}</small></span>
            <span class="hi-main">${esc(L.treatmentNames(a))}${a.notes ? `<br><small class="muted">${esc(a.notes)}</small>` : ''}</span>
            <span style="text-align:center"><span class="hi-price">${money(L.apptTotal(a))}</span><br><span class="pill ${a.status}">${L.statusLabel(a.status)}</span></span>
          </button>`).join('')}
        </section>
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
        <h2>סוגי טיפולים ומחירים</h2>
        <p class="settings-note">המחיר והמשך מתמלאים אוטומטית בטיפול חדש, ואפשר לשנות אותם לכל לקוחה.</p>
        <div id="typesList">
          ${st.treatmentTypes.map((t) => `
            <div class="type-row" data-type-id="${t.id}">
              <div><label>שם הטיפול</label><input type="text" data-field="name" value="${esc(t.name)}" placeholder="למשל: פילינג"></div>
              <div><label>מחיר ₪</label><input type="number" inputmode="decimal" min="0" data-field="price" value="${esc(t.price)}" class="ltr"></div>
              <div><label>משך (דק׳)</label><input type="number" inputmode="numeric" min="5" step="5" data-field="duration" value="${esc(t.duration)}" class="ltr"></div>
              <button class="del" data-action="del-type" data-id="${t.id}" aria-label="מחיקת ${esc(t.name)}">${I.trash}</button>
            </div>`).join('')}
        </div>
        <button class="btn secondary" data-action="add-type" style="margin-top:12px">${I.plus}הוספת סוג טיפול</button>
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
        <p class="settings-note">אחרי הייבוא, כשמקלידים שם בטיפול חדש יופיעו גם אנשי הקשר מהטלפון והמספר יתמלא לבד. ברשימת "לקוחות" יופיעו רק מי שקבעה טיפול.</p>
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
      <p class="settings-note" style="text-align:center">היומן של סימה · גרסה 1.0</p>`;
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
          <div class="items" id="items"></div>
        </div>

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
            ${L.PAYMENTS.map((p) => `<button type="button" class="pay-btn ${f.payment === p.id ? 'on' : ''}" data-action="f-pay" data-pay="${p.id}" aria-pressed="${f.payment === p.id}">${esc(p.label)}</button>`).join('')}
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
    const selectedTypeIds = new Set(form.items.map((i) => i.typeId));
    $('#typeChips').innerHTML = types.map((t) => `
      <button type="button" class="chip ${selectedTypeIds.has(t.id) ? 'on' : ''}" data-action="f-type" data-type="${t.id}" aria-pressed="${selectedTypeIds.has(t.id)}">
        ${selectedTypeIds.has(t.id) ? I.check : ''}${esc(t.name || 'ללא שם')}</button>`).join('') +
      '<button type="button" class="chip add" data-action="f-new-type">+ סוג חדש</button>';

    $('#items').innerHTML = form.items.map((it, idx) => `
      <div class="item-row">
        <div class="item-name">${esc(it.name)}<small>${Number(it.duration) || 0} דק׳</small></div>
        <label class="price-input"><span>₪</span><input type="number" inputmode="decimal" min="0" data-item="${idx}" value="${esc(it.price)}" aria-label="מחיר ${esc(it.name)}"></label>
        <button type="button" class="rm" data-action="f-rm-item" data-idx="${idx}" aria-label="הסרת ${esc(it.name)}">${I.x}</button>
      </div>`).join('');
    updateFormTotals();
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

  async function addTypeFromForm() {
    const html = `
      <h3>סוג טיפול חדש</h3>
      <div class="field" style="text-align:start"><label for="ntName">שם</label><input id="ntName" type="text" placeholder="למשל: פילינג"></div>
      <div class="two-col" style="text-align:start">
        <div class="field"><label for="ntPrice">מחיר ₪</label><input id="ntPrice" type="number" inputmode="decimal" class="ltr"></div>
        <div class="field"><label for="ntDur">משך (דק׳)</label><input id="ntDur" type="number" inputmode="numeric" class="ltr" value="30"></div>
      </div>
      <div class="btn-row"><button class="btn" data-r="1">הוספה</button><button class="btn ghost" data-r="0">ביטול</button></div>`;
    const wrap = $('#dialogWrap');
    $('#dialog').innerHTML = html;
    wrap.classList.add('open');
    setTimeout(() => $('#ntName').focus(), 50);
    const ok = await new Promise((resolve) => {
      wrap.onclick = (e) => {
        const b = e.target.closest('[data-r]');
        if (!b) return;
        if (b.dataset.r === '1' && !$('#ntName').value.trim()) { $('#ntName').classList.add('invalid'); return; }
        resolve(b.dataset.r === '1');
      };
    });
    const t = {
      id: 't-' + uid(),
      name: $('#ntName').value.trim(),
      price: Number($('#ntPrice').value) || 0,
      duration: Number($('#ntDur').value) || 30,
    };
    wrap.classList.remove('open');
    wrap.onclick = null;
    if (!ok) return;
    state.settings.treatmentTypes.push(t);
    await saveSettings();
    form.items.push({ typeId: t.id, name: t.name, price: t.price, duration: t.duration });
    recalcDuration();
    renderFormItems();
    toast(`"${t.name}" נוסף לרשימה`);
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
    if (!form.items.length) problems.push('סוג טיפול');
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
    const a = {
      id: form.id || uid(),
      clientName: form.clientName,
      phone: form.phone,
      date: form.date,
      time: form.time,
      items: form.items.map((i) => ({ typeId: i.typeId || null, name: i.name, price: L.num(i.price), duration: Number(i.duration) || 0 })),
      duration: form.duration || L.DEFAULT_DURATION,
      payment: form.payment || '',
      status: form.status || 'pending',
      reminderSent: !!form.reminderSent,
      reminderSentAt: form.reminderSent ? (form.reminderSentAt || Date.now()) : null,
      notes: form.notes,
      createdAt: existing ? existing.createdAt : Date.now(),
    };
    await saveAppt(a);
    closeSheet();
    toast(existing ? 'הטיפול עודכן' : 'הטיפול נשמר 🌸');
    render();
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
    toast('הטיפול נמחק');
    render();
  }

  /* ---------- גיבוי ---------- */
  function backupPayload() {
    return {
      app: 'sima-calendar',
      version: 1,
      exportedAt: new Date().toISOString(),
      appointments: state.appts,
      settings: state.settings,
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
      items: Array.isArray(a.items) ? a.items.map((i) => ({
        typeId: i.typeId || null, name: String(i.name || ''), price: L.num(i.price), duration: Number(i.duration) || 0,
      })) : [],
      duration: Number(a.duration) || L.DEFAULT_DURATION,
      payment: L.PAYMENTS.some((p) => p.id === a.payment) ? a.payment : '',
      status: statuses.has(a.status) ? a.status : 'pending',
      reminderSent: !!a.reminderSent,
      reminderSentAt: a.reminderSentAt || null,
      notes: String(a.notes || ''),
      createdAt: a.createdAt || Date.now(),
      updatedAt: a.updatedAt || Date.now(),
    }));
    const s = data.settings || {};
    const settings = {
      businessName: typeof s.businessName === 'string' ? s.businessName : DEFAULT_SETTINGS.businessName,
      template: typeof s.template === 'string' && s.template.trim() ? s.template : DEFAULT_SETTINGS.template,
      treatmentTypes: Array.isArray(s.treatmentTypes) && s.treatmentTypes.length
        ? s.treatmentTypes.map((t) => ({ id: String(t.id || 't-' + uid()), name: String(t.name || ''), price: L.num(t.price), duration: Number(t.duration) || 30 }))
        : JSON.parse(JSON.stringify(DEFAULT_TYPES)),
    };
    return { appointments: appts, settings };
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
    toast(`יובאו ${list.length} אנשי קשר ✓`);
    render();
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
        const row = e.target.closest('[data-type-id]');
        if (!row) return;
        const t = state.settings.treatmentTypes.find((x) => x.id === row.dataset.typeId);
        const f = e.target.dataset.field;
        if (!t || !f) return;
        t[f] = f === 'name' ? e.target.value.trim() : (Number(e.target.value) || 0);
        await saveSettings();
        toast('נשמר');
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
    toast(`${a.clientName}: ${L.statusLabel(status)}`);
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
      const c = L.clientsIndex(state.appts).find((x) => x.key === el.dataset.key);
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
      const t = state.settings.treatmentTypes.find((x) => x.id === el.dataset.type);
      if (!t) return;
      const idx = form.items.findIndex((i) => i.typeId === t.id);
      if (idx >= 0) form.items.splice(idx, 1);
      else form.items.push({ typeId: t.id, name: t.name, price: t.price, duration: t.duration });
      recalcDuration();
      renderFormItems();
    },
    'f-rm-item': (el) => {
      form.items.splice(Number(el.dataset.idx), 1);
      recalcDuration();
      renderFormItems();
    },
    'f-new-type': () => addTypeFromForm(),
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
    'add-type': async () => {
      state.settings.treatmentTypes.push({ id: 't-' + uid(), name: '', price: 0, duration: 30 });
      await saveSettings();
      render();
      const rows = $$('.type-row');
      const inp = rows[rows.length - 1].querySelector('[data-field=name]');
      inp.scrollIntoView({ block: 'center' });
      inp.focus();
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
    state.settings = Object.assign(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), data.settings || {});
    state.meta = data.meta || {};
    state.contacts = Array.isArray(data.contacts) ? data.contacts : [];
    if (!data.settings) await saveSettings();
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
