// api.js — Shared fetch helper
const API = {
  async get(url) {
    const res = await fetch(url, { credentials: 'include' });
    return res.json();
  },
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async put(url, data) {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async del(url) {
    const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
    return res.json();
  },
  async upload(url, formData) {
    const res = await fetch(url, { method: 'POST', credentials: 'include', body: formData });
    return res.json();
  }
};
