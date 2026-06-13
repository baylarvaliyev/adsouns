import os, glob

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# Comprehensive replacement rules for each language context
# Format: list of (old, new) tuples
RU_ALL = [
    ('/pages/hesablayici.html', '/ru/calculator.html'),
    ('/pages/xidmetler.html#meta', '/ru/services.html'),
    ('/pages/xidmetler.html#google', '/ru/services.html'),
    ('/pages/xidmetler.html#tiktok', '/ru/services.html'),
    ('/pages/xidmetler.html#linkedin', '/ru/services.html'),
    ('/pages/xidmetler.html#smm', '/ru/services.html'),
    ('/pages/xidmetler.html', '/ru/services.html'),
    ('/pages/qiymetler.html', '/ru/pricing.html'),
    ('/pages/haqqimizda.html', '/ru/about.html'),
    ('/pages/elaqe.html', '/ru/'),
    ('/en/calculator.html', '/ru/calculator.html'),
    ('/en/services.html', '/ru/services.html'),
    ('/en/pricing.html', '/ru/pricing.html'),
    ('/en/about.html', '/ru/about.html'),
    ('/en/', '/ru/'),
]

TR_ALL = [
    ('/pages/hesablayici.html', '/tr/calculator.html'),
    ('/pages/xidmetler.html#meta', '/tr/services.html'),
    ('/pages/xidmetler.html#google', '/tr/services.html'),
    ('/pages/xidmetler.html#tiktok', '/tr/services.html'),
    ('/pages/xidmetler.html#linkedin', '/tr/services.html'),
    ('/pages/xidmetler.html#smm', '/tr/services.html'),
    ('/pages/xidmetler.html', '/tr/services.html'),
    ('/pages/qiymetler.html', '/tr/pricing.html'),
    ('/pages/haqqimizda.html', '/tr/about.html'),
    ('/pages/elaqe.html', '/tr/'),
    ('/en/calculator.html', '/tr/calculator.html'),
    ('/en/services.html', '/tr/services.html'),
    ('/en/pricing.html', '/tr/pricing.html'),
    ('/en/about.html', '/tr/about.html'),
    ('/en/', '/tr/'),
]

EN_ALL = [
    ('/pages/hesablayici.html', '/calculator.html'),
    ('/pages/xidmetler.html#meta', '/services.html'),
    ('/pages/xidmetler.html#google', '/services.html'),
    ('/pages/xidmetler.html#tiktok', '/services.html'),
    ('/pages/xidmetler.html#linkedin', '/services.html'),
    ('/pages/xidmetler.html#smm', '/services.html'),
    ('/pages/xidmetler.html', '/services.html'),
    ('/pages/qiymetler.html', '/pricing.html'),
    ('/pages/haqqimizda.html', '/about.html'),
    ('/pages/elaqe.html', '/'),
    ('/en/calculator.html', '/calculator.html'),
    ('/en/services.html', '/services.html'),
    ('/en/pricing.html', '/pricing.html'),
    ('/en/about.html', '/about.html'),
    ('href="/en/"', 'href="/"'),
]

def fix_file(path, rules):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f: c = f.read()
    c2 = c
    for old, new in rules: c2 = c2.replace(old, new)
    if c2 != c:
        with open(path, 'w', encoding='utf-8') as f: f.write(c2)
        # Count remaining AZ links
        remaining = sum(c2.count(x) for x in ['hesablayici','xidmetler','haqqimizda','qiymetler','/en/calculator','/en/services','/en/pricing','/en/about'])
        print(f'Fixed: {path.split(BASE)[-1]}  (remaining: {remaining})')
    else:
        print(f'No change: {path.split(BASE)[-1]}')

print('=== EN files ===')
for f in ['index.html','en/index.html','en/services.html','en/pricing.html','en/about.html','en/calculator.html',
          'services.html','pricing.html','about.html','calculator.html']:
    fix_file(BASE+f, EN_ALL)

print('\n=== RU files ===')
for f in glob.glob(BASE+'ru/*.html'):
    fix_file(f, RU_ALL)

print('\n=== TR files ===')
for f in glob.glob(BASE+'tr/*.html'):
    fix_file(f, TR_ALL)

# Fix blog pages (always EN, so use EN rules)
print('\n=== Blog files ===')
for f in glob.glob(BASE+'blog/*.html'):
    fix_file(f, EN_ALL)

print('\nDone.')
