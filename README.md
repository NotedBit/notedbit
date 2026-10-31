# Notedbit

Personal developer portfolio and project archive by **Loran Mustafa**, published at **https://notedbit.com**.

The website is a static site built with HTML, CSS and JavaScript and hosted on GitHub Pages. No framework, build pipeline or backend is required.

## Website structure

- `index.html` — homepage with selected projects, background, skills and contact
- `projects/index.html` — **complete project archive**, including smaller exercises and project status
- `projects/trendingtrove.html` — product video generation project, prototype video and documented development runs
- `projects/dungeoncrawler.html` — 2023 C++ university group project documentation
- `games/dungeoncrawler/` — JavaScript browser adaptation, separate from the original C++ version
- `assets/` — project images, video prototype, branding and social previews
- `style.css` — shared responsive design
- `language.js` — DE/EN language switch; stores the selected language locally in the browser
- `script.js` — navigation and scroll effects
- `CNAME` — GitHub Pages custom-domain configuration; **must be preserved**

## Project notes

Not every archive entry represents completed software. Prototypes, coursework, archived systems and media projects are labelled accordingly. Projects without a public repository or demo are described but intentionally do not link to one.

The **Dungeon Crawler** original was built as a university group project. The browser version is a later adaptation. The **Trending Trove** video is a prototype, not a production-ready release or a demonstration of the Windows version.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. The archive is available at `http://localhost:8000/projects/`.

## Publishing

This repository is deployed through GitHub Pages. Do not delete or overwrite `CNAME` during updates.

## Links

- Website: https://notedbit.com
- GitHub profile: https://github.com/NotedBit
- Repository: https://github.com/NotedBit/notedbit

A LinkedIn link can be added to the website once its exact public profile URL is confirmed. No guessed profile URL is used.
