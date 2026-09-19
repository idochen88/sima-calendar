// הרצה: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/logic.js');

let seq = 0;
const appt = (date, time, items, payment, status = 'pending', extra = {}) => ({
  id: 'a' + (++seq), clientName: 'לקוחה ' + seq, phone: '050-1234567',
  date, time, items: items.map(([name, price, duration = 30]) => ({ name, price, duration })),
  duration: items.reduce((s, i) => s + (i[2] || 30), 0),
  payment, status, reminderSent: false, ...extra,
});

// ספטמבר 2026: ה-1 הוא יום שלישי. שבוע 13–19 הוא ראשון עד שבת.
const DATA = [
  appt('2026-09-13', '09:00', [['טיפול פנים', 250]], 'paybox', 'confirmed'),
  appt('2026-09-13', '11:00', [['עיצוב גבות', 80], ['הסרת שיער', 150]], 'bit', 'pending'),
  appt('2026-09-13', '12:00', [['טיפול פנים', 250]], 'bank', 'cancelled'),      // לא נספר
  appt('2026-09-15', '10:00', [['הסרת שיער', 120]], 'meshulam', 'confirmed'),
  appt('2026-09-19', '10:00', [['עיצוב גבות', 90]], 'bit', 'confirmed'),        // שבת, סוף השבוע
  appt('2026-09-20', '10:00', [['טיפול פנים', 300]], 'paybox', 'confirmed'),     // ראשון, שבוע הבא
  appt('2026-09-01', '10:00', [['טיפול פנים', 200]], '', 'pending'),             // בלי אמצעי תשלום
  appt('2026-08-31', '10:00', [['טיפול פנים', 999]], 'bit', 'confirmed'),       // חודש קודם
  appt('2026-10-01', '10:00', [['טיפול פנים', 777]], 'bit', 'confirmed'),       // חודש הבא
  appt('2026-09-30', '18:00', [['עיצוב גבות', 60]], 'bank', 'cancelled'),         // לא נספר
];

test('סיכום יומי: סכום, מספר טיפולים, אמצעי תשלום, ביטולים לא נספרים', () => {
  const s = L.daySummary(DATA, '2026-09-13');
  assert.equal(s.total, 250 + 80 + 150);
  assert.equal(s.count, 2);
  assert.equal(s.cancelledCount, 1);
  assert.deepEqual(s.byPayment, { paybox: 250, bit: 230, cash: 0, bank: 0, meshulam: 0, none: 0 });
});

test('סיכום יומי ליום ריק', () => {
  const s = L.daySummary(DATA, '2026-09-14');
  assert.equal(s.total, 0);
  assert.equal(s.count, 0);
  assert.deepEqual(s.byType, []);
});

test('השבוע מתחיל ביום ראשון', () => {
  assert.deepEqual(L.weekRange('2026-09-16'), { from: '2026-09-13', to: '2026-09-19' });
  assert.deepEqual(L.weekRange('2026-09-13'), { from: '2026-09-13', to: '2026-09-19' });
  assert.deepEqual(L.weekRange('2026-09-19'), { from: '2026-09-13', to: '2026-09-19' });
  assert.deepEqual(L.weekRange('2026-09-20'), { from: '2026-09-20', to: '2026-09-26' });
  // שבוע שחוצה חודש ושנה
  assert.deepEqual(L.weekRange('2027-01-01'), { from: '2026-12-27', to: '2027-01-02' });
});

test('סיכום שבועי: סכום, אמצעי תשלום, סוג טיפול, פירוט ימים', () => {
  const s = L.weekSummary(DATA, '2026-09-16');
  assert.equal(s.total, 250 + 80 + 150 + 120 + 90);
  assert.equal(s.count, 4);
  assert.equal(s.cancelledCount, 1);
  assert.deepEqual(s.byPayment, { paybox: 250, bit: 320, cash: 0, bank: 0, meshulam: 120, none: 0 });
  const byType = Object.fromEntries(s.byType.map((t) => [t.name, [t.count, t.total]]));
  assert.deepEqual(byType, {
    'טיפול פנים': [1, 250],
    'הסרת שיער': [2, 270],
    'עיצוב גבות': [2, 170],
  });
  assert.equal(s.days.length, 7);
  assert.equal(s.days[0].total, 480);  // ראשון 13.9
  assert.equal(s.days[2].total, 120);  // שלישי 15.9
  assert.equal(s.days[6].total, 90);   // שבת 19.9
  assert.equal(s.days.reduce((x, d) => x + d.total, 0), s.total);
});

