/* form.js — Multi-step lead capture form modal */
(function(){

var STEPS_TOTAL = 3;
var state = { platforms:[], business:'', budget:'', name:'', phone:'' };

/* ── CSS ── */
var s = document.createElement('style');
s.textContent = `
#form-modal-bg {
  position:fixed;inset:0;z-index:8000;
  background:rgba(0,0,0,.72);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  opacity:0;pointer-events:none;transition:opacity .4s;
}
#form-modal-bg.open{opacity:1;pointer-events:all;}
#form-modal {
  background:#0B1020;border:1px solid rgba(255,255,255,.1);border-radius:22px;
  width:100%;max-width:520px;padding:0;overflow:hidden;
  transform:translateY(28px) scale(.97);transition:transform .45s cubic-bezier(0.16,1,0.3,1);
  position:relative;
}
#form-modal-bg.open #form-modal{transform:translateY(0) scale(1);}
.fm-header{padding:28px 32px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.fm-header h2{font-family:'Manrope',sans-serif;font-size:20px;font-weight:800;color:#fff;line-height:1.25;}
.fm-header p{font-size:13px;color:rgba(255,255,255,.45);margin-top:5px;line-height:1.6;}
.fm-close{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.5);
  width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;line-height:32px;
  text-align:center;flex-shrink:0;transition:all .25s;margin-top:-4px;}
.fm-close:hover{background:rgba(255,255,255,.14);color:#fff;}

/* Progress */
.fm-progress{display:flex;gap:4px;padding:20px 32px 0;}
.fm-prog-bar{height:3px;flex:1;border-radius:3px;background:rgba(255,255,255,.1);
  transition:background .4s;}
.fm-prog-bar.done{background:#2563EB;}
.fm-prog-bar.active{background:linear-gradient(90deg,#2563EB,#38BDF8);}

/* Steps */
.fm-steps{padding:24px 32px 28px;}
.fm-step{display:none;}
.fm-step.active{display:block;}
.fm-step-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:rgba(255,255,255,.28);margin-bottom:14px;}

/* Platform checkboxes */
.platform-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.platform-item{
  background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);
  border-radius:12px;padding:13px 14px;cursor:pointer;
  display:flex;align-items:center;gap:10px;
  transition:all .25s cubic-bezier(0.16,1,0.3,1);
  user-select:none;
}
.platform-item:hover{border-color:rgba(37,99,235,.4);background:rgba(37,99,235,.07);}
.platform-item.selected{border-color:#2563EB;background:rgba(37,99,235,.15);}
.platform-item input{display:none;}
.platform-ico{font-size:18px;line-height:1;}
.platform-name{font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.75);}
.platform-item.selected .platform-name{color:#fff;}

/* Select / inputs */
.fm-field{margin-bottom:14px;}
.fm-field label{display:block;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;
  color:rgba(255,255,255,.35);margin-bottom:7px;}
.fm-field select,.fm-field input{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
  border-radius:11px;padding:12px 15px;color:#fff;
  font-size:14px;font-family:'Noto Sans',sans-serif;
  outline:none;transition:border-color .25s,background .25s;
  appearance:none;-webkit-appearance:none;
}
.fm-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
.fm-field select:focus,.fm-field input:focus{border-color:#2563EB;background:rgba(37,99,235,.08);}
.fm-field select option{background:#0B1020;color:#fff;}

/* Budget radio */
.budget-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.budget-item{
  background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);
  border-radius:11px;padding:11px 14px;cursor:pointer;text-align:center;
  font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.6);
  transition:all .25s;user-select:none;
}
.budget-item:hover{border-color:rgba(37,99,235,.4);}
.budget-item.selected{border-color:#2563EB;background:rgba(37,99,235,.15);color:#fff;}

/* Step 3 success */
.fm-success{text-align:center;padding:16px 0 8px;}
.fm-success .success-ico{font-size:52px;margin-bottom:16px;}
.fm-success h3{font-family:'Manrope',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;}
.fm-success p{font-size:14px;color:rgba(255,255,255,.5);line-height:1.75;}

/* Nav buttons */
.fm-nav{display:flex;gap:10px;margin-top:22px;}
.fm-btn-back{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.6);padding:12px 22px;border-radius:50px;
  font-family:'Manrope',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .25s;}
.fm-btn-back:hover{color:#fff;background:rgba(255,255,255,.1);}
.fm-btn-next{flex:1;background:linear-gradient(90deg,#2563EB,#38BDF8);color:#fff;
  border:none;padding:13px 22px;border-radius:50px;
  font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;cursor:pointer;
  transition:box-shadow .3s,transform .3s;position:relative;overflow:hidden;}
.fm-btn-next:hover{box-shadow:0 0 28px rgba(37,99,235,.55);transform:translateY(-1px);}
.fm-btn-next:disabled{opacity:.45;cursor:default;transform:none;box-shadow:none;}
.fm-error{font-size:12px;color:#f87171;margin-top:8px;display:none;}

@media(max-width:540px){
  #form-modal{border-radius:18px;}
  .fm-header,.fm-steps,.fm-progress{padding-left:20px;padding-right:20px;}
  .platform-grid{grid-template-columns:1fr;}
  .budget-grid{grid-template-columns:1fr 1fr;}
}
`;
document.head.appendChild(s);

/* ── HTML ── */
var bg = document.createElement('div');
bg.id = 'form-modal-bg';
bg.innerHTML = `
<div id="form-modal" role="dialog" aria-modal="true" aria-label="Pulsuz Sınaq Forması">
  <div class="fm-header">
    <div>
      <h2>Pulsuz Sınağa Başlayın</h2>
      <p>30 saniyəlik forma — nəticəni 14 gündə görün</p>
    </div>
    <button class="fm-close" onclick="closeLeadForm()" aria-label="Bağla">✕</button>
  </div>
  <div class="fm-progress">
    <div class="fm-prog-bar active" id="pb1"></div>
    <div class="fm-prog-bar" id="pb2"></div>
    <div class="fm-prog-bar" id="pb3"></div>
  </div>
  <div class="fm-steps">

    <!-- STEP 1: Platforms -->
    <div class="fm-step active" id="fm-s1">
      <div class="fm-step-label">Addım 1 / 3 — Xidmət seçin</div>
      <div class="platform-grid">
        <label class="platform-item" data-val="meta">
          <span class="platform-ico">📱</span>
          <span class="platform-name">Meta Reklam</span>
        </label>
        <label class="platform-item" data-val="google">
          <span class="platform-ico">🔍</span>
          <span class="platform-name">Google Ads</span>
        </label>
        <label class="platform-item" data-val="tiktok">
          <span class="platform-ico">🎵</span>
          <span class="platform-name">TikTok Ads</span>
        </label>
        <label class="platform-item" data-val="linkedin">
          <span class="platform-ico">💼</span>
          <span class="platform-name">LinkedIn Ads</span>
        </label>
        <label class="platform-item" data-val="smm">
          <span class="platform-ico">📊</span>
          <span class="platform-name">SMM</span>
        </label>
        <label class="platform-item" data-val="hamsini">
          <span class="platform-ico">✨</span>
          <span class="platform-name">Hamısı</span>
        </label>
      </div>
      <div class="fm-error" id="e1">Ən az 1 xidmət seçin</div>
      <div class="fm-nav">
        <button class="fm-btn-next" onclick="nextStep(1)">Davam Et →</button>
      </div>
    </div>

    <!-- STEP 2: Business + Budget -->
    <div class="fm-step" id="fm-s2">
      <div class="fm-step-label">Addım 2 / 3 — Biznesiniz</div>
      <div class="fm-field">
        <label>Biznes növü</label>
        <select id="fm-business">
          <option value="">Seçin...</option>
          <option value="Kosmetika Mağazası">💄 Kosmetika Mağazası</option>
          <option value="Tort / Şirniyyat">🍰 Tort / Şirniyyat</option>
          <option value="Zərgərlik / Aksesuar">💍 Zərgərlik / Aksesuar</option>
          <option value="Uşaq Məhsulları">👶 Uşaq Məhsulları</option>
          <option value="Tədris / Kurslar">📚 Tədris / Kurslar</option>
          <option value="Geyim Mağazası">👗 Geyim Mağazası</option>
          <option value="Dondurmacı / Fast Food">🍦 Dondurmacı / Fast Food</option>
          <option value="Restoran / Çatdırılma">🍕 Restoran / Çatdırılma</option>
          <option value="Gözəllik Salonu">💇 Gözəllik Salonu</option>
          <option value="Fitness / İdman Zalı">🏋️ Fitness / İdman Zalı</option>
          <option value="Ev Dekor / Mebel">🛋️ Ev Dekor / Mebel</option>
          <option value="Toy / Şadlıq Xidmətləri">💒 Toy / Şadlıq Xidmətləri</option>
          <option value="Tibb / Diş Klinikası">🦷 Tibb / Diş Klinikası</option>
          <option value="Turizm / Mehmanxana">🏨 Turizm / Mehmanxana</option>
          <option value="Avtomobil Aksesuarları">🚗 Avtomobil Aksesuarları</option>
          <option value="Əczaçılıq / Supplement">💊 Əczaçılıq / Supplement</option>
          <option value="Ev Xidmətləri">🧹 Ev Xidmətləri</option>
          <option value="Elektronika / Texnika">📱 Elektronika / Texnika</option>
          <option value="Daşınmaz Əmlak">🏠 Daşınmaz Əmlak</option>
          <option value="B2B / Korporativ">💼 B2B / Korporativ</option>
          <option value="Digər">🔹 Digər</option>
        </select>
      </div>
      <div class="fm-field">
        <label>Aylıq reklam büdcəniz</label>
        <div class="budget-grid">
          <div class="budget-item" data-val="₼100–300">₼100–300</div>
          <div class="budget-item" data-val="₼300–500">₼300–500</div>
          <div class="budget-item" data-val="₼500–1000">₼500–1000</div>
          <div class="budget-item" data-val="₼1000+">₼1000+</div>
        </div>
      </div>
      <div class="fm-error" id="e2">Biznes növü və büdcəni seçin</div>
      <div class="fm-nav">
        <button class="fm-btn-back" onclick="prevStep(2)">← Geri</button>
        <button class="fm-btn-next" onclick="nextStep(2)">Davam Et →</button>
      </div>
    </div>

    <!-- STEP 3: Contact -->
    <div class="fm-step" id="fm-s3">
      <div class="fm-step-label">Addım 3 / 3 — Əlaqə məlumatları</div>
      <div class="fm-field">
        <label>Ad Soyad *</label>
        <input type="text" id="fm-name" placeholder="Məsələn: Cavid Məmmədov" autocomplete="name"/>
      </div>
      <div class="fm-field">
        <label>WhatsApp Nömrəsi *</label>
        <input type="tel" id="fm-phone" placeholder="+994 XX XXX XX XX" autocomplete="tel"/>
      </div>
      <div class="fm-error" id="e3">Ad və nömrəni daxil edin</div>
      <div class="fm-nav">
        <button class="fm-btn-back" onclick="prevStep(3)">← Geri</button>
        <button class="fm-btn-next" onclick="submitForm()">WhatsApp-da Göndər →</button>
      </div>
    </div>

  </div>
</div>
`;
document.body.appendChild(bg);

// Close on backdrop click
bg.addEventListener('click', function(e){ if(e.target === bg) closeLeadForm(); });
// Close on Escape
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLeadForm(); });

