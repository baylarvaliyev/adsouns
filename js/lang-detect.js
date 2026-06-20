/* lang-detect.js - AdsOnUs
   DISABLED auto-redirect by IP/geography.
   Why: paid traffic (Google/Meta Ads) sends visitors to an exact URL.
   Auto-redirecting by detected country silently pulls people away from
   landing pages before conversion tracking fires, and causes confusing
   behavior when testing the site from Azerbaijan (or via VPN) makes the
   "global" site appear to redirect to the AZ version.

   Visitors now always see the page they actually navigated to.
   The language switcher (AZ/EN/RU/TR buttons in nav) is the only way
   to change language. We still remember an explicit choice for their
   next visit to the ROOT URL only (not for direct/ad-traffic landing pages).
*/
(function(){
  var path = window.location.pathname;

  /* Already on a language subfolder - never redirect */
  if(/^\/(az|en|ru|tr)(\/|$)/.test(path)) return;

  /* Only apply a remembered preference on the bare root URL "/" -
     never on landing pages, get-started, thank-you, case-studies, etc.
     This preserves "remember my language" for organic repeat visitors
     without ever interfering with paid traffic landing on a specific page. */
  if(path !== '/') return;

  var pref = localStorage.getItem('adsonus_lang');
  if(pref === 'az'){ window.location.replace('/az/'); return; }
  if(pref === 'ru'){ window.location.replace('/ru/'); return; }
  if(pref === 'tr'){ window.location.replace('/tr/'); return; }
  /* pref === 'en' or no preference: stay on root. No IP/geo detection. */
})();
