/*
 * אחסון מקומי: IndexedDB, ואם הוא לא זמין — localStorage.
 */
(function (root) {
  'use strict';

  const DB_NAME = 'sima-calendar';
  const DB_VERSION = 3;
  const LS_KEY = 'sima-calendar-data';

  function reqToPromise(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function txDone(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  function idbAdapter(db) {
    return {
      kind: 'indexeddb',
      async getAll() {
        const tx = db.transaction(['appointments', 'kv'], 'readonly');
        const appointments = await reqToPromise(tx.objectStore('appointments').getAll());
        const settings = await reqToPromise(tx.objectStore('kv').get('settings'));
        const meta = await reqToPromise(tx.objectStore('kv').get('meta'));
        const contacts = await reqToPromise(tx.objectStore('kv').get('contacts'));
        return { appointments, settings, meta, contacts };
      },
      async putAppointment(a) {
        const tx = db.transaction('appointments', 'readwrite');
        tx.objectStore('appointments').put(a);
        return txDone(tx);
      },
      async deleteAppointment(id) {
        const tx = db.transaction('appointments', 'readwrite');
        tx.objectStore('appointments').delete(id);
        return txDone(tx);
      },
      async setKV(key, value) {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(value, key);
        return txDone(tx);
      },
      async replaceAll({ appointments, settings, meta }) {
        const tx = db.transaction(['appointments', 'kv'], 'readwrite');
        const store = tx.objectStore('appointments');
        store.clear();
        appointments.forEach((a) => store.put(a));
        tx.objectStore('kv').put(settings, 'settings');
        tx.objectStore('kv').put(meta || {}, 'meta');
        return txDone(tx);
      },
      // תמונות לפני/אחרי של לקוחות: { id, clientKey, clientName, date, createdAt, data (dataURL) }
      async getPhotos(clientKey) {
        const tx = db.transaction('photos', 'readonly');
        return reqToPromise(tx.objectStore('photos').index('clientKey').getAll(clientKey));
      },
      async getAllPhotos() {
        const tx = db.transaction('photos', 'readonly');
        return reqToPromise(tx.objectStore('photos').getAll());
      },
      async putPhoto(p) {
        const tx = db.transaction('photos', 'readwrite');
        tx.objectStore('photos').put(p);
        return txDone(tx);
      },
      async deletePhoto(id) {
        const tx = db.transaction('photos', 'readwrite');
        tx.objectStore('photos').delete(id);
        return txDone(tx);
      },
      async replacePhotos(list) {
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        store.clear();
        list.forEach((p) => store.put(p));
        return txDone(tx);
      },
      // הצהרות בריאות שהתקבלו מהטופס
      async getDeclarations() {
        const tx = db.transaction('declarations', 'readonly');
        return reqToPromise(tx.objectStore('declarations').getAll());
      },
      async putDeclaration(d) {
        const tx = db.transaction('declarations', 'readwrite');
        tx.objectStore('declarations').put(d);
        return txDone(tx);
      },
      async deleteDeclaration(id) {
        const tx = db.transaction('declarations', 'readwrite');
        tx.objectStore('declarations').delete(id);
        return txDone(tx);
      },
      async replaceDeclarations(list) {
        const tx = db.transaction('declarations', 'readwrite');
        const store = tx.objectStore('declarations');
        store.clear();
        list.forEach((d) => store.put(d));
        return txDone(tx);
      },
    };
  }

  function lsAdapter() {
    const read = () => {
      try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
    };
    const write = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
    return {
      kind: 'localstorage',
      async getAll() {
        const d = read();
        return { appointments: d.appointments || [], settings: d.settings, meta: d.meta, contacts: d.contacts };
      },
      async putAppointment(a) {
        const d = read();
        d.appointments = (d.appointments || []).filter((x) => x.id !== a.id).concat(a);
        write(d);
      },
      async deleteAppointment(id) {
        const d = read();
        d.appointments = (d.appointments || []).filter((x) => x.id !== id);
        write(d);
      },
      async setKV(key, value) {
        const d = read();
        d[key] = value;
        write(d);
      },
      async replaceAll(data) {
        const d = read(); // אנשי הקשר נשמרים, רק הטיפולים וההגדרות מוחלפים
        write({ ...d, appointments: data.appointments, settings: data.settings, meta: data.meta || {} });
      },
      async getPhotos(clientKey) {
        return (read().photos || []).filter((p) => p.clientKey === clientKey);
      },
      async getAllPhotos() {
        return read().photos || [];
      },
      async putPhoto(p) {
        const d = read();
        d.photos = (d.photos || []).filter((x) => x.id !== p.id).concat(p);
        write(d);
      },
      async deletePhoto(id) {
        const d = read();
        d.photos = (d.photos || []).filter((x) => x.id !== id);
        write(d);
      },
      async replacePhotos(list) {
        const d = read();
        d.photos = list;
        write(d);
      },
      async getDeclarations() {
        return read().declarations || [];
      },
      async putDeclaration(x) {
        const d = read();
        d.declarations = (d.declarations || []).filter((y) => y.id !== x.id).concat(x);
        write(d);
      },
      async deleteDeclaration(id) {
        const d = read();
        d.declarations = (d.declarations || []).filter((y) => y.id !== id);
        write(d);
      },
      async replaceDeclarations(list) {
        const d = read();
        d.declarations = list;
        write(d);
      },
    };
  }

  function openIDB() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) { reject(new Error('no indexedDB')); return; }
      const req = root.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('appointments')) {
          db.createObjectStore('appointments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' }).createIndex('clientKey', 'clientKey');
        }
        if (!db.objectStoreNames.contains('declarations')) db.createObjectStore('declarations', { keyPath: 'id' });
      };
      req.onsuccess = () => {
        const db = req.result;
        // גרסה חדשה של האפליקציה נפתחה בלשונית אחרת — משחררים כדי לא לחסום את השדרוג שלה
        db.onversionchange = () => { db.close(); location.reload(); };
        resolve(db);
      };
      req.onerror = () => reject(req.error);
      // שדרוג מסד הנתונים מחכה שגרסה ישנה שפתוחה בלשונית אחרת תיסגר.
      // לא עוברים ל-localStorage במקרה כזה, אחרת האפליקציה תיפתח בלי הנתונים.
      req.onblocked = () => console.warn('indexedDB upgrade waiting for another tab to close');
    });
  }

  async function open() {
    try {
      const db = await openIDB();
      return idbAdapter(db);
    } catch (e) {
      console.warn('IndexedDB לא זמין, עובר ל-localStorage', e);
      return lsAdapter();
    }
  }

  // מבקש מהדפדפן לא למחוק את הנתונים כשחסר מקום
  async function requestPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        if (await navigator.storage.persisted()) return true;
        return await navigator.storage.persist();
      }
    } catch (e) { /* לא נתמך */ }
    return false;
  }

  root.DB = { open, requestPersistence };
})(self);
