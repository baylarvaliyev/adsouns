"""Builds adsonus.com's inner pages, and the shared header, footer and menu script.

One list (SERVICES) drives the Services menu, the footer, the quote form, the /services
hub, the sitemap and every service page. The header, footer and menu script are also
written back into index.html, so the homepage and the inner pages always match.
Run from the repo root: python3 tools/build_pages.py"""
import re, html, datetime

EMAIL = 'contact@adsonus.com'
ADDRESS = 'Rashid Behbudov 66, Baku, Azerbaijan'

# ---------------------------------------------------------------- services
PILLARS = [
  ('grow', 'Grow', 'Bring revenue in'),
  ('paid', 'Get paid', 'Collect it and control costs'),
  ('run',  'Run', 'Keep the business running'),
]
# slug, name, pillar, one-line description used in the menu, hub and footer
SERVICE_LIST = [
  ('marketing',            'Marketing',                  'grow', 'Google, Meta and LinkedIn ads'),
  ('sales-crm-operations', 'Sales & CRM operations',     'grow', 'Lead routing, CRM upkeep, pipeline reports'),
  ('accounts-receivable',  'Accounts receivable',        'paid', 'Overdue invoices followed up'),
  ('accounts-payable',     'Accounts payable',           'paid', 'Bills processed, payment runs prepared'),
  ('finance-reporting',    'Finance reporting',          'paid', 'Your cash position every Monday'),
  ('customer-operations',  'Customer operations',        'run',  'Inbox, tickets and order questions'),
  ('hr-recruiting',        'HR & recruiting operations', 'run',  'Hiring admin, onboarding, HR records'),
  ('it-help-desk',         'IT help desk',               'run',  'Remote first-line support and accounts'),
]
def in_pillar(p): return [s for s in SERVICE_LIST if s[2] == p]
esc = html.escape

# ---------------------------------------------------------------- shared chrome
def build_header():
    cols = ''
    for key, name, sub in PILLARS:
        links = ''.join(f'<a href="/{slug}"><b>{esc(n)}</b><span>{esc(d)}</span></a>' for slug, n, _, d in in_pillar(key))
        cols += f'<div class="menu-col"><p class="svc-pillar">{name}<span>{sub}</span></p>{links}</div>'
    return f'''<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/" aria-label="adsonus home"><img src="/img/logo-mark.svg" alt="" width="30" height="30"/><span>adsonus</span></a>
    <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
      <div class="nav-svc">
        <button class="nav-svc-btn" id="svc-btn" aria-expanded="false" aria-controls="svc-menu">Services<span class="chev" aria-hidden="true"></span></button>
        <div class="svc-menu" id="svc-menu">{cols}<a class="svc-all" href="/services">All services <span aria-hidden="true">→</span></a></div>
      </div>
      <a href="/how-we-work">How we work</a>
      <a href="/security">Security</a>
      <a href="/about">About</a>
      <a class="btn btn-primary" href="/quote">Get a quote</a>
    </nav>
  </div>
</header>'''

def build_footer():
    cols = ''
    for key, name, _ in PILLARS:
        cols += f'<div><h4>{name}</h4><ul>' + ''.join(f'<li><a href="/{slug}">{esc(n)}</a></li>' for slug, n, _, _ in in_pillar(key)) + '</ul></div>'
    cols += ('<div><h4>Company</h4><ul><li><a href="/services">All services</a></li><li><a href="/how-we-work">How we work</a></li>'
             '<li><a href="/security">Security</a></li><li><a href="/about">About</a></li></ul></div>')
    cols += (f'<div><h4>Contact</h4><ul><li><a href="mailto:{EMAIL}">{EMAIL}</a></li><li>Rashid Behbudov 66</li><li>Baku, Azerbaijan</li></ul>'
             '<p class="f-tag">Back-office operations for small and medium businesses.</p></div>')
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="f-mark" aria-hidden="true"><svg viewBox="0 0 202 200"><use href="#mark"/></svg><span class="word">adsonus</span></div>
    <div class="footer-grid">{cols}</div>
    <div class="footer-base">
      <span>© 2026 Adsonus · <a href="/security">Security</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
      <a class="btn btn-primary" href="/quote">Get a quote <span class="arr" aria-hidden="true">→</span></a>
    </div>
  </div>
