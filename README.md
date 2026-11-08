# Vertex Web Studio
Static HTML/CSS/JS site (GitHub Pages, see `.github/workflows/static.yml`). No build step.
- Styles: `assets/site.css` (single file). Scripts: `assets/site.js`. Contact details: `assets/config.js`.
- The enquiry form (contact.html, the only form on the site) POSTs JSON to `VX.endpoint` in `assets/config.js` (default: FormSubmit.co, delivering to the email there). On failure, or if `endpoint` is empty, it falls back to a prefilled WhatsApp message. The first live submission triggers a one-time FormSubmit activation email to the owner; click its link to activate.
- Before launch: confirm address/social links, replace demo-project photos with real screenshots, have Privacy/Terms reviewed.
- Google Sheet storage: set up `google-sheet/Code.gs` following `google-sheet/README.md`, then put the web-app URL in `VX.sheet` in `assets/config.js`. Each enquiry is then appended as a row (and emailed via FormSubmit).
- Local preview: all links are relative, so you can open `index.html` directly or run `python -m http.server 8000` in this folder and visit http://localhost:8000. (The email delivery via FormSubmit needs the site served over http(s); the Google Sheet and WhatsApp fallback also work from a file.)
