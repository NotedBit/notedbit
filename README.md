# Notedbit — portfolio & project archive

Static bilingual technical portfolio by **Loran Mustafa**.

- **Website:** https://notedbit.com
- **LinkedIn:** https://www.linkedin.com/in/loran-mustafa
- **GitHub profile:** https://github.com/notedbit

## Design and content

The homepage highlights **three projects with directly inspectable evidence** (prototype video, playable browser adaptation, published site/source). The project archive contains **nine principal work areas**, plus smaller archived exercises grouped by topic. Ideas and future hardware concepts remain in `docs/PROJECT_INVENTORY.md`, **not** in the public portfolio.

Projects are not automatically called complete. Historic coursework dates are preserved, and subsequent software adaptations/tests are identified separately. The full project catalogue records evidence and limits.

## Technology

- Plain **HTML, CSS, JavaScript**; no framework or backend
- **GitHub Pages** with custom domain
- **DE/EN** language preference using `language.js` and browser local storage
- Lightweight client-side searchable/filterable archive in `archive.js`
- Media: a real generated product-video **prototype output**, genuine archived graphics and a JavaScript game adaptation

## Folder layout

```text
CNAME                                  Custom domain: notedbit.com — do not delete
index.html                             Main portfolio
projects/index.html                    Complete public project archive
projects/*.html                        Topic-specific technical case studies
archive.js                             Archive search and filters
language.js                            DE/EN translation logic
style.css, script.js                   Styles and core navigation
assets/                                 Genuine visuals and prototype video
  trending-trove-prototype.mp4         Earlier video output, not a final release
  trending-trove-poster.jpg            Frame from that output
  notedbit-site-preview.png            Screenshot of this website
  dungeoncrawler-preview.png           Original graphics
  memesmoke-*.jpg                      Original historical screenshots
  og-preview.png/svg, favicon.svg      Site assets
games/dungeoncrawler/                  Browser adaptation (game.js, game.css, sprites)
docs/PROJECT_INVENTORY.md              Full status inventory, including ideas
docs/PROJECT_SOURCE_AUDIT.md           Provenance, dates, verified/unverified scopes
docs/PUBLICATION_REVIEW.md             Privacy/copyright/deployment review
```

## Run locally

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`. The local server is useful because the game uses asset fetches; opening individual HTML files via `file://` is not a reliable functional test.

## Attribution and disclosure

- The original **C++ Dungeon Crawler (2022/23)** was university **group** coursework. The **JavaScript browser adaptation** is later work.
- The **2024 C++ library-management source** is archived, but its command dispatch was incomplete; original individual code authorship is not fully verified. A separate 2026 reconstructed CLI exists in the **review-only delivery package**, not in the public website repository.
- The **product video** is an earlier prototype. A later automated Linux run tested a *different* output. Do not conflate them.
- Python simulation and horror-video application source archives are known from the user's Library, but the raw bytes were unavailable for reinspection in this session. Their case studies do not claim a new successful execution.
- No invented demos, performance numbers, Windows release validation or third-party repository links.

## Deploy carefully

The required root `CNAME` contains exactly `notedbit.com`. Do not delete or replace this file with a blank value. The delivery package includes a local publishing script that clones the repository, overlays only the supplied website files, checks `CNAME`, shows the pending changes and requires explicit confirmation before pushing.

Check copyright/privacy and possible legal-notice obligations before publication: `docs/PUBLICATION_REVIEW.md`.


## Project archive interface

The archive at `projects/` uses native HTML `<details>` for inline project documentation, a JavaScript category filter and search, and a lazy-loaded embedded game demo. The full case-study pages remain accessible as optional references. Language labels are maintained in the HTML with `data-de` and `language.js`.

The sample video is an earlier prototype output, not a current or final release. No project source or demo is published unless the corresponding material is available and verified.