</footer>'''

NAVJS = '''<script>
(function(){var t=document.getElementById('nav-toggle'),n=document.getElementById('nav'),b=document.getElementById('svc-btn'),m=document.getElementById('svc-menu');
if(t&&n)t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});
if(b&&m){var set=function(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');};
b.addEventListener('click',function(e){e.stopPropagation();set(!m.classList.contains('open'));});
document.addEventListener('click',function(e){if(!m.contains(e.target))set(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open')){set(false);b.focus();}});}})();
</script>'''

HEADER, FOOTER = build_header(), build_footer()

# Write the shared chrome back into the homepage so it matches every inner page.
INDEX = open('index.html', encoding='utf-8').read()
INDEX = re.sub(r'<header class="site-header">.*?</header>', lambda m: HEADER, INDEX, count=1, flags=re.S)
INDEX = re.sub(r'<footer class="site-footer">.*?</footer>', lambda m: FOOTER, INDEX, count=1, flags=re.S)
INDEX = re.sub(r'<script>\n\(function\(\)\{var t=document.*?</script>', lambda m: NAVJS, INDEX, count=1, flags=re.S)
open('index.html', 'w', encoding='utf-8', newline='').write(INDEX)

HEAD_TOP = INDEX.split('<title>')[0]
SPRITE = re.search(r'(<svg width="0" height="0".*?</svg>)', INDEX, re.S).group(1)
FONTS = re.search(r'(<link rel="preconnect".*?<link rel="stylesheet" href="/css/site-v3.css[^"]*"/>)', INDEX, re.S).group(1)
GTM_NS = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGJCN4HG" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
SITEJS = '<script src="/js/site-v3.js?v=2" defer></script>'
PAGE_ASSETS = '<link rel="stylesheet" href="/css/pages.css?v=4"/>'
PAGE_JS = ('<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>\n'
           '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>\n'
           '<script src="/js/pages.js?v=3" defer></script>')

# ---------------------------------------------------------------- building blocks
CTA = '''<a class="cta-band" href="/quote"><span class="cta-note">{h}. {p}</span><svg class="cta-arrow" viewBox="0 0 48 48" aria-hidden="true"><path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" stroke-width="4"/></svg><span class="cta-word" aria-hidden="true">Start</span><span class="skip">Get a quote</span></a>'''
def cta(h='Tell us what you need', p='Describe your situation in a few lines. You get a reply within one working day and a written quote by email.'):
    return CTA.format(h=h, p=p)

def hero(h1, lead, crumbs=None, visual=''):
    c = ''
    if crumbs:
        c = '<nav class="p-crumbs" aria-label="Breadcrumb">' + ''.join(f'<a href="{u}">{t}</a>' for t, u in crumbs) + '</nav>'
    return (f'<section class="p-hero"><div class="p-glow" aria-hidden="true"></div><div class="wrap">{c}'
            f'<h1 class="p-title"><span class="x-line"><span>{h1}</span></span></h1><p class="p-lead">{lead}</p></div>{visual}</section>')

def checks(items):
    return '<ul class="checks" data-r>' + ''.join(f'<li><span class="mk" aria-hidden="true"></span><span><strong>{a}</strong><span>{b}</span></span></li>' for a, b in items) + '</ul>'

def bullets(items):
    return '<ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

def table(cols, rows):
    head = ''.join(f'<th>{c}</th>' for c in cols)
    body = ''.join('<tr>' + ''.join(f'<td>{v}</td>' for v in r) + '</tr>' for r in rows)
    return f'<div class="table-wrap"><table class="table"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'

def faq(items):
    return '<div class="p-faq">' + ''.join(f'<details{" open" if i == 0 else ""}><summary>{q}<i aria-hidden="true"></i></summary><p>{a}</p></details>' for i, (q, a) in enumerate(items)) + '</div>'

# ---------------------------------------------------------------- sample product cards
MARK = '<img src="/img/logo-mark.svg" alt=""/>'
def stage(card): return f'<div class="p-stage"><div class="p-stage-bg" aria-hidden="true"></div>{card}</div>'
def kpis(items): return '<div class="pc-kpis">' + ''.join(f'<div><span>{a}</span><b>{b}</b><i>{c}</i></div>' for a, b, c in items) + '</div>'
def card(label, title, inner, note, tag='Sample figures'):
    return stage(f'<figure class="p-card" aria-label="{label}"><div class="pc-top">{MARK}{title}<em>{tag}</em></div>{inner}<p class="pc-note">{note}</p></figure>')
def pill(kind, text): return f'<span class="pill pill-{kind}">{text}</span>'
def mini(cols, rows, hide=()):
    head = ''.join(f'<th class="{"r " if i else ""}{"hide-sm" if i in hide else ""}">{c}</th>' for i, c in enumerate(cols))
    body = ''.join('<tr>' + ''.join(f'<td class="{"r " if i else ""}{"hide-sm" if i in hide else ""}">{v}</td>' for i, v in enumerate(r)) + '</tr>' for r in rows)
    return f'<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'

REPORT = card('Sample weekly finance report', 'Weekly report · Monday',
  kpis([('Collected', '$12,640', '7 invoices paid'), ('Overdue now', '$21,380', 'down from $33,900'), ('Bills due', '9', '$14,200 this week')]) +
  '<div class="pc-bars" role="img" aria-label="Cash collected per week over six weeks, highest this week"><span style="--h:33%"><i>W36</i></span><span style="--h:48%"><i>W37</i></span><span style="--h:42%"><i>W38</i></span><span style="--h:66%"><i>W39</i></span><span style="--h:57%"><i>W40</i></span><span class="hi" style="--h:100%"><i>W41</i></span></div>' +
  mini(['Needs you', 'Amount'], [['Kellet &amp; Moss dispute the April invoice', '$8,120'], ['New supplier: confirm bank details by phone', '$2,450']]),
  'The report you receive every Monday. All figures are illustrative.')
VISUALS = {
  'finance-operations': REPORT,
  'finance-reporting': REPORT,
  'accounts-receivable': stage(f'''<figure class="p-card pc-mail" aria-label="Sample reminder waiting for approval">
<div class="pc-top">{MARK}Waiting for your approval<em>Sample message</em></div>
<dl><dt>From</dt><dd>accounts@yourcompany.com</dd><dt>To</dt><dd>Kellet &amp; Moss, accounts payable</dd><dt>Subject</dt><dd>Invoice 1042, $8,120, due 58 days ago</dd></dl>
<p class="msg">Hi Dana, a quick note on invoice 1042. Could you tell me when it is scheduled for payment, or whether anything is holding it up on your side?</p>
<div class="pc-acts"><span class="yes">Approve and send</span><span>Edit</span></div>
<p class="pc-note">Nothing goes out under your name until you approve it.</p></figure>'''),
  'accounts-payable': card('Sample payment run ready for release', 'Payment run · Friday',
    mini(['Supplier', 'Due', 'Amount', 'Check'], [['Harlow Timber', 'Fri', '$4,860', pill('good', 'Matched')], ['Brightline Freight', 'Fri', '$1,940', pill('good', 'Matched')],
         ['Office Supply Co.', 'Mon', '$385', pill('good', 'Matched')], ['Northside Print', 'Mon', '$1,215', pill('warn', 'Duplicate?')]], hide=(1,)) +
    '<div class="pc-total"><span>Ready to release</span><span>$7,185</span></div><div class="pc-acts"><span class="yes">Release from your bank</span><span>Review</span></div>',
    'We prepare the run. Only you release it.'),
  'marketing': card('Sample monthly advertising report', 'Ads report · September',
    kpis([('Spend', '$2,400', 'within budget'), ('Leads', '63', 'up 18%'), ('Cost per lead', '$38', 'down from $46')]) +
    mini(['Channel', 'Leads', 'Cost per lead'], [['Google Ads', '34', '$31'], ['LinkedIn Ads', '18', '$52'], ['Meta Ads', '11', '$36']]),
    'The report you receive every month. All figures are illustrative.'),
  'sales-crm-operations': card('Sample weekly pipeline report', 'Pipeline · Week 41',
    kpis([('New leads', '23', 'all assigned same day'), ('Meetings booked', '6', 'up from 4'), ('Duplicates merged', '140', 'CRM cleanup')]) +
    mini(['Deal', 'Stage', 'Next step'], [['Harbour Studio', 'Proposal sent', 'Follow-up Tue'], ['Kellet &amp; Moss', 'Meeting booked', 'Thu 10:00'],
         ['Northfield Joinery', 'Qualified', pill('warn', 'Approve email')]]),
    'The pipeline report you receive every Monday. All figures are illustrative.'),
  'customer-operations': card('Sample support inbox', 'Support inbox · Today',
    kpis([('Answered today', '46', 'of 49 received'), ('First reply', '38 min', 'median'), ('Satisfaction', '96%', 'last 7 days')]) +
    mini(['Conversation', 'Waiting', 'Status'], [['Where is my order #4821?', '12 min', pill('good', 'Answered')], ['Move my booking to Friday', '40 min', pill('good', 'Answered')],
         ['Refund for a damaged item', '1 h', pill('warn', 'Needs you')], ['Copy of last invoice', '2 h', pill('good', 'Answered')]]),
    'Refunds above your limit come to you. All figures are illustrative.'),
  'hr-recruiting': card('Sample hiring pipeline', 'Hiring · Operations coordinator',
    kpis([('Applicants', '84', 'this week'), ('Screened', '31', 'against your criteria'), ('Interviews', '5', 'scheduled')]) +
    mini(['Candidate', 'Stage', 'Next'], [['A. Moreno', 'Interview', 'Wed 14:00'], ['J. Patel', 'Shortlisted', pill('info', 'Your review')],
         ['S. Okafor', 'Offer drafted', pill('warn', 'Needs you')]]),
    'You make every hiring decision. All names and figures are illustrative.'),
  'it-help-desk': card('Sample help-desk board', 'Help desk · This week',
    kpis([('Requests', '37', 'from 22 people'), ('Resolved', '35', '2 with vendors'), ('Time to resolve', '1 h 12', 'median')]) +
    mini(['Request', 'Team', 'Status'], [['New starter: Google and Slack accounts', 'Ops', pill('good', 'Done')], ['Two-factor reset', 'Sales', pill('good', 'Done')],
         ['Laptop not charging', 'Finance', pill('info', 'Vendor ticket')], ['Unusual sign-in alert', 'Admin', pill('warn', 'Escalated to you')]], hide=(1,)),
    'Suspected security issues go to you immediately. All figures are illustrative.'),
}

# ---------------------------------------------------------------- page shell
def page(slug, title, desc, body, noindex=False):
    url = 'https://adsonus.com/' + slug
    robots = '<meta name="robots" content="noindex"/>\n' if noindex else ''
    out = f'''{HEAD_TOP}<title>{title}</title>
<meta name="description" content="{esc(desc)}"/>
{robots}<link rel="canonical" href="{url}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="{url}"/>
<meta property="og:title" content="{esc(title)}"/>
<meta property="og:description" content="{esc(desc)}"/>
<meta property="og:image" content="https://adsonus.com/og-image.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="theme-color" content="#FFFFFF"/>
<link rel="icon" type="image/svg+xml" href="/img/logo-mark.svg"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
{FONTS}
{PAGE_ASSETS}
</head>
<body>
{GTM_NS}
<a class="skip" href="#main">Skip to content</a>
{SPRITE}

{HEADER}

<main id="main" class="v4p">
{body}
</main>

{FOOTER}

{NAVJS}
{SITEJS}
{PAGE_JS}
</body>
</html>
'''
    open(f'{slug}.html', 'w', encoding='utf-8').write(out)
    return slug

# ---------------------------------------------------------------- the service template
PILLAR_HOME = {'grow': ('Services', '/services'), 'paid': ('Finance operations', '/finance-operations'), 'run': ('Services', '/services')}

def service_page(s):
    """The same ten parts on every service page: who it is for, what is included and not,
    how it runs, what you receive, response times, what we need, limits, pricing, questions."""
    name = next(n for slug, n, _, _ in SERVICE_LIST if slug == s['slug'])
    pillar = next(p for slug, _, p, _ in SERVICE_LIST if slug == s['slug'])
    crumbs = [('Home', '/'), PILLAR_HOME[pillar]]
    resp = ''.join(f'<div class="resp"><span>{k}</span><b>{v}</b></div>' for k, v in s['response'])
    body = hero(s['h1'], s['lead'], crumbs, VISUALS.get(s['slug'], ''))
    body += f'''
<section class="section"><div class="wrap split">
<div class="prose"><h2>{s['included_h']}</h2>{checks(s['included'])}</div>
<aside class="side-box who-box"><h3>Who it is for</h3>{bullets(s['who'])}<a class="btn btn-primary" href="/quote">Get a fixed quote <span class="arr" aria-hidden="true">→</span></a><p class="small">A written scope and monthly fee, by email.</p></aside>
</div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><h2>What is not included</h2><p class="lead">Clear limits, so you always know what we do and what stays with you or another provider.</p></div>
<ul class="nots">{''.join(f'<li>{i}</li>' for i in s['not_included'])}</ul>
</div></section>
<section class="section"><div class="wrap">
<div class="section-head"><h2>{s['runs_h']}</h2><p class="lead">{s['runs_lead']}</p></div>
{table(s['runs_cols'], s['runs_rows'])}
</div></section>
<section class="section band"><div class="wrap split">
<div class="prose"><h2>What you receive</h2>{bullets(s['receive'])}</div>
<div class="prose"><h2>Response times</h2><p>Agreed in writing for your time zone before work starts.</p><div class="resps">{resp}</div></div>
</div></section>
<section class="section rules-band"><div class="wrap split">
<div class="prose"><h2>What we need from you</h2>{bullets(s['need'])}</div>
<div class="prose"><h2>Security and limits</h2>{bullets(s['limits'])}</div>
</div></section>
<section class="section"><div class="wrap split">
<div class="prose"><h2>How pricing works</h2><p>{s['pricing']}</p><p><a class="tlink" href="/how-we-work">How every engagement works →</a></p></div>
<div><h2 class="faq-h">Questions</h2>{faq(s['faq'])}</div>
</div></section>
''' + cta(*s['cta'])
    return page(s['slug'], s['title'], s['desc'], body)

MONTH = "Month to month, with 30 days' notice."
def RESP(*rows): return [('Coverage hours', 'Agreed to your time zone')] + list(rows)

SERVICES = [
{
 'slug': 'marketing', 'title': 'Google, Meta and LinkedIn advertising for small businesses — adsonus',
 'desc': 'Paid advertising for small and medium businesses: Google Ads, Meta and LinkedIn campaigns and proper conversion tracking, managed against cost per lead.',
 'h1': 'Advertising measured in customers, not clicks',
 'lead': 'We plan, build and manage paid campaigns for businesses that sell to other businesses and to local customers. You set the budget, the ad accounts stay in your name, and every month you see what each lead cost.',
 'who': ['Businesses that sell to other businesses or to local customers', 'Owners who want leads and cost per lead, not impressions', 'Teams without an in-house paid-media specialist'],
 'included_h': 'What we do',
 'included': [
   ('Google Ads', 'Search campaigns built around the words your buyers actually type, after keyword and competitor research.'),
   ('Meta and LinkedIn Ads', 'Campaigns aimed at the companies, roles and local audiences you sell to.'),
   ('Creative and copy', 'Ad text and simple visuals prepared with you and approved before launch.'),
   ('Conversion tracking', 'Google Tag Manager, Google Analytics and platform tags set up and tested, so campaigns are judged on leads.'),
   ('Weekly optimisation', 'Search terms, audiences and bids reviewed, and waste cut, against cost per qualified lead.'),
   ('Lead handling', 'Lead forms connected to your inbox or CRM, so no enquiry sits unanswered.')],
 'not_included': ['Your ad spend: paid by you, directly to the platforms', 'Brand design, video production or photo shoots', 'Organic social media posting',
   'Website rebuilds: we advise on landing pages, your developer builds them', 'Guaranteed numbers of leads or sales'],
 'runs_h': 'How it runs', 'runs_lead': 'A steady routine, with your approval before any campaign or budget change goes live.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['First week', 'Account audit or build, and tracking checked end to end'], ['Before launch', 'Campaigns, copy and budgets sent for your approval'],
   ['Every week', 'Search terms, audiences and bids reviewed; waste cut'], ['Every month', 'Report on spend, leads and cost per lead, with next month’s changes for approval']],
 'receive': ['A monthly report: spend, leads and cost per lead, by channel', 'What changed this month and why', 'Proposed changes for next month, for your approval', 'Access to every ad account at any time, in your name'],
 'response': RESP(('Replies to you', 'Same working day'), ('Budget changes', 'Only with your written approval')),
 'need': ['Admin access to your Google, Meta and LinkedIn ad accounts, created in your name if new', 'Access to Google Tag Manager and Analytics, or your developer for tag changes', 'What a good lead is worth to you, and who receives new leads'],
 'limits': ['Ad accounts stay in your name and on your card', 'Monthly budgets are agreed in writing, and we do not exceed them', 'No ad goes live without your sign-off'],
 'pricing': f'A fixed monthly management fee, quoted in writing for the platforms and spend we manage. Your ad spend is separate and paid by you directly to the platforms. {MONTH}',
 'faq': [('Is there a minimum ad budget?', 'No fixed minimum. If a budget is too small to produce useful results, we tell you in writing before you spend it.'),
   ('Which platform should we use?', 'For selling to other businesses, usually Google search and LinkedIn; for local and consumer audiences, Google and Meta. We recommend after looking at your account.'),
   ('Who owns the accounts and data?', 'You do. Accounts are created in your name, and you keep everything if we stop working together.')],
 'cta': ('Ask for an account review', 'Tell us what you are spending now and what a good lead is worth to you. We reply within one working day.'),
},
{
 'slug': 'sales-crm-operations', 'title': 'Sales and CRM operations for small businesses — adsonus',
 'desc': 'CRM cleanup, lead routing, approved follow-ups, pipeline upkeep and a weekly pipeline report, run inside your own CRM.',
 'h1': 'A clean CRM and no lead left waiting',
 'lead': 'We keep your CRM accurate, route every new lead to the right person, prepare follow-ups for your approval and report on the pipeline every week. Your salespeople spend their time selling.',
 'who': ['Businesses with a CRM that nobody keeps up to date', 'Sales teams of one to twenty people', 'Owners who want to know what is in the pipeline without asking'],
 'included_h': 'What we do',
 'included': [
   ('CRM cleanup', 'Duplicates merged, fields standardised and stale deals flagged, then kept that way.'),
   ('Lead capture and routing', 'Web forms, ad leads and inbound email entered in the CRM and assigned within the working day.'),
   ('Follow-up sequences', 'Written in your tone and sent from your domain, only after your approval.'),
   ('Pipeline upkeep', 'Stages, next steps and close dates kept current with your salespeople.'),
   ('Meeting scheduling', 'Calendars coordinated for your salespeople, with reminders to prospects.'),
   ('Weekly pipeline report', 'New leads, meetings and deals by stage, and anything stuck.')],
 'not_included': ['Closing deals, negotiating prices or signing contracts', 'Buying contact lists or sending bulk cold email', 'Commission or quota calculations', 'Building custom CRM software'],
 'runs_h': 'How it runs', 'runs_lead': 'Daily lead handling and a weekly pipeline review, agreed with your sales team.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['Every working day', 'New leads checked, completed and assigned to the right person'], ['Twice a week', 'Follow-ups due prepared for approval, then sent'],
   ['Every week', 'Pipeline reviewed: stages, next steps and close dates updated'], ['Every month', 'Data health check: duplicates, missing fields, stale deals']],
 'receive': ['A weekly pipeline report: new leads, meetings and deals by stage', 'Leads waiting longer than agreed, and why', 'Deals with no next step', 'Data health, month on month'],
 'response': RESP(('New leads', 'Assigned the same working day'), ('Replies to you', 'Same working day')),
 'need': ['A CRM user with the lowest role that can edit records', 'Access to the inboxes or forms that receive leads', 'Your sales process: stages, who owns which leads, and the tone of follow-ups'],
 'limits': ['Outreach goes from your domain, only after your approval', 'Unsubscribes and opt-outs are honoured immediately, in line with CAN-SPAM and GDPR', 'We never export or reuse your contact data'],
 'pricing': f'A fixed monthly fee based on lead volume, team size and the tasks we take on, quoted in writing. {MONTH}',
 'faq': [('Which CRMs do you work in?', 'HubSpot, Pipedrive, Salesforce and Zoho CRM. Others on request.'),
   ('Do you send cold email?', 'We follow up with people who contacted you or agreed to hear from you. We do not buy lists or send bulk cold email.'),
   ('Will our salespeople have to change how they work?', 'Very little. We agree a few simple rules, and we do the upkeep.')],
 'cta': ('Tell us about your pipeline', 'Which CRM you use, how many leads a month and what slips. We reply within one working day.'),
},
{
 'slug': 'accounts-receivable', 'title': 'Accounts receivable and collections — adsonus',
 'desc': 'Outsourced accounts receivable for small businesses: polite reminders from your own mailbox, calls on large balances, dispute handling and a weekly report.',
 'h1': 'Get paid on time without chasing customers',
 'lead': 'We run your collections from your own accounts address, in your tone. Your customers deal with your accounts team. You keep the relationship and get the cash.',
 'who': ['Businesses that sell to other businesses on invoice', 'Teams where nobody owns collections day to day', 'Owners tired of chasing the same customers every month'],
 'included_h': 'Every overdue invoice followed up, every week',
 'included': [
   ('Reminders before and after the due date', 'Friendly at first, firmer as time passes, always polite and always in your style.'),
   ('Calls on the largest and oldest balances', 'A real conversation finds out why an invoice is stuck and gets a payment date.'),
   ('Excuses cleared quickly', 'Missing purchase order, wrong address, lost invoice: we resend what is needed the same day.'),
   ('Disputes passed straight to you', 'Anything about the work itself comes back to you with the full history, so nothing is promised on your behalf.'),
   ('A weekly report', 'Paid, promised, overdue and stuck, on one page every Monday.')],
 'not_included': ['Collecting money into our account: customers pay you directly', 'Chasing individual consumers', 'Legal action, debt purchase or court filings', 'Deciding which customers get credit'],
 'runs_h': 'A standard follow-up, adjusted to you', 'runs_lead': 'You approve the wording once. Customers you mark as sensitive are handled by hand or not contacted at all.',
 'runs_cols': ['When', 'What happens', 'Tone'],
 'runs_rows': [['3 days before due', 'Courtesy reminder with the invoice attached', 'Friendly'], ['1 day after due', 'Payment reminder and a request to confirm a date', 'Friendly'],
   ['7 days overdue', 'Second reminder and statement of account', 'Firm'], ['10–14 days overdue', 'Phone call to the person responsible for payment', 'Firm'],
   ['21 days overdue', 'Final notice, sent only with your approval', 'Formal'], ['30+ days overdue', 'We agree the next step with you: hold, payment plan or referral', 'Your decision']],
 'receive': ['A weekly report: paid, promised, overdue and stuck', 'Every customer reply logged against the invoice', 'Disputes passed to you with the full history', 'Customers who are getting slower, month on month'],
 'response': RESP(('Customer replies', 'Answered the same working day'), ('Disputes', 'Passed to you the same day')),
 'need': ['An aged receivables report from your accounting software, or read-only access to it', 'A mailbox on your domain, for example accounts@yourcompany.com, that we send from', 'A short email exchange to agree tone, sensitive customers and open disputes'],
 'limits': ['We never collect money into our own account', 'We never threaten, and any legal step is your decision', 'We only chase business customers, never individual consumers', 'We check an invoice has not been paid before chasing it'],
 'pricing': f'A fixed monthly fee based on how many open invoices and customers we follow up, quoted in writing. {MONTH}',
 'faq': [('Will our customers know you are an outside company?', 'They deal with your accounts team. We write from your domain, in your tone, as part of your team.'),
   ('What about customers we want to handle carefully?', 'You mark them. They are handled by hand with your approval, or not contacted at all.'),
   ('Why not just turn on reminders in QuickBooks or Xero?', 'Software only sends emails. It does not call the person who approves payments, find out why an invoice is stuck or tell you which customers are getting slower. That is the part we do.')],
 'cta': ('See what steady follow-up brings in', 'Tell us roughly how much is overdue and how many invoices. We reply within one working day.'),
},
{
 'slug': 'accounts-payable', 'title': 'Accounts payable for small businesses — adsonus',
 'desc': 'Outsourced accounts payable: supplier bills captured, coded and matched, and payment runs prepared for your approval. Your bank, your release.',
 'h1': 'Supplier bills paid on time, never twice',
 'lead': 'Bills arrive in one inbox. We capture, code and check them, then prepare a payment run that you approve and release from your own bank.',
 'who': ['Businesses with more supplier bills than time to check them', 'Owners who approve payments but do not want to prepare them', 'Teams that have paid a duplicate or a fake invoice before'],
 'included_h': 'From inbox to approved payment run',
 'included': [
   ('One inbox for every bill', 'Suppliers send to a dedicated address on your domain. Paper bills can be photographed and forwarded.'),
   ('Captured and coded', 'Supplier, amount, dates and account code entered in your accounting software, with the bill attached.'),
   ('Checked before anything is due', 'Matched against purchase orders or delivery notes where you use them, and checked for duplicates.'),
   ('Payment run prepared', 'A list of what to pay this week, ready for you to approve. You release it from your bank.'),
   ('Supplier statements reconciled', 'Monthly statements compared with your records, so differences are found early.')],
 'not_included': ['Sending money: you release every payment from your bank', 'Tax filings, payroll or year-end accounts, which stay with your accountant', 'Negotiating prices with suppliers', 'Holding any of your funds'],
 'runs_h': 'How it runs', 'runs_lead': 'Bills are handled as they arrive, and payments go out on the days you choose.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['Every working day', 'New bills captured, coded and attached in your accounting software'], ['Before due dates', 'Bills matched; duplicates and changed bank details checked'],
   ['Every week', 'Payment run prepared for your approval'], ['Every month', 'Supplier statements reconciled with your records']],
 'receive': ['A weekly payment run, ready to approve and release', 'Bills due in the next 14 days', 'Anything blocked: missing approvals, mismatches, disputes', 'A monthly statement reconciliation'],
 'response': RESP(('New bills', 'Processed within one working day'), ('Payment runs', 'Ready on the day you choose')),
 'need': ['A bills inbox on your domain, for example bills@yourcompany.com', 'A limited user role in your accounting software', 'Your approval rules: who approves what, and up to what amount'],
 'limits': ['You, or someone you name, release every payment', 'Bank detail changes are confirmed by phone on a number already on file, never the one in the email', 'Possible duplicates are stopped and checked before they reach a payment run'],
 'pricing': f'A fixed monthly fee based on how many bills and suppliers we process, quoted in writing. {MONTH}',
 'faq': [('Can you pay our suppliers for us?', 'No. We prepare the payment run and you release it from your own bank. Your money never passes through us.'),
   ('Do you work with our accountant?', 'Yes. We keep your records tidy in the same software, so year-end work is easier for them.'),
   ('What if a bill looks wrong?', 'We hold it, tell you why and ask the supplier for what is missing. Nothing doubtful reaches a payment run.')],
 'cta': ('Tell us what you need', 'How many bills a month and which accounting software you use. We reply within one working day.'),
},
{
 'slug': 'finance-reporting', 'title': 'Weekly finance reporting for small businesses — adsonus',
 'desc': 'A short weekly report on cash collected, overdue invoices, supplier bills due and the decisions waiting for you.',
 'h1': 'Know where your cash stands every Monday',
 'lead': 'One page, the same format every week: what came in, what is owed to you, what you owe, and what needs your decision.',
 'who': ['Owners who check the bank balance to guess how the business is doing', 'Businesses using our receivables or payables service', 'Teams that want numbers before decisions, not after'],
 'included_h': 'Numbers you can act on in two minutes',
 'included': [
   ('Cash in', 'Payments received this week and the invoices they cleared.'), ('Owed to you', 'Overdue total by age, with the five largest balances.'),
   ('Promises', 'Payment dates customers have given, and whether they were kept.'), ('Owed by you', 'Supplier bills due in the next 14 days.'),
   ('Needs you', 'Disputes, approvals and anything unusual.'), ('Monthly cash summary', 'Collections against last month, average days to get paid, and customers getting slower.')],
 'not_included': ['Bookkeeping, year-end accounts or tax returns', 'Forecasts or financial advice', 'Audits or formal management accounts'],
 'runs_h': 'How it runs', 'runs_lead': 'The same report at the same time every week, so you always know where to look.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['Every Monday morning', 'Weekly report sent by email'], ['First week of the month', 'Monthly cash summary'], ['Any time', 'Questions about a number answered the same working day']],
 'receive': ['One page, the same format every week', 'Figures taken from your accounting software', 'Short notes on what changed and why'],
 'response': RESP(('Report delivery', 'Every Monday, your time'), ('Questions', 'Same working day')),
 'need': ['Read-only access to your accounting software', 'Who should receive the report'],
 'limits': ['Read-only access is enough: we change nothing in your books for this service', 'Figures come from your own software, not estimates', 'We report what happened; decisions stay with you'],
 'pricing': f'Included with receivables and payables. On its own, a fixed monthly fee quoted in writing. {MONTH}',
 'faq': [('Is this the same as bookkeeping?', 'No. Your bookkeeper or accountant keeps the books. We read them and turn them into a short weekly view.'),
   ('Which software do you read from?', 'QuickBooks Online, Xero, NetSuite and Bill.com.'),
   ('Can we change what the report shows?', 'Yes, within one page. We agree the sections with you first.')],
 'cta': ('Tell us what you need', 'Which accounting software you use and who needs the numbers. We reply within one working day.'),
},
{
 'slug': 'customer-operations', 'title': 'Customer operations and support for small businesses — adsonus',
 'desc': 'Your customer inbox and help desk, run in your tools and your tone: order, booking and account questions answered, with anything sensitive passed to you.',
 'h1': 'Every customer answered, in your voice',
 'lead': 'We run your customer inbox and help desk: order, booking and account questions answered from your own tools, in your tone, with anything sensitive passed to you.',
 'who': ['Businesses whose inbox fills faster than anyone can answer it', 'Online shops and service businesses with repeat questions', 'Teams that want customer service covered without hiring'],
 'included_h': 'What we do',
 'included': [
   ('Shared inbox and tickets', 'Email, chat and web-form messages answered in your help-desk tool.'),
   ('Order, booking and account questions', 'Status, changes, returns and invoice copies, using your own systems.'),
   ('Saved replies and help articles', 'Written and kept current, so every answer is consistent.'),
   ('Escalations to you', 'Complaints, refunds above your limits and anything sensitive, with the full history.'),
   ('Customer feedback', 'Repeated questions and problems collected, so you can fix the cause.'),
   ('Weekly report', 'Conversations, reply times, satisfaction and open issues.')],
 'not_included': ['Phone lines', 'Refunds or credits outside the rules you set', 'Product development or bug fixing', 'Sales commitments or custom pricing'],
 'runs_h': 'How it runs', 'runs_lead': 'Inbox coverage in the hours agreed with you, and a weekly review of what customers are asking.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['During agreed hours', 'Inbox and chat answered within the agreed reply times'], ['As it happens', 'Urgent and sensitive conversations passed to you'],
   ['Every week', 'Saved replies updated from new questions'], ['Every month', 'Themes and repeated problems reported']],
 'receive': ['A weekly report: conversations, first-reply and resolution times', 'Satisfaction scores, where your tool collects them', 'The top reasons customers got in touch', 'Open issues that need your decision'],
 'response': RESP(('First reply', 'Target agreed in writing, typically within a few working hours'), ('Urgent issues', 'Passed to you immediately')),
 'need': ['An agent seat in your help-desk tool or shared inbox', 'Read access to the systems answers come from: orders, bookings, accounts', 'Your policies: refunds, returns, tone and escalation contacts'],
 'limits': ['Refunds and credits only within limits you set in writing', 'Customers are never promised anything outside your policies', 'Customer data stays in your systems'],
 'pricing': f'A fixed monthly fee based on conversation volume, channels and coverage hours, quoted in writing. {MONTH}',
 'faq': [('Which help-desk tools do you use?', 'Zendesk, Freshdesk, Gorgias, Intercom, Help Scout, and shared Gmail or Outlook inboxes.'),
   ('Will customers know you are an outside team?', 'They talk to your support team. We reply under your name and in your tone.'),
   ('Can you cover evenings or weekends?', 'Coverage hours are agreed per client and written into the scope.')],
 'cta': ('Tell us about your inbox', 'How many messages a week, which channels and which tool. We reply within one working day.'),
},
{
 'slug': 'hr-recruiting', 'title': 'HR and recruiting operations for small businesses — adsonus',
 'desc': 'Job posts, screening against your criteria, interview scheduling, onboarding paperwork and HR records, run in your own HR tools. You make every decision.',
 'h1': 'Hiring and HR admin, handled',
 'lead': 'We run the administrative side of hiring and HR: job posts, screening against your criteria, interview scheduling, onboarding paperwork and HR records. You make every decision.',
 'who': ['Businesses that hire regularly without a recruiter', 'Owners and managers spending evenings on HR paperwork', 'Teams of 5 to 200 people with no HR department'],
 'included_h': 'What we do',
 'included': [
   ('Job posts', 'Written from your brief and published on the boards you choose.'),
   ('Screening', 'Applications checked against criteria you set, with a shortlist and notes.'),
   ('Interview scheduling', 'Calendars coordinated and candidates kept informed at every step.'),
   ('Offer letters', 'Prepared from your templates, for your approval and signature.'),
   ('Onboarding', 'Paperwork, checklists, account requests and a first-day plan for every new starter.'),
   ('HR records', 'Employee records, time off and documents kept current in your HR system.')],
 'not_included': ['Hiring decisions or salary negotiation', 'Employment-law advice: we follow your policies and your legal adviser', 'Running payroll: we prepare the inputs for your payroll provider', 'Workplace investigations or disciplinary decisions'],
 'runs_h': 'How it runs', 'runs_lead': 'A clear routine for every opening and every new starter.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['For each opening', 'Brief agreed, post published, applications screened against your criteria'], ['Every week', 'Shortlist and interview schedule sent to you'],
   ['For each hire', 'Offer prepared for your approval, onboarding started'], ['Every month', 'HR records checked and time-off balances updated']],
 'receive': ['A weekly hiring report: applicants, shortlist, interviews and offers', 'Candidates waiting on your decision', 'Onboarding status for each new starter', 'A monthly HR records check'],
 'response': RESP(('Candidate replies', 'Within one working day'), ('Your questions', 'Same working day')),
 'need': ['A user in your applicant-tracking or HR system with the lowest role that works', 'Your hiring criteria, templates and approval steps', 'Who approves offers, and who receives onboarding tasks'],
 'limits': ['You decide who is hired, and at what pay', 'Candidate and employee data stays in your systems; our access is removed when we finish', 'No employment-law advice: we follow your policies and your adviser'],
 'pricing': f'A fixed monthly fee based on open roles, team size and the HR tasks we take on, quoted in writing. {MONTH}',
 'faq': [('Are you a recruitment agency?', 'No. There are no placement fees and no candidate database of our own. We run your hiring process, for your roles, under your name.'),
   ('Which HR tools do you work in?', 'BambooHR, Gusto, Rippling, Workable, Greenhouse, LinkedIn and Indeed. Others on request.'),
   ('How is personal data handled?', 'Under the data processing agreement we sign before starting, with the lowest access that works, inside your own systems.')],
 'cta': ('Tell us what you are hiring for', 'Which roles, how many people you have and which HR tasks slip. We reply within one working day.'),
},
{
 'slug': 'it-help-desk', 'title': 'IT help desk for small businesses — adsonus',
 'desc': 'Remote first-line IT support: accounts for new and leaving staff, password and access resets, software admin and vendor tickets, through your own admin consoles.',
 'h1': 'IT support for your team, remotely',
 'lead': "We are the first line for your team's IT questions: accounts for new and leaving staff, password and access resets, software admin and vendor tickets, all through your own admin consoles.",
 'who': ['Businesses of 5 to 200 people with no IT staff', 'Teams on Google Workspace or Microsoft 365', 'Owners who became the IT department by accident'],
 'included_h': 'What we do',
 'included': [
   ('Staff questions and access requests', 'How-to questions, permissions and shared drives, handled in one place.'),
   ('Password and two-factor resets', 'Through your admin console, after the person’s identity is checked.'),
   ('Joiners and leavers', 'Accounts created on day one and closed on the last day, across your tools.'),
   ('Licences and devices', 'Lists kept current, and unused licences flagged.'),
   ('Software admin', 'Settings and users in Google Workspace, Microsoft 365, Slack, Zoom and similar tools.'),
   ('Vendor tickets', 'Raised and followed up with your software and hardware suppliers.')],
 'not_included': ['On-site visits or hardware repair', 'Network and server installation', 'Security incident response: incidents go straight to you or your security provider', 'Buying hardware or software on your behalf'],
 'runs_h': 'How it runs', 'runs_lead': 'Requests handled in the hours agreed with you, with a monthly review of access and licences.',
 'runs_cols': ['When', 'What happens'],
 'runs_rows': [['During agreed hours', 'Requests answered in your help-desk channel within the agreed times'], ['First and last day', 'Joiner and leaver checklists completed'],
   ['Every week', 'Open requests and vendor tickets reviewed'], ['Every month', 'Licence, device and admin-access review']],
 'receive': ['A monthly IT report: requests, time to resolve and open issues', 'Licences you pay for but do not use', 'Who has admin access, reviewed monthly', 'Joiners and leavers completed'],
 'response': RESP(('First response', 'Target agreed in writing, typically within a few working hours'), ('Suspected security issues', 'Passed to you immediately')),
 'need': ['A delegated admin role with only the permissions the work needs', 'A channel or address for staff requests', 'Your list of tools and vendors, and who approves access'],
 'limits': ['Named admin accounts with two-factor authentication, never shared', 'Identity checked before any password or access reset', 'No access to personal mailboxes or files without your written approval'],
 'pricing': f'A fixed monthly fee based on team size, tools and coverage hours, quoted in writing. {MONTH}',
 'faq': [('Do you replace an IT company?', 'For first-line support and software admin, often yes. For networks, servers and security we work alongside your provider.'),
   ('What if something is urgent?', 'Suspected security issues are passed to you immediately. Coverage hours are agreed per client.'),
   ('Which tools do you support?', 'Google Workspace, Microsoft 365, Okta, JumpCloud, Slack, Zoom and 1Password, among others.')],
 'cta': ('Tell us about your team', 'How many people, which tools and what keeps breaking. We reply within one working day.'),
},
]

