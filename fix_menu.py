import re, os

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# Pages with inline mob-menu CSS that overrides style.css
PAGES = [
    'az/index.html',
    'en/index.html',
    'ru/index.html',
    'tr/index.html',
    'index.html',
]

# The old inline mob-menu CSS patterns to remove (both copies)
OLD_MOB_CSS_PATTERNS = [
    # Original old style (no height:100dvh)
    r'\.mob-menu\{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#04080F;flex-direction:column;padding:80px 5% 36px;z-index:8002;overflow-y:auto;\}\s*',
    r'\.mob-menu\.open\{display:flex;\}\s*',
    # Old mob-menu a styles
    r'\.mob-menu a\{font-family:"Manrope",sans-serif;font-size:clamp\(24px,6vw,38px\);font-weight:700;color:rgba\(255,255,255,\.45\);padding:16px 0;border-bottom:1px solid rgba\(255,255,255,\.07\);display:block;transition:color \.25s,padding-left \.3s [^}]+\}\s*',
    r'\.mob-menu a:hover\{color:#fff;padding-left:8px;\}\s*',
    r'\.mob-menu a:last-child\{border:none;background:#2563EB;color:#fff!important;text-align:center;padding:16px!important;border-radius:50px;margin-top:24px;font-size:16px!important;font-family:"Manrope",sans-serif;font-weight:700;\}\s*',
    # Newer but still wrong mob-menu CSS (without height:100dvh)
    r'\.mob-menu\{display:none;position:fixed;top:0;left:0;right:0;bottom:0;height:100%;height:100vh;height:100dvh;background:#04080F;flex-direction:column;padding:76px 28px 32px;z-index:8002;overflow-y:auto;\}\s*',
    r'\.mob-menu\.open\{display:flex;\}\s*',
    r'\.mob-menu>a\{[^}]+\}\s*',
    r'\.mob-menu>a:hover,[^{]+\{[^}]+\}\s*',
    r'\.mob-menu>a:last-child\{[^}]+\}\s*',
    r'\.mob-menu a:hover\{[^}]+\}\s*',
]

# Also fix the burger CSS inline
OLD_BURGER_PATTERNS = [
    r'\.burger\{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:none;padding:6px;\}\s*',
    r'\.burger\{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;[^}]*\}\s*',
    r'\.burger\{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;\}\s*',
    r'\.burger span\{display:block;width:22px;height:2px;background:rgba\(255,255,255,\.7\);border-radius:2px;transition:all \.3s;pointer-events:none;\}\s*',
    r'\.burger span\{display:block;width:22px;height:2px;background:rgba\(255,255,255,\.7\);border-radius:2px;transition:all \.3s;\}\s*',
]

total_removed = 0

for fname in PAGES:
    full = BASE + fname
    if not os.path.exists(full):
        print('MISSING:', fname)
        continue
    with open(full, 'r', encoding='utf-8') as f:
        c = f.read()
    
    c2 = c
    removed = 0
    
    # Remove old inline mob-menu CSS
    for pattern in OLD_MOB_CSS_PATTERNS + OLD_BURGER_PATTERNS:
        before = c2
        c2 = re.sub(pattern, '', c2)
        if c2 != before:
            removed += 1
    
    if c2 != c:
        with open(full, 'w', encoding='utf-8') as f:
            f.write(c2)
        print(f'Fixed {fname}: removed {removed} old CSS patterns')
        total_removed += removed
    else:
        print(f'No inline mob CSS found in {fname}')

print(f'\nTotal patterns removed: {total_removed}')
