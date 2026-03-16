// auth.js — Login page logic
(function () {
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('loginError');
  const errorMsg = document.getElementById('errorMsg');
  const loginText = document.getElementById('loginText');
  const loginSpinner = document.getElementById('loginSpinner');
  const loginBtn = document.getElementById('loginBtn');
  const togglePw = document.getElementById('togglePw');
  const pwInput = document.getElementById('password');

  // Toggle password visibility
  togglePw.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    togglePw.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
    loginBtn.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = '/admin/dashboard.html';
      } else {
        errorMsg.textContent = data.message || 'Access denied.';
        errorBox.classList.remove('hidden');
      }
    } catch (err) {
      errorMsg.textContent = 'Server error. Please try again.';
      errorBox.classList.remove('hidden');
    } finally {
      loginText.classList.remove('hidden');
      loginSpinner.classList.add('hidden');
      loginBtn.disabled = false;
    }
  });
})();
