# Copilot Instructions for AI Agents

## Project Overview
This is a static web application for calculating time and shift details for locomotive crews. The app is primarily in Ukrainian and targets railway operational workflows. It is designed for use as a GitHub Pages site and supports PWA features (see `manifest.json`).

## Architecture & Key Files
- **index.html**: Main UI, contains all form controls for input (time, wagons, station, operation, place, medical commission, action). All calculations are triggered from here.
- **js/js.js**: Core logic for time calculations and business rules. Contains:
  - `parseTimeSimple`, `formatTimeSimple`, `addTimeSimple`, `subtractTimeSimple`: Simple time math for user input.
  - `rules` object: Encodes all calculation rules for different stations, operations, and wagon counts. This is the main source of business logic.
  - `parseTimeCalc`, `formatTimeCalc`: Used for main calculation block.
- **css/styles.css**: Custom styles for layout, form controls, and responsive design. No CSS frameworks used.
- **manifest.json**: PWA configuration, icons, and theme color.
- **images/**: Contains icons and reference images for UI and PWA.

## Developer Workflows
- **No build step required**: All files are static. Edit HTML, JS, or CSS directly and refresh the browser to see changes.
- **Testing**: Manual, via browser. No automated tests or test runner present.
- **Debugging**: Use browser DevTools (console, inspector) to debug JS and inspect DOM.
- **Deployment**: Publish via GitHub Pages. Ensure `index.html` is at the repo root.

## Project-Specific Conventions
- **Time format**: Accepts `год.хв` (e.g., `5.45`), but also supports `.`, `,`, `:`, `-` as separators. All parsing normalizes to `.`.
- **Business rules**: All calculation logic is centralized in the `rules` object in `js/js.js`. If updating rules, modify this object only.
- **Language**: UI and comments are in Ukrainian. Maintain this for consistency.
- **No external dependencies**: All logic is custom; do not introduce frameworks or libraries unless absolutely necessary.
- **PWA support**: Manifest and icons are present, but no service worker. If adding offline support, follow PWA best practices.

## Integration Points
- **Form controls**: All user input is via HTML form elements. JS reads values directly from DOM.
- **Results display**: Output is written to specific DOM elements (`result_kp`, `result_zd`, `result_end`, `resultSimple`).
- **Images**: Used for icons and reference tables in UI.

## Examples
- To add a new station or operation, update the `rules` object in `js/js.js` and add corresponding form controls in `index.html`.
- To change time parsing, update `parseTimeSimple` and `parseTimeCalc` in `js/js.js`.

## References
- See `README.md` for general GitHub Pages setup and usage.
- See `manifest.json` for PWA configuration.
- See `js/js.js` for all calculation logic and business rules.

---
If any section is unclear or missing, please provide feedback for further refinement.
