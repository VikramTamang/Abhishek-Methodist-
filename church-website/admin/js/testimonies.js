// testimonies.js — Testimonies CRUD
let testimonies = [];
let editingTestimonyId = null;

document.addEventListener('sectionShown', ({ detail: { section } }) => {
  if (section === 'testimonies') loadTestimonies();
});

async function loadTestimonies() {
  const res = await API.get('/api/testimonies');
  testimonies = res.data || [];
  renderTestimonyTable();
}

function renderTestimonyTable() {
  const tbody = document.getElementById('testimonyBody');
  if (!testimonies.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px">No testimonies yet.</td></tr>';
    return;
  }
  tbody.innerHTML = testimonies.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td>${t.role || '—'}</td>
      <td class="tbl-preview">${t.message}</td>
      <td>
        <button class="btn-edit" onclick="editTestimony('${t._id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-delete" onclick="deleteTestimony('${t._id}', '${t.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addTestimonyBtn').addEventListener('click', () => {
  editingTestimonyId = null;
  clearTestimonyForm();
  document.getElementById('testimonyFormTitle').textContent = 'Add Testimony';
  document.getElementById('testimonyForm').classList.remove('hidden');
  document.getElementById('testimonyForm').scrollIntoView({ behavior: 'smooth' });
});

window.editTestimony = function(id) {
  editingTestimonyId = id;
  const t = testimonies.find(x => x._id === id);
  if (!t) return;
  document.getElementById('testimonyId').value = id;
  document.getElementById('tName').value = t.name || '';
  document.getElementById('tRole').value = t.role || '';
  document.getElementById('tInitial').value = t.initial || '';
  document.getElementById('tMessage').value = t.message || '';
  document.getElementById('tOrder').value = t.order || 0;
  document.getElementById('tColor').value = t.avatarColor || 'linear-gradient(135deg, #1a56db, #3b82f6)';
  document.getElementById('testimonyFormTitle').textContent = 'Edit Testimony';
  document.getElementById('testimonyForm').classList.remove('hidden');
  document.getElementById('testimonyForm').scrollIntoView({ behavior: 'smooth' });
};

window.deleteTestimony = async function(id, name) {
  const ok = await showConfirm('Delete Testimony?', `Testimony by "${name}" will be permanently deleted.`);
  if (!ok) return;
  await API.del(`/api/testimonies/${id}`);
  showToast('Testimony deleted.');
  loadTestimonies();
};

document.getElementById('saveTestimonyBtn').addEventListener('click', async () => {
  const payload = {
    name: document.getElementById('tName').value,
    role: document.getElementById('tRole').value,
    initial: document.getElementById('tInitial').value,
    message: document.getElementById('tMessage').value,
    order: Number(document.getElementById('tOrder').value),
    avatarColor: document.getElementById('tColor').value,
  };
  if (!payload.name || !payload.message) { showToast('Name and message are required.', 'error'); return; }
  const res = editingTestimonyId
    ? await API.put(`/api/testimonies/${editingTestimonyId}`, payload)
    : await API.post('/api/testimonies', payload);
  if (res.success) {
    showToast(editingTestimonyId ? 'Testimony updated!' : 'Testimony added!');
    document.getElementById('testimonyForm').classList.add('hidden');
    clearTestimonyForm();
    loadTestimonies();
  } else showToast(res.error || 'Save failed.', 'error');
});

document.getElementById('cancelTestimony').addEventListener('click', () => {
  document.getElementById('testimonyForm').classList.add('hidden');
  clearTestimonyForm();
});

function clearTestimonyForm() {
  ['testimonyId','tName','tRole','tInitial','tMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('tOrder').value = 0;
  editingTestimonyId = null;
}
