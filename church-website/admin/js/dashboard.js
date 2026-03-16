// dashboard.js — Core dashboard: session guard, sidebar, navigation, toast, confirm modal
(async function () {
  // ── Session guard ─────────────────────────────────────────────────────────
  try {
    const check = await API.get('/api/auth/check');
    if (!check.success) { window.location.href = '/admin/index.html'; return; }
    document.getElementById('adminEmail').textContent = check.admin;
  } catch {
    window.location.href = '/admin/index.html'; return;
  }

  // ── Sidebar toggle ────────────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebar.classList.toggle('collapsed');
    mainWrapper.classList.toggle('expanded');
  });

  // ── Section navigation ────────────────────────────────────────────────────
  const sections = document.querySelectorAll('.dash-section');
  const navItems = document.querySelectorAll('.nav-item');
  const topbarTitle = document.getElementById('topbarTitle');

  const sectionTitles = {
    overview: 'Dashboard Overview', homepage: 'Homepage Content',
    about: 'About the Church', history: 'Church History',
    branches: 'Church Branches', testimonies: 'Testimonies',
    contact: 'Contact Information', media: 'Media Library'
  };

  function showSection(name) {
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    const target = document.getElementById(`section-${name}`);
    if (target) target.classList.add('active');
    navItems.forEach(n => { if (n.dataset.section === name) n.classList.add('active'); });
    topbarTitle.textContent = sectionTitles[name] || name;
    // Trigger load for each section
    const ev = new CustomEvent('sectionShown', { detail: { section: name } });
    document.dispatchEvent(ev);
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); showSection(item.dataset.section); });
  });

  // Overview quick-nav cards
  document.querySelectorAll('.ov-card').forEach(card => {
    card.addEventListener('click', () => showSection(card.dataset.section));
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await API.post('/api/auth/logout', {});
    window.location.href = '/admin/index.html';
  });

  // ── Toast notification ────────────────────────────────────────────────────
  window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast${type === 'error' ? ' error' : ''}`;
    toast.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
  };

  // ── Confirm modal ─────────────────────────────────────────────────────────
  window.showConfirm = function(title, msg) {
    return new Promise(resolve => {
      const modal = document.getElementById('confirmModal');
      document.getElementById('confirmTitle').textContent = title;
      document.getElementById('confirmMsg').textContent = msg;
      modal.classList.remove('hidden');
      const ok = document.getElementById('confirmOk');
      const cancel = document.getElementById('confirmCancel');
      function cleanup(val) {
        modal.classList.add('hidden');
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        resolve(val);
      }
      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }
      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', onCancel);
    });
  };

  // ── Upload helper (inline file inputs) ───────────────────────────────────
  window.handleInlineUpload = function(fileInput, urlInput, previewEl) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      showToast('Uploading image…');
      try {
        const res = await API.upload('/api/media/upload', fd);
        if (res.success) {
          urlInput.value = res.url;
          previewEl.src = res.url; previewEl.classList.remove('hidden');
          showToast('Image uploaded!');
        } else { showToast(res.message || 'Upload failed.', 'error'); }
      } catch { showToast('Upload error.', 'error'); }
    });
  };

  // Load overview by default
  showSection('overview');
})();
