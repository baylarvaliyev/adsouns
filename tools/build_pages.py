"""Builds the inner pages of adsonus.com from shared header/footer taken from index.html.
Run from the repo root: python3 tools/build_pages.py"""
import re, html
INDEX = open('index.html', encoding='utf-8').read()
HEAD_TOP = INDEX.split('<title>')[0]
HEADER = re.search(r'(<header class="site-header">.*?</header>)', INDEX, re.S).group(1)
FOOTER = re.search(r'(<footer class="site-footer">.*?</footer>)', INDEX, re.S).group(1)
NAVJS = re.search(r'(<script>\n\(function\(\)\{var t=document.*?</script>)', INDEX, re.S).group(1)
FONTS = re.search(r'(<link rel="preconnect".*?<link rel="stylesheet" href="/css/site-v2.css"/>)', INDEX, re.S).group(1)
GTM_NS = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGJCN4HG" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'

CTA = '''<section class="cta"><div class="wrap"><div class="cta-box"><div><h2>{h}</h2><p>{p}</p></div><a class="btn btn-primary" href="/quote">Get a quote <span class="arr" aria-hidden="true">→</span></a></div></div></section>'''
def cta(h='Tell us what you need', p='Describe your situation in a few lines. You get a reply within one working day and a written quote after a short call.'):
    return CTA.format(h=h, p=p)

def hero(label, h1, lead, crumbs=None):
    c = ''
    if crumbs:
        c = '<p class="crumbs">' + ' / '.join(f'<a href="{u}">{t}</a>' if u else t for t, u in crumbs) + '</p>'
    return f'<section class="page-hero"><div class="wrap">{c}<p class="label">{label}</p><h1>{h1}</h1><p class="lead">{lead}</p></div></section>'

def checks(items):
    return '<ul class="checks">' + ''.join(f'<li><span><strong>{a}</strong><span>{b}</span></span></li>' for a, b in items) + '</ul>'

def page(slug, title, desc, body, noindex=False):
    url = 'https://adsonus.com/' + ('' if slug == 'index' else slug)
    robots = '<meta name="robots" content="noindex"/>\n' if noindex else ''
    out = f'''{HEAD_TOP}<title>{title}</title>
<meta name="description" content="{html.escape(desc)}"/>
{robots}<link rel="canonical" href="{url}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="{url}"/>
<meta property="og:title" content="{html.escape(title)}"/>
<meta property="og:description" content="{html.escape(desc)}"/>
<meta property="og:image" content="https://adsonus.com/og-image.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="theme-color" content="#FFFFFF"/>
<link rel="icon" type="image/svg+xml" href="/img/logo-mark.svg"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
{FONTS}
</head>
<body>
{GTM_NS}
<a class="skip" href="#main">Skip to content</a>

{HEADER}

<main id="main">
{body}
</main>

{FOOTER}

{NAVJS}
</body>
</html>
'''
    open(f'{slug}.html', 'w', encoding='utf-8').write(out)
    return slug

TRIAL_BOX = '''<aside class="side-box"><p class="label">Free 2-week trial</p><h3>{h}</h3><p>{p}</p><a class="btn btn-primary" href="/quote">Start with a quote <span class="arr" aria-hidden="true">→</span></a><p class="small">No payment details needed for the trial.</p></aside>'''

pages = []