/* ── Platform item toggle ── */
document.querySelectorAll('.platform-item').forEach(function(item){
  item.addEventListener('click', function(){
    var val = item.dataset.val;
    if(val === 'hamsini'){
      // Select all
      document.querySelectorAll('.platform-item').forEach(function(i){ i.classList.add('selected'); });
      state.platforms = ['meta','google','tiktok','linkedin','smm'];
    } else {
      item.classList.toggle('selected');
      var idx = state.platforms.indexOf(val);
      if(idx > -1) state.platforms.splice(idx,1);
      else state.platforms.push(val);
      // Deselect "hamısı" if individual deselected
      if(item.classList.contains('selected') === false){
        document.querySelector('[data-val="hamsini"]').classList.remove('selected');
      }
    }
  });
});

/* ── Budget selection ── */
document.querySelectorAll('.budget-item').forEach(function(item){
  item.addEventListener('click', function(){
    document.querySelectorAll('.budget-item').forEach(function(i){i.classList.remove('selected');});
    item.classList.add('selected');
    state.budget = item.dataset.val;
  });
});

/* ── Step navigation ── */
var currentStep = 1;

window.nextStep = function(from){
  var e;
  if(from === 1){
    e = document.getElementById('e1');
    if(state.platforms.length === 0){ e.style.display='block'; return; }
    e.style.display='none';
  }
  if(from === 2){
    e = document.getElementById('e2');
    state.business = document.getElementById('fm-business').value;
    if(!state.business || !state.budget){ e.style.display='block'; return; }
    e.style.display='none';
  }
  currentStep = from + 1;
  updateStepUI();
};

