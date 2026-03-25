const API_URL = 'https://abhishek-methodist-church.onrender.com';
let token = localStorage.getItem('adminToken');

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const toastEl = document.getElementById('toast');
const navItems = document.querySelectorAll('.nav-item');
const adminPanels = document.querySelectorAll('.admin-panel');

// Forms
const homeForm = document.getElementById('homeForm');
const aboutForm = document.getElementById('aboutForm');
const contactForm = document.getElementById('contactForm');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Utilities
function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;
    setTimeout(() => {
        toastEl.className = 'toast';
    }, 3000);
}

function showLogin() {
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'flex';
    // Auto-seed default content on first load (safe — won't overwrite existing data)
    seedDefaultContent(false);
    // Load all section data into forms
    loadHomeData();
    loadAboutData();
    loadContactData();
    loadSectionData('history', 'historyList');
    loadSectionData('branch', 'branchList');
    loadSectionData('testimony', 'testimonyList');
}

// Seed default content from static site into the database
async function seedDefaultContent(showResult = true) {
    try {
        const res = await fetch(`${API_URL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            if (showResult) {
                const data = await res.json();
                showToast('Default content loaded! Refreshing forms...', 'success');
                setTimeout(() => {
                    loadHomeData();
                    loadAboutData();
                    loadContactData();
                }, 500);
            }
        }
    } catch (e) {
        if (showResult) showToast('Could not connect to server', 'error');
    }
}

// Auth Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            token = data.token;
            localStorage.setItem('adminToken', token);
            document.getElementById('adminUserEmail').innerText = data.email || email;
            showDashboard();
            showToast('Login successful!');
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (err) {
        showToast('Server connection error', 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    token = null;
    showLogin();
    showToast('Logged out');
});

document.getElementById('seedBtn').addEventListener('click', () => {
    if (confirm('This will fill the database with the default website content (existing data will NOT be overwritten). Continue?')) {
        seedDefaultContent(true);
    }
});

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('data-target');
        adminPanels.forEach(panel => {
            panel.classList.remove('active-panel');
            if (panel.id === targetId) {
                panel.classList.add('active-panel');
            }
        });
        document.getElementById('pageTitle').innerText = item.innerText;
    });
});

// Fetch Single Content API Wrapper
async function fetchContent(endpoint) {
    try {
        const res = await fetch(`${API_URL}/content/${endpoint}`);
        return await res.json();
    } catch (e) {
        return null;
    }
}

// Update Single Content API Wrapper
async function updateContent(endpoint, payload) {
    try {
        const res = await fetch(`${API_URL}/content/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            showToast('Updated successfully');
        } else {
            const data = await res.json();
            showToast(data.message || 'Update failed', 'error');
        }
    } catch (e) {
        showToast('Network error', 'error');
    }
}

// ---------------- HOME ----------------
async function loadHomeData() {
    const data = await fetchContent('home');
    if (data) {
        document.getElementById('homeHeroTitle').value = data.heroTitle || '';
        document.getElementById('homeHeroSubtitle').value = data.heroSubtitle || '';
        document.getElementById('homePastorTitle').value = data.pastorMessageTitle || '';
        document.getElementById('homePastorBody').value = data.pastorMessageBody || '';
        document.getElementById('homeFellowshipInfo').value = data.fellowshipInfo || '';
    }
}

homeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateContent('home', {
        heroTitle: document.getElementById('homeHeroTitle').value,
        heroSubtitle: document.getElementById('homeHeroSubtitle').value,
        pastorMessageTitle: document.getElementById('homePastorTitle').value,
        pastorMessageBody: document.getElementById('homePastorBody').value,
        fellowshipInfo: document.getElementById('homeFellowshipInfo').value
    });
});

// ---------------- ABOUT ----------------
async function loadAboutData() {
    const data = await fetchContent('about');
    if (data) {
        document.getElementById('aboutDesc').value = data.description || '';
        document.getElementById('aboutMission').value = data.mission || '';
        document.getElementById('aboutVision').value = data.vision || '';
    }
}

aboutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateContent('about', {
        description: document.getElementById('aboutDesc').value,
        mission: document.getElementById('aboutMission').value,
        vision: document.getElementById('aboutVision').value
    });
});

// ---------------- CONTACT ----------------
async function loadContactData() {
    const data = await fetchContent('contact');
    if (data) {
        document.getElementById('contactAddress').value = data.address || '';
        document.getElementById('contactPhone').value = data.phone || '';
        document.getElementById('contactEmail').value = data.email || '';
        document.getElementById('contactMap').value = data.mapLocation || '';
    }
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateContent('contact', {
        address: document.getElementById('contactAddress').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        mapLocation: document.getElementById('contactMap').value
    });
});