# ---------- Finance operations overview ----------
pages.append(page('finance-operations', 'Finance operations for small businesses — adsonus',
 'Accounts receivable, accounts payable and weekly finance reporting run for small and medium businesses, inside your own tools.',
 hero('Finance operations', 'The back office your business keeps putting off', 'We take on the daily finance work that slips when everyone is busy: chasing what you are owed, processing what you owe, and showing you where the cash stands every week.') + '''
<section class="section"><div class="wrap">
<div class="cards">
<a class="card" href="/accounts-receivable"><h3>Accounts receivable</h3><p>Reminders, follow-ups and calls on overdue invoices, from your own accounts address. Disputes come straight back to you.</p></a>
<a class="card" href="/accounts-payable"><h3>Accounts payable</h3><p>Supplier bills captured, coded and matched, and a payment run prepared for you to approve and release.</p></a>
<a class="card" href="/finance-reporting"><h3>Finance reporting</h3><p>One short report every Monday: cash collected, what is overdue, what is due to suppliers and what needs your decision.</p></a>
</div></div></section>
<section class="section band"><div class="wrap split">
<div class="prose"><p class="label">Who it suits</p><h2>Built for businesses without a full finance team</h2>
<p>Most of our clients have between 5 and 200 people and sell to other businesses on invoice. They usually have an accountant or bookkeeper for the year-end, but nobody whose job is to chase late payers or keep supplier bills under control day to day.</p>
<p>We fill that gap. We are not a replacement for your accountant: we work alongside them, in the same accounting software, and keep your records tidy for them.</p></div>
<div>''' + checks([
 ('Works in your software', 'Xero, QuickBooks, Sage or FreeAgent. No new system to buy.'),
 ('Your name on everything', 'Emails go from your domain, signed as part of your team.'),
 ('You stay in control', 'Templates, payment runs and anything unusual are approved by you.'),
 ('Clear weekly numbers', 'The same short report every Monday, whichever services you use.'),
]) + '''</div></div></section>
''' + cta()))

# ---------- Accounts receivable ----------
pages.append(page('accounts-receivable', 'Accounts receivable and credit control — adsonus',
 'Outsourced accounts receivable for small businesses: polite reminders from your own mailbox, calls on large balances, dispute handling and a weekly report.',
 hero('Accounts receivable', 'Get paid on time without chasing customers yourself', 'We run your credit control from your own accounts address, in your tone. Your customers deal with your accounts team. You keep the relationship and get the cash.', [('Home','/'),('Finance operations','/finance-operations'),('Accounts receivable',None)]) + '''
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">What we do</p><h2>Every overdue invoice followed up, every week</h2>
''' + checks([
 ('Reminders before and after the due date', 'Friendly at first, firmer as time passes, always polite and always in your style.'),
 ('Calls on the largest and oldest balances', 'A real conversation finds out why an invoice is stuck and gets a payment date.'),
 ('Excuses cleared quickly', 'Missing purchase order, wrong address, lost invoice: we resend what is needed the same day.'),
 ('Disputes passed straight to you', 'Anything about the work itself comes back to you with the full history, so nothing is promised on your behalf.'),
 ('A weekly report', 'Paid, promised, overdue and stuck, on one page every Monday.'),
]) + '''</div>
''' + TRIAL_BOX.format(h='We chase your overdue invoices for two weeks, free', p='Give us up to 20 overdue invoices. You see every email before it is sent, and a short update every working day.') + '''
</div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><p class="label">The routine</p><h2>A standard follow-up sequence, adjusted to you</h2><p class="lead">You approve the wording once. Customers you mark as sensitive are handled by hand or not contacted at all.</p></div>
<div class="table-wrap"><table class="table">
<thead><tr><th>When</th><th>What happens</th><th>Tone</th></tr></thead>
<tbody>
<tr><td class="num">3 days before due</td><td>Courtesy reminder with the invoice attached</td><td>Friendly</td></tr>
<tr><td class="num">1 day after due</td><td>Payment reminder and a request to confirm a date</td><td>Friendly</td></tr>
<tr><td class="num">7 days overdue</td><td>Second reminder and statement of account</td><td>Firm</td></tr>
<tr><td class="num">10–14 days overdue</td><td>Phone call to the person responsible for payment</td><td>Firm</td></tr>
<tr><td class="num">21 days overdue</td><td>Final notice, sent only with your approval</td><td>Formal</td></tr>
<tr><td class="num">30+ days overdue</td><td>We agree the next step with you: hold, payment plan or referral</td><td>Your decision</td></tr>
</tbody></table></div>
</div></section>
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">What we need from you</p><h2>One export, one mailbox, one call</h2>
<ul><li>An aged receivables report from your accounting software, or read-only access to it.</li>
<li>A mailbox on your domain, for example accounts@yourcompany.com, that we send from.</li>
<li>A 20-minute call to agree tone, sensitive customers and open disputes.</li></ul></div>
<div class="prose"><p class="label">What we never do</p><h2>Clear limits</h2>
<ul><li>We never collect money into our own account. Customers pay you, as they do today.</li>
<li>We never threaten, and any legal step is your decision.</li>
<li>We only chase business customers, never individual consumers.</li>
<li>We never chase an invoice before checking it has not already been paid.</li></ul></div>
</div></section>
''' + cta('See what two weeks of follow-up brings in', 'Tell us roughly how much is overdue and how many invoices. We reply within one working day.')))

