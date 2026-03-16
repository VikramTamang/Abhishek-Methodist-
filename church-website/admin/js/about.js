// about.js — Save About section
document.getElementById('saveAbout')?.addEventListener('click', async () => {
  const payload = {};
  ['visionText','missionText','valuesText','spiritText'].forEach(k => {
    const el = document.getElementById(k);
    if (el) payload[k] = el.value;
  });
  try {
    const res = await API.put('/api/content', payload);
    if (res.success) showToast('About section saved!');
    else showToast(res.error || 'Save failed.', 'error');
  } catch { showToast('Save failed.', 'error'); }
});
