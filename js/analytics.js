/* analytics.js — AdsOnUs
   
   SETUP INSTRUCTIONS:
   1. Google Analytics 4:
      - Go to analytics.google.com → Admin → Create Property
      - Copy your Measurement ID (format: G-XXXXXXXXXX)
      - Replace 'G-XXXXXXXXXX' below with your real ID
   
   2. Meta Pixel:
      - Go to business.facebook.com → Events Manager → Connect Data → Web
      - Create a Pixel → copy the Pixel ID (format: 1234567890123)
      - Replace '1234567890123' below with your real Pixel ID
*/

var GA4_ID    = 'G-XXXXXXXXXX';   // ← Replace with your GA4 Measurement ID
var PIXEL_ID  = '1234567890123';  // ← Replace with your Meta Pixel ID

/* ── Google Analytics 4 ── */
(function(){
  if(GA4_ID === 'G-XXXXXXXXXX') return; // skip if not configured
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true
  });
  // Track WhatsApp clicks
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href*="wa.me"]');
    if(a) gtag('event','whatsapp_click',{event_category:'CTA',event_label:document.title});
  });
  // Track calculator usage
  var calcBiz = document.getElementById('calc-biz');
  if(calcBiz) calcBiz.addEventListener('change', function(){
    gtag('event','calculator_used',{event_category:'Engagement',event_label:calcBiz.value});
  });
})();

/* ── Meta Pixel ── */
(function(){
  if(PIXEL_ID === '1234567890123') return; // skip if not configured
  if(localStorage.getItem('cookie_ok') === 'declined') return; // respect opt-out
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
  // Track WhatsApp button clicks as Lead
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href*="wa.me"]');
    if(a) fbq('track','Lead',{content_name:'WhatsApp CTA',content_category:'Lead'});
  });
  // Track form submission
  document.addEventListener('click', function(e){
    if(e.target.closest && e.target.closest('#fm-s3 .fm-btn-next')){
      fbq('track','Contact');
    }
  });
})();
