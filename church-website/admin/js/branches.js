// branches.js — Branches CRUD
let branchItems = [];
let editingBranchId = null;

document.addEventListener('sectionShown', ({ detail: { section } }) => {
  if (section === 'branches') loadBranches();
});

async function loadBranches() {
  const res = await API.get('/api/branches');
  branchItems = res.data || [];
  renderBranchTable();
}

function renderBranchTable() {
  const tbody = document.getElementById('branchBody');
  if (!branchItems.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No branches yet.</td></tr>';
    return;
  }
  tbody.innerHTML = branchItems.map(b => `
    <tr>
      <td><strong>${b.name}</strong></td>
      <td>${b.tag || '—'}</td>
      <td>${b.location || '—'}</td>
      <td>${b.schedule || '—'}</td>
      <td>${b.phone || '—'}</td>
      <td>
        <button class="btn-edit" onclick="editBranch('${b._id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-delete" onclick="deleteBranch('${b._id}', '${b.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addBranchBtn').addEventListener('click', () => {
  editingBranchId = null;
  clearBranchForm();
  document.getElementById('branchFormTitle').textContent = 'Add Branch';
  document.getElementById('branchForm').classList.remove('hidden');
  document.getElementById('branchForm').scrollIntoView({ behavior: 'smooth' });
});

window.editBranch = function(id) {
  editingBranchId = id;
  const b = branchItems.find(x => x._id === id);
  if (!b) return;
  document.getElementById('branchId').value = id;
  document.getElementById('bName').value = b.name || '';
  document.getElementById('bTag').value = b.tag || '';
  document.getElementById('bLocation').value = b.location || '';
  document.getElementById('bSchedule').value = b.schedule || '';
  document.getElementById('bPhone').value = b.phone || '';
  document.getElementById('bOrder').value = b.order || 0;
  document.getElementById('bColor').value = b.colorClass || 'branch-blue';
  document.getElementById('bImage').value = b.image || '';
  const prev = document.getElementById('bImagePreview');
  if (b.image) { prev.src = b.image; prev.classList.remove('hidden'); }
  else prev.classList.add('hidden');
  document.getElementById('branchFormTitle').textContent = 'Edit Branch';
  document.getElementById('branchForm').classList.remove('hidden');
  document.getElementById('branchForm').scrollIntoView({ behavior: 'smooth' });
};

window.deleteBranch = async function(id, name) {
  const ok = await showConfirm('Delete Branch?', `"${name}" will be permanently deleted.`);
  if (!ok) return;
  await API.del(`/api/branches/${id}`);
  showToast('Branch deleted.');
  loadBranches();
};

document.getElementById('saveBranchBtn').addEventListener('click', async () => {
  const payload = {
    name: document.getElementById('bName').value,
    tag: document.getElementById('bTag').value,
    location: document.getElementById('bLocation').value,
    schedule: document.getElementById('bSchedule').value,
    phone: document.getElementById('bPhone').value,
    order: Number(document.getElementById('bOrder').value),
    colorClass: document.getElementById('bColor').value,
    image: document.getElementById('bImage').value,
  };
  if (!payload.name) { showToast('Branch name is required.', 'error'); return; }
  const res = editingBranchId
    ? await API.put(`/api/branches/${editingBranchId}`, payload)
    : await API.post('/api/branches', payload);
  if (res.success) {
    showToast(editingBranchId ? 'Branch updated!' : 'Branch added!');
    document.getElementById('branchForm').classList.add('hidden');
    clearBranchForm();
    loadBranches();
  } else showToast(res.error || 'Save failed.', 'error');
});

document.getElementById('cancelBranch').addEventListener('click', () => {
  document.getElementById('branchForm').classList.add('hidden');
  clearBranchForm();
});

function clearBranchForm() {
  ['branchId','bName','bTag','bLocation','bSchedule','bPhone','bImage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('bOrder').value = 0;
  document.getElementById('bColor').value = 'branch-blue';
  const prev = document.getElementById('bImagePreview');
  prev.src = ''; prev.classList.add('hidden');
  editingBranchId = null;
}

handleInlineUpload(
  document.getElementById('bImageFile'),
  document.getElementById('bImage'),
  document.getElementById('bImagePreview')
);