# ---------- Accounts payable ----------
pages.append(page('accounts-payable', 'Accounts payable for small businesses — adsonus',
 'Outsourced accounts payable: supplier bills captured, coded and matched, and payment runs prepared for your approval. Your bank, your release.',
 hero('Accounts payable', 'Supplier bills under control, paid on time, never paid twice', 'Bills arrive in one inbox. We capture, code and check them, then prepare a payment run that you approve and release from your own bank.', [('Home','/'),('Finance operations','/finance-operations'),('Accounts payable',None)]) + '''
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">What we do</p><h2>From inbox to approved payment run</h2>
''' + checks([
 ('One inbox for every bill', 'Suppliers send to a dedicated address on your domain. Paper bills can be photographed and forwarded.'),
 ('Captured and coded', 'Supplier, amount, dates and account code entered in your accounting software, with the bill attached.'),
 ('Checked before anything is due', 'Matched against purchase orders or delivery notes where you use them, and checked for duplicates.'),
 ('Payment run prepared', 'A list of what to pay this week, ready for you to approve. You release it from your bank.'),
 ('Supplier statements reconciled', 'Monthly statements compared with your records, so differences are found early.'),
]) + '''</div>
''' + TRIAL_BOX.format(h='We process two weeks of your supplier bills, free', p='We set up the bills inbox, process everything that arrives for two weeks and prepare your first payment run.') + '''
</div></section>
<section class="section dark"><div class="wrap">
<div class="section-head"><p class="label">Payment safety</p><h2>Controls that stop the most common payment fraud</h2></div>
<div class="rules">
<div class="rule"><span class="no">01</span><h3>You release every payment</h3><p>We prepare payment runs. Only you, or someone you name, can send money from your bank.</p></div>
<div class="rule"><span class="no">02</span><h3>Bank detail changes are verified</h3><p>A request to change a supplier's bank details is confirmed by phone on a number we already hold, never on the one in the email.</p></div>
<div class="rule"><span class="no">03</span><h3>Duplicates are flagged</h3><p>Same supplier, same amount, similar date: we stop and ask before it reaches a payment run.</p></div>
</div></div></section>
''' + cta()))

# ---------- Finance reporting ----------
pages.append(page('finance-reporting', 'Weekly finance reporting for small businesses — adsonus',
 'A short weekly report on cash collected, overdue invoices, supplier bills due and the decisions waiting for you.',
 hero('Finance reporting', 'Know where your cash stands every Monday', 'One page, the same format every week: what came in, what is owed to you, what you owe, and what needs your decision.', [('Home','/'),('Finance operations','/finance-operations'),('Finance reporting',None)]) + '''
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">What is in the report</p><h2>Numbers you can act on in two minutes</h2>
<div class="table-wrap"><table class="table"><thead><tr><th>Section</th><th>What it shows</th></tr></thead><tbody>
<tr><td>Cash in</td><td>Payments received this week and the invoices they cleared</td></tr>
<tr><td>Owed to you</td><td>Overdue total, by age, with the five largest balances</td></tr>
<tr><td>Promises</td><td>Payment dates customers have given us, and whether they were kept</td></tr>
<tr><td>Owed by you</td><td>Supplier bills due in the next 14 days</td></tr>
<tr><td>Needs you</td><td>Disputes, approvals and anything unusual</td></tr>
</tbody></table></div>
<p>Once a month you also get a short cash summary: collections against last month, average days to get paid, and the customers who are getting slower.</p></div>
''' + TRIAL_BOX.format(h='Included with receivables and payables', p='Reporting comes with both finance services. It can also be set up on its own from your accounting software.') + '''
</div></section>
''' + cta()))

