# Notedbit

Personal developer portfolio and project documentation, published at **https://notedbit.com**.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript, hosted on GitHub Pages with a custom domain. It does not require a framework, build step or backend.

## What is included

- Portfolio homepage (`index.html`) with project summaries, about, skills and contact sections
- `projects/dungeoncrawler.html` — documentation of a 2023 C++ university group project
- `games/dungeoncrawler/` — playable JavaScript browser adaptation using the original pixel-art assets
- `projects/trendingtrove.html` — current development notes for a Python video-generation application
- `assets/` — favicon, project imagery and social sharing assets
- `style.css` — shared site styles
- `script.js` — navigation, scroll and reveal behavior
- `CNAME` — required GitHub Pages custom-domain configuration; **do not remove**

## Running locally

A local HTTP server is recommended so relative asset paths behave like they do on GitHub Pages:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Project status

The DungeonCrawler game on this site is a **browser adaptation** of an earlier C++ group project. TrendingTrove remains in development; its Linux end-to-end pipeline has been tested but there is no public application release linked here.

## Links

- Website: https://notedbit.com
- Developer GitHub profile: https://github.com/notedbit
- This repository: https://github.com/NotedBit/notedbit
