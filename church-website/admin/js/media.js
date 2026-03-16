// media.js — Media Library (upload, list, delete)
document.addEventListener('sectionShown', ({ detail: { section } }) => {
  if (section === 'media') initMedia();
});

let selectedFile = null;

function initMedia() {
  loadMediaGrid();

  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('mediaUploadInput');
  const previewWrap = document.getElementById('uploadPreviewWrap');
  const preview = document.getElementById('uploadPreview');
  const mediaUploadBtn = document.getElementById('mediaUploadBtn');

  mediaUploadBtn.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('click', (e) => {
    if (e.target === dropzone || e.target.tagName === 'P' || e.target.tagName === 'I') fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) showPreview(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) showPreview(fileInput.files[0]);
  });

  document.getElementById('cancelUploadBtn').addEventListener('click', () => {
    previewWrap.classList.add('hidden');
    dropzone.classList.remove('hidden');
    selectedFile = null;
    fileInput.value = '';
  });

  document.getElementById('doUploadBtn').addEventListener('click', async () => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append('image', selectedFile);
    showToast('Uploading…');
    try {
      const res = await API.upload('/api/media/upload', fd);
      if (res.success) {
        showToast('Image uploaded successfully!');
        previewWrap.classList.add('hidden');
        dropzone.classList.remove('hidden');
        selectedFile = null;
        fileInput.value = '';
        loadMediaGrid();
      } else showToast(res.message || 'Upload failed.', 'error');
    } catch { showToast('Upload error.', 'error'); }
  });

  function showPreview(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      dropzone.classList.add('hidden');
      previewWrap.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

async function loadMediaGrid() {
  const grid = document.getElementById('mediaGrid');
  grid.innerHTML = '<div class="media-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading images…</div>';
  try {
    const res = await API.get('/api/media/list');
    const files = res.data || [];
    if (!files.length) {
      grid.innerHTML = '<div class="media-loading">No images in the library yet.</div>';
      return;
    }
    grid.innerHTML = files.map(f => `
      <div class="media-item" data-filename="${f.filename}">
        <img src="${f.url}" alt="${f.filename}" loading="lazy"/>
        <div class="media-item-overlay">
          <button class="btn-copy" onclick="copyUrl('${f.url}')">Copy URL</button>
          <button class="media-del" onclick="deleteMedia('${f.filename}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch { grid.innerHTML = '<div class="media-loading">Failed to load images.</div>'; }
}

window.copyUrl = function(url) {
  navigator.clipboard.writeText(`http://localhost:3000${url}`).then(() => showToast('URL copied to clipboard!'));
};

window.deleteMedia = async function(filename) {
  const ok = await showConfirm('Delete Image?', `"${filename}" will be permanently deleted.`);
  if (!ok) return;
  const res = await API.del(`/api/media/${filename}`);
  if (res.success) { showToast('Image deleted.'); loadMediaGrid(); }
  else showToast(res.message || 'Delete failed.', 'error');
};