# ---------- Marketing ----------
pages.append(page('marketing', 'Google, Meta and LinkedIn advertising for small businesses — adsonus',
 'Paid advertising for small and medium businesses: Google Ads, Meta and LinkedIn campaigns, and proper conversion tracking, managed against qualified leads.',
 hero('Marketing', 'Advertising measured in customers, not clicks', 'We plan, build and manage paid campaigns for businesses that sell to other businesses and to local customers. You set the budget, the ad accounts stay in your name, and every month you see what each lead cost.') + '''
<section class="section"><div class="wrap">
<nav class="anchor-nav" aria-label="On this page"><a href="#google-ads">Google Ads</a><a href="#meta-linkedin">Meta and LinkedIn Ads</a><a href="#tracking">Tracking and reporting</a><a href="#approach">How we manage budgets</a></nav>
</div></section>
<section class="section svc-block" id="google-ads" style="padding-top:0"><div class="wrap split">
<div class="prose"><p class="label">Google Ads</p><h2>Be found when buyers are already looking</h2>
<p>Search campaigns built around the words your customers actually type, with landing pages that answer the question they asked.</p>''' + checks([
 ('Keyword and competitor research', 'Before any money is spent, so the budget goes to searches with buying intent.'),
 ('Campaign build and copy', 'Search ads, extensions and negative keywords, prepared for your sign-off.'),
 ('Weekly optimisation', 'Search terms reviewed, waste cut and bids adjusted to cost per qualified lead.'),
]) + '''</div>
''' + TRIAL_BOX.format(h='Two weeks of management, free', p='We audit your existing account or build a first campaign, and run it for two weeks on your budget.') + '''
</div></section>
<section class="section band svc-block" id="meta-linkedin"><div class="wrap split">
<div class="prose"><p class="label">Meta and LinkedIn Ads</p><h2>Reach the companies and roles you sell to</h2>
<p>LinkedIn targets by company, industry and job title, which suits business-to-business offers. Meta (Facebook and Instagram) reaches local and consumer audiences at a lower cost per lead.</p>''' + checks([
 ('Audience planning', 'Who to reach, who to exclude and how much each audience is worth to you.'),
 ('Creative and copy', 'Ad text and simple visuals prepared with you and approved before launch.'),
 ('Lead handling', 'Lead forms connected to your inbox or CRM, so no enquiry sits unanswered.'),
]) + '''</div><div></div></div></section>
<section class="section svc-block" id="tracking"><div class="wrap split">
<div class="prose"><p class="label">Tracking and reporting</p><h2>Know which money brought customers</h2>
<p>Most small business ad accounts report clicks, not enquiries. We set up conversion tracking properly, so every campaign is judged on leads and sales.</p>''' + checks([
 ('Conversion tracking', 'Google Tag Manager, Google Analytics and platform tags configured and tested.'),
 ('Monthly report', 'Spend, leads, cost per lead and what we will change next month, on one page.'),
]) + '''</div>
<div class="prose svc-block" id="approach"><p class="label">How we manage budgets</p><h2>Your accounts, your card, your limits</h2>
<ul><li>Ad accounts are created in your name and paid with your card. You can see everything at any time.</li>
<li>Monthly budgets are agreed in writing, and we do not exceed them.</li>
<li>Our fee is separate from your ad spend and quoted after a short call.</li></ul></div>
</div></section>
''' + cta('Ask for an account review', 'Tell us what you are spending now and what a good lead is worth to you. We reply within one working day.')))

