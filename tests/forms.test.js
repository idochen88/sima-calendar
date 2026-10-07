// הרצה: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../js/forms.js');

test('מזהי הטפסים ייחודיים ויש להם שם', () => {
  const ids = F.FORMS.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => /^[a-z]+$/.test(id) && id.length < 40));
  assert.ok(F.FORMS.every((f) => f.title));
});

test('כל טופס שלם: פרטים, שאלות, הסכמות', () => {
  for (const f of F.FORMS) {
    assert.ok(f.personal.includes('name') && f.personal.includes('phone') && f.personal.includes('birth'), f.id + ': חסר שם/טלפון/תאריך לידה');
    assert.ok(f.sections.length && f.agreements.length, f.id);
    for (const s of f.sections) {
      assert.ok(s.title && s.items.length, f.id + ': סעיף ריק');
      for (const it of s.items) {
        assert.ok(['yn', 'check', 'text'].includes(it.k), f.id + ': סוג לא מוכר ' + it.k);
        assert.ok(it.q && it.q.trim(), f.id + ': שאלה ריקה');
        if (it.detail) assert.ok(['opt', 'req'].includes(it.detail));
        if (it.flag !== undefined) assert.ok(['yes', 'no', false].includes(it.flag));
        if (it.detailWhen) assert.ok(['yes', 'no'].includes(it.detailWhen));
      }
    }
    const keys = f.agreements.map((a) => a.key);
    assert.equal(new Set(keys).size, keys.length, f.id + ': מפתחות הסכמה כפולים');
    for (const a of f.agreements) assert.ok(a.title && a.confirm && (a.items || a.text), f.id + ':' + a.key);
  }
});

test('formById', () => {
  assert.equal(F.formById('face').title, 'אנמנזה טיפולי פנים');
  assert.equal(F.formById('pm').guardianAge, 18);
  assert.equal(F.formById('nope'), null);
});
