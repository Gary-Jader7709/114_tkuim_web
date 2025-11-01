// signup_form.js
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

const strengthBar = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

const touched = new Set();

function setError(input, msg) {
  const error = document.getElementById(`${input.id}-error`);
  if (error) error.textContent = msg || '';
  input.setCustomValidity(msg || '');
  input.classList.toggle('is-invalid', !!msg);
  return !msg;
}

function validateName(){ const v=nameInput.value.trim(); return setError(nameInput, v? '' : '請輸入姓名。'); }
function validateEmail(){ const v=emailInput.value.trim(); const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); return setError(emailInput, v? (ok? '' : 'Email 格式不正確。') : '請輸入 Email。'); }
function validatePhone(){ const v=phoneInput.value.trim(); const ok=/^\d{10}$/.test(v); return setError(phoneInput, v? (ok? '' : '請輸入 10 碼數字（不含空格與符號）。') : '請輸入手機。'); }

function validatePassword(){
  const v=passwordInput.value;
  const hasLetter=/[A-Za-z]/.test(v), hasNumber=/\d/.test(v);
  let msg='';
  if(!v) msg='請輸入密碼。';
  else if(v.length<8) msg='密碼至少需 8 碼。';
  else if(!hasLetter||!hasNumber) msg='請同時包含英文字母與數字。';
  updateStrength(v);
  return setError(passwordInput, msg);
}
function validateConfirm(){
  const pv=passwordInput.value, cv=confirmInput.value;
  let msg='';
  if(!cv) msg='請再次輸入密碼。';
  else if(pv!==cv) msg='兩次輸入的密碼不一致。';
  return setError(confirmInput, msg);
}

function validateTags(){
  const checked=tagGroup.querySelectorAll('input[type="checkbox"]:checked').length;
  tagCount.textContent=checked;
  tagError.textContent= checked===0 ? '請至少選擇一個興趣。' : '';
  return checked>0;
}
function validateAgree(){
  const ok=agree.checked;
  document.getElementById('agree-error').textContent= ok? '' : '需同意服務條款。';
  agree.setCustomValidity(ok? '' : '需同意服務條款。');
  return ok;
}

function updateStrength(v){
  let score=0;
  if(v.length>=8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[a-z]/.test(v)) score++;
  if(/\d/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  const level=Math.min(score,4);
  const widths=['0%','25%','50%','75%','100%'];
  const labels=['弱','弱','中','良','強'];
  const classes=['weak','weak','mid','good','strong'];
  strengthBar.style.width=widths[level];
  strengthBar.className=classes[level];
  strengthText.textContent = v ? `密碼強度：${labels[level]}` : '密碼強度：尚未評估';
}

const inputs=[nameInput,emailInput,phoneInput,passwordInput,confirmInput];
inputs.forEach(el=>{
  el.addEventListener('blur',e=>{touched.add(e.target.id); runField(e.target.id);});
  el.addEventListener('input',e=>{ if(!touched.has(e.target.id)) return; runField(e.target.id); saveDraft();});
});

function runField(id){
  if(id==='fullName') return validateName();
  if(id==='email') return validateEmail();
  if(id==='phone') return validatePhone();
  if(id==='password'){ const ok=validatePassword(); if(touched.has('confirm')) validateConfirm(); return ok; }
  if(id==='confirm') return validateConfirm();
}

tagGroup.addEventListener('click',e=>{
  const label=e.target.closest('.tag'); if(!label) return;
  const cb=label.querySelector('input[type="checkbox"]');
  cb.checked=!cb.checked;
  label.classList.toggle('btn-primary', cb.checked);
  label.classList.toggle('btn-outline-secondary', !cb.checked);
  validateTags(); saveDraft();
});
tagGroup.addEventListener('change',()=>{ validateTags(); saveDraft(); });

agree.addEventListener('change',()=>{ validateAgree(); saveDraft(); });

form.addEventListener('submit', async e=>{
  e.preventDefault();
  inputs.forEach(i=>touched.add(i.id));
  const fns=[validateName,validateEmail,validatePhone,validatePassword,validateConfirm];
  let firstInvalid=null;
  fns.forEach(fn=>{const ok=fn(); if(!ok && !firstInvalid) firstInvalid=document.querySelector('.is-invalid');});
  const tagsOk=validateTags(), agreeOk=validateAgree();
  if(firstInvalid || !tagsOk || !agreeOk){ (firstInvalid || (!tagsOk && tagGroup) || (!agreeOk && agree))?.focus(); return; }

  submitBtn.disabled=true; const text=submitBtn.textContent; submitBtn.textContent='建立中…'; submitBtn.classList.add('loading');
  await new Promise(r=>setTimeout(r,1000));

  const toast=document.getElementById('toast'); toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800);

  form.reset(); updateStrength('');
  inputs.forEach(i=>setError(i,''));
  tagGroup.querySelectorAll('.tag').forEach(lbl=>{ lbl.classList.remove('btn-primary'); lbl.classList.add('btn-outline-secondary'); });
  validateTags();
  localStorage.removeItem('W07_DRAFT');

  submitBtn.disabled=false; submitBtn.textContent=text; submitBtn.classList.remove('loading');
  touched.clear();
});

resetBtn.addEventListener('click',()=>{
  form.reset(); updateStrength('');
  inputs.forEach(i=>setError(i,''));
  tagGroup.querySelectorAll('.tag').forEach(lbl=>{ lbl.classList.remove('btn-primary'); lbl.classList.add('btn-outline-secondary'); });
  validateTags();
  document.querySelectorAll('[id$="-error"]').forEach(el=>el.textContent='');
  localStorage.removeItem('W07_DRAFT');
  touched.clear();
});

function saveDraft(){
  const data={
    fullName:nameInput.value, email:emailInput.value, phone:phoneInput.value,
    tags:Array.from(tagGroup.querySelectorAll('input[type="checkbox"]:checked')).map(c=>c.value),
    agree:agree.checked
  };
  localStorage.setItem('W07_DRAFT', JSON.stringify(data));
}
(function restoreDraft(){
  try{
    const data=JSON.parse(localStorage.getItem('W07_DRAFT')||'null'); if(!data) return;
    nameInput.value=data.fullName||''; emailInput.value=data.email||''; phoneInput.value=data.phone||'';
    (data.tags||[]).forEach(val=>{
      const label=Array.from(tagGroup.querySelectorAll('.tag')).find(l=>l.querySelector('input').value===val);
      if(label){ const cb=label.querySelector('input'); cb.checked=true; label.classList.remove('btn-outline-secondary'); label.classList.add('btn-primary'); }
    });
    agree.checked=!!data.agree; validateTags();
  }catch{}
})();
