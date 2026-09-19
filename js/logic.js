/*
 * לוגיקה טהורה: תאריכים, סיכומים, טלפונים ותבניות הודעה.
 * אין כאן גישה ל-DOM או לאחסון, כדי שאפשר יהיה לבדוק את החישובים בנפרד.
 */
(function (root) {
  'use strict';

  const PAYMENTS = [
    { id: 'paybox', label: 'PayBox' },
    { id: 'cash', label: 'מזומן' },
    { id: 'bank', label: 'העברה בנקאית' },
    { id: 'meshulam', label: 'משולם' },
  ];
  const NO_PAYMENT = 'none';
  const NO_PAYMENT_LABEL = 'לא צוין';

  const STATUSES = [
    { id: 'confirmed', label: 'אישרה' },
    { id: 'pending', label: 'ממתינה' },
    { id: 'cancelled', label: 'ביטלה' },
  ];

  const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
  const MONTH_NAMES = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  const DEFAULT_DURATION = 30;

  const DEFAULT_TEMPLATE =
    'היי {שם} 🌸\n' +
    'מזכירה לך שקבענו תור ל{טיפול} ביום {יום}, {תאריך}, בשעה {שעה}.\n' +
    'אשמח שתאשרי הגעה 🙏\n' +
    'תודה ונתראה,\n' +
    '{עסק}';

  /* ---------- תאריכים (כמחרוזות YYYY-MM-DD, לפי שעון מקומי) ---------- */

  const pad = (n) => String(n).padStart(2, '0');

  // שעה 12:00 כדי שמעברי שעון קיץ/חורף לא יזיזו את היום
  function parseDate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d, 12);
  }

  function fmtDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function todayStr(now) {
    return fmtDate(now || new Date());
  }

  function addDays(s, n) {
    const d = parseDate(s);
    d.setDate(d.getDate() + n);
    return fmtDate(d);
  }

  function dayOfWeek(s) {
    return parseDate(s).getDay();
  }

  function daysInMonth(y, m) { // m: 1-12
    return new Date(y, m, 0).getDate();
  }

  function monthStart(s) {
    return s.slice(0, 8) + '01';
  }

  function monthEnd(s) {
    const [y, m] = s.split('-').map(Number);
    return `${y}-${pad(m)}-${pad(daysInMonth(y, m))}`;
  }

  function addMonths(s, n) {
    const [y, m] = s.split('-').map(Number);
    const d = new Date(y, m - 1 + n, 1, 12);
    return fmtDate(d);
  }

  // השבוע מתחיל ביום ראשון
  function weekStart(s) {
    return addDays(s, -dayOfWeek(s));
  }

  function weekRange(s) {
    const from = weekStart(s);
    return { from, to: addDays(from, 6) };
  }

  function monthRange(s) {
    return { from: monthStart(s), to: monthEnd(s) };
  }

  // שבועות החודש (ראשון עד שבת), חתוכים לגבולות החודש
  function monthWeeks(s) {
    const { from, to } = monthRange(s);
    const weeks = [];
    let cur = from;
    while (cur <= to) {
      const end = addDays(weekStart(cur), 6);
      weeks.push({ from: cur, to: end < to ? end : to });
      cur = addDays(end, 1);
    }
    return weeks;
  }

  function shortDate(s) { // 20.9
    const [, m, d] = s.split('-').map(Number);
    return `${d}.${m}`;
  }

  function longDate(s) { // 20 בספטמבר 2026
    const [y, m, d] = s.split('-').map(Number);
    return `${d} ב${MONTH_NAMES[m - 1]} ${y}`;
  }

  function monthLabel(s) {
    const [y, m] = s.split('-').map(Number);
    return `${MONTH_NAMES[m - 1]} ${y}`;
  }

  function dayName(s) {
    return DAY_NAMES[dayOfWeek(s)];
  }

  /* ---------- זמנים ---------- */

  function timeToMin(t) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  function minToTime(min) {
    min = ((min % 1440) + 1440) % 1440;
    return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
  }

  function apptDuration(a) {
    const d = Number(a.duration);
    return d > 0 ? d : DEFAULT_DURATION;
  }

  function apptEnd(a) {
    return minToTime(timeToMin(a.time) + apptDuration(a));
  }

  /* ---------- כסף ---------- */

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function formatMoney(n) {
    n = round2(num(n));
    const neg = n < 0;
    const [int, dec] = Math.abs(n).toFixed(2).split('.');
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const body = dec === '00' ? withCommas : `${withCommas}.${dec}`;
    return `${neg ? '-' : ''}₪${body}`;
  }

  function apptTotal(a) {
    return round2((a.items || []).reduce((s, i) => s + num(i.price), 0));
  }

  function isCounted(a) {
    return a.status !== 'cancelled';
  }

  function paymentLabel(id) {
    const p = PAYMENTS.find((x) => x.id === id);
    return p ? p.label : NO_PAYMENT_LABEL;
  }

  function statusLabel(id) {
    const s = STATUSES.find((x) => x.id === id);
    return s ? s.label : 'ממתינה';
  }

  function treatmentNames(a) {
    const names = (a.items || []).map((i) => i.name).filter(Boolean);
    if (names.length <= 1) return names[0] || '';
    return names.slice(0, -1).join(', ') + ' ו' + names[names.length - 1];
  }

  /* ---------- סיכומים ---------- */

  function summarize(appts, from, to) {
    const inRange = appts.filter((a) => a.date >= from && a.date <= to);
    const counted = inRange.filter(isCounted);

    const byPayment = {};
    PAYMENTS.forEach((p) => { byPayment[p.id] = 0; });
    byPayment[NO_PAYMENT] = 0;

    const typeMap = new Map();
    let total = 0;
    let itemsCount = 0;

    for (const a of counted) {
      const t = apptTotal(a);
      total += t;
      const key = PAYMENTS.some((p) => p.id === a.payment) ? a.payment : NO_PAYMENT;
      byPayment[key] = round2(byPayment[key] + t);
      for (const it of a.items || []) {
        const name = (it.name || 'ללא שם').trim();
        const row = typeMap.get(name) || { name, count: 0, total: 0 };
        row.count += 1;
        row.total = round2(row.total + num(it.price));
        typeMap.set(name, row);
        itemsCount += 1;
      }
    }

    const byType = [...typeMap.values()].sort((a, b) => b.total - a.total || b.count - a.count);

    return {
      from,
      to,
      total: round2(total),
      count: counted.length,
      itemsCount,
      cancelledCount: inRange.length - counted.length,
      byPayment,
      byType,
    };
  }

  function daySummary(appts, date) {
    return summarize(appts, date, date);
  }

  function weekSummary(appts, date) {
    const { from, to } = weekRange(date);
    const s = summarize(appts, from, to);
    s.days = [];
    for (let d = from; d <= to; d = addDays(d, 1)) {
      s.days.push(summarize(appts, d, d));
    }
    return s;
  }

  function monthSummary(appts, date) {
    const { from, to } = monthRange(date);
    const s = summarize(appts, from, to);
    s.weeks = monthWeeks(date).map((w) => summarize(appts, w.from, w.to));
    return s;
  }

  // סכום ומספר טיפולים לכל יום בטווח, בשביל הלוח החודשי
  function dailyTotals(appts, from, to) {
    const map = {};
    for (const a of appts) {
      if (a.date < from || a.date > to) continue;
      const row = map[a.date] || (map[a.date] = { total: 0, count: 0, statuses: [] });
      row.statuses.push(a.status || 'pending');
      if (isCounted(a)) {
        row.total = round2(row.total + apptTotal(a));
        row.count += 1;
      }
    }
    return map;
  }

  /* ---------- חפיפות ---------- */

  function findOverlaps(appts, cand) {
    if (!cand.date || !cand.time) return [];
    const s1 = timeToMin(cand.time);
    const e1 = s1 + apptDuration(cand);
    return appts.filter((a) => {
      if (a.id === cand.id || a.date !== cand.date || !isCounted(a) || !a.time) return false;
      const s2 = timeToMin(a.time);
      const e2 = s2 + apptDuration(a);
      return s1 < e2 && s2 < e1;
    });
  }

  /* ---------- טלפון ווואטסאפ ---------- */

  // 050-1234567 → 972501234567. מחזיר מחרוזת ריקה אם המספר לא תקין.
  function toIntlPhone(raw) {
    let d = String(raw || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('972')) {
      d = '972' + d.slice(3).replace(/^0+/, '');
    } else if (d.startsWith('0')) {
      d = '972' + d.slice(1);
    } else if (d.length === 9 && /^[57]/.test(d)) {
      d = '972' + d; // 501234567 בלי אפס בהתחלה
    }
    return d.length >= 10 && d.length <= 15 ? d : '';
  }

  function fillTemplate(tpl, appt, businessName) {
    const fullName = (appt.clientName || '').trim().replace(/\s+/g, ' ');
    const vars = {
      'שם': fullName.split(' ')[0],
      'שם מלא': fullName,
      'שעה': appt.time || '',
      'טיפול': treatmentNames(appt),
      'תאריך': appt.date ? shortDate(appt.date) : '',
      'יום': appt.date ? dayName(appt.date) : '',
      'עסק': businessName || '',
    };
    return String(tpl || '').replace(/\{([^{}]+)\}/g, (m, key) =>
      Object.prototype.hasOwnProperty.call(vars, key.trim()) ? vars[key.trim()] : m);
  }

  function waLink(phone, text) {
    const intl = toIntlPhone(phone);
    if (!intl) return '';
    return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
  }

  /* ---------- תזכורות ---------- */

  function reminderStatus(appts, date) {
    const list = appts
      .filter((a) => a.date === date && isCounted(a))
      .sort((a, b) => timeToMin(a.time) - timeToMin(b.time));
    const notSent = list.filter((a) => !a.reminderSent).length;
    const notConfirmed = list.filter((a) => a.status !== 'confirmed').length;
    const needAttention = list.filter((a) => !a.reminderSent || a.status !== 'confirmed').length;
    return { list, total: list.length, notSent, notConfirmed, needAttention };
  }

  /* ---------- לקוחות ---------- */

  function normName(s) {
    return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function clientsIndex(appts) {
    const map = new Map();
    const sorted = [...appts].sort((a, b) =>
      (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
    for (const a of sorted) {
      const key = normName(a.clientName);
      if (!key) continue;
      const c = map.get(key) || { key, name: a.clientName.trim(), phone: '', visits: 0, total: 0, lastDate: '', appts: [] };
      c.name = a.clientName.trim();
      if (a.phone) c.phone = a.phone;
      c.appts.push(a);
      if (isCounted(a)) {
        c.visits += 1;
        c.total = round2(c.total + apptTotal(a));
      }
      if (a.date > c.lastDate) c.lastDate = a.date;
      map.set(key, c);
    }
    return [...map.values()];
  }

  function searchClients(clients, q) {
    const n = normName(q);
    if (!n) return clients;
    const digits = n.replace(/\D/g, '');
    return clients.filter((c) => normName(c.name).includes(n) ||
      (digits.length >= 3 && String(c.phone).replace(/\D/g, '').includes(digits)));
  }

  /* ---------- אנשי קשר (קובץ vCard מהאייפון) ---------- */

  function decodeQP(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(s.substr(i + 1, 2))) {
        bytes.push(parseInt(s.substr(i + 1, 2), 16));
        i += 2;
      } else {
        bytes.push(s.charCodeAt(i) & 0xff);
      }
    }
    return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  }

  function unescapeVCard(s) {
    return s.replace(/\\([\\,;nN])/g, (m, c) => (c === 'n' || c === 'N' ? ' ' : c));
  }

  // מפצל לפי ; שאינו מוקדם ב-\
  function splitUnescaped(s) {
    const parts = [''];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '\\' && i + 1 < s.length) { parts[parts.length - 1] += s[i] + s[i + 1]; i++; }
      else if (s[i] === ';') parts.push('');
      else parts[parts.length - 1] += s[i];
    }
    return parts.map(unescapeVCard);
  }

  // מחזיר [{ name, phone }] — איש קשר אחד לכל שם+טלפון, רק כאלה שיש להם גם שם וגם טלפון
  function parseVCards(text) {
    let src = String(text || '').replace(/\r\n?/g, '\n');
    src = src.replace(/\n[ \t]/g, ''); // שורות מקופלות
    if (/QUOTED-PRINTABLE/i.test(src)) src = src.replace(/=\n/g, '');

    const out = [];
    const seen = new Set();
    let card = null;

    for (const line of src.split('\n')) {
      const colon = line.indexOf(':');
      if (colon < 0) continue;
      const rawKey = line.slice(0, colon);
      let value = line.slice(colon + 1);
      const parts = rawKey.split(';');
      const prop = parts[0].replace(/^[^.]*\./, '').trim().toUpperCase();
      const params = parts.slice(1).join(';').toLowerCase();

      if (prop === 'BEGIN' && /^vcard$/i.test(value.trim())) { card = { fn: '', n: '', org: '', tels: [] }; continue; }
      if (!card) continue;
      if (prop === 'END') {
        const name = (card.fn || card.n || card.org).trim().replace(/\s+/g, ' ');
        const phone = pickPhone(card.tels);
        const key = normName(name) + '|' + phone.replace(/\D/g, '');
        if (name && phone && !seen.has(key)) {
          seen.add(key);
          out.push({ name, phone });
        }
        card = null;
        continue;
      }

      if (/quoted-printable/.test(params)) value = decodeQP(value);
      if (prop === 'FN') card.fn = unescapeVCard(value);
      else if (prop === 'N') {
        const [family = '', given = '', middle = ''] = splitUnescaped(value);
        card.n = [given, middle, family].filter((x) => x.trim()).join(' ');
      } else if (prop === 'ORG') card.org = splitUnescaped(value)[0] || '';
      else if (prop === 'TEL') {
        const v = value.replace(/^tel:/i, '').trim();
        if (v) card.tels.push({ value: v, cell: /cell|mobile|iphone/.test(params) });
      }
    }
    return out;
  }

  // עדיפות: נייד ישראלי, אחר כך כל נייד, ואחר כך המספר הראשון
  function pickPhone(tels) {
    const isIlMobile = (t) => toIntlPhone(t.value).startsWith('9725');
    const t = tels.find(isIlMobile) || tels.find((x) => x.cell) || tels[0];
    return t ? t.value : '';
  }

  const api = {
    PAYMENTS, NO_PAYMENT, NO_PAYMENT_LABEL, STATUSES, DAY_NAMES, DAY_LETTERS, MONTH_NAMES,
    DEFAULT_DURATION, DEFAULT_TEMPLATE,
    parseDate, fmtDate, todayStr, addDays, dayOfWeek, daysInMonth, monthStart, monthEnd, addMonths,
    weekStart, weekRange, monthRange, monthWeeks, shortDate, longDate, monthLabel, dayName,
    timeToMin, minToTime, apptDuration, apptEnd,
    num, round2, formatMoney, apptTotal, isCounted, paymentLabel, statusLabel, treatmentNames,
    summarize, daySummary, weekSummary, monthSummary, dailyTotals,
    findOverlaps, toIntlPhone, fillTemplate, waLink, reminderStatus,
    normName, clientsIndex, searchClients, parseVCards,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Logic = api;
})(typeof self !== 'undefined' ? self : this);
