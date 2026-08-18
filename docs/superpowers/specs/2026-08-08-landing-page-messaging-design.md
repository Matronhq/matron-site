# Landing page messaging rework — design

**Date:** 2026-08-08
**Scope:** `index.html` copy and section structure, plus `<head>` meta/OG tags. Minor
`style.css` additions only as needed for the two new sections. No visual redesign,
no changes to `privacy/`, `support/`, or `404.html`.

## Problem

The current landing page sells a vague benefit ("chat to your agents") without
saying concretely what Matron is, and without speaking to a specific visitor:

- The ecosystem — journal server, bridge, clients, dev-boxer — isn't introduced
  until the fourth section, so a visitor spends the first three screenfuls
  without knowing what the product physically consists of.
- The copy doesn't distinguish its two real audiences, so it lands specifically
  with neither.
- Android isn't mentioned anywhere, though a native Android client exists and is
  in Play Store review with testers active.

## Target personas

1. **Newcomer** — has no remote agent today. Wants a first foray: a cheap VPS
   that dev-boxer turns into an always-on agent box, then chat with that agent
   from desktop and phone with friction-free instant handoff.
2. **Power user** — already runs Claude Code on multiple machines, currently
   SSHing in from tools like Termius. Matron replaces that with a native
   interface that also adds things a terminal-over-SSH can't do well: live
   session rendering, context and usage meters, slash commands (compact, new
   chat), push notifications — in native Mac, iPhone and Android apps plus
   Electron for Windows/Linux.

## Page structure (new order)

1. **Hero (rewritten).** Headline keeps punch; lede is plain-English and
   concrete, low jargon: Matron puts the Claude Code and Codex agents running on
   your machines into a native chat app — Mac, iPhone and Android — synced live
   through a small server you host yourself. One short follow-on line for the
   handoff hook (start at your desk, answer from your phone). CTA note becomes
   "iPhone, Mac and Android · open source · beta".
2. **Parts strip (new).** Directly under the hero, before any feature cards.
   Four one-liners with links: **Apps** (native Mac/iPhone/Android, Electron
   for Windows/Linux, web client) · **matron-journal** (small self-hosted sync
   server) · **matron-bridge** (runs beside the agent CLI on each dev machine) ·
   **dev-boxer** (one command turns a fresh Ubuntu VPS into an always-on agent
   box). This is the "exactly what it is" moment.
3. **"Two ways in" (new).** Two persona cards:
   - *No remote agent yet?* Cheap VPS + one dev-boxer command → an always-on
     agent you chat with from every device, instant handoff between them.
     Anchors to the dev-boxer section.
   - *Already running Claude Code on three machines?* Drop the SSH-from-Termius
     routine: native apps with live sessions, context and usage meters, slash
     commands (/compact, new chats), push notifications. Anchors to Features.
4. **Features (kept, touched up).** Existing showcase stays; section headers
   nudged toward power-user pains where natural. The platform card gains
   Android.
5. **How it works (kept, trimmed).** The parts strip now carries some of this;
   remove redundancy, keep the "remote control, not cloud IDE" framing and the
   self-hosting honesty box.
6. **Ecosystem (kept, +Android).** Grid remains the detailed repo directory;
   add a **matron-android** card (Kotlin/Jetpack Compose native client, same
   journal protocol).
7. **Setup (kept).**
8. **dev-boxer (kept).** Position unchanged; newcomer card links here.
9. **Beta (updated).** iPhone and Mac via TestFlight; Android via Play Store
   testing. Both store submissions are in review. Same email CTA covers all.

Head/meta: title, description and OG tags updated to name all three native
platforms and the concrete use case.

## Copy principles

- First paragraph a visitor reads must say what Matron physically is.
- Name the parts early; save per-repo detail for the Ecosystem grid.
- Address one persona at a time; don't blend their pitches into mush.
- Keep the existing honest tone ("the app is the window, not the engine").
- Facts to respect: Android app is store-submitted and tester-available, not
  publicly downloadable yet; matron-desktop is Electron; no build step on this
  site — plain HTML/CSS only.

## Testing / acceptance

- Preview locally with `python3 -m http.server 8788`; check narrow (iPhone) and
  wide layouts for the two new sections.
- All internal anchors (#features, #how, #setup, #devboxer, and the new ones)
  resolve; all repo links valid, including the new matron-android link.
- HTML validates (no unclosed tags); existing CSS classes reused where possible.