pages = [service_page(s) for s in SERVICES]

# ---------------------------------------------------------------- services hub
def svc_tiles(pillar):
    return '<div class="cards">' + ''.join(f'<a class="card" href="/{slug}"><h3>{esc(n)}</h3><p>{esc(d)}.</p></a>' for slug, n, _, d in in_pillar(pillar)) + '</div>'
hub = hero('Every back-office service, one team', 'Sales, finance, customer, HR and IT operations for small and medium businesses. Use one service or several: they share the same rules and the same weekly reporting.', [('Home', '/')])
for i, (key, name, sub) in enumerate(PILLARS):
    hub += f'<section class="section{" band" if i == 1 else ""}"><div class="wrap"><div class="section-head"><h2>{name}</h2><p class="lead">{sub}.</p></div>{svc_tiles(key)}</div></section>'
hub += '<section class="section rules-band"><div class="wrap"><div class="section-head"><h2>The same rules for every service</h2></div><ul class="rules">' + ''.join(
    f'<li><span class="mk" aria-hidden="true"></span><h3>{a}</h3><p>{b}</p></li>' for a, b in [
    ('A written scope', 'What is included, what is not and the response times, agreed before we start.'),
    ('A fixed monthly fee', 'Quoted for your volume, in writing. Month to month, with 30 days’ notice.'),
    ('Your approval', 'On anything sensitive before it goes out under your name.'),
    ('Your tools, your data', 'We work inside your systems with the least access we need.'),
    ('One weekly report', 'The same clear format, whichever services you use.'),
    ('Everything is yours', 'Templates, documents and records stay with you if we stop working together.')]) + '</ul></div></section>'
