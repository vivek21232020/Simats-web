# SIMATS — Academic Toolkit (Simats-web)

A browser-first, client-side academic dashboard built as a single-page frontend. The app provides tools tailored for SIMATS Engineering students: CGPA calculation, attendance tracking, bunk planning, faculty directory, department subjects, and study material access.

## Key Features

- CGPA Calculator: grade-count inputs, computed CGPA, distribution chart, and export options (image/PDF).
- Attendance Tracker: calculates current attendance percentage, visual ring indicator, and export options.
- Bunk Calculator: shows how many classes you can safely miss while maintaining the 80% rule.
- Faculty Directory: searchable list of faculty names and mobile numbers with direct call/WhatsApp links (data embedded in the app).
- Department Subjects: year-based subject lists that open department PDF resources.
- Study Materials: subject folders and quick search for notes and PDFs.
- Responsive UI: sidebar navigation with mobile drawer, theme toggle (light/dark), and animated ambient background (particles and blobs).

## Architecture & Files

- `index.html` — Main layout and all app sections (home, CGPA, attendance, bunk, faculty, subjects, materials); imports fonts, icons and Chart.js.
- `app.js` — Client-side logic: UI navigation, particles animation, calculators, faculty data parsing, chart rendering, and export helpers.
- `styles.css` — Themed, responsive styles with CSS custom properties and dark mode support.
- `package.json` — Project metadata and optional scripts (if present).

The app is fully client-side and does not require a backend to run. Data like the faculty directory is embedded directly in `app.js`.

## Tech Stack

- HTML, modern JavaScript (ES6+), and CSS
- Chart.js for visualizing grade distributions
- Font Awesome for icons and Google Fonts for typography

## Data & Behavior Notes

- Faculty contact list is stored as plain text inside `app.js` and parsed at runtime — remove or replace sensitive data before public distribution.
- Export options appear to generate images/PDFs in-browser; there is no server-side export.
- Theme and responsive behavior are controlled with CSS custom properties and `data-theme` on `html`.

## Known Limitations & TODOs

- No persistence: user inputs are not saved across sessions (consider adding localStorage or sync).
- No backend: features that need user accounts, cloud sync, or server-side validation require a server.
- Accessibility: keyboard focus flow and ARIA labeling should be audited and improved.
- Tests: add unit/UX tests for calculators and parsing code.

## Contributing & Next Steps

- For fixes or new features, open a pull request with a short description. For larger scope changes, open an issue first.
- Suggested improvements: persistent storage, input validation, faculty data management via JSON, and CI for linting/tests.