# ---------- How we work ----------
pages.append(page('how-we-work', 'How we work — adsonus',
 'How an engagement with adsonus works: a short call, a free 2-week trial on real work, a results review and a fixed monthly quote.',
 hero('How we work', 'See the work before you commit to anything', 'Every engagement starts the same way, whichever service you choose: a short call, two weeks of real work for free, and a written quote only if you want to continue.') + '''
<section class="section"><div class="wrap">
<ol class="steps">
<li><span class="meta">Day 0 · 20 minutes</span><h3>Intro call</h3><p>How you work today, your tools, what you want fixed first and any customers or suppliers that need special care.</p></li>
<li><span class="meta">Days 1–3</span><h3>Setup</h3><p>Access agreed at the lowest level that works, templates written and approved by you, data agreement signed.</p></li>
<li><span class="meta">Days 1–14 · free</span><h3>Trial on real work</h3><p>We do the work and send a short update every working day.</p></li>
<li><span class="meta">Day 14</span><h3>Review and quote</h3><p>A one-page summary of results and a fixed monthly quote for your volume.</p></li>
</ol></div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><p class="label">The trial</p><h2>What the free two weeks covers</h2></div>
<div class="table-wrap"><table class="table"><thead><tr><th>Service</th><th>Trial scope</th><th>You see at the end</th></tr></thead><tbody>
<tr><td>Accounts receivable</td><td>Up to 20 overdue invoices followed up by email and phone</td><td>Paid, promised and disputed, invoice by invoice</td></tr>
<tr><td>Accounts payable</td><td>All supplier bills received in two weeks</td><td>Bills processed and a payment run ready to approve</td></tr>
<tr><td>Google, Meta or LinkedIn Ads</td><td>Account audit plus two weeks of management on your budget</td><td>Changes made, leads and cost per lead before and after</td></tr>
</tbody></table></div></div></section>
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">Pricing</p><h2>A fixed monthly fee, quoted for your volume</h2>
<p>We do not publish a price list because the work depends on your volume: how many invoices or bills you have, or how much ad spend we manage. After the trial you get a fixed monthly fee in writing.</p>
<p>Engagements run month to month with 30 days' notice. There are no setup fees for the trial.</p></div>
<div class="prose"><p class="label">Working together</p><h2>How we keep in touch</h2>
<ul><li>A weekly report every Monday morning.</li>
<li>Replies the same working day, during UK and European business hours.</li>
<li>One named person responsible for your account.</li>
<li>Email, phone or WhatsApp, whichever you prefer.</li></ul></div>
</div></section>
''' + cta()))

