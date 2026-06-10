/* lang-detect.js - AdsOnUs
   Root / is now English (default for global traffic).
   AZ users redirect to /az/
   TR users to /tr/
   RU/CIS users to /ru/
   Others stay on / (English)
*/
(function(){
  var path = window.location.pathname;

  /* Already on a language subfolder - don't redirect */
  if(/^\/(az|en|ru|tr)(\/|$)/.test(path)) return;

  /* Check stored user preference */
  var pref = localStorage.getItem('adsonus_lang');
  if(pref === 'az'){ window.location.replace('/az/'); return; }
  if(pref === 'ru'){ window.location.replace('/ru/'); return; }
  if(pref === 'tr'){ window.location.replace('/tr/'); return; }
  if(pref === 'en') return; /* stay on root */

  /* Check session cache */
  var cached = sessionStorage.getItem('adsonus_country');
  if(cached){ applyCountry(cached); return; }

  /* IP detection */
  var RU_COUNTRIES = ['RU','BY','KZ','KG','UZ','TJ','AM','GE','MD','UA'];

  function applyCountry(country){
    if(country === 'AZ')                    window.location.replace('/az/');
    else if(country === 'TR')               window.location.replace('/tr/');
    else if(RU_COUNTRIES.indexOf(country) > -1) window.location.replace('/ru/');
    /* All others stay on root (English) */
  }

  fetch('https://api.country.is/')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var country = (d.country || '').toUpperCase().slice(0,2);
      sessionStorage.setItem('adsonus_country', country);
      applyCountry(country);
    })
    .catch(function(){
      /* Fallback: navigator.language */
      var lang = (navigator.language || '').toLowerCase();
      if(lang.startsWith('az')) window.location.replace('/az/');
      else if(lang.startsWith('tr')) window.location.replace('/tr/');
      else if(lang.startsWith('ru')) window.location.replace('/ru/');
      /* English is default - no redirect needed */
    });
})();
