# Run this from: C:\Users\Baylar\Documents\GitHub\adsouns\
# Command: python fix_cursor.py

import os

files_to_fix = [
    'az/index.html',
    'en/index.html',
    'ru/index.html', 
    'tr/index.html',
    'index.html',
]

replacements = [
    # Body cursor:none → remove it
    ('overflow-x:hidden;cursor:none;-webkit-font-smoothing', 
     'overflow-x:hidden;-webkit-font-smoothing'),
    # faq-q cursor:none → pointer
    (';cursor:none;gap:16px;}', ';cursor:pointer;gap:16px;}'),
    # p-btn cursor:none → pointer
    ('border:none;cursor:none;transition:', 'border:none;cursor:pointer;transition:'),
    # .tc cursor:none → remove
    ('transition:all .4s var(--expo);cursor:none;}', 'transition:all .4s var(--expo);}'),
    # svc-item cursor:none → pointer
    (';cursor:none;position:relative;overflow:hidden;}', ';cursor:pointer;position:relative;overflow:hidden;}'),
    # Any remaining cursor:none in CSS (but not in JS/comments)
]

total = 0
for fname in files_to_fix:
    if not os.path.exists(fname):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
    
    remaining = content.count('cursor:none')
    if changed:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {fname} — cursor:none remaining: {remaining}')
        total += 1
    else:
        print(f'No changes in {fname} — cursor:none count: {remaining}')

print(f'\nTotal files fixed: {total}')
