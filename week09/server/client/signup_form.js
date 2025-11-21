// signup_form.js（Week09 串接版）

// ------- 抓 DOM 元素 -------
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

const nameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');

const tagGroup = document.getElementById('tags');
const tagError = document.getElementById('tags-error');
const tagCount = document.getElementById('tag-count');

const agree = document.getElementById('agree');
const agreeError = document.getElementById('agree-error');

const strengthBar = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

const toastEl = document.getElementById('toast');
const toastBody = toastEl?.querySelector('.toast-body');

const inputs = [nameInput, emailInput, phoneInput, passwordInput, confirmInput];
const touched = new Set();

// ------- 共用：錯誤處理 -------
function setError(input, msg) {
  if (!input) return;
  const error = document.getElementById(`${input.id}-error`);
  if (error) error.textContent = msg || '';
  input.setCustomValidity(msg || '');
  input.classList.toggle('is-invalid', !!msg);
}

function showToast(message, success = true) {
  if (!toastEl) return;
  if (toastBody) toastBody.textContent = message;

  toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'show');
  toastEl.classList.add(success ? 'text-bg-success' : 'text-bg-danger');

  // Bootstrap 手動控制很麻煩，這裡用最簡單的 class 切換
  void toastEl.offsetWidth; // 強制 reflow
  toastEl.classList.add('show');

  setTimeout(() => toastEl.classList.remove('show'), 2000);
}

// ------- 驗證邏輯 -------
function validateName() {
  const v = nameInput.value.trim();
  if (!v) {
    setError(nameInput, '請輸入姓名');
    return false;
  }
  setError(nameInput, '');
  return true;
}

function validateEmail() {
  const v = emailInput.value.trim();
  if (!v) {
    setError(emailInput, '請輸入 Email');
    return false;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v)) {
    setError(emailInput, 'Email 格式不正確');
    return false;
  }
  setError(emailInput, '');
  return true;
}

function validatePhone() {
  const v = phoneInput.value.trim();
  if (!v) {
    setError(phoneInput, '請輸入手機號碼');
    return false;
  }
  if (!/^09\d{8}$/.test(v)) {
    setError(phoneInput, '手機需為 09 開頭 10 碼');
    return false;
  }
  setError(phoneInput, '');
  return true;
}

function getPasswordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[a-zA-Z]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

function updateStrength(pw) {
  if (!strengthBar || !strengthText) return;
  const score = getPasswordScore(pw);

  let level = '弱';
  let width = '25%';

  if (!pw) {
    level = '尚未輸入';
    width = '0%';
  } else if (score >= 4) {
    level = '強';
    width = '100%';
  } else if (score === 3) {
    level = '良';
    width = '75%';
  } else if (score === 2) {
    level = '中';
    width = '50%';
  }

  strengthBar.style.width = width;
  strengthText.textContent = level;
}

function validatePassword() {
  const pw = passwordInput.value;
  updateStrength(pw);

  if (!pw) {
    setError(passwordInput, '請輸入密碼');
    return false;
  }
  if (pw.length < 8) {
    setError(passwordInput, '密碼需至少 8 碼');
    return false;
  }
  setError(passwordInput, '');
  return true;
}

function validateConfirm() {
  const pw = passwordInput.value;
  const cpw = confirmInput.value;
  if (!cpw) {
    setError(confirmInput, '請再次輸入密碼');
    return false;
  }
  if (pw !== cpw) {
    setError(confirmInput, '密碼與確認密碼不一致');
    return false;
  }
  setError(confirmInput, '');
  return true;
}

function validateTags() {
  const checks = tagGroup.querySelectorAll('input[type="checkbox"]');
  const checked = Array.from(checks).filter(c => c.checked);
  if (tagCount) tagCount.textContent = String(checked.length);

  // 標籤樣式切換（如果有 .tag label）
  const labels = tagGroup.querySelectorAll('.tag');
  labels.forEach(label => {
    const input = label.querySelector('input[type="checkbox"]');
    if (!input) return;
    if (input.checked) {
      label.classList.add('btn-primary');
      label.classList.remove('btn-outline-secondary');
    } else {
      label.classList.remove('btn-primary');
      label.classList.add('btn-outline-secondary');
    }
  });

  if (checked.length === 0) {
    tagError.textContent = '請至少選擇一個興趣';
    return false;
  }
  tagError.textContent = '';
  return true;
}

function validateAgree() {
  if (!agree.checked) {
    agreeError.textContent = '請勾選同意條款';
    return false;
  }
  agreeError.textContent = '';
  return true;
}