// ---------------- DYNAMIC LISTS (HISTORY, BRANCH, TESTIMONY) ----------------
// Generic loader
async function loadSectionData(endpoint, containerId) {
    const data = await fetchContent(endpoint);
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach(item => {
            let title = item.title || item.name || 'Item';
            let subtitle = item.year || item.location || '';
            container.innerHTML += `
                <div class="data-item">
                    <div class="data-item-content">
                        <h4>${title}</h4>
                        <p>${subtitle}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-small btn-primary" onclick="editItem('${endpoint}', '${item._id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-small btn-danger" onclick="deleteItem('${endpoint}', '${item._id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    } else {
        container.innerHTML = '<p>No data found.</p>';
    }
}

async function deleteItem(endpoint, id) {
    if (confirm('Are you certain you want to delete this?')) {
        try {
            const res = await fetch(`${API_URL}/content/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                showToast('Deleted successfully');
                loadSectionData(endpoint, `${endpoint}List`);
            } else {
                showToast('Failed to delete', 'error');
            }
        } catch (e) { showToast('Error', 'error'); }
    }
}

// Modal handling
const itemModal = document.getElementById('itemModal');
const closeBtn = document.querySelector('.close-modal');
const modalForm = document.getElementById('modalForm');
const modalInputs = document.getElementById('modalInputs');

let currentModalMode = 'POST'; // or 'PUT'
let currentEndpoint = '';
let currentItemId = '';

closeBtn.onclick = () => itemModal.style.display = 'none';
window.onclick = (e) => { if (e.target == itemModal) itemModal.style.display = 'none'; };

function openModal(endpoint, mode = 'POST', id = '', data = {}) {
    currentModalMode = mode;
    currentEndpoint = endpoint;
    currentItemId = id;

    document.getElementById('modalTitle').innerText = mode === 'POST' ? `Add ${endpoint}` : `Edit ${endpoint}`;

    let html = '';
    if (endpoint === 'history') {
        html = `
            <div class="form-group"><label>Year</label><input type="text" id="mYear" value="${data.year || ''}" required></div>
            <div class="form-group"><label>Title</label><input type="text" id="mTitle" value="${data.title || ''}" required></div>
            <div class="form-group"><label>Description</label><textarea id="mDesc" rows="3" required>${data.description || ''}</textarea></div>
        `;
    } else if (endpoint === 'branch') {
        html = `
            <div class="form-group"><label>Branch Name</label><input type="text" id="mName" value="${data.name || ''}" required></div>
            <div class="form-group"><label>Location</label><input type="text" id="mLoc" value="${data.location || ''}" required></div>
            <div class="form-group"><label>Details / Timings</label><textarea id="mDetails" rows="3">${data.details || ''}</textarea></div>
            <div class="form-group">
                <label>Upload Branch Image (Optional)</label>
                <input type="file" id="mImageFile" accept="image/*">
                ${data.imageUrl ? `<img src="http://localhost:5000${data.imageUrl}" style="max-width:100px; margin-top:10px;">` : ''}
                <input type="hidden" id="mImageUrl" value="${data.imageUrl || ''}">
            </div>
        `;
    } else if (endpoint === 'testimony') {
        html = `
            <div class="form-group"><label>Name</label><input type="text" id="mName" value="${data.name || ''}" required></div>
            <div class="form-group"><label>Message</label><textarea id="mMessage" rows="4" required>${data.message || ''}</textarea></div>
        `;
    }

    modalInputs.innerHTML = html;
    itemModal.style.display = 'block';
}

document.getElementById('addHistoryBtn').onclick = () => openModal('history');
document.getElementById('addBranchBtn').onclick = () => openModal('branch');
document.getElementById('addTestimonyBtn').onclick = () => openModal('testimony');

async function editItem(endpoint, id) {
    const res = await fetch(`${API_URL}/content/${endpoint}`);
    const dataArray = await res.json();
    const item = dataArray.find(d => d._id === id);
    if (item) openModal(endpoint, 'PUT', id, item);
}

modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let payload = {};
    if (currentEndpoint === 'history') {
        payload = {
            year: document.getElementById('mYear').value,
            title: document.getElementById('mTitle').value,
            description: document.getElementById('mDesc').value
        };
    } else if (currentEndpoint === 'testimony') {
        payload = {
            name: document.getElementById('mName').value,
            message: document.getElementById('mMessage').value
        };
    } else if (currentEndpoint === 'branch') {
        // Handle file upload first if file exists
        const fileInput = document.getElementById('mImageFile');
        let finalImageUrl = document.getElementById('mImageUrl').value;

        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            try {
                const uRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const uData = await uRes.json();
                if (uRes.ok) finalImageUrl = uData.imageUrl;
            } catch (e) { showToast('Image upload failed', 'error'); }
        }

        payload = {
            name: document.getElementById('mName').value,
            location: document.getElementById('mLoc').value,
            details: document.getElementById('mDetails').value,
            imageUrl: finalImageUrl
        };
    }

    const url = currentModalMode === 'POST' ? `${API_URL}/content/${currentEndpoint}` : `${API_URL}/content/${currentEndpoint}/${currentItemId}`;
    try {
        const res = await fetch(url, {
            method: currentModalMode,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast('Saved successfully');
            itemModal.style.display = 'none';
            loadSectionData(currentEndpoint, `${currentEndpoint}List`);
        } else {
            showToast('Save failed', 'error');
        }
    } catch (e) {
        showToast('Error saving item', 'error');
    }
});
