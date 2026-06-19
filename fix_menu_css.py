CORRECT_MENU_CSS = """.burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;min-width:44px;min-height:44px;align-items:center;justify-content:center;}
.burger span{display:block;width:22px;height:2px;background:rgba(255,255,255,.7);border-radius:2px;transition:all .3s;pointer-events:none;}
html.nav-open,html.nav-open body{overflow:hidden!important;}
.mob-menu{display:none;position:fixed;top:0;left:0;right:0;width:100%;height:100vh;background:#04080F;flex-direction:column;padding:72px 24px 28px;z-index:8002;overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;padding-bottom:max(28px, env(safe-area-inset-bottom));}
.mob-menu.open{display:flex;}
.mob-menu>a{font-family:"Manrope",sans-serif;font-size:clamp(18px,5vw,28px);font-weight:700;color:rgba(255,255,255,.55);padding:13px 0;border-bottom:1px solid rgba(255,255,255,.07);display:block;transition:color .2s;text-decoration:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
.mob-menu>a:hover,.mob-menu>a:active{color:#fff;}
.mob-menu>a:last-child{border:none;background:#2563EB;color:#fff!important;font-size:16px!important;text-align:center;padding:14px!important;border-radius:50px;margin-top:16px;}
.mob-close-btn{position:absolute;top:24px;right:24px;background:none;border:none;color:rgba(255,255,255,.5);font-size:22px;cursor:pointer;width:40px;height:40px;}
@media(max-width:900px){.nav-links{display:none;}.burger{display:flex;}}"""

import os, re

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# Files with completely MISSING menu CSS - need full injection before </style>
MISSING_CSS_FILES = ['about.html', 'calculator.html']

# Files with OLD BROKEN menu CSS - need replacement
BROKEN_CSS_PATTERNS = {
    'services.html': '.mob-menu{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#04080F;flex-direction:column;padding:80px 5% 36px;z-index:8002;overflow-y:auto;}\n.mob-menu.open{display:flex;}\n.mob-menu a{font-family:\'Manrope\',sans-serif;font-size:clamp(22px,5vw,36px);font-weight:700;color:rgba(255,255,255,.5);padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);display:block;transition:color .25s;}\n.mob-menu a:hover{color:#fff;}',
    'pricing.html': '.mob-menu{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#04080F;flex-direction:column;padding:80px 5% 36px;z-index:8002;overflow-y:auto;}\n.mob-menu.open{display:flex;}\n.mob-menu a{font-family:\'Manrope\',sans-serif;font-size:clamp(22px,5vw,36px);font-weight:700;color:rgba(255,255,255,.5);padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);display:block;transition:color .25s;}\n.mob-menu a:hover{color:#fff;}',
}

print('=== Checking & fixing missing CSS files ===')
for fname in MISSING_CSS_FILES:
    path = BASE + fname
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if '.mob-menu{' in c or '.burger{' in c:
        print(f'{fname}: already has some menu CSS, skipping injection (will check separately)')
        continue
    # Inject before closing </style> tag
    if '</style>' in c:
        c2 = c.replace('</style>', CORRECT_MENU_CSS + '\n</style>', 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c2)
        print(f'Injected full menu CSS into: {fname}')
    else:
        print(f'WARNING: no </style> tag found in {fname}')

print('\n=== Fixing broken CSS files ===')
for fname, old_pattern in BROKEN_CSS_PATTERNS.items():
    path = BASE + fname
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if old_pattern in c:
        c2 = c.replace(old_pattern, CORRECT_MENU_CSS)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c2)
        print(f'Replaced broken menu CSS in: {fname}')
    else:
        print(f'Pattern not found in {fname} - needs manual check')

print('\nDone.')