# ---------- Security ----------
pages.append(page('security', 'Security and data protection — adsonus',
 'How adsonus handles access, passwords, client data and payments: least access, no client money, a data processing agreement and verified bank detail changes.',
 hero('Security', 'How we handle your access and your data', 'You give us access to your customers, suppliers and numbers. This page sets out exactly how we protect them.') + '''
<section class="section"><div class="wrap split">
<div class="prose">
<h2>Access</h2>
<ul><li>We ask for the lowest access level that does the job: read-only or limited roles in your accounting software, and only the mailboxes we send from.</li>
<li>Each person at adsonus has their own login. Shared logins are not used.</li>
<li>Two-factor authentication is switched on for every account we use, where the software supports it.</li>
<li>Passwords are never sent by email or chat. Where a login must be shared, it is shared through a password manager.</li>
<li>When an engagement ends, you remove our access and we confirm in writing that we have.</li></ul>
<h2>Money</h2>
<ul><li>Client money never passes through adsonus. Your customers pay you directly.</li>
<li>For payables we prepare payment runs; only you, or someone you name, releases payments.</li>
<li>Requests to change a supplier's bank details are verified by phone on a number already on file.</li></ul>
<h2>Data protection</h2>
<ul><li>We sign a data processing agreement with every client before work starts. It covers what data we handle, why, for how long and how it is deleted.</li>
<li>adsonus is based in Azerbaijan. For clients in the UK and European Union, transfers are covered by the standard contractual clauses (and the UK addendum) included in our agreement.</li>
<li>We keep client data only for the length of the engagement plus any period agreed in the contract, then delete it.</li>
<li>The software we use to do the work, including AI-assisted drafting tools, is listed in the agreement. A person reviews everything before it is sent to your customers or suppliers.</li></ul>
<h2>Communication with your customers</h2>
<ul><li>We contact business customers only, never consumers.</li>
<li>We write as part of your team, in a tone you approve. We never threaten legal action; legal steps are your decision.</li></ul>
</div>
<aside class="side-box"><p class="label">Questions about security</p><h3>Ask before you start</h3><p>If your business has its own security questionnaire or contract terms, send them with your quote request and we will answer them before the trial.</p><p><strong>info@adsonus.com</strong></p><a class="btn btn-primary" href="/quote">Get a quote <span class="arr" aria-hidden="true">→</span></a></aside>
</div></section>'''))

# ---------- About ----------
pages.append(page('about', 'About adsonus',
 'adsonus provides finance operations and marketing for small and medium businesses. Founded by Baylar Valiyev, based in Baku, Azerbaijan.',
 hero('About', 'Back-office and marketing discipline for small businesses', 'adsonus gives small and medium businesses the kind of finance operations and marketing support that larger companies take for granted, delivered by a small team you deal with directly.') + '''
<section class="section"><div class="wrap founder">
<div class="photo"><img src="/img/baylar-valiyev.jpg" alt="Baylar Valiyev, founder of adsonus" width="800" height="1000" loading="lazy"/></div>
<div class="founder-copy">
<p class="label">Founder</p><h2>Baylar Valiyev</h2>
<p>I started adsonus after years of working on both sides of what keeps a small business alive: winning customers and getting paid. I have managed advertising for businesses of many sizes, and as a loans specialist at Express Bank I saw how often healthy businesses run short of cash simply because invoices are paid late.</p>
<p>adsonus brings those two sides together. You deal with me directly, and I am responsible for every piece of work that goes out under your name.</p>
<ul class="cv"><li><span class="k">Express Bank</span>Loans Specialist</li><li><span class="k">Based in</span>Baku, Azerbaijan</li></ul>
</div></div></section>
<section class="section band"><div class="wrap">
<div class="section-head"><p class="label">What we stand for</p><h2>Three things we will not compromise on</h2></div>
<div class="cards">
<div class="card"><h3>Honest numbers</h3><p>Reports show what happened, including what did not work. We never inflate results.</p></div>
<div class="card"><h3>Your control</h3><p>Your accounts, your bank, your ad budgets. We prepare and recommend; you decide.</p></div>
<div class="card"><h3>Proof before payment</h3><p>Every engagement starts with two weeks of real work, free, so you judge us on results.</p></div>
</div></div></section>
<section class="section"><div class="wrap split">
<div class="prose"><p class="label">Where we work from</p><h2>Baku, on your business hours</h2>
<p>Our team works from Baku, Azerbaijan, and keeps UK and European business hours. Working from Baku keeps our costs lower than a local agency, and that is reflected in our quotes.</p></div>
<div class="prose"><p class="label">Contact</p><h2>Talk to us</h2>
<ul><li>Email: <strong>info@adsonus.com</strong></li><li>Phone: <strong>+994 77 369 89 29</strong></li><li>Location: Baku, Azerbaijan</li></ul></div>
</div></section>
''' + cta()))

