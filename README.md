# Notedbit — developer portfolio

Personal project archive by **Loran Mustafa**, a Business Information Systems student at **Technische Universität Braunschweig**.

**Website:** https://notedbit.com · **LinkedIn:** https://www.linkedin.com/in/loran-mustafa

## Scope

Static bilingual site (English / German) with selected technical projects, an archive and case studies. Built with **HTML, CSS, vanilla JavaScript**, versioned using Git and deployed with **GitHub Pages**. No frontend framework, backend or build step.

## Real demonstrations

- **Automated Product Video Generation:** a hosted output MP4 from an early working prototype; later Linux test results refer to a different run.
- **C++ Game Development — Dungeon Crawler:** browser-playable **JavaScript adaptation** of an archived **university C++ group project**.
- **Notedbit:** live website and source code in this repository.

Other projects may be described without a hosted executable or sample. Their current status is clearly indicated.

## Repository layout

```text
index.html                          Landing page
projects/index.html                 Full project archive
projects/*.html                     Technical case studies
assets/                             Genuine project images and prototype output
language.js                         DE/EN language switch
style.css, script.js                Site styling and navigation behavior
games/dungeoncrawler/              JavaScript game adaptation
docs/PROJECT_INVENTORY.md           Source-based project/status catalogue
CNAME                               GitHub Pages custom domain (must remain)
```

## Run locally

Serve the directory with a static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`. No dependencies are required for the website itself.

## Attribution & status

The original Dungeon Crawler was **group coursework**. The browser adaptation is a separate later implementation. Unfinished C++ coursework is not presented as functional software. Product-video output is a prototype demonstration, not a commercial release.

**No public download / source URL is promised** for projects not yet published. See [project catalogue](docs/PROJECT_INVENTORY.md) for further details.

## Deployment

GitHub Pages serves the repository using the root `CNAME` file containing `notedbit.com`. Do not delete or overwrite it while uploading targeted changes.
