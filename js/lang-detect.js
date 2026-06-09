/* lang-detect.js — AdsOnUs
   Auto-detects country via IP, redirects to language version.
   Respects explicit user preference (localStorage).
   Only runs on root AZ pages (not /en/, /ru/, /tr/).
*/
(function(){
  var path = window.location.pathname;

  // Already on a language version — don't redirect
  if(/^\/(en|ru|tr)(\/|$)/.test(path)) return;

  // Map language code → home path
  var LANG_PATH = { az:'/', en:'/en/', ru:'/ru/', tr:'/tr/' };

  // RU-speaking countries (CIS where Meta/Google still available)
  var RU_COUNTRIES = ['RU','BY','KZ','KG','UZ','TJ','AM','GE','MD','UA'];

  function redirect(lang){
    if(lang === 'az') return; // stay
    var dest = LANG_PATH[lang];
    if(dest && window.location.pathname !== dest){
      // Preserve path suffix (e.g. /blog/ → /en/blog/ if exists)
      window.location.replace(dest);
    }
  }

  // 1. Explicit user preference
  var pref = localStorage.getItem('adsonus_lang');
  if(pref && LANG_PATH[pref]){ redirect(pref); return; }

  // 2. Already detected this session
  var cached = sessionStorage.getItem('adsonus_country');
  if(cached){ applyCountry(cached); return; }

  // 3. Detect via IP — use two APIs with fallback
  var apis = [
    'https://api.country.is/',
    'https://ipapi.co/country/'
  ];

  function tryApi(idx){
    if(idx >= apis.length){ fallback(); return; }
    fetch(apis[idx])
      .then(function(r){
        if(!r.ok) throw new Error();
        // api.country.is returns JSON; ipapi.co returns plain text
        var isJson = apis[idx].includes('country.is');
        return isJson ? r.json() : r.text();
      })
      .then(function(data){
        var country = typeof data === 'object' ? (data.country || '') : data.trim();
        country = country.toUpperCase().slice(0,2);
        if(!country || country.length !== 2) throw new Error();
        sessionStorage.setItem('adsonus_country', country);
        applyCountry(country);
      })
      .catch(function(){ tryApi(idx + 1); });
  }

  function applyCountry(country){
    if(country === 'AZ')              redirect('az');
    else if(country === 'TR')         redirect('tr');
    else if(RU_COUNTRIES.includes(country)) redirect('ru');
    else                              redirect('en');
  }

  function fallback(){
    // Use browser language as last resort
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if(lang.startsWith('az'))      redirect('az');
    else if(lang.startsWith('tr')) redirect('tr');
    else if(lang.startsWith('ru')) redirect('ru');
    else                           redirect('en');
  }

  tryApi(0);
})();

  window.location.href = paths[lang] || '/';
};
