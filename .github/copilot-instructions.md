# ShoreSquad fking copilot Instructions

## Project Overview
ShoreSquad is a web app for coordinating beach cleanup events. Users rally crews, track weather, and view cleanup spots on a map. The app is a **vanilla JS + HTML/CSS** project (no frameworks), optimized for progressive enhancement and lightweight deployment.

## Architecture & Key Files

### Frontend Structure
- **`index.html`**: Semantic HTML5 with ARIA labels for accessibility. Contains header, controls (Create/Find buttons), map section, events list, and footer.
- **`css/styles.css`**: Single CSS file with CSS custom properties (ocean, seafoam, coral, sand, kelp colors). Uses CSS Grid/Flexbox. **No CSS framework.**
- **`js/app.js`**: Entry point (module script, deferred). Initializes UI, map, weather. Extensible stub functions for future features.

### Key Patterns
1. **DOM Selectors**: Centralized in `selectors` object at top of `app.js`. Always update this when adding new interactive elements.
2. **Lazy-Loading Map**: Code checks for `window.L` (Leaflet). If not found, shows fallback. Map library should be lazy-loaded, not bundled.
3. **Stub Functions**: `fetchWeatherStub()`, `initMap()` are intentionally incomplete. Expand with real APIs (OpenWeather, Leaflet, IndexedDB for events).
4. **Async/Await Pattern**: Used for API calls. See `fetchWeatherStub()` and `registerServiceWorker()` for examples.

## Development Workflow

### Local Development
- **Server**: Use Live Server extension (port 5500 configured in `.vscode/settings.json`). Right-click `index.html` → "Open with Live Server" to launch on `http://localhost:5500`.
- **No Build Step**: This is a static site. Changes are instant; no bundling required. CSS and JS reload automatically via Live Server.
- **Testing**: Manual browser testing. Open DevTools (F12) to check console for errors and network activity.
- **Module Scripts**: `js/app.js` uses `type="module"` with `defer`—DOM is guaranteed ready when script runs.

### Adding Features
1. **New UI Elements**: Add to `index.html`, update `selectors` object, add event listeners in `initUI()`.
2. **Styling**: Add to `css/styles.css`. Use existing CSS variables (`:root`). Keep mobile-first (`@media` queries at bottom).
3. **API Integration**: Replace stub functions (`fetchWeatherStub`, etc.) with real API calls. Store API keys in env vars or `.env` (add to `.gitignore`).
4. **Service Worker**: Uncomment `registerServiceWorker()` call when `sw.js` is added.

## Conventions & Project-Specific Practices

### Naming
- **CSS classes**: kebab-case (`.site-header`, `.map-section`, `.placeholder`). Always prefix utilities with their purpose.
- **JS functions**: camelCase (`initUI`, `fetchWeatherStub`, `debounce`). Use descriptive names that indicate sync/async.
- **IDs**: verb-first for interactive elements (`#createEvent`, `#findEvents`, `#weather`, `#map`, `#eventsList`). Add to `selectors` object immediately.

### Accessibility
- All interactive sections have `aria-label` or `aria-live` attributes.
- Map has `role="application"`. Events list has `aria-live="polite"` for dynamic updates.
- **Never remove ARIA attributes** when refactoring HTML.

### Performance
- Lazy-load map library (Leaflet/Mapbox) only when needed, not on page load.
- Service Worker ready (stub included) for offline support—implement when SW.js is added.
- Minimize inline styles; use CSS classes.

## Integration Points (To Be Implemented)

| Feature | Current State | Next Step |
|---------|---------------|-----------|
| Map | Leaflet-ready (checks `window.L`) | Lazy-load Leaflet CDN or bundle |
| Weather | Stub with 600ms delay | Replace with OpenWeather API + key mgmt |
| Events | Static list only | Add IndexedDB persistence + CRUD |
| Geolocation | Alert placeholder | Integrate Geolocation API for "Find Nearby" |
| Auth | None | Consider JWT + backend API |

## External Dependencies
- **Leaflet** (optional, CDN): `https://unpkg.com/leaflet/dist/leaflet.js`
- **OpenWeather API**: Requires API key (free tier available)
- **Backend API** (future): Consider Node.js/Express for event persistence

## Common Refactoring Scenarios

### "Add a new button"
1. Add `<button id="newAction">Label</button>` to appropriate HTML section (controls, events, etc.)
2. Add `newActionBtn: '#newAction'` to `selectors` object in `app.js`
3. Add event listener in `initUI()`: `document.querySelector(selectors.newActionBtn).addEventListener('click', handleNewAction)`
4. Test in Live Server—reload auto-triggers

### "Connect to a real API"
1. Replace stub async function (e.g., `fetchWeatherStub`) with real `fetch()`: `const res = await fetch(apiUrl, { headers: { Authorization: ... } })`
2. Parse JSON: `const data = await res.json()`
3. Update DOM via template literals or `innerHTML`. **Sanitize user input** if inserting event data to avoid XSS.
4. Add error handling with try-catch (see `fetchWeatherStub` pattern).

### "Add offline support"
1. Create `sw.js` at project root with cache strategies (cache-first for CSS/JS, network-first for API calls)
2. Uncomment `registerServiceWorker()` call in `app.js`
3. Use **IndexedDB** for event persistence. See `registerServiceWorker()` for pattern.
4. Test in DevTools → Application tab → Service Workers

## Gotchas & Tips
- **Map div must exist**: `initMap()` returns early if `#map` not found—no console error, just silent failure. Ensure `<div id="map">` is in HTML.
- **Module script deferred**: JavaScript loads after HTML parsing completes; DOM is guaranteed ready. No need for `DOMContentLoaded` guard, but kept for clarity.
- **CSS variables fallback**: Older browsers won't support `var(--ocean)`. Test in browser DevTools device emulation for compatibility.
- **No build tool = immediate feedback**: Changes take effect instantly in Live Server; manual QA is critical before feature completion.
- **`selectors` object is single source of truth**: Always update it when adding/removing interactive IDs. Prevents typos in `querySelector` calls.
- **Leaflet check pattern**: Code checks `window.L` before using Leaflet API. This allows lazy-loading without errors if library not yet loaded.