hub += cta()
pages.append(page('services', 'Services — back-office operations for small businesses — adsonus',
  'Marketing, sales and CRM, accounts receivable and payable, finance reporting, customer operations, HR and recruiting, and IT help desk for small and medium businesses.', hub))

# ---------------------------------------------------------------- finance operations (pillar page)
pages.append(page('finance-operations', 'Finance operations for small businesses — adsonus',
 'Accounts receivable, accounts payable and weekly finance reporting run for small and medium businesses, inside your own tools.',
 hero('The back office you keep putting off', 'We take on the daily finance work that slips when everyone is busy: chasing what you are owed, processing what you owe, and showing you where the cash stands every week.', [('Home', '/'), ('Services', '/services')], VISUALS['finance-operations']) + f'''
<section class="section"><div class="wrap">{svc_tiles('paid')}</div></section>
<section class="section band"><div class="wrap split">
<div class="prose"><h2>For businesses without a finance team</h2>
<p>We work best with businesses of 5 to 200 people that sell to other businesses on invoice. They usually have an accountant or bookkeeper for the year-end, but nobody whose job is to chase late payers or keep supplier bills under control day to day.</p>
<p>We fill that gap. We are not a replacement for your accountant: we work alongside them, in the same accounting software, and keep your records tidy for them.</p></div>
<div>''' + checks([
 ('Works in your software', 'QuickBooks Online, Xero, Bill.com or NetSuite. No new system to buy.'),
 ('Your name on everything', 'Emails go from your domain, signed as part of your team.'),
 ('You stay in control', 'Templates, payment runs and anything unusual are approved by you.'),
 ('Clear weekly numbers', 'The same short report every Monday, whichever services you use.'),
]) + '''</div></div></section>
''' + cta()))

