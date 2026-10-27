# Portfolio — Good ideas. Thoughtfully built.

A three-project portfolio site featuring Right Masters Ltd, HeartLINK+ and Nurture Ville.
Plain HTML, CSS and JavaScript: no framework, and nothing to install to run it. The only external dependency is the Archivo font from Google Fonts, with system fallbacks.

## Structure

```
index.html            Page shell and static sections (hero, services, approach, contact, footer)
css/styles.css        All styles: tokens, layout, project frames, sections
js/projects.js        Content: owner details, services, capabilities, project data
js/main.js            Renders projects and capabilities from the data; nav, hover effects, contact form
assets/shots/         Real screenshots of each live site (desktop 1440px wide, mobile 390px @2x)
assets/favicon.svg
build.mjs             Produces the single-file version
dist/portfolio-standalone.html   Self-contained build (CSS, JS, favicon and screenshots inlined)
```

## Contact details & placeholders

Contact details live in `js/projects.js`:

```js
site: {
  ownerName: "Abigail Amoah & John Yelbert",  // footer
  people: [                                   // contact section; the brief form emails everyone listed
    { name: "Abigail Amoah", email: "abigailamoah3@gmail.com", phone: "+233554771170" },
    { name: "John Yelbert", email: "n.yelbert@gmail.com", phone: "+233548761498" },
  ],
  wordmark: "Portfolio",                      // header wordmark
  availability: "Taking on new projects",     // hero status line; set to "" to hide it
}
```

Phone numbers are stored without spaces and displayed in groups (+233 54 876 1498). Each email has a Copy button, and each phone number is a tap-to-call link.

## Run locally

```bash
python -m http.server 8000     # then open http://localhost:8000
# or
npx serve .
```

Opening `index.html` directly also works.

## Build the self-contained file

```bash
node build.mjs
```

This writes `dist/portfolio-standalone.html` (about 2.3 MB, mostly the inlined screenshots). It works offline and can be hosted anywhere. Re-run the build after editing any source file.

## Deploy

It is a static site, so any static host works:

- **Netlify / Cloudflare Pages:** drag the project folder into the dashboard, or connect the repo with no build command and `.` as the publish directory.
- **Vercel:** run `npx vercel` in the folder, choose "Other" as the framework, and leave the build command empty.
- **GitHub Pages:** push the folder to a repo and enable Pages on the root of the default branch.

## Adding a project

1. Capture a desktop screenshot (1440px wide, up to about 3600px tall) and a mobile one (390 × 844 at 2× scale). Save them as JPGs in `assets/shots/`.
2. Add an object to `projects` in `js/projects.js` with `id`, `number`, `category`, `sector`, `name`, `description`, `tags`, `url`, `layout`, `panel` colours and `shots`.
3. Cards with `layout: "half"` sit side by side on desktop, and the second of each pair is lifted. Cards with `layout: "full"` take a whole row.
4. Optionally add a capability in `capabilities` that points to the new project's `id`.

## Interactions

- **Project frames:** hovering a project, or focusing its link, scrolls the desktop screenshot through the real site and lifts the phone. On mouse-driven devices a "Visit site" label follows the pointer.
- **Hero thumbnail:** a small window in the headline cycles through the three projects.
- **Contact form:** it builds a pre-filled email (subject and body) and opens it in the visitor's mail app. It has no backend and sends nothing by itself. "Copy" puts the email address on the clipboard.

## Accessibility & motion

- Semantic landmarks, a skip link, labelled sections and one link per project. The link's click area covers the whole project, and the project shows the focus ring.
- Visible focus indicators adapt to each section's background. The mobile menu exposes `aria-expanded`, closes on Escape and returns focus to the toggle.
- With `prefers-reduced-motion: reduce`, the ticker becomes a static list. The hero thumbnail, scroll reveals, hover scrolling and the pulsing status dot all stop.
- External links open in a new tab with `rel="noopener noreferrer"` and announce that to screen readers.

## Content notes

Project descriptions and screenshots come from the live sites as checked in October 2026. Re-capture the screenshots if those sites change. The portfolio makes no claims about project outcomes or metrics, and no medical claims on behalf of HeartLINK+.
