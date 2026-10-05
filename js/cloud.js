/*
 * "תיבת דואר" בענן (Firebase Firestore) להצהרות שהלקוחות שולחות.
 * הטופס רק כותב לתיבה. רק האפליקציה, אחרי התחברות, יכולה לקרוא ולמחוק.
 * עובד דרך ה-REST API, בלי ספריות חיצוניות.
 */
(function (root) {
  'use strict';

  // הגדרות הפרויקט ב-Firebase. אלה לא נתונים סודיים; ההגנה היא בכללי האבטחה (firestore.rules).
  const CONFIG = {
    apiKey: 'AIzaSyA8srk8Dl8mnLn-XN8xBcjAf0cDD908CsA',
    projectId: 'sima-calendar-a3579',
  };

  const COLLECTION = 'declarations';
  const configured = () => !!(CONFIG.apiKey && CONFIG.projectId);
  const docsUrl = () => `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/(default)/documents`;
  const JSON_HEADERS = { 'Content-Type': 'application/json' };

  async function readError(res) {
    try {
      const d = await res.json();
      return (d.error && (d.error.message || d.error.status)) || String(res.status);
    } catch (e) {
      return String(res.status);
    }
  }

  // שליחת טופס מלא (בלי התחברות)
  async function submit(formId, payload) {
    const body = {
      fields: {
        formId: { stringValue: formId },
        payload: { stringValue: JSON.stringify(payload) },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    };
    const res = await fetch(`${docsUrl()}/${COLLECTION}?key=${CONFIG.apiKey}`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await readError(res));
  }

  // התחברות בעלת העסק. מחזיר "חיבור" שנשמר בטלפון (בלי הסיסמה).
  async function signIn(email, password) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CONFIG.apiKey}`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    if (!res.ok) throw new Error(await readError(res));
    const d = await res.json();
    return {
      uid: d.localId, email: d.email, refreshToken: d.refreshToken,
      idToken: d.idToken, expiresAt: Date.now() + (Number(d.expiresIn) - 120) * 1000,
    };
  }

  // מחדש את אסימון הגישה כשפג (פעם בשעה). מחזיר חיבור מעודכן.
  async function fresh(session) {
    if (session.idToken && session.expiresAt > Date.now()) return session;
    const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${CONFIG.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(session.refreshToken)}`,
    });
    if (!res.ok) {
      const err = new Error(await readError(res));
      err.auth = true;
      throw err;
    }
    const d = await res.json();
    return {
      ...session, idToken: d.id_token, refreshToken: d.refresh_token,
      expiresAt: Date.now() + (Number(d.expires_in) - 120) * 1000,
    };
  }

  // כל ההצהרות שמחכות בתיבה: [{ name, id, formId, createdAt, payload }]
  async function list(session) {
    const out = [];
    let pageToken = '';
    do {
      const url = `${docsUrl()}/${COLLECTION}?pageSize=50${pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''}`;
      const res = await fetch(url, { headers: { Authorization: 'Bearer ' + session.idToken } });
      if (!res.ok) {
        const err = new Error(await readError(res));
        err.auth = res.status === 401 || res.status === 403;
        throw err;
      }
      const d = await res.json();
      (d.documents || []).forEach((doc) => {
        const f = doc.fields || {};
        let payload = null;
        try { payload = JSON.parse((f.payload && f.payload.stringValue) || 'null'); } catch (e) { /* פגום */ }
        out.push({
          name: doc.name,
          id: doc.name.split('/').pop(),
          formId: (f.formId && f.formId.stringValue) || '',
          createdAt: Date.parse((f.createdAt && f.createdAt.timestampValue) || doc.createTime) || Date.now(),
          payload,
        });
      });
      pageToken = d.nextPageToken || '';
    } while (pageToken);
    return out;
  }

  async function remove(session, name) {
    const res = await fetch(`https://firestore.googleapis.com/v1/${name}`, {
      method: 'DELETE', headers: { Authorization: 'Bearer ' + session.idToken },
    });
    if (!res.ok && res.status !== 404) throw new Error(await readError(res));
  }

  root.Cloud = { configured, submit, signIn, fresh, list, remove };
})(self);