test('שבועות בחודש חתוכים לגבולות החודש', () => {
  assert.deepEqual(L.monthWeeks('2026-09-10'), [
    { from: '2026-09-01', to: '2026-09-05' },
    { from: '2026-09-06', to: '2026-09-12' },
    { from: '2026-09-13', to: '2026-09-19' },
    { from: '2026-09-20', to: '2026-09-26' },
    { from: '2026-09-27', to: '2026-09-30' },
  ]);
  // פברואר 2026 מתחיל ביום ראשון ויש בו בדיוק 4 שבועות
  assert.equal(L.monthWeeks('2026-02-01').length, 4);
});

test('סיכום חודשי: סכום, אמצעי תשלום, סוג טיפול, שבועות', () => {
  const s = L.monthSummary(DATA, '2026-09-05');
  const expected = 250 + 80 + 150 + 120 + 90 + 300 + 200;
  assert.equal(s.total, expected);
  assert.equal(s.count, 6);
  assert.equal(s.cancelledCount, 2);
  assert.deepEqual(s.byPayment, { paybox: 550, bit: 320, cash: 0, bank: 0, meshulam: 120, none: 200 });
  assert.equal(Object.values(s.byPayment).reduce((a, b) => a + b, 0), s.total);
  assert.deepEqual(s.weeks.map((w) => w.total), [200, 0, 690, 300, 0]);
  assert.equal(s.weeks.reduce((x, w) => x + w.total, 0), s.total);
  assert.equal(s.byType.reduce((x, t) => x + t.total, 0), s.total);
});

test('שינוי סטטוס לביטלה מוציא את הטיפול מהסיכום', () => {
  const data = DATA.map((a) => ({ ...a }));
  const before = L.daySummary(data, '2026-09-15').total;
  data.find((a) => a.date === '2026-09-15').status = 'cancelled';
  assert.equal(before, 120);
  assert.equal(L.daySummary(data, '2026-09-15').total, 0);
  assert.equal(L.monthSummary(data, '2026-09-01').byPayment.meshulam, 0);
});

test('מחירים עם אגורות מסוכמים בלי שגיאות עיגול', () => {
  const d = [appt('2026-05-05', '10:00', [['א', 0.1], ['ב', 0.2]], 'bit', 'confirmed')];
  assert.equal(L.daySummary(d, '2026-05-05').total, 0.3);
  assert.equal(L.formatMoney(0.3), '₪0.30');
  assert.equal(L.formatMoney(1250), '₪1,250');
  assert.equal(L.formatMoney(1234567), '₪1,234,567');
});

test('סכומים יומיים ללוח החודשי', () => {
  const t = L.dailyTotals(DATA, '2026-09-01', '2026-09-30');
  assert.deepEqual(t['2026-09-13'], { total: 480, count: 2, statuses: ['confirmed', 'pending', 'cancelled'] });
  assert.equal(t['2026-09-30'].total, 0);
  assert.equal(t['2026-08-31'], undefined);
});

test('המרת טלפון ישראלי לפורמט בינלאומי', () => {
  assert.equal(L.toIntlPhone('050-1234567'), '972501234567');
  assert.equal(L.toIntlPhone('0501234567'), '972501234567');
  assert.equal(L.toIntlPhone('050 123 4567'), '972501234567');
  assert.equal(L.toIntlPhone('+972 50-123-4567'), '972501234567');
  assert.equal(L.toIntlPhone('+972 (0)50-1234567'), '972501234567');
  assert.equal(L.toIntlPhone('00972501234567'), '972501234567');
  assert.equal(L.toIntlPhone('501234567'), '972501234567');
  assert.equal(L.toIntlPhone('02-6543210'), '97226543210');
  assert.equal(L.toIntlPhone('+44 7700 900123'), '447700900123');
  assert.equal(L.toIntlPhone('123'), '');
  assert.equal(L.toIntlPhone(''), '');
});

