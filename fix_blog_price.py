import os, glob

BASE = 'C:/Users/Baylar/Documents/GitHub/adsouns/'

# ─── FIX 1: Add lang switcher to blog desktop nav ───────────────────────────
# Current blog desktop nav (no lang switcher):
OLD_BLOG_NAV = '<div class="nav-links"><a href="/">Home</a><a href="/services.html">Services</a><a href="/pricing.html">Pricing</a><a href="/blog/" class="active">Blog</a><a href="/about.html">About</a><a href="https://wa.me/994773698929" class="nav-cta" rel="noopener">Free Trial &rarr;</a></div>'

NEW_BLOG_NAV = '<div class="nav-links"><a href="/">Home</a><a href="/services.html">Services</a><a href="/pricing.html">Pricing</a><a href="/blog/" class="active">Blog</a><a href="/about.html">About</a><a href="https://wa.me/994773698929" class="nav-cta" rel="noopener">Free Trial &rarr;</a><div class="lang-sw" style="margin-left:8px;"><button class="ls-btn" onclick="switchLang(\'az\')">AZ</button><button class="ls-btn active">EN</button><button class="ls-btn" onclick="switchLang(\'ru\')">RU</button><button class="ls-btn" onclick="switchLang(\'tr\')">TR</button></div></div>'

# Fix blog index nav too
OLD_BLOG_IDX_NAV = '<div class="nav-links"><a href="/">Home</a><a href="/services.html">Services</a><a href="/pricing.html">Pricing</a><a href="/blog/" class="active">Blog</a><a href="/about.html">About</a><a href="https://wa.me/994773698929" class="nav-cta" rel="noopener">Free Trial &rarr;</a></div>'

blog_files = glob.glob(BASE + 'blog/*.html')
blog_fixed = 0
for path in blog_files:
    f = open(path, 'r', encoding='utf-8'); c = f.read(); f.close()
    c2 = c.replace(OLD_BLOG_NAV, NEW_BLOG_NAV)
    if c2 != c:
        f = open(path, 'w', encoding='utf-8'); f.write(c2); f.close()
        blog_fixed += 1
print(f'Blog nav fixed: {blog_fixed}/{len(blog_files)} files')

# ─── FIX 2: Update EN pricing ($299/$599/$1,199 → $1,500/$2,500/$4,000) ─────
PRICE_FILES = [
    'pricing.html',
    'en/pricing.html',
    'index.html',
    'en/index.html',
]

PRICE_REPS = [
    # Meta tag
    ('Starter $299/mo, Growth $599/mo, Pro $1,199/mo',
     'Starter $1,500/mo, Growth $2,500/mo, Pro $4,000/mo'),
    # Price amounts
    ('>$299<sub>/mo</sub><',  '>$1,500<sub>/mo</sub><'),
    ('>$599<sub>/mo</sub><',  '>$2,500<sub>/mo</sub><'),
    ('>$1,199<sub>/mo</sub><','>$4,000<sub>/mo</sub><'),
    # Hero/section mentions
    ('$299/mo', '$1,500/mo'),
    ('$599/mo', '$2,500/mo'),
    ('$1,199/mo', '$4,000/mo'),
    ('$299/month', '$1,500/month'),
    ('$599/month', '$2,500/month'),
    ('$1,199/month', '$4,000/month'),
    # Plain text references in any copy
    ('from $299', 'from $1,500'),
    ('$299', '$1,500'),
    ('$599', '$2,500'),
    ('$1,199', '$4,000'),
    # Title tags and descriptions
    ('Starter $1500/mo', 'Starter $1,500/mo'),  # cleanup
]

price_fixed = 0
for fname in PRICE_FILES:
    full = BASE + fname
    if not os.path.exists(full): print('MISSING:', fname); continue
    f = open(full, 'r', encoding='utf-8'); c = f.read(); f.close()
    c2 = c
    for old, new in PRICE_REPS:
        c2 = c2.replace(old, new)
    if c2 != c:
        f = open(full, 'w', encoding='utf-8'); f.write(c2); f.close()
        price_fixed += 1
        print(f'Pricing updated: {fname}')
    else:
        print(f'No price changes: {fname}')

print(f'\nTotal pricing files updated: {price_fixed}')
print('Done.')
