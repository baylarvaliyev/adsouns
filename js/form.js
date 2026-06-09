/* form.js — AdsOnUs Multi-language Lead Form */
(function(){

/* Detect language from <html lang="..."> or path */
var htmlLang = (document.documentElement.lang || 'az').toLowerCase().slice(0,2);
var pathLang = window.location.pathname.match(/^\/(en|ru|tr)\//);
var LANG = pathLang ? pathLang[1] : (htmlLang === 'en' || htmlLang === 'ru' || htmlLang === 'tr' ? htmlLang : 'az');

var T = {
  az:{
    title:'Pulsuz Sınağa Başlayın',
    sub:'30 saniyəlik forma — nəticəni 14 gündə görün',
    step1:'Addım 1/3 — Xidmət seçin',
    step2:'Addım 2/3 — Biznesiniz',
    step3:'Addım 3/3 — Əlaqə məlumatları',
    next:'Davam Et →', back:'← Geri', send:'WhatsApp-da Göndər →',
    bizLabel:'Biznes növü', budgetLabel:'Aylıq reklam büdcəniz',
    nameLabel:'Ad Soyad *', phoneLbl:'WhatsApp Nömrəsi *',
    namePh:'Məs: Cavid Məmmədov', phonePh:'+994 XX XXX XX XX',
    e1:'Ən az 1 xidmət seçin', e2:'Biznes növü və büdcəni seçin', e3:'Ad və nömrəni daxil edin',
    bizPlh:'Seçin...', allPl:'Hamısı',
    budgets:['₼100–300','₼300–500','₼500–1000','₼1000+'],
    successTitle:'Göndərildi!', successMsg:'WhatsApp pəncərəsi açıldı.<br>Biz 5 dəqiqə içinde cavab veririk.',
    close:'Bağla',
    waPrefix:'Salam! Mən {name}. Biznesim: {biz}. Xidmətlər: {svcs}. Büdcəm: {budget}. Pulsuz sınaq haqqında məlumat almaq istəyirəm.'
  },
  en:{
    title:'Start Your Free Trial',
    sub:'30-second form — see results within 14 days',
    step1:'Step 1/3 — Choose services',
    step2:'Step 2/3 — Your business',
    step3:'Step 3/3 — Contact details',
    next:'Continue →', back:'← Back', send:'Send via WhatsApp →',
    bizLabel:'Business type', budgetLabel:'Monthly ad budget',
    nameLabel:'Full Name *', phoneLbl:'WhatsApp Number *',
    namePh:'e.g. John Smith', phonePh:'+1 XXX XXX XXXX',
    e1:'Please select at least 1 service', e2:'Select business type and budget', e3:'Please enter name and number',
    bizPlh:'Select...', allPl:'All platforms',
    budgets:['$100–300','$300–600','$600–1200','$1200+'],
    successTitle:'Sent!', successMsg:'WhatsApp window opened.<br>We reply within 5 minutes.',
    close:'Close',
    waPrefix:'Hello! My name is {name}. Business: {biz}. Interested in: {svcs}. Monthly budget: {budget}. I would like to learn about the free trial.'
  },
  ru:{
    title:'Начните бесплатный тест',
    sub:'30-секундная форма — результаты за 14 дней',
    step1:'Шаг 1/3 — Выберите услуги',
    step2:'Шаг 2/3 — Ваш бизнес',
    step3:'Шаг 3/3 — Контактные данные',
    next:'Продолжить →', back:'← Назад', send:'Отправить в WhatsApp →',
    bizLabel:'Тип бизнеса', budgetLabel:'Ежемесячный рекламный бюджет',
    nameLabel:'Имя и фамилия *', phoneLbl:'Номер WhatsApp *',
    namePh:'Например: Иван Иванов', phonePh:'+7 XXX XXX-XX-XX',
    e1:'Выберите хотя бы 1 услугу', e2:'Выберите тип бизнеса и бюджет', e3:'Введите имя и номер',
    bizPlh:'Выберите...', allPl:'Все платформы',
    budgets:['₽10,000–25,000','₽25,000–50,000','₽50,000–100,000','₽100,000+'],
    successTitle:'Отправлено!', successMsg:'Окно WhatsApp открыто.<br>Мы отвечаем в течение 5 минут.',
    close:'Закрыть',
    waPrefix:'Здравствуйте! Меня зовут {name}. Бизнес: {biz}. Интересуют: {svcs}. Бюджет: {budget}. Хочу узнать о бесплатном тесте.'
  },
  tr:{
    title:'Ücretsiz Denemeye Başlayın',
    sub:'30 saniyelik form — 14 günde sonuç görün',
    step1:'Adım 1/3 — Hizmet seçin',
    step2:'Adım 2/3 — İşletmeniz',
    step3:'Adım 3/3 — İletişim bilgileri',
    next:'Devam Et →', back:'← Geri', send:'WhatsApp\'a Gönder →',
    bizLabel:'İşletme türü', budgetLabel:'Aylık reklam bütçeniz',
    nameLabel:'Ad Soyad *', phoneLbl:'WhatsApp Numarası *',
    namePh:'Örn: Ahmet Yılmaz', phonePh:'+90 5XX XXX XX XX',
    e1:'En az 1 hizmet seçin', e2:'İşletme türü ve bütçe seçin', e3:'İsim ve numara girin',
    bizPlh:'Seçin...', allPl:'Tüm platformlar',
    budgets:['₺2,000–5,000','₺5,000–10,000','₺10,000–20,000','₺20,000+'],
    successTitle:'Gönderildi!', successMsg:'WhatsApp penceresi açıldı.<br>5 dakika içinde cevap veriyoruz.',
    close:'Kapat',
    waPrefix:'Merhaba! Ben {name}. İşletmem: {biz}. İlgilendiğim hizmetler: {svcs}. Bütçem: {budget}. Ücretsiz deneme hakkında bilgi almak istiyorum.'
  }
};

var t = T[LANG] || T.az;
var WA = 'https://wa.me/994773698929?text=';

var platforms = {
  az:['📱 Meta Reklam','🔍 Google Ads','🎵 TikTok Ads','💼 LinkedIn Ads','📊 SMM',t.allPl],
  en:['📱 Meta Ads','🔍 Google Ads','🎵 TikTok Ads','💼 LinkedIn Ads','📊 SMM',t.allPl],
  ru:['📱 Meta реклама','🔍 Google Ads','🎵 TikTok Ads','💼 LinkedIn Ads','📊 SMM',t.allPl],
  tr:['📱 Meta Reklamları','🔍 Google Ads','🎵 TikTok Reklamları','💼 LinkedIn Ads','📊 SMM',t.allPl]
}[LANG] || platforms.az;

var bizOptions = {
  az:['💄 Kosmetika','🍰 Tort/Şirniyyat','💍 Zərgərlik','👶 Uşaq Məhsulları','📚 Kurslar','👗 Geyim','🍦 Fast Food','🍕 Restoran','💇 Gözəllik Salonu','🏋️ Fitness Zalı','🏠 Daşınmaz Əmlak','💼 B2B','🔹 Digər'],
  en:['💄 Cosmetics','🍰 Bakery/Sweets','💍 Jewelry','👶 Baby Products','📚 Education/Courses','👗 Fashion/Clothing','🍦 Fast Food/Cafe','🍕 Restaurant/Delivery','💇 Beauty Salon','🏋️ Fitness/Gym','🏠 Real Estate','💼 B2B/Corporate','🔹 Other'],
  ru:['💄 Косметика','🍰 Торты/Сладости','💍 Ювелирные изделия','👶 Детские товары','📚 Образование/Курсы','👗 Одежда/Мода','🍦 Фастфуд/Кафе','🍕 Ресторан/Доставка','💇 Салон красоты','🏋️ Фитнес/Спортзал','🏠 Недвижимость','💼 B2B/Корпоративный','🔹 Другое'],
  tr:['💄 Kozmetik','🍰 Pastane/Tatlı','💍 Mücevher','👶 Bebek Ürünleri','📚 Eğitim/Kurslar','👗 Giyim/Moda','🍦 Fast Food/Kafe','🍕 Restoran/Teslimat','💇 Güzellik Salonu','🏋️ Fitness/Spor Salonu','🏠 Gayrimenkul','💼 B2B/Kurumsal','🔹 Diğer']
}[LANG] || bizOptions.az;

/* ── CSS ── */
var s = document.createElement('style');
s.textContent = `
#form-modal-bg{position:fixed;inset:0;z-index:8000;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .4s;}
#form-modal-bg.open{opacity:1;pointer-events:all;}
#form-modal{background:#0B1020;border:1px solid rgba(255,255,255,.1);border-radius:22px;width:100%;max-width:520px;overflow:hidden;transform:translateY(28px) scale(.97);transition:transform .45s cubic-bezier(0.16,1,0.3,1);}
#form-modal-bg.open #form-modal{transform:translateY(0) scale(1);}
.fm-hdr{padding:26px 28px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.fm-hdr h2{font-family:'Manrope',sans-serif;font-size:19px;font-weight:800;color:#fff;line-height:1.25;}
.fm-hdr p{font-size:12.5px;color:rgba(255,255,255,.43);margin-top:4px;line-height:1.6;}
.fm-x{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.5);width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;flex-shrink:0;transition:all .25s;}
.fm-x:hover{background:rgba(255,255,255,.14);color:#fff;}
.fm-prog{display:flex;gap:4px;padding:18px 28px 0;}
.fm-pb{height:3px;flex:1;border-radius:3px;background:rgba(255,255,255,.1);transition:background .4s;}
.fm-pb.done{background:#2563EB;}
.fm-pb.active{background:linear-gradient(90deg,#2563EB,#38BDF8);}
.fm-body{padding:22px 28px 26px;}
.fm-step{display:none;}
.fm-step.active{display:block;}
.fm-slbl{font-size:10.5px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:14px;}
.plat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.plat-it{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);border-radius:11px;padding:12px 13px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .25s;user-select:none;}
.plat-it:hover{border-color:rgba(37,99,235,.4);}
.plat-it.sel{border-color:#2563EB;background:rgba(37,99,235,.15);}
.plat-ico{font-size:16px;line-height:1;}
.plat-nm{font-family:'Manrope',sans-serif;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.7);}
.plat-it.sel .plat-nm{color:#fff;}
.fm-field{margin-bottom:13px;}
.fm-field label{display:block;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.32);margin-bottom:6px;}
.fm-field select,.fm-field input{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;font-family:'Noto Sans',sans-serif;outline:none;transition:border-color .25s,background .25s;appearance:none;-webkit-appearance:none;}
.fm-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
.fm-field select:focus,.fm-field input:focus{border-color:#2563EB;background:rgba(37,99,235,.08);}
.fm-field select option{background:#0B1020;}
.bud-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.bud-it{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 13px;cursor:pointer;text-align:center;font-family:'Manrope',sans-serif;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.55);transition:all .25s;user-select:none;}
.bud-it:hover{border-color:rgba(37,99,235,.4);}
.bud-it.sel{border-color:#2563EB;background:rgba(37,99,235,.15);color:#fff;}
.fm-err{font-size:12px;color:#f87171;margin-top:7px;display:none;}
.fm-nav{display:flex;gap:9px;margin-top:20px;}
.fm-back{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);padding:11px 20px;border-radius:50px;font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;transition:all .25s;}
.fm-back:hover{color:#fff;background:rgba(255,255,255,.1);}
.fm-next{flex:1;background:linear-gradient(90deg,#2563EB,#38BDF8);color:#fff;border:none;padding:12px 20px;border-radius:50px;font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:700;cursor:pointer;transition:box-shadow .3s,transform .3s;}
.fm-next:hover{box-shadow:0 0 24px rgba(37,99,235,.55);transform:translateY(-1px);}
.fm-success{text-align:center;padding:14px 0 6px;}
.fm-success .s-ico{font-size:48px;margin-bottom:14px;}
.fm-success h3{font-family:'Manrope',sans-serif;font-size:19px;font-weight:800;margin-bottom:8px;}
.fm-success p{font-size:14px;color:rgba(255,255,255,.5);line-height:1.75;}
@media(max-width:520px){#form-modal{border-radius:18px;}.fm-hdr,.fm-body,.fm-prog{padding-left:18px;padding-right:18px;}.plat-grid{grid-template-columns:1fr;}}
`;
document.head.appendChild(s);

/* ── HTML ── */
var bg = document.createElement('div');
bg.id = 'form-modal-bg';
bg.innerHTML = '<div id="form-modal" role="dialog" aria-modal="true">'
  + '<div class="fm-hdr"><div><h2>' + t.title + '</h2><p>' + t.sub + '</p></div>'
  + '<button class="fm-x" onclick="closeLeadForm()">✕</button></div>'
  + '<div class="fm-prog"><div class="fm-pb active" id="pb1"></div><div class="fm-pb" id="pb2"></div><div class="fm-pb" id="pb3"></div></div>'
  + '<div class="fm-body">'

  // Step 1: Platforms
  + '<div class="fm-step active" id="fm-s1">'
  + '<div class="fm-slbl">' + t.step1 + '</div>'
  + '<div class="plat-grid">'
  + platforms.map(function(p,i){
      var val = ['meta','google','tiktok','linkedin','smm','all'][i] || 'other';
      return '<div class="plat-it" data-val="'+val+'"><span class="plat-ico">'+p.split(' ')[0]+'</span><span class="plat-nm">'+p.slice(p.indexOf(' ')+1)+'</span></div>';
    }).join('')
  + '</div><div class="fm-err" id="e1">' + t.e1 + '</div>'
  + '<div class="fm-nav"><button class="fm-next" onclick="fmNext(1)">' + t.next + '</button></div></div>'

  // Step 2: Business + Budget
  + '<div class="fm-step" id="fm-s2">'
  + '<div class="fm-slbl">' + t.step2 + '</div>'
  + '<div class="fm-field"><label>' + t.bizLabel + '</label>'
  + '<select id="fm-biz"><option value="">' + t.bizPlh + '</option>'
  + bizOptions.map(function(b){ return '<option value="'+b.slice(b.indexOf(' ')+1)+'">'+b+'</option>'; }).join('')
  + '</select></div>'
  + '<div class="fm-field"><label>' + t.budgetLabel + '</label>'
  + '<div class="bud-grid">'
  + t.budgets.map(function(b){ return '<div class="bud-it" data-val="'+b+'">'+b+'</div>'; }).join('')
  + '</div></div>'
  + '<div class="fm-err" id="e2">' + t.e2 + '</div>'
  + '<div class="fm-nav"><button class="fm-back" onclick="fmPrev(2)">' + t.back + '</button>'
  + '<button class="fm-next" onclick="fmNext(2)">' + t.next + '</button></div></div>'

  // Step 3: Contact
  + '<div class="fm-step" id="fm-s3">'
  + '<div class="fm-slbl">' + t.step3 + '</div>'
  + '<div class="fm-field"><label>' + t.nameLabel + '</label><input type="text" id="fm-name" placeholder="' + t.namePh + '" autocomplete="name"/></div>'
  + '<div class="fm-field"><label>' + t.phoneLbl + '</label><input type="tel" id="fm-phone" placeholder="' + t.phonePh + '" autocomplete="tel"/></div>'
  + '<div class="fm-err" id="e3">' + t.e3 + '</div>'
  + '<div class="fm-nav"><button class="fm-back" onclick="fmPrev(3)">' + t.back + '</button>'
  + '<button class="fm-next" onclick="fmSubmit()">' + t.send + '</button></div></div>'

  + '</div></div>';
document.body.appendChild(bg);
bg.addEventListener('click', function(e){ if(e.target === bg) closeLeadForm(); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLeadForm(); });

var state = { platforms:[], budget:'' };

/* Platform toggle */
document.querySelectorAll('.plat-it').forEach(function(item){
  item.addEventListener('click', function(){
    var val = item.dataset.val;
    if(val === 'all'){
      document.querySelectorAll('.plat-it').forEach(function(i){ i.classList.add('sel'); });
      state.platforms = ['meta','google','tiktok','linkedin','smm'];
    } else {
      item.classList.toggle('sel');
      var idx = state.platforms.indexOf(val);
      if(idx > -1) state.platforms.splice(idx,1); else state.platforms.push(val);
      if(!item.classList.contains('sel')) document.querySelector('[data-val="all"]').classList.remove('sel');
    }
  });
});

/* Budget toggle */
document.querySelectorAll('.bud-it').forEach(function(item){
  item.addEventListener('click', function(){
    document.querySelectorAll('.bud-it').forEach(function(i){i.classList.remove('sel');});
    item.classList.add('sel'); state.budget = item.dataset.val;
  });
});

var cur = 1;
function updateProgress(){
  for(var i=1;i<=3;i++){
    document.getElementById('fm-s'+i).classList.toggle('active',i===cur);
    var pb = document.getElementById('pb'+i);
    pb.className = 'fm-pb'+(i<cur?' done':i===cur?' active':'');
  }
}

window.fmNext = function(from){
  if(from===1 && state.platforms.length===0){ document.getElementById('e1').style.display='block'; return; }
  document.getElementById('e1').style.display='none';
  if(from===2){
    var biz = document.getElementById('fm-biz').value;
    if(!biz || !state.budget){ document.getElementById('e2').style.display='block'; return; }
    document.getElementById('e2').style.display='none';
  }
  cur = from+1; updateProgress();
};
window.fmPrev = function(from){ cur=from-1; updateProgress(); };

var pNames = {meta:'Meta',google:'Google Ads',tiktok:'TikTok',linkedin:'LinkedIn',smm:'SMM'};

window.fmSubmit = function(){
  var name = document.getElementById('fm-name').value.trim();
  var phone = document.getElementById('fm-phone').value.trim();
  if(!name||!phone){ document.getElementById('e3').style.display='block'; return; }
  document.getElementById('e3').style.display='none';
  var biz = document.getElementById('fm-biz').value;
  var svcs = state.platforms.map(function(p){return pNames[p]||p;}).join(', ') || 'All';
  var msg = t.waPrefix.replace('{name}',name).replace('{biz}',biz).replace('{svcs}',svcs).replace('{budget}',state.budget);
  window.open(WA + encodeURIComponent(msg), '_blank');
  document.getElementById('fm-s3').innerHTML = '<div class="fm-success"><div class="s-ico">✅</div><h3>'+t.successTitle+'</h3><p>'+t.successMsg+'</p><button onclick="closeLeadForm()" style="margin-top:18px;background:#2563EB;color:#fff;border:none;padding:11px 26px;border-radius:50px;font-family:Manrope,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">'+t.close+'</button></div>';
};

window.openLeadForm = function(){ bg.classList.add('open'); document.body.style.overflow='hidden'; };
window.closeLeadForm = function(){ bg.classList.remove('open'); document.body.style.overflow=''; };

/* Wire nav-cta buttons */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.nav-cta').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openLeadForm(); });
  });
});

})();