// ------- 草稿儲存 / 還原 -------
const DRAFT_KEY = 'W07_DRAFT';

function saveDraft() {
  try {
    const tags = Array.from(
      tagGroup.querySelectorAll('input[type="checkbox"]:checked')
    ).map(c => c.value);

    const data = {
      fullName: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      tags,
      agree: agree.checked,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.fullName) nameInput.value = data.fullName;
    if (data.email) emailInput.value = data.email;
    if (data.phone) phoneInput.value = data.phone;

    if (Array.isArray(data.tags)) {
      const checks = tagGroup.querySelectorAll('input[type="checkbox"]');
      checks.forEach(c => {
        c.checked = data.tags.includes(c.value);
      });
    }

    if (typeof data.agree === 'boolean') {
      agree.checked = data.agree;
    }

    updateStrength(passwordInput.value);
    validateTags();
  } catch (e) {
    // ignore
  }
}

// ------- 事件綁定（blur 驗證、即時更新） -------
inputs.forEach(input => {
  input.addEventListener('blur', () => {
    touched.add(input.id);
    switch (input) {
      case nameInput: validateName(); break;
      case emailInput: validateEmail(); break;
      case phoneInput: validatePhone(); break;
      case passwordInput: validatePassword(); validateConfirm(); break;
      case confirmInput: validateConfirm(); break;
    }
  });

  input.addEventListener('input', () => {
    if (!touched.has(input.id)) return;
    switch (input) {
      case nameInput: validateName(); break;
      case emailInput: validateEmail(); break;
      case phoneInput: validatePhone(); break;
      case passwordInput: validatePassword(); validateConfirm(); break;
      case confirmInput: validateConfirm(); break;
    }
    saveDraft();
  });
});

passwordInput.addEventListener('input', () => {
  updateStrength(passwordInput.value);
  saveDraft();
});

tagGroup.addEventListener('change', () => {
  validateTags();
  saveDraft();
});

agree.addEventListener('change', () => {
  validateAgree();
  saveDraft();
});

// ------- 送出時：串接後端 API -------
async function submitSignup(payload) {
  const res = await fetch('http://localhost:3001/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '報名失敗');
  }
  return data;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 先把所有欄位標記為 touched，強制驗證一次
  inputs.forEach(i => touched.add(i.id));

  const validators = [validateName, validateEmail, validatePhone, validatePassword, validateConfirm];
  let firstInvalid = null;

  validators.forEach(fn => {
    const ok = fn();
    if (!ok && !firstInvalid) {
      firstInvalid = document.querySelector('.is-invalid');
    }
  });

  const tagsOk = validateTags();
  const agreeOk = validateAgree();

  if (firstInvalid || !tagsOk || !agreeOk) {
    const target = firstInvalid || (!tagsOk && tagGroup) || (!agreeOk && agree);
    target && target.focus();
    return;
  }

  // 組 payload（符合後端需求）
  const interests = Array.from(
    tagGroup.querySelectorAll('input[type="checkbox"]:checked')
  ).map(c => c.value);

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    password: passwordInput.value,
    confirmPassword: confirmInput.value,
    interests,
    terms: agree.checked,
  };

  // 按鈕進入 loading 狀態
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '送出中…';
  submitBtn.classList.add('loading');

  try {
    const result = await submitSignup(payload);
    showToast(`✅ ${result.message || '註冊成功'}`, true);

    // 重置表單 & 狀態
    form.reset();
    updateStrength('');
    inputs.forEach(i => setError(i, ''));
    tagError.textContent = '';
    tagCount.textContent = '0';
    agreeError.textContent = '';

    const labels = tagGroup.querySelectorAll('.tag');
    labels.forEach(label => {
      label.classList.remove('btn-primary');
      label.classList.add('btn-outline-secondary');
    });

    localStorage.removeItem(DRAFT_KEY);
    touched.clear();
  } catch (err) {
    showToast(`❌ ${err.message}`, false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.classList.remove('loading');
  }
});

// ------- 重設按鈕 -------
resetBtn.addEventListener('click', () => {
  form.reset();
  updateStrength('');
  inputs.forEach(i => setError(i, ''));
  tagError.textContent = '';
  tagCount.textContent = '0';
  agreeError.textContent = '';

  const labels = tagGroup.querySelectorAll('.tag');
  labels.forEach(label => {
    label.classList.remove('btn-primary');
    label.classList.add('btn-outline-secondary');
  });

  localStorage.removeItem(DRAFT_KEY);
  touched.clear();
});

// 初始化
restoreDraft();
updateStrength(passwordInput.value || '');
validateTags();