# ---------- Quote ----------
pages.append(page('quote', 'Get a quote — adsonus',
 'Request a quote for accounts receivable, accounts payable or paid advertising. Reply within one working day.',
 hero('Get a quote', 'Tell us what you need', 'A few details help us prepare. You get a reply within one working day, then a short call and a written quote.') + '''
<section class="section"><div class="wrap split">
<form class="form" id="quote-form" novalidate>
<div class="row"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required/></div>
<div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required/></div></div>
<div class="row"><div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization" required/></div>
<div class="field"><label for="f-country">Country</label><input id="f-country" name="country" autocomplete="country-name"/></div></div>
<div class="row"><div class="field"><label for="f-web">Website <span class="hint">(optional)</span></label><input id="f-web" name="website" type="url" placeholder="https://"/></div>
<div class="field"><label for="f-phone">Phone <span class="hint">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"/></div></div>
<fieldset class="field"><legend>What do you need?</legend><div class="opts">
<label><input type="checkbox" name="services" value="Accounts receivable"/> Accounts receivable</label>
<label><input type="checkbox" name="services" value="Accounts payable"/> Accounts payable</label>
<label><input type="checkbox" name="services" value="Finance reporting"/> Finance reporting</label>
<label><input type="checkbox" name="services" value="Google Ads"/> Google Ads</label>
<label><input type="checkbox" name="services" value="Meta / LinkedIn Ads"/> Meta / LinkedIn Ads</label>
<label><input type="checkbox" name="services" value="Tracking and reporting"/> Tracking and reporting</label>
</div></fieldset>
<div class="row"><div class="field"><label for="f-size">Company size</label><select id="f-size" name="size"><option value="">Select</option><option>1–4 people</option><option>5–20 people</option><option>21–50 people</option><option>51–200 people</option><option>200+ people</option></select></div>
<div class="field"><label for="f-volume">Monthly volume <span class="hint">(optional)</span></label><input id="f-volume" name="volume" placeholder="e.g. 60 invoices, or $3,000 ad spend"/></div></div>
<div class="field"><label for="f-msg">What would you like fixed first?</label><textarea id="f-msg" name="message" placeholder="For example: about £40k is overdue across 25 invoices and nobody has time to chase it."></textarea></div>
<input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off"/>
<p class="form-msg err" id="form-err" hidden></p>
<div class="btn-row"><button class="btn btn-primary" type="submit" id="f-submit">Send request <span class="arr" aria-hidden="true">→</span></button></div>
<p class="small">We use these details only to reply to your request. See our <a href="/privacy">privacy notice</a>.</p>
</form>
<aside class="side-box"><p class="label">What happens next</p><h3>From request to quote</h3>
<ol class="prose" style="padding-left:1.2em;margin:0"><li>We reply within one working day.</li><li>A 20-minute call to understand your situation.</li><li>A free 2-week trial on real work.</li><li>A fixed monthly quote in writing.</li></ol>
<p>Prefer email? Write to <strong>info@adsonus.com</strong>.</p></aside>
</div></section>
<script>
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
    .catch(function(){ err.textContent='Your request could not be sent. Please email info@adsonus.com instead.'; err.hidden=false; btn.disabled=false; btn.textContent='Send request →'; });
  });
})();
</script>'''))

# ---------- Thank you ----------
pages.append(page('thank-you', 'Thank you — adsonus', 'Your request has been received.',
 hero('Request received', 'Thank you. We will reply within one working day.', 'Your request has reached us. If anything is urgent, email info@adsonus.com or call +994 77 369 89 29.') + '''
<section class="section"><div class="wrap"><div class="btn-row"><a class="btn btn-secondary" href="/">Back to the homepage</a><a class="btn btn-secondary" href="/how-we-work">How the trial works</a></div></div></section>''', noindex=True))