# ---------------------------------------------------------------- how we work
pages.append(page('how-we-work', 'How we work — adsonus',
 'How an engagement with adsonus works: an introduction by email, a written scope and fixed monthly quote, a careful setup, then steady work with a weekly report.',
 hero('Clear scope, a fixed fee and your approval', 'Every engagement works the same way, whichever service you choose: an introduction by email, a written scope and fixed quote, a careful setup, then steady work with a report every week.', [('Home', '/')]) + '''
<section class="section"><div class="wrap">
<ol class="how-steps steps-4">
<li><span class="when">Day 0 · by email</span><h3>Introduction</h3><p>You tell us how you work today, which tools you use, what you want fixed first and anyone who needs special care.</p></li>
<li><span class="when">Within a few days</span><h3>Scope and fixed quote</h3><p>What is included, what is not, response times for your time zone and a fixed monthly fee, all in writing.</p></li>
<li><span class="when">First week</span><h3>Setup</h3><p>Access at the lowest level that works, templates and tone approved by you, and a data processing agreement signed.</p></li>
<li><span class="when">Every week</span><h3>Running</h3><p>Daily work in your tools, your approval on anything sensitive, and one clear report every week.</p></li>
</ol></div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><h2>What every engagement includes</h2></div>
''' + table(['What', 'Detail'], [
  ['A written scope', 'What is included, what is not, and response times agreed for your time zone'],
  ['A fixed monthly fee', 'Quoted for your volume, in writing, before any work starts'],
  ['A data processing agreement', 'Signed before we touch any of your data'],
  ['Your approval', 'On templates, payments, budgets, offers and anything sensitive'],
  ['A weekly report', 'The same clear format, whichever services you use'],
  ['A clean handover', 'Everything we produce is yours, with access removed and confirmed when we finish']]) + '''
</div></section>
<section class="section"><div class="wrap split">
<div class="prose"><h2>A fixed monthly fee, quoted for your volume</h2>
<p>We do not publish a price list because the work depends on your volume: invoices or bills, leads, conversations, roles, or the size of your team. You get a fixed monthly fee in writing before anything starts.</p>
<p>Engagements run month to month with 30 days’ notice.</p></div>
<div class="prose"><h2>How we keep in touch</h2>
<ul><li>A weekly report on the day you choose.</li>
<li>Replies the same working day, in hours agreed for your time zone.</li>
<li>One named person responsible for your account.</li>
<li>Everything in writing, by email.</li></ul></div>
</div></section>
''' + cta()))

