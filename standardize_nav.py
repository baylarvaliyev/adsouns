import re, glob, os

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# Canonical desktop nav-links (EN pages, with lang switcher)
def make_desktop_nav(active):
    items = [
        ('/', 'Home'), ('/services.html', 'Services'), ('/pricing.html', 'Pricing'),
        ('/calculator.html', 'Calculator'), ('/case-studies.html', 'Case Studies'),
        ('/testimonials.html', 'Reviews'), ('/blog/', 'Blog'), ('/about.html', 'About'),
    ]
    out = []
    for href, label in items:
        cls = ' class="active"' if href == active else ''
        out.append(f'<a href="{href}"{cls}>{label}</a>')
    links_html = ''.join(out)
    return (f'<div class="nav-links">\n      {links_html}\n'
            '<a href="/get-started.html" class="nav-cta">Free Trial &rarr;</a>\n'
            '<div class="lang-sw"><button class="ls-btn" onclick="switchLang(\'az\')">AZ</button>'
            '<button class="ls-btn active">EN</button>'
            '<button class="ls-btn" onclick="switchLang(\'ru\')">RU</button>'
            '<button class="ls-btn" onclick="switchLang(\'tr\')">TR</button></div>\n    </div>')

def make_mobile_nav():
    return ('''<div class="mob-menu" id="mobMenu">
    <button class="mob-close-btn" onclick="closeMenu()">&times;</button>
    <a href="/" onclick="closeMenu()">Home</a>
    <div class="mob-lang"><button class="mls-btn" onclick="closeMenu();switchLang('az')">AZ</button><button class="mls-btn active">EN</button><button class="mls-btn" onclick="closeMenu();switchLang('ru')">RU</button><button class="mls-btn" onclick="closeMenu();switchLang('tr')">TR</button></div>
    <a href="/services.html" onclick="closeMenu()">Services</a>
    <a href="/pricing.html" onclick="closeMenu()">Pricing</a>
    <a href="/calculator.html" onclick="closeMenu()">Calculator</a>
    <a href="/case-studies.html" onclick="closeMenu()">Case Studies</a>
    <a href="/testimonials.html" onclick="closeMenu()">Reviews</a>
    <a href="/blog/" onclick="closeMenu()">Blog</a>
    <a href="/about.html" onclick="closeMenu()">About</a>
    <a href="/get-started.html" onclick="closeMenu()">Free Trial &rarr;</a>
  </div>''')

TARGETS = {
    'about.html': '/about.html',
    'services.html': '/services.html',
    'pricing.html': '/pricing.html',
    'calculator.html': '/calculator.html',
    'case-studies.html': '/case-studies.html',
    'testimonials.html': '/testimonials.html',
}

for fname, active in TARGETS.items():
    path = BASE + fname
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    orig = c

    # Replace <div class="nav-links">...</div> (first occurrence, non-greedy, single line or multi)
    new_desktop = make_desktop_nav(active)
    c2 = re.sub(r'<div class="nav-links">.*?</div>\s*</div>\s*<button class="burger"',
                new_desktop + '\n    </div>\n    <button class="burger"', c, count=1, flags=re.DOTALL)

    if c2 == c:
        print(fname, '- DESKTOP NAV REGEX DID NOT MATCH')
    else:
        c = c2
        print(fname, '- desktop nav replaced')

    # Replace <div class="mob-menu" id="mobMenu">...</div>\n</nav> (first occurrence)
    new_mobile = make_mobile_nav()
    c3 = re.sub(r'<div class="mob-menu" id="mobMenu">.*?</div>\s*</nav>',
                new_mobile + '\n</nav>', c, count=1, flags=re.DOTALL)
    if c3 == c:
        print(fname, '- MOBILE NAV REGEX DID NOT MATCH')
    else:
        c = c3
        print(fname, '- mobile nav replaced')

    if c != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(fname, '-> SAVED\n')
    else:
        print(fname, '-> no changes\n')

print('Done.')
