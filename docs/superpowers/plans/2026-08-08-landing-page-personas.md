# Landing Page Messaging Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `index.html` so the first screenful says concretely what Matron is, the ecosystem parts appear immediately, two persona paths (newcomer / power user) are explicit, and Android is advertised as a full peer.

**Architecture:** Pure copy-and-markup changes to a static site. New section order: hero (rewritten) → parts strip (new) → two-ways-in (new) → features → how-it-works (trimmed) → ecosystem (+Android) → setup → dev-boxer → beta (updated). Existing CSS classes (`.grid`, `.card`, `.grid.two`, `.section-lede`, `.alt`) are reused; two small CSS rules are added.

**Tech Stack:** Plain HTML/CSS, no build step. Deploys as-is to Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-08-08-landing-page-messaging-design.md`

## Global Constraints

- Branch: `landing-page-personas`. Working dir: repo root (`~/matron-site`).
- No build step — never add tooling, bundlers, or npm. Edit files in place.
- Copy style: apostrophes in body copy use `&rsquo;`, em-dashes are literal `—`, middots are `&middot;` (match the existing file).
- Facts that must stay true in all copy: Android app is in Play Store review with testers active (not publicly downloadable); iPhone/Mac beta is via TestFlight; matron-desktop is Electron for Windows/Linux; the journal server is self-hosted.
- Section background rhythm: sections alternate plain / `class="alt"`. After inserting the two new sections the order is: parts (plain), paths (alt), features (plain), how (alt), ecosystem (plain), setup (alt), devboxer (plain), beta (alt). The existing `features` section must LOSE nothing but its `id` stays; `how`, `setup`, `beta` keep `class="alt"` as today — the inserted `paths` section takes `alt` so the rhythm holds.
- Verification helper used by several tasks (run from repo root; expects "OK"):

```bash
python3 - index.html <<'PY'
import sys
from html.parser import HTMLParser
VOID={'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}
class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.stack=[]; self.errs=[]
    def handle_starttag(self,t,a):
        if t not in VOID: self.stack.append((t,self.getpos()))
    def handle_endtag(self,t):
        if t in VOID: return
        if not self.stack: self.errs.append(f"stray </{t}> at {self.getpos()}"); return
        top,pos=self.stack.pop()
        if top!=t: self.errs.append(f"</{t}> at {self.getpos()} closes <{top}> from {pos}")
p=P(); p.feed(open(sys.argv[1]).read()); p.close()
for t,pos in p.stack: p.errs.append(f"unclosed <{t}> from {pos}")
print("\n".join(p.errs) or "OK"); sys.exit(1 if p.errs else 0)
PY
```

---

### Task 1: Head metadata + hero rewrite

**Files:**
- Modify: `index.html` (head block lines ~6–16, hero block lines ~36–44)

**Interfaces:**
- Produces: hero CTA note naming all three platforms; meta/OG copy later tasks must not contradict.

- [ ] **Step 1: Replace the title and meta description**

Old:
```html
<title>Matron — the open-source remote for Claude Code and Codex</title>
<meta name="description" content="Matron is an open-source remote control for Claude Code and Codex. Drive the agents on all your machines from native iPhone and Mac apps — on your own Claude or ChatGPT plan, through a server you run.">
```

New:
```html
<title>Matron — native Mac, iPhone and Android apps for Claude Code and Codex</title>
<meta name="description" content="Matron turns the Claude Code and Codex agents on your machines into live chats in native Mac, iPhone and Android apps — synced through a small server you host. New to remote agents? dev-boxer builds you an agent box from a fresh VPS in one command.">
```

- [ ] **Step 2: Replace the OG title and description**

Old:
```html
<meta property="og:title" content="Matron — the open-source remote for Claude Code and Codex">
<meta property="og:description" content="Drive the coding agents on all your machines from native iPhone and Mac apps. Open source, self-hosted, and it runs on the Claude or ChatGPT subscription you already pay for.">
```

New:
```html
<meta property="og:title" content="Matron — native Mac, iPhone and Android apps for Claude Code and Codex">
<meta property="og:description" content="Chat with the Claude Code and Codex agents on your own machines from native Mac, iPhone and Android apps — self-hosted, open source, on the subscription you already pay for.">
```

- [ ] **Step 3: Replace the hero lede and CTA note** (headline `Your coding agents, <span class="mono">anywhere</span>` is unchanged)

Old:
```html
<p class="lede">Matron is an open-source remote for <strong>Claude Code</strong> and <strong>Codex</strong>. Follow the agents on all your machines, start sessions from the sofa, answer prompts from the coffee queue — on the plan you already pay for.</p>
```

New:
```html
<p class="lede">Matron turns the <strong>Claude Code</strong> and <strong>Codex</strong> agents on your machines into chats in a native app — on Mac, iPhone and Android. Everything syncs through a small server you host, so the session you start at your desk is already on your phone when you stand up.</p>
```

Old:
```html
<span class="cta-note">iPhone and Mac &middot; open source &middot; TestFlight beta</span>
```

New:
```html
<span class="cta-note">iPhone, Mac and Android &middot; open source &middot; beta</span>
```

- [ ] **Step 4: Verify** — run the HTML checker from Global Constraints; expect `OK`. Then `grep -c "Android" index.html` — expect ≥ 4 (title, description, OG description, lede, cta-note).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Hero and meta: concrete definition, all three native platforms"
```

### Task 2: Parts strip section + CSS

**Files:**
- Modify: `index.html` (insert new section between the hero `</div>` at line ~52 and `<section id="features">`)
- Modify: `style.css` (append two rules after the `.grid.two` rule, line ~214)

**Interfaces:**
- Produces: section `id="parts"`; CSS class `grid four`; `.card p + p` spacing rule used by Task 3.

- [ ] **Step 1: Append CSS rules** after `@media (max-width: 640px) { .grid.two { grid-template-columns: 1fr; } }`:

```css
.grid.four { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 900px) { .grid.four { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .grid.four { grid-template-columns: 1fr; } }
.card p + p { margin-top: 10px; }
```

- [ ] **Step 2: Insert the parts section** immediately after the hero's closing `</div>` (the one before `<section id="features">`):

```html
  <section id="parts">
    <div class="wrap">
      <h2>What Matron is</h2>
      <p class="section-lede">Four small open-source parts that snap together. One cheap VPS can run the lot.</p>
      <div class="grid four">
        <div class="card"><span class="glyph">&#9673;</span><h3>The apps</h3><p>Native <a href="https://github.com/Matronhq/matron-apple">Mac and iPhone</a> and <a href="https://github.com/Matronhq/matron-android">Android</a> clients, an <a href="https://github.com/Matronhq/matron-desktop">Electron app</a> for Windows and Linux, and a <a href="https://github.com/Matronhq/matron-web">web client</a>.</p></div>
        <div class="card"><span class="glyph">&#9636;</span><h3><a href="https://github.com/Matronhq/matron-journal">matron-journal</a></h3><p>The sync server you host: every device reads the same conversations from it, live.</p></div>
        <div class="card"><span class="glyph">&#10231;</span><h3><a href="https://github.com/Matronhq/matron-bridge">matron-bridge</a></h3><p>Runs beside Claude Code or Codex on each dev machine and publishes its sessions to your journal.</p></div>
        <div class="card"><span class="glyph">&#9635;</span><h3><a href="https://github.com/Matronhq/dev-boxer">dev-boxer</a></h3><p>No dev machine? One command turns a fresh Ubuntu VPS into a hardened, always-on agent box.</p></div>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Verify** — HTML checker expects `OK`; `grep -c 'id="parts"' index.html` expects 1; open `http://localhost:8788` via `python3 -m http.server 8788` and confirm the strip renders 4-across on desktop width.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add parts strip: the four ecosystem pieces directly under the hero"
```

### Task 3: "Two ways in" persona section

**Files:**
- Modify: `index.html` (insert new section immediately after the `</section>` of `id="parts"`)

**Interfaces:**
- Consumes: `.grid.two` (existing CSS), `.card p + p` spacing (Task 2), anchors `#devboxer` and `#features` (existing).
- Produces: section `id="paths"`.

- [ ] **Step 1: Insert the section** directly after the parts section's closing `</section>`:

```html
  <section id="paths" class="alt">
    <div class="wrap">
      <h2>Two ways in</h2>
      <div class="grid two">
        <div class="card">
          <h3>No remote agent yet?</h3>
          <p>Rent a cheap VPS, run one <a href="https://github.com/Matronhq/dev-boxer">dev-boxer</a> command, and you have an always-on agent box: Claude Code installed, locked down, reachable from everywhere. Chat with it from your desktop or your phone — every device shows the same conversation, so handoff is instant.</p>
          <p><a href="#devboxer">Set up your first agent box &rarr;</a></p>
        </div>
        <div class="card">
          <h3>Already running Claude Code everywhere?</h3>
          <p>Retire the SSH-from-your-phone routine. Matron is a native interface to the sessions on all your machines — live tool calls and diffs instead of a terminal squeezed onto a phone screen, plus context and usage meters, slash commands to compact or start fresh chats, and push notifications when an agent needs you.</p>
          <p><a href="#features">See what the apps can do &rarr;</a></p>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify** — HTML checker `OK`; anchor check finds no missing targets:

```bash
for a in $(grep -o 'href="#[a-z-]*"' index.html | tr -d '"' | sed 's/href=#//' | sort -u); do grep -q "id=\"$a\"" index.html || echo "MISSING #$a"; done
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add two-ways-in section: newcomer and power-user paths"
```

### Task 4: Features touch-ups (Android in platform card, slash commands)

**Files:**
- Modify: `index.html` (the three-card grid at the end of `#features`, lines ~132–136; the allowance feature paragraph, line ~105)

- [ ] **Step 1: Replace the platform card**

Old:
```html
<div class="card"><span class="glyph">&#63743;</span><h3>Native on iPhone and Mac</h3><p>Smooth, fast, and light — custom-designed native apps. Windows and Linux are covered by <a href="https://github.com/Matronhq/matron-desktop">matron-desktop</a>.</p></div>
```

New:
```html
<div class="card"><span class="glyph">&#9673;</span><h3>Native on iPhone, Mac and Android</h3><p>Smooth, fast, and light — custom-designed native apps on all three. Windows and Linux are covered by <a href="https://github.com/Matronhq/matron-desktop">matron-desktop</a> (Electron).</p></div>
```

- [ ] **Step 2: Extend the allowance feature paragraph** to mention slash commands

Old:
```html
<p>Every session shows its model, context-window fill, and your session and weekly rate limits with reset times — live. Running long? Compact the conversation with one tap.</p>
```

New:
```html
<p>Every session shows its model, context-window fill, and your session and weekly rate limits with reset times — live. Running long? Compact with one tap, or use slash commands to compact, switch agents, and start fresh chats by typing.</p>
```

- [ ] **Step 3: Verify** — HTML checker `OK`; `grep -c "Native on iPhone, Mac and Android" index.html` expects 1.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Features: Android joins the platform card, slash commands named"
```

### Task 5: Trim how-it-works

**Files:**
- Modify: `index.html` (the three `.step` blocks in `#how`, lines ~145–147)

The parts strip now explains journal/bridge, so the steps get tighter and the apps step names all platforms. The section lede and honesty box are unchanged.

- [ ] **Step 1: Replace step 2's paragraph**

Old:
```html
<div class="step"><h3>Your journal server relays</h3><p>Sessions sync through a Matron journal server that you run yourself — your conversations and files go through your own box, not a third-party cloud.</p></div>
```

New:
```html
<div class="step"><h3>Your journal server relays</h3><p>Sessions sync through your own matron-journal server — conversations and files go through your box, not a third-party cloud.</p></div>
```

- [ ] **Step 2: Replace step 3's paragraph**

Old:
```html
<div class="step"><h3>Matron goes with you</h3><p>The iPhone and Mac apps show every session live. Read, reply, approve, attach — from the sofa, the train, or the queue for coffee.</p></div>
```

New:
```html
<div class="step"><h3>Matron goes with you</h3><p>The apps on your phone, desktop and browser show every session live. Read, reply, approve, attach — from the sofa, the train, or the queue for coffee.</p></div>
```

- [ ] **Step 3: Verify** — HTML checker `OK`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "How it works: trim overlap with parts strip, platform-neutral apps step"
```

### Task 6: Ecosystem grid — add matron-android, plain matron-desktop

**Files:**
- Modify: `index.html` (the `#ecosystem` grid, lines ~157–164)

- [ ] **Step 1: Insert the matron-android card** immediately after the matron-apple card:

```html
        <div class="card"><span class="glyph">&#9673;</span><h3><a href="https://github.com/Matronhq/matron-android">matron-android</a></h3><p>The native Android client — Kotlin and Jetpack Compose, a faithful port of the iPhone app, speaking the same journal protocol.</p></div>
```

- [ ] **Step 2: Replace the matron-desktop card's paragraph**

Old:
```html
<p>A lightweight desktop client for Windows and Linux — currently being updated for the new journal features.</p>
```

New:
```html
<p>The Electron client for Windows and Linux — the same live sessions on the platforms the native apps don&rsquo;t cover.</p>
```

- [ ] **Step 3: Verify** — HTML checker `OK`; `grep -c "matron-android" index.html` expects ≥ 2 (parts strip + ecosystem card).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Ecosystem: add matron-android card, describe matron-desktop plainly"
```

### Task 7: Beta section update + full-page verification

**Files:**
- Modify: `index.html` (the `#beta` section lede, line ~199)

- [ ] **Step 1: Replace the beta lede**

Old:
```html
<p class="section-lede">Matron is in TestFlight beta for iPhone, with the Mac app alongside it. If you&rsquo;d like an invite, get in touch and tell us a little about your setup.</p>
```

New:
```html
<p class="section-lede">Matron is in beta on every platform: iPhone and Mac through TestFlight, Android through Play Store testing — both store submissions are in review. If you&rsquo;d like an invite, get in touch and tell us a little about your setup.</p>
```

- [ ] **Step 2: Full verification pass**

```bash
python3 - index.html <<'PY'
# (HTML checker from Global Constraints)
PY
for a in $(grep -o 'href="#[a-z-]*"' index.html | tr -d '"' | sed 's/href=#//' | sort -u); do grep -q "id=\"$a\"" index.html || echo "MISSING #$a"; done
grep -o 'https://github.com/Matronhq/[a-z-]*' index.html | sort -u
```

Expected: `OK`, no missing anchors, and the repo list includes matron-android, matron-apple, matron-bridge, matron-desktop, matron-journal, matron-web, dev-boxer.

- [ ] **Step 3: Visual check** — `python3 -m http.server 8788`, load `http://localhost:8788` at desktop and ~390px widths; confirm parts strip (4→2→1 columns), two-ways-in cards (2→1), and that section background alternation is unbroken top to bottom.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Beta: all platforms, TestFlight and Play Store testing"
```
