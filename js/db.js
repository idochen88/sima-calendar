/*
 * אחסון מקומי: IndexedDB, ואם הוא לא זמין — localStorage.
 */
(function (root) {
  'use strict';

  const DB_NAME = 'sima-calendar';
  const DB_VERSION = 1;
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
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('indexedDB blocked'));
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