test('תבנית הודעה וקישור וואטסאפ', () => {
  const a = appt('2026-09-20', '14:30', [['טיפול פנים', 250], ['עיצוב גבות', 80]], 'bit');
  a.clientName = '  דנה  לוי ';
  assert.equal(L.fillTemplate('{שם מלא}', a, ''), 'דנה לוי');
  const msg = L.fillTemplate('היי {שם}, מחר ב{שעה} ל{טיפול} ({יום} {תאריך}) — {עסק} {לא_קיים}', a, 'סימה');
  assert.equal(msg, 'היי דנה, מחר ב14:30 לטיפול פנים ועיצוב גבות (ראשון 20.9) — סימה {לא_קיים}');
  const link = L.waLink('050-1234567', 'שלום 🌸');
  assert.ok(link.startsWith('https://wa.me/972501234567?text='));
  assert.equal(decodeURIComponent(link.split('text=')[1]), 'שלום 🌸');
  assert.equal(L.waLink('12', 'x'), '');
  assert.equal(L.treatmentNames({ items: [{ name: 'א' }, { name: 'ב' }, { name: 'ג' }] }), 'א, ב וג');
});

test('זיהוי חפיפה בין תורים', () => {
  const day = [
    appt('2026-09-20', '10:00', [['פנים', 250, 60]], 'bit', 'confirmed'),
    appt('2026-09-20', '12:00', [['גבות', 80, 20]], 'bit', 'cancelled'),
  ];
  const cand = (time, dur) => ({ id: 'new', date: '2026-09-20', time, duration: dur });
  assert.equal(L.findOverlaps(day, cand('10:30', 30)).length, 1);
  assert.equal(L.findOverlaps(day, cand('09:30', 30)).length, 0);  // נגמר בדיוק ב-10:00
  assert.equal(L.findOverlaps(day, cand('11:00', 30)).length, 0);  // מתחיל בדיוק כשהקודם נגמר
  assert.equal(L.findOverlaps(day, cand('12:00', 30)).length, 0);  // מבוטל לא נחשב
  assert.equal(L.findOverlaps(day, { ...day[0] }).length, 0);       // לא חופף לעצמו
  assert.equal(L.apptEnd(day[0]), '11:00');
});

test('תזכורות למחר: מי לא קיבלה תזכורת ומי לא אישרה', () => {
  const d = [
    appt('2026-09-20', '11:00', [['א', 1]], 'bit', 'pending', { reminderSent: true }),
    appt('2026-09-20', '09:00', [['א', 1]], 'bit', 'confirmed', { reminderSent: true }),
    appt('2026-09-20', '10:00', [['א', 1]], 'bit', 'pending', { reminderSent: false }),
    appt('2026-09-20', '12:00', [['א', 1]], 'bit', 'cancelled'),
    appt('2026-09-21', '12:00', [['א', 1]], 'bit', 'pending'),
  ];
  const r = L.reminderStatus(d, '2026-09-20');
  assert.equal(r.total, 3);
  assert.equal(r.notSent, 1);
  assert.equal(r.notConfirmed, 2);
  assert.equal(r.needAttention, 2);
  assert.deepEqual(r.list.map((a) => a.time), ['09:00', '10:00', '11:00']);
});

test('אינדקס לקוחות וחיפוש', () => {
  const d = [
    { ...appt('2026-09-01', '10:00', [['א', 100]], 'bit', 'confirmed'), clientName: 'דנה לוי', phone: '050-1111111' },
    { ...appt('2026-09-10', '10:00', [['א', 150]], 'bit', 'cancelled'), clientName: ' דנה  לוי', phone: '' },
    { ...appt('2026-09-05', '10:00', [['א', 200]], 'bit', 'confirmed'), clientName: 'רותם', phone: '052-2222222' },
  ];
  const cs = L.clientsIndex(d);
  assert.equal(cs.length, 2);
  const dana = cs.find((c) => c.key === 'דנה לוי');
  assert.equal(dana.visits, 1);
  assert.equal(dana.total, 100);
  assert.equal(dana.phone, '050-1111111');
  assert.equal(dana.lastDate, '2026-09-10');
  assert.equal(L.searchClients(cs, 'דנ').length, 1);
  assert.equal(L.searchClients(cs, '2222').length, 1);
  assert.equal(L.searchClients(cs, '').length, 2);
});

