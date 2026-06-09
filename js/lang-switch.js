/* lang-switch.js — Language Switcher Widget
   Injects a flag dropdown into the nav on all pages */
(function(){
  var LANG_KEY = 'adsonus_lang';

  var langs = [
    { code:'az', label:'AZ', flag:'🇦🇿', path:'/'     },
    { code:'en', label:'EN', flag:'🇬🇧', path:'/en/'  },
    { code:'ru', label:'RU', flag:'🇷🇺', path:'/ru/'  },
    { code:'tr', label:'TR', flag:'🇹🇷', path:'/tr/'  }
  ];

  // Detect current lang from path
  function getCurrentLang(){
    var p = window.location.pathname;
    if(p.startsWith('/en')) return 'en';
    if(p.startsWith('/ru')) return 'ru';
    if(p.startsWith('/tr')) return 'tr';
    return 'az';
  }

  var current = getCurrentLang();

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '#lang-switcher{position:relative;margin-left:8px;}',
    '#lang-btn{',
    '  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);',
    '  border-radius:8px;padding:7px 11px;',
    '  font-family:"Manrope",sans-serif;font-size:12px;font-weight:700;',
    '  color:rgba(255,255,255,.7);cursor:pointer;',
    '  display:flex;align-items:center;gap:6px;',
    '  transition:all .25s;white-space:nowrap;',
    '}',
    '#lang-btn:hover{background:rgba(255,255,255,.13);color:#fff;}',
    '#lang-btn .arrow{font-size:9px;opacity:.5;transition:transform .25s;}',
    '#lang-switcher.open #lang-btn .arrow{transform:rotate(180deg);}',
    '#lang-menu{',
    '  position:absolute;top:calc(100% + 8px);right:0;',
    '  background:rgba(8,13,26,.97);border:1px solid rgba(255,255,255,.1);',
    '  border-radius:12px;overflow:hidden;min-width:130px;',
    '  box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(20px);',
    '  opacity:0;transform:translateY(8px) scale(.97);pointer-events:none;',
    '  transition:opacity .25s,transform .3s cubic-bezier(0.16,1,0.3,1);',
    '  z-index:600;',
    '}',
    '#lang-switcher.open #lang-menu{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}',
    '.lang-opt{',
    '  display:flex;align-items:center;gap:10px;padding:11px 15px;',
    '  font-family:"Manrope",sans-serif;font-size:13px;font-weight:600;',
    '  color:rgba(255,255,255,.55);cursor:pointer;',
    '  transition:background .2s,color .2s;text-decoration:none;',
    '}',
    '.lang-opt:hover{background:rgba(255,255,255,.07);color:#fff;}',
    '.lang-opt.active{color:#fff;background:rgba(37,99,235,.15);}',
    '.lang-opt .flag{font-size:16px;}',
    '.lang-opt .lname{flex:1;}',
    '.lang-opt .check{color:#2563EB;font-size:12px;opacity:0;}',
    '.lang-opt.active .check{opacity:1;}'
  ].join('');
  document.head.appendChild(style);

  // Build widget HTML
  var currentLang = langs.find(function(l){ return l.code === current; }) || langs[0];

  var wrapper = document.createElement('div');
  wrapper.id = 'lang-switcher';

  var btn = document.createElement('button');
  btn.id = 'lang-btn';
  btn.setAttribute('aria-label','Change language');
  btn.innerHTML = '<span class="flag">' + currentLang.flag + '</span>'
    + '<span>' + currentLang.label + '</span>'
    + '<span class="arrow">▼</span>';

  var menu = document.createElement('div');
  menu.id = 'lang-menu';
  menu.setAttribute('role','menu');

  langs.forEach(function(l){
    var opt = document.createElement('a');
    opt.className = 'lang-opt' + (l.code === current ? ' active' : '');
    opt.href = l.path;
    opt.setAttribute('role','menuitem');
    opt.innerHTML = '<span class="flag">' + l.flag + '</span>'
      + '<span class="lname">' + l.flag + ' ' + l.label + ' — '
      + {az:'Azərbaycan', en:'English', ru:'Русский', tr:'Türkçe'}[l.code]
      + '</span><span class="check">✓</span>';
    opt.addEventListener('click', function(e){
      e.preventDefault();
      localStorage.setItem(LANG_KEY, l.code);
      window.location.href = l.path;
    });
    menu.appendChild(opt);
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(menu);

  // Toggle
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    wrapper.classList.toggle('open');
  });
  document.addEventListener('click', function(){
    wrapper.classList.remove('open');
  });

  // Inject into nav
  document.addEventListener('DOMContentLoaded', function(){
    var navLinks = document.querySelector('.nav-links');
    if(navLinks) navLinks.appendChild(wrapper);
  });
})();
