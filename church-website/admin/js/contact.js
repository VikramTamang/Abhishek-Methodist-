// contact.js — Contact Info editor
document.addEventListener('sectionShown', ({ detail: { section } }) => {
  if (section === 'contact') loadContact();
});

async function loadContact() {
  try {
    const res = await API.get('/api/contact');
    if (!res.success) return;
    const d = res.data;
    const map = { address:'cAddress', phone:'cPhone', email:'cEmail', serviceTime:'cServiceTime',
                  mapUrl:'cMapUrl', facebook:'cFacebook', youtube:'cYoutube',
                  instagram:'cInstagram', whatsapp:'cWhatsapp' };
    Object.entries(map).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.value = d[key] || '';
    });
  } catch { showToast('Failed to load contact data.', 'error'); }
}

document.getElementById('saveContact')?.addEventListener('click', async () => {
  const map = { address:'cAddress', phone:'cPhone', email:'cEmail', serviceTime:'cServiceTime',
                mapUrl:'cMapUrl', facebook:'cFacebook', youtube:'cYoutube',
                instagram:'cInstagram', whatsapp:'cWhatsapp' };
  const payload = {};
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) payload[key] = el.value;
  });
  try {
    const res = await API.put('/api/contact', payload);
    if (res.success) showToast('Contact info saved!');
    else showToast(res.error || 'Save failed.', 'error');
  } catch { showToast('Save failed.', 'error'); }
});