test('מעבר בין חודשים', () => {
  assert.equal(L.addMonths('2026-01-31', 1), '2026-02-01');
  assert.equal(L.addMonths('2026-12-15', 1), '2027-01-01');
  assert.equal(L.addMonths('2026-01-15', -1), '2025-12-01');
  assert.equal(L.monthEnd('2028-02-10'), '2028-02-29');
});

test('ייבוא אנשי קשר מקובץ vCard של אייפון', () => {
  const vcf = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:כהן;רותם;;;', 'FN:רותם כהן',
    'item1.TEL;type=pref:02-6543210',
    'TEL;type=CELL;type=VOICE:+972 52-765-4321',
    'END:VCARD',
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:לוי;מיכל;;;',                                   // בלי FN — השם נבנה מ-N
    'TEL;type=HOME:04-1234567',
    'END:VCARD',
    'BEGIN:VCARD', 'VERSION:3.0',
    'FN:בלי טלפון', 'END:VCARD',                        // מדלגים
    'BEGIN:VCARD', 'VERSION:3.0',
    'ORG:מספרת יופי\\, בע"מ;',                          // רק שם עסק
    'TEL:050-1112222', 'END:VCARD',
    'BEGIN:VCARD', 'VERSION:3.0',
    'FN:רותם כהן', 'TEL;type=CELL:052-7654321', 'END:VCARD',   // כפילות
    'BEGIN:VCARD', 'VERSION:3.0',
    'FN:שם ארוך מאוד',
    ' שמתקפל', 'TEL;type=CELL:054-9',
    ' 876543', 'END:VCARD',
  ].join('\r\n');
  assert.deepEqual(L.parseVCards(vcf), [
    { name: 'רותם כהן', phone: '+972 52-765-4321' },
    { name: 'מיכל לוי', phone: '04-1234567' },
    { name: 'מספרת יופי, בע"מ', phone: '050-1112222' },
    { name: 'רותם כהן', phone: '052-7654321' },
    { name: 'שם ארוך מאודשמתקפל', phone: '054-9876543' },
  ]);
});

test('ייבוא vCard 2.1 בקידוד quoted-printable (אנדרואיד)', () => {
  const heb = Buffer.from('דנה', 'utf8').toString('hex').toUpperCase().match(/../g).map((b) => '=' + b).join('');
  const vcf = `BEGIN:VCARD\nVERSION:2.1\nFN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:${heb}\nTEL;CELL:0501234567\nEND:VCARD\n`;
  assert.deepEqual(L.parseVCards(vcf), [{ name: 'דנה', phone: '0501234567' }]);
  assert.deepEqual(L.parseVCards('not a vcard'), []);
});

test('מזומן ישן עדיין נספר בנפרד, וביט הוא אמצעי התשלום החדש', () => {
  const d = [
    appt('2026-09-01', '10:00', [['א', 100]], 'cash', 'confirmed'),
    appt('2026-09-01', '11:00', [['א', 50]], 'bit', 'confirmed'),
  ];
  const s = L.daySummary(d, '2026-09-01');
  assert.equal(s.byPayment.cash, 100);
  assert.equal(s.byPayment.bit, 50);
  assert.equal(L.paymentLabel('cash'), 'מזומן');
  assert.equal(L.paymentLabel('bit'), 'ביט');
  assert.ok(!L.PAYMENTS.some((p) => p.id === 'cash'));
});