# ---------------------------------------------------------------- security
pages.append(page('security', 'Security and data protection — adsonus',
 'How adsonus handles access, passwords, client data, employee data and payments: least access, named accounts, no client money and a data processing agreement.',
 hero('How we handle your access and your data', 'You give us access to your customers, suppliers, staff and numbers. This page sets out exactly how we protect them.', [('Home', '/')]) + f'''
<section class="section"><div class="wrap split">
<div class="prose doc">
<h2>Access</h2>
<ul><li>We ask for the lowest access level that does the job: read-only or limited roles, and only the mailboxes and consoles the work needs.</li>
<li>Every login we use is personal and named. Shared logins are not used.</li>
<li>Two-factor authentication is switched on for every account we use, where the software supports it.</li>
<li>Passwords are never sent by email or chat. Where a login must be shared, it is shared through a password manager.</li>
<li>When an engagement ends, you remove our access and we confirm in writing that we have.</li></ul>
<h2>Money</h2>
<ul><li>Client money never passes through adsonus. Your customers pay you directly.</li>
<li>For payables we prepare payment runs; only you, or someone you name, releases payments.</li>
<li>Requests to change a supplier's bank details are verified by phone on a number already on file.</li></ul>
<h2>Employee and candidate data</h2>
<ul><li>HR and recruiting work happens inside your own HR and applicant-tracking systems. We do not keep copies elsewhere.</li>
<li>Access is limited to the records the work needs, and removed when the engagement ends.</li>
<li>Hiring decisions, pay and employment matters stay with you and your advisers.</li></ul>
<h2>Admin access for IT support</h2>
<ul><li>We use named, delegated admin roles with only the permissions the work needs, protected by two-factor authentication.</li>
<li>Identity is checked before any password or access reset.</li>
<li>We do not open personal mailboxes or files without your written approval.</li>
<li>Suspected security incidents are passed to you, or your security provider, immediately.</li></ul>
<h2>Messages to your customers and leads</h2>
<ul><li>We contact business customers only for collections, never consumers.</li>
<li>Follow-ups and outreach go from your domain, only after your approval, and opt-outs are honoured immediately.</li>
<li>We write as part of your team, in a tone you approve. We never threaten legal action; legal steps are your decision.</li></ul>
<h2>Data protection</h2>
<ul><li>We sign a data processing agreement with every client before work starts. It covers what data we handle, why, for how long and how it is deleted.</li>
<li>adsonus is based in Azerbaijan. For clients in the UK and European Union, transfers are covered by the standard contractual clauses (and the UK addendum) included in our agreement.</li>
<li>We keep client data only for the length of the engagement plus any period agreed in the contract, then delete it.</li>
<li>The software we use to do the work, including AI-assisted drafting tools, is listed in the agreement. A person reviews everything before it is sent to your customers, suppliers, candidates or staff.</li></ul>
</div>
<aside class="side-box"><h3>Ask before you start</h3><p>If your business has its own security questionnaire or contract terms, send them with your quote request and we will answer them before we start.</p><p><strong>{EMAIL}</strong></p><a class="btn btn-primary" href="/quote">Get a quote <span class="arr" aria-hidden="true">→</span></a></aside>
</div></section>'''))

