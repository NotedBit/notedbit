# Notedbit — source-backed portfolio review (2026-11-02)

This report records **what was actually verified** for the public portfolio. It is not a warranty that every desktop app is ready for distribution.

## Evidence and implementation

| Public project entry | Source / evidence | Verified outcome | Limitation |
| --- | --- | --- | --- |
| Automated Video Production | Local Python `pvg` source and stored project output | Website MP4 is byte-identical to `ProductVideoGenerator_Visual_Run_B.mp4`; source includes product/LLM/TTS/render modules | No new full render performed; filtered source archive excludes local secret/config modules required by some development tests; category isolation is development work |
| Python Simulation & Video Generation | 29 selected files from pygame project | Nine registered modes (eight flagged production, one experimental), recipe/seed/quality modules inspected; independent three-mode Canvas adaptation tested in Chromium | `pygame-ce` unavailable here, so original desktop app not launched; browser demo is a labeled adaptation, not a Python port |
| Automated Horror Story & Video Production | 175 selected project files from the large archive; own 2026-09-24 video | 530 Python tests + 42 subtests passed; FFmpeg excerpt includes H.264/AAC; 42 s sample from a 2:53 original | No fresh full AI inference or final batch run; prior batch report documented 3/12 successful items |
| C++ Library Management | `CLionProjects(2).zip`, January 2024 | Original C++ classes and incomplete `Library::processCommand` inspected | No working end-to-end program claimed; no fabricated browser interface |
| C++ Game Development — Dungeon Crawler | Archived C++ work + browser adaptation | Tested actual browser gameplay: Fighter started with 50 HP at level 1; genuine screenshot captured | Browser game is a separate JavaScript adaptation, not the original C++ executable |
| Web Development & Deployment | Repository ZIP, user-supplied illustration and earlier real screenshot | User's original artwork matches `web-deployment-thumbnail.webp` byte-for-byte; separate earlier screenshot labeled as such | Live deployment is not performed by this patch |
| Linux & System Automation | User-documented commands and configuration work | Descriptions align with documented systemd, diagnostics and storage migration | No real production service demonstrated here |
| Private Game Server Operation | User's October 2026 operational work and local community-code checkout | Date corrected; framed as configuration, maintenance, backup and administration | Community game/server source is **not** claimed as user's authorship |
| Social Media Content Project | User-supplied 10k and 5m milestone pictures | Historical media screenshots retained | Historical, not current account statistics |
| Introductory C++ Programs | `CLionProjects(2).zip` dated October–December 2023 | Dates corrected; presented as small coursework | No fake standalone application |
| Computer Architecture & Digital Logic | `TI.zip` own `Aufgaben/.../Abgabe` files | Digital and RISC-V submissions dated 2022-11–2023-01; actual RISC-V assembly excerpt included | No claim of a full digital computer, browser simulator or emulator |

## Browser / site checks

- 11 original archive items retained; category filters, search, list/card mode and DE language change tested in Chromium.
- Hero at 125% CSS zoom checked at 1440px and 390px viewports: no horizontal document overflow or clipped line-box content.
- New Canvas demo: mode selection, pause, restart and rendered canvas checked. The Chromium page has no reported JavaScript exceptions.
- Dungeon Crawler browser adaptation: original pixel art loaded in a local browser QA harness; new game started, HP and level populated, and arrow-key input handled without exceptions.
- 226 local links and media references inspected: zero missing targets; relevant JavaScript files passed `node --check`.
- Original `CNAME` was not modified. No existing project removed, no original source or local secrets published.

## Demo provenance

- Horror short clip is an excerpt of a **real generated output**, not a source-video/reference clip.
- Simulation screenshot comes from the new Canvas adaptation actually rendered in Chromium.
- Dungeon Crawler screenshot is an actual run of the existing browser game.
- Featured website illustration is the image supplied by the project owner, not a screenshot; the separate case-study image is labeled an earlier screenshot.

## Follow-up outside the static portfolio

Desktop source-level work that needs an actual native test environment remains separate: installing `pygame-ce`, verifying Product Video Generation with its local runtime/model setup, and end-to-end generation in Horror Shorts Engine using its model assets. The static website patch does not alter those local applications.