test('תתי-סוגים ותכשירים: סכומים, כמויות ופירוט', () => {
  const a = {
    id: 'p1', clientName: 'נועה', date: '2026-09-02', time: '10:00', status: 'confirmed', payment: 'bit',
    items: [
      { kind: 'treatment', typeId: 't-hair', name: 'הסרת שיער', sub: 'רגליים', price: 200, duration: 40 },
      { kind: 'treatment', typeId: 't-hair', name: 'הסרת שיער', sub: 'בית שחי', price: 60, duration: 10 },
      { kind: 'treatment', typeId: 't-face', name: 'טיפול פנים', sub: 'פילינג', price: 300, duration: 60 },
      { kind: 'product', name: 'קרם לחות', price: 120, qty: 2 },
      { kind: 'product', name: 'סרום', price: 90 },
    ],
  };
  const b = { ...a, id: 'p2', items: [{ kind: 'treatment', typeId: 't-hair', name: 'הסרת שיער', sub: 'רגליים', price: 180 }, { kind: 'treatment', typeId: 't-hair', name: 'הסרת שיער', price: 100 }] };
  const cancelled = { ...a, id: 'p3', status: 'cancelled' };
  assert.equal(L.apptTotal(a), 200 + 60 + 300 + 240 + 90);
  assert.equal(L.treatmentNames(a), 'הסרת שיער – רגליים, הסרת שיער – בית שחי וטיפול פנים – פילינג');
  assert.equal(L.productNames(a), 'קרם לחות ×2, סרום');

  const s = L.daySummary([a, b, cancelled], '2026-09-02');
  assert.equal(s.total, 890 + 180 + 100);
  assert.equal(s.productsTotal, 330);
  assert.equal(s.byPayment.bit, 1170);
  const hair = s.byType.find((t) => t.name === 'הסרת שיער');
  assert.deepEqual([hair.count, hair.total], [4, 540]);
  assert.deepEqual(hair.subs, [
    { name: 'רגליים', count: 2, total: 380 },
    { name: 'כללי', count: 1, total: 100 },
    { name: 'בית שחי', count: 1, total: 60 },
  ]);
  assert.equal(hair.subs.reduce((x, r) => x + r.total, 0), hair.total);
  // סוג בלי תתי-סוגים לא מקבל פירוט
  assert.deepEqual(L.daySummary([{ ...a, items: [{ name: 'עיצוב גבות', price: 80 }] }], '2026-09-02').byType[0].subs, []);
  assert.deepEqual(s.byProduct, [
    { name: 'קרם לחות', count: 2, total: 240 },
    { name: 'סרום', count: 1, total: 90 },
  ]);
  // סכום כל השורות שווה לסך הכול
  const parts = s.byType.reduce((x, t) => x + t.total, 0) + s.byProduct.reduce((x, p) => x + p.total, 0);
  assert.equal(parts, s.total);
  // תזכורת בוואטסאפ מזכירה רק טיפולים, לא תכשירים
  assert.equal(L.fillTemplate('{טיפול}', b, ''), 'הסרת שיער – רגליים והסרת שיער');
});

test('קובץ ליומן האייפון: שעה מקומית, התראה ושורות מקופלות', () => {
  const a = {
    id: 'abc', clientName: 'דנה לוי', phone: '050-1234567', date: '2026-09-20', time: '09:30', duration: 45,
    items: [{ name: 'טיפול פנים', sub: 'ניקוי עמוק', price: 250 }], notes: 'עור רגיש, להיזהר; תודה',
  };
  const ics = L.buildICS([a], { alarmMinutes: 15, businessName: 'סימה חן', now: new Date(Date.UTC(2026, 8, 19, 8, 0, 0)) });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.includes('DTSTART:20260920T093000\r\n'));
  assert.ok(ics.includes('DTEND:20260920T101500\r\n'));
  assert.ok(ics.includes('TRIGGER:-PT15M'));
  assert.ok(ics.includes('UID:abc@sima-calendar'));
  // כל שורה עד 75 בתים
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, line);
  // אחרי פתיחת הקיפול, התוכן המקורי שלם ומוגן מתווים מיוחדים
  const unfolded = ics.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('SUMMARY:דנה לוי – טיפול פנים – ניקוי עמוק'));
  assert.ok(unfolded.includes(String.raw`עור רגיש\, להיזהר\; תודה`));
  assert.ok(!L.buildICS([a], { alarmMinutes: 0 }).includes('VALARM'));
});