# ---------------------------------------------------------------- about
pages.append(page('about', 'About adsonus',
 'adsonus runs back-office operations for small and medium businesses: sales, finance, customer, HR and IT operations. Based in Baku, Azerbaijan, working globally.',
 hero('Big-company discipline for small businesses', 'adsonus gives small and medium businesses the kind of back-office support that larger companies take for granted: sales, finance, customer, HR and IT operations, delivered by people you deal with directly.', [('Home', '/')]) + f'''
<section class="section"><div class="wrap founder">
<div class="photo"><img src="/img/baylar-valiyev-sketch.jpg" alt="Pencil drawing of Baylar Valiyev, founder of adsonus" width="922" height="1152" loading="lazy"/></div>
<div class="founder-copy">
<h2>Baylar Valiyev</h2>
<p>adsonus was started after years of working on both sides of what keeps a small business alive: winning customers and getting paid. That experience covers managing advertising for businesses of many sizes and lending at Express Bank, which showed how often healthy businesses run short of cash simply because invoices are paid late.</p>
<p>adsonus brings the back office together in one place. You deal with us directly, and we are responsible for every piece of work that goes out under your name.</p>
</div></div></section>
<section class="section rules-band"><div class="wrap split">
<div class="prose"><h2>We are a new business</h2>
<p>adsonus started in 2026. Our marketing work so far covers a small number of clients, including a business-to-business logistics company in California. Our other services are newer still: we are taking on our first clients now.</p>
<p>That means we cannot show you years of case studies or hundreds of reviews, and we will not pretend otherwise. Anything you read on this site describes how we work, not results we have not yet earned.</p></div>
<div class="prose"><h2>What you can rely on</h2>
<ul><li><strong>A written scope and fixed fee.</strong> You know what is included, what is not and the monthly price before we start.</li>
<li><strong>No lock-in.</strong> Month to month, 30 days' notice, and everything we produce is yours.</li>
<li><strong>Direct access to the people doing the work.</strong> Your account is not passed to a junior team.</li>
<li><strong>Founding-client terms.</strong> Our first clients get their monthly fee fixed for 12 months, in exchange for honest feedback.</li>
<li><strong>A limited number of clients.</strong> We only take on what we can do properly, and say so when we are full.</li>
<li><strong>Modern tools, human checks.</strong> We use good software, including AI-assisted drafting, so a small business can afford careful work. A person reviews everything before it goes out.</li></ul></div>
</div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><h2>Three things we will not compromise on</h2></div>
<div class="cards">
<div class="card"><h3>Honest numbers</h3><p>Reports show what happened, including what did not work. We never inflate results.</p></div>
<div class="card"><h3>Your control</h3><p>Your accounts, your bank, your budgets and your hiring decisions. We prepare and recommend; you decide.</p></div>
<div class="card"><h3>Clear scope</h3><p>Every engagement starts with what is included, what is not and a fixed fee, in writing.</p></div>
</div></div></section>
<section class="section"><div class="wrap split">
<div class="prose"><h2>Baku, on your hours</h2>
<p>adsonus works from Baku, Azerbaijan, with clients around the world. Working hours are agreed with each client for their time zone, and working from Baku keeps our costs lower than a local agency, which is reflected in our quotes.</p></div>
<div class="prose"><h2>Talk to us</h2>
<ul><li>Email: <strong>{EMAIL}</strong></li><li>Address: {ADDRESS}</li></ul></div>
</div></section>
''' + cta()))

