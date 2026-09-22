# Fathom CPG — fathomcpg.com

Static site, hosted on Netlify. No build step: what's in this repo is exactly what gets served.
Every push to `main` goes live in about a minute.

## Where things live

| You want to change… | Open this file |
|---|---|
| Home page | `index.html` |
| About | `about/index.html` |
| Services | `services/index.html` |
| Success Stories | `stories/index.html` |
| Methodology | `method/index.html` |
| Partner With Me (the form) | `partner/index.html` |
| Privacy Policy / Terms | `privacy/index.html`, `terms/index.html` |
| Header nav or footer (shared, so change it on every page) | search for `<header class="top">` / `<footer class="foot">` in each page |
| Colors, spacing, fonts, mobile layout | `css/site.css` |
| Mobile menu, form steps, slider behaviour | `js/site.js` |
| Photos | `img/` |
| Perfectly Nineties webfont (licensed) | `fonts/` |

Each page's copy sits between `<!-- ===== PAGE — edit page copy below ===== -->` and the `<div class="scallop">` line.

## Editing text

Find the sentence you want to change, change the words, keep the tags (`<p>`, `<h2>`, `<a …>`) around it as they are.
Use `&amp;` for `&`, and keep curly quotes (’ “ ”) as they are.

## Form submissions

The Partner With Me form is a Netlify Form named `partner-intake`. Submissions show up in the Netlify dashboard
under **Forms**, and are emailed to whichever address is set under Forms → Form notifications.

## Adding a page

Copy `about/index.html` to `newpage/index.html`, change the `<title>`, description and the content block, and add a link
to it in the header/footer of the other pages. It will be live at `/newpage/`.