window.prevStep = function(from){
  currentStep = from - 1;
  updateStepUI();
};

function updateStepUI(){
  for(var i=1;i<=3;i++){
    document.getElementById('fm-s'+i).classList.toggle('active', i===currentStep);
    var pb = document.getElementById('pb'+i);
    pb.className = 'fm-prog-bar' + (i < currentStep ? ' done' : i === currentStep ? ' active' : '');
  }
}

/* ── Platform display names ── */
var platformNames = {
  meta:'Meta Reklam', google:'Google Ads', tiktok:'TikTok Ads',
  linkedin:'LinkedIn Ads', smm:'SMM'
};

/* ── Submit → open WhatsApp ── */
window.submitForm = function(){
  var name = document.getElementById('fm-name').value.trim();
  var phone = document.getElementById('fm-phone').value.trim();
  var e3 = document.getElementById('e3');
  if(!name || !phone){ e3.style.display='block'; return; }
  e3.style.display='none';
  state.name = name; state.phone = phone;

  var platformStr = state.platforms.map(function(p){ return platformNames[p]||p; }).join(', ') || 'Hamısı';

  var msg = 'Salam! Mən ' + name + '. '
    + 'Biznesim: ' + state.business + '. '
    + 'Maraqlandığım xidmətlər: ' + platformStr + '. '
    + 'Aylıq büdcəm: ' + state.budget + '. '
    + 'Pulsuz sınaq barədə məlumat almaq istəyirəm.';

  var waUrl = 'https://wa.me/994773698929?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');

  // Show success state
  var step3 = document.getElementById('fm-s3');
  step3.innerHTML = '<div class="fm-success">'
    + '<div class="success-ico">✅</div>'
    + '<h3>Göndərildi!</h3>'
    + '<p>WhatsApp pəncərəsi açıldı.<br>Biz 5 dəqiqə içinde cavab veririk.</p>'
    + '<button onclick="closeLeadForm()" style="margin-top:20px;background:#2563EB;color:#fff;border:none;'
    + 'padding:12px 28px;border-radius:50px;font-family:Manrope,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">Bağla</button>'
    + '</div>';
};

/* ── Open / Close ── */
window.openLeadForm = function(){
  bg.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLeadForm = function(){
  bg.classList.remove('open');
  document.body.style.overflow = '';
};

/* ── Wire up nav-cta buttons ── */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.nav-cta').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      openLeadForm();
    });
  });
});

})();