# ---------------------------------------------------------------- quote
SERVICE_BOXES = ''.join(f'<label><input type="checkbox" name="services" value="{esc(n)}"/> {esc(n)}</label>' for _, n, _, _ in SERVICE_LIST)
QUOTE_JS = '''<script>
(function(){
  var f=document.getElementById('quote-form'),err=document.getElementById('form-err'),btn=document.getElementById('f-submit');
  f.addEventListener('submit',function(e){
    e.preventDefault(); err.hidden=true;
    var d=new FormData(f), name=(d.get('name')||'').trim(), email=(d.get('email')||'').trim(), company=(d.get('company')||'').trim();
    if(!name||!company||!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)){err.textContent='Please add your name, company and a valid work email.';err.hidden=false;return;}
    if(d.get('botcheck'))return;
    var services=d.getAll('services').join(', ')||'Not specified';
    btn.disabled=true; btn.textContent='Sending…';
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({
      access_key:'ef4328e5-9f87-4b48-b570-ade6af479224',
      subject:'Quote request: '+company+' ('+services+')',
      from_name:'adsonus website', replyto:email, email:email,
      'Name':name,'Company':company,'Country':d.get('country')||'','Website':d.get('website')||'','Phone':d.get('phone')||'',
      'Services':services,'Company size':d.get('size')||'','Volume':d.get('volume')||'','Message':d.get('message')||'',
      'Source page':location.href})})
    .then(function(r){return r.json();})
    .then(function(j){ if(j&&j.success){ if(window.dataLayer)dataLayer.push({event:'quote_request'}); location.href='/thank-you'; } else { throw new Error(); } })
    .catch(function(){ err.textContent='Your request could not be sent. Please email ''' + EMAIL + ''' instead.'; err.hidden=false; btn.disabled=false; btn.textContent='Send request →'; });
  });
})();
</script>'''
pages.append(page('quote', 'Get a quote — adsonus',
 'Request a fixed quote for any adsonus service: marketing, sales and CRM, receivables, payables, reporting, customer operations, HR and recruiting, or IT help desk.',
 hero('Tell us what you need', 'A few details help us prepare. You get a reply within one working day, then a written scope and fixed monthly quote.', [('Home', '/')]) + f'''
<section class="section"><div class="wrap split">
<form class="form" id="quote-form" novalidate>
<div class="row"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required/></div>
<div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required/></div></div>
<div class="row"><div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization" required/></div>
<div class="field"><label for="f-country">Country</label><input id="f-country" name="country" autocomplete="country-name"/></div></div>
<div class="row"><div class="field"><label for="f-web">Website <span class="hint">(optional)</span></label><input id="f-web" name="website" type="url" placeholder="https://"/></div>
<div class="field"><label for="f-phone">Phone <span class="hint">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"/></div></div>
<fieldset class="field"><legend>What do you need?</legend><div class="opts">{SERVICE_BOXES}</div></fieldset>
<div class="row"><div class="field"><label for="f-size">Company size</label><select id="f-size" name="size"><option value="">Select</option><option>1–4 people</option><option>5–20 people</option><option>21–50 people</option><option>51–200 people</option><option>200+ people</option></select></div>
<div class="field"><label for="f-volume">Monthly volume <span class="hint">(optional)</span></label><input id="f-volume" name="volume" placeholder="e.g. 60 invoices, 300 tickets or 2 open roles"/></div></div>
<div class="field"><label for="f-msg">What would you like fixed first?</label><textarea id="f-msg" name="message" placeholder="For example: about $40k is overdue across 25 invoices and nobody has time to chase it."></textarea></div>
<input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off"/>
<p class="form-msg err" id="form-err" hidden></p>
<div class="btn-row"><button class="btn btn-primary" type="submit" id="f-submit">Send request <span class="arr" aria-hidden="true">→</span></button></div>
<p class="small">We use these details only to reply to your request. See our <a href="/privacy">privacy notice</a>.</p>
</form>
<aside class="side-box"><h3>From request to quote</h3>
<ol class="prose" style="margin:0"><li>We reply within one working day.</li><li>A few questions by email to understand your situation.</li><li>A written scope and fixed monthly quote.</li><li>Setup, then the work starts.</li></ol>
<p>We take on a limited number of new clients each month, so every account gets proper attention.</p><p>Prefer email? Write to <strong>{EMAIL}</strong>.</p></aside>
</div></section>
''' + QUOTE_JS))

# ---------------------------------------------------------------- thank you, 404
pages.append(page('thank-you', 'Thank you — adsonus', 'Your request has been received.',
 hero('Thank you. We reply within a working day.', f'Your request has reached us. If anything is urgent, email {EMAIL}.') +
 '<section class="section"><div class="wrap"><div class="btn-row" style="justify-content:center"><a class="btn btn-quiet" href="/">Back to the homepage</a><a class="btn btn-quiet" href="/how-we-work">How we work</a></div></div></section>', noindex=True))

pages.append(page('404', 'Page not found — adsonus', 'This page does not exist.',
 hero('This page does not exist', 'The link may be old or mistyped. The pages below are a good place to start.') + '''
<section class="section"><div class="wrap"><div class="cards">
<a class="card" href="/services"><h3>Services</h3><p>Sales, finance, customer, HR and IT operations.</p></a>
<a class="card" href="/how-we-work"><h3>How we work</h3><p>Scope, fixed fee and your approval.</p></a>
<a class="card" href="/quote"><h3>Get a quote</h3><p>Tell us what you need.</p></a>
</div></div></section>''', noindex=True))

# ---------------------------------------------------------------- legal
LEGAL_DATE = '10 October 2026'
pages.append(page('privacy', 'Privacy notice — adsonus', 'How adsonus collects and uses personal data on this website.',
 hero('Privacy notice', f'Last updated {LEGAL_DATE}.') + f'''
<section class="section"><div class="wrap"><div class="prose doc">
<h2>Who we are</h2><p>adsonus (Adsonus) is a back-office operations business at {ADDRESS}. For questions about this notice or your data, contact {EMAIL}.</p>
<h2>What we collect on this website</h2><ul>
<li><strong>Quote requests:</strong> the details you enter in our form (name, work email, company, country, website, phone and your message). The form is delivered to us by Web3Forms, which processes the submission on our behalf.</li>
<li><strong>Usage data:</strong> we use Google Tag Manager and Google Analytics to understand how the website is used, such as pages visited and the device type. These tools may set cookies.</li></ul>
<h2>Why we use it</h2><ul>
<li>To reply to your request and prepare a quote, because you asked us to (steps before entering a contract).</li>
<li>To improve the website and measure our marketing, based on our legitimate interest in running the business.</li></ul>
<h2>How long we keep it</h2><p>Quote requests that do not lead to work are deleted within 24 months. Data about clients is kept for the length of the engagement and as required by law and our contract with you.</p>
<h2>Sharing and transfers</h2><p>We do not sell personal data. We share it only with service providers that help us run the business, such as email, form and analytics providers. Some of them are located outside the UK and European Union; where required, transfers are covered by appropriate safeguards such as standard contractual clauses.</p>
<h2>Client data</h2><p>When we work for a client, we handle their customers', suppliers', candidates' and employees' data as a processor under a separate data processing agreement. That agreement, not this notice, governs that data.</p>
<h2>Your rights</h2><p>Depending on where you live, you may have the right to access, correct or delete your data, to object to or restrict its use, and to complain to your data protection authority. To exercise these rights, email {EMAIL}.</p>
<h2>Changes</h2><p>We will update this notice when our practices change and show the date of the latest version at the top.</p>
</div></div></section>'''))

pages.append(page('terms', 'Website terms — adsonus', 'Terms of use for the adsonus website.',
 hero('Website terms of use', f'Last updated {LEGAL_DATE}.') + f'''
<section class="section"><div class="wrap"><div class="prose doc">
<h2>About these terms</h2><p>These terms apply to your use of adsonus.com. Our services are provided under a separate written agreement with each client, which takes precedence over anything on this website.</p>
<h2>Information on this website</h2><p>The content is general information about our services. Sample reports and figures are illustrative and do not describe any real client. Nothing on this website is financial, legal, tax or employment advice.</p>
<h2>Quotes</h2><p>Prices are given only in a written quote. A quote is valid for 30 days unless it says otherwise.</p>
<h2>Intellectual property</h2><p>The adsonus name, logo and website content belong to Adsonus. You may not copy them for commercial use without permission.</p>
<h2>Links</h2><p>We are not responsible for the content of other websites linked from this one.</p>
<h2>Liability</h2><p>We take care to keep this website accurate but do not guarantee that it is complete or always available. To the extent permitted by law, we are not liable for losses arising from use of the website.</p>
<h2>Contact</h2><p>Adsonus, {ADDRESS} · {EMAIL}</p>
</div></div></section>'''))

# ---------------------------------------------------------------- sitemap
today = datetime.date.today().isoformat()
urls = [''] + [p for p in pages if p not in ('thank-you', '404')]
open('sitemap.xml', 'w', encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ''.join(f'  <url><loc>https://adsonus.com/{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')

print('built', pages)