# ---------- 404 ----------
pages.append(page('404', 'Page not found — adsonus', 'This page does not exist.',
 hero('Error 404', 'This page does not exist', 'The link may be old or mistyped. The pages below are a good place to start.') + '''
<section class="section"><div class="wrap"><div class="cards">
<a class="card" href="/finance-operations"><h3>Finance operations</h3><p>Accounts receivable, accounts payable and reporting.</p></a>
<a class="card" href="/marketing"><h3>Marketing</h3><p>Google, Meta and LinkedIn advertising.</p></a>
<a class="card" href="/quote"><h3>Get a quote</h3><p>Tell us what you need.</p></a>
</div></div></section>''', noindex=True))

# ---------- Privacy ----------
LEGAL_DATE = '10 October 2026'
pages.append(page('privacy', 'Privacy notice — adsonus', 'How adsonus collects and uses personal data on this website.',
 hero('Legal', 'Privacy notice', f'Last updated {LEGAL_DATE}.') + '''
<section class="section"><div class="wrap"><div class="prose">
<h2>Who we are</h2><p>adsonus is a finance operations and marketing services business based in Baku, Azerbaijan. For questions about this notice or your data, contact info@adsonus.com.</p>
<h2>What we collect on this website</h2><ul>
<li><strong>Quote requests:</strong> the details you enter in our form (name, work email, company, country, website, phone and your message). The form is delivered to us by Web3Forms, which processes the submission on our behalf.</li>
<li><strong>Usage data:</strong> we use Google Tag Manager and Google Analytics to understand how the website is used, such as pages visited and the device type. These tools may set cookies.</li></ul>
<h2>Why we use it</h2><ul>
<li>To reply to your request and prepare a quote, because you asked us to (steps before entering a contract).</li>
<li>To improve the website and measure our marketing, based on our legitimate interest in running the business.</li></ul>
<h2>How long we keep it</h2><p>Quote requests that do not lead to work are deleted within 24 months. Data about clients is kept for the length of the engagement and as required by law and our contract with you.</p>
<h2>Sharing and transfers</h2><p>We do not sell personal data. We share it only with service providers that help us run the business, such as email, form and analytics providers. Some of them are located outside the UK and European Union; where required, transfers are covered by appropriate safeguards such as standard contractual clauses.</p>
<h2>Client data</h2><p>When we work for a client, we handle their customers' and suppliers' data as a processor under a separate data processing agreement. That agreement, not this notice, governs that data.</p>
<h2>Your rights</h2><p>Depending on where you live, you may have the right to access, correct or delete your data, to object to or restrict its use, and to complain to your data protection authority. To exercise these rights, email info@adsonus.com.</p>
<h2>Changes</h2><p>We will update this notice when our practices change and show the date of the latest version at the top.</p>
</div></div></section>'''))

# ---------- Terms ----------
pages.append(page('terms', 'Website terms — adsonus', 'Terms of use for the adsonus website.',
 hero('Legal', 'Website terms of use', f'Last updated {LEGAL_DATE}.') + '''
<section class="section"><div class="wrap"><div class="prose">
<h2>About these terms</h2><p>These terms apply to your use of adsonus.com. Our services are provided under a separate written agreement with each client, which takes precedence over anything on this website.</p>
<h2>Information on this website</h2><p>The content is general information about our services. Sample reports and figures are illustrative and do not describe any real client. Nothing on this website is financial, legal or tax advice.</p>
<h2>Quotes</h2><p>Prices are given only in a written quote. A quote is valid for 30 days unless it says otherwise.</p>
<h2>Intellectual property</h2><p>The adsonus name, logo and website content belong to adsonus. You may not copy them for commercial use without permission.</p>
<h2>Links</h2><p>We are not responsible for the content of other websites linked from this one.</p>
<h2>Liability</h2><p>We take care to keep this website accurate but do not guarantee that it is complete or always available. To the extent permitted by law, we are not liable for losses arising from use of the website.</p>
<h2>Contact</h2><p>adsonus, Baku, Azerbaijan · info@adsonus.com</p>
</div></div></section>'''))

print('built', pages)
