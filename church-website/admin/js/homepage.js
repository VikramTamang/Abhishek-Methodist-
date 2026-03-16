// homepage.js — Load and save homepage & about content
document.addEventListener('sectionShown', async ({ detail: { section } }) => {
  if (section === 'homepage') await loadHomepage();
  if (section === 'about') await loadAbout();
});

async function loadHomepage() {
  try {
    const res = await API.get('/api/content');
    if (!res.success) return;
    const d = res.data;
    ['heroTitle','heroSubtitle','heroBadge','heroSaturday',
     'pastorName','pastorTitle','pastorQuote','pastorMessage1','pastorMessage2',
     'fellowshipTitle','fellowshipDesc','eventBannerText',
     'memberCount','yearsOfService','branchCount'].forEach(k => {
      const el = document.getElementById(k);
      if (el) el.value = d[k] ?? '';
    });
  } catch (e) { showToast('Failed to load homepage data.', 'error'); }
}

document.getElementById('saveHomepage')?.addEventListener('click', async () => {
  const payload = {};
  ['heroTitle','heroSubtitle','heroBadge','heroSaturday',
   'pastorName','pastorTitle','pastorQuote','pastorMessage1','pastorMessage2',
   'fellowshipTitle','fellowshipDesc','eventBannerText',
   'memberCount','yearsOfService','branchCount'].forEach(k => {
    const el = document.getElementById(k);
    if (el) payload[k] = el.type === 'number' ? Number(el.value) : el.value;
  });
  try {
    const res = await API.put('/api/content', payload);
    if (res.success) showToast('Homepage saved successfully!');
    else showToast(res.error || 'Save failed.', 'error');
  } catch { showToast('Save failed.', 'error'); }
});

async function loadAbout() {
  try {
    const res = await API.get('/api/content');
    if (!res.success) return;
    const d = res.data;
    ['visionText','missionText','valuesText','spiritText'].forEach(k => {
      const el = document.getElementById(k);
      if (el) el.value = d[k] ?? '';
    });
  } catch { showToast('Failed to load About data.', 'error'); }
}
