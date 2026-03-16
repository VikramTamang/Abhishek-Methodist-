// history.js — History milestone CRUD
let historyItems = [];
let editingHistoryId = null;

document.addEventListener('sectionShown', ({ detail: { section } }) => {
  if (section === 'history') loadHistory();
});

async function loadHistory() {
  const res = await API.get('/api/history');
  historyItems = res.data || [];
  renderHistoryTable();
}

function renderHistoryTable() {
  const tbody = document.getElementById('historyBody');
  if (!historyItems.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px">No history milestones yet. Click "Add Milestone".</td></tr>';
    return;
  }
  tbody.innerHTML = historyItems.map(item => `
    <tr>
      <td><strong>${item.year}</strong></td>
      <td>${item.title}</td>
      <td>${item.tag || '—'}</td>
      <td>
        <button class="btn-edit" onclick="editHistory('${item._id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-delete" onclick="deleteHistory('${item._id}', '${item.title.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addHistoryBtn').addEventListener('click', () => {
  editingHistoryId = null;
  clearHistoryForm();
  document.getElementById('historyFormTitle').textContent = 'Add Milestone';
  document.getElementById('historyForm').classList.remove('hidden');
  document.getElementById('historyForm').scrollIntoView({ behavior: 'smooth' });
});

window.editHistory = function(id) {
  editingHistoryId = id;
  const item = historyItems.find(h => h._id === id);
  if (!item) return;
  document.getElementById('historyId').value = id;
  document.getElementById('hYear').value = item.year || '';
  document.getElementById('hTitle').value = item.title || '';
  document.getElementById('hTag').value = item.tag || '';
  document.getElementById('hOrder').value = item.order || 0;
  document.getElementById('hQuote').value = item.pullQuote || '';
  document.getElementById('hDesc1').value = item.description1 || '';
  document.getElementById('hDesc2').value = item.description2 || '';
  document.getElementById('hImage').value = item.image || '';
  const prev = document.getElementById('hImagePreview');
  if (item.image) { prev.src = item.image; prev.classList.remove('hidden'); }
  else { prev.classList.add('hidden'); }
  document.getElementById('historyFormTitle').textContent = 'Edit Milestone';
  document.getElementById('historyForm').classList.remove('hidden');
  document.getElementById('historyForm').scrollIntoView({ behavior: 'smooth' });
};

window.deleteHistory = async function(id, title) {
  const ok = await showConfirm('Delete Milestone?', `"${title}" will be permanently deleted.`);
  if (!ok) return;
  try {
    await API.del(`/api/history/${id}`);
    showToast('Milestone deleted.');
    loadHistory();
  } catch { showToast('Delete failed.', 'error'); }
};

document.getElementById('saveHistoryBtn').addEventListener('click', async () => {
  const payload = {
    year: document.getElementById('hYear').value,
    title: document.getElementById('hTitle').value,
    tag: document.getElementById('hTag').value,
    order: Number(document.getElementById('hOrder').value),
    pullQuote: document.getElementById('hQuote').value,
    description1: document.getElementById('hDesc1').value,
    description2: document.getElementById('hDesc2').value,
    image: document.getElementById('hImage').value,
  };
  if (!payload.year || !payload.title) { showToast('Year and Title are required.', 'error'); return; }
  try {
    const res = editingHistoryId
      ? await API.put(`/api/history/${editingHistoryId}`, payload)
      : await API.post('/api/history', payload);
    if (res.success) {
      showToast(editingHistoryId ? 'Milestone updated!' : 'Milestone added!');
      document.getElementById('historyForm').classList.add('hidden');
      clearHistoryForm();
      loadHistory();
    } else { showToast(res.error || 'Save failed.', 'error'); }
  } catch { showToast('Save failed.', 'error'); }
});

document.getElementById('cancelHistory').addEventListener('click', () => {
  document.getElementById('historyForm').classList.add('hidden');
  clearHistoryForm();
});

function clearHistoryForm() {
  ['historyId','hYear','hTitle','hTag','hQuote','hDesc1','hDesc2','hImage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('hOrder').value = 0;
  const prev = document.getElementById('hImagePreview');
  prev.src = ''; prev.classList.add('hidden');
  editingHistoryId = null;
}

// Inline image upload
handleInlineUpload(
  document.getElementById('hImageFile'),
  document.getElementById('hImage'),
  document.getElementById('hImagePreview')
);
