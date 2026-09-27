# Maharashtra Education Department — frontend demo

A standalone React + Vite departmental node for the SIH MahaSetu demonstration. No backend, API server, database, authentication server or external service is used.

## Run

```bash
cd mock-education-frontend
npm install
npm run dev
```

Open http://localhost:5175. This port is separate from the existing portals; Vite stops if it is already occupied. Production build: `npm run build`; preview: `npm run preview`.

## Architecture and demo boundaries

Like `mock-employment-frontend`, this app uses React state, History API navigation, in-memory records and asynchronous mock service functions. Education uses separate data and service modules to keep domain rules reviewable. Styling follows Employment’s navy/saffron palette, serif headings, government header, cards, forms, sidebar, tables and responsive layouts.

Records start empty and reset on full reload, including directly loading a tracker URL in a new tab. Navigate using the portal links to preserve the current session. IDs start at `EDU-APP-10001`, increment within the current session and are not global identifiers. Files are validated locally by content signature and size (PDF/PNG/JPEG, 4 MB limit); only filename, MIME type and size are retained. No document bytes are sent anywhere.

Employment currently models MahaSetu provenance through mock state; it does not contain a working cross-portal transport. Education follows that conceptual approach. The admin simulator previews a fictional payload and passes it to the local mock service, producing a `MahaSetu Submission`. Citizen applications and officer-created manual applications produce `Direct Department Entry`. There is no live data exchange with `frontend/`. The master portal remains unchanged. Employment has an additive local Education-data demonstration in its qualification form.

All eligibility rules, benefits, processing times, student identities and institutions are fictional demonstration data. The admin console has no authentication, consistent with its local demo purpose. Officers can revisit statuses; updates reset relevant verification state and create timestamped audit events. Rejections and requests for additional information require a note. Verification is simulated, not external validation.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home, notices, searchable and filterable discovery |
| `/services` | All education services |
| `/service-details?id=EDU-SVC-001` | Service details and eligibility checker; IDs 001–005 |
| `/apply?service=EDU-SVC-001` | Six-step citizen application; service parameter optional |
| `/track?id=EDU-APP-10001` | Application lookup and timeline; ID parameter optional |
| `/admin` | Dashboard and application source comparison |
| `/admin/dashboard` | Dashboard alias |
| `/admin/applications` | Searchable application register with source/status filters |
| `/admin/application-details?id=EDU-APP-10001` | Application details, documents, verification and status updates |
| `/admin/manual-entry` | Officer-created direct application |
| `/admin/interoperability` | Preview and receive simulated MahaSetu submissions |
| `/admin/services` | Service and fictional institution register |
| `/admin/logs` | Timestamp, actor, action, application, result and note |

Unknown routes and service IDs show a not-found page. Unknown application IDs return an explicit error, never another citizen’s application.

## Demonstration walkthrough

1. Explore services, review a scheme and check eligibility.
2. Apply, optionally filling the fictional student details. Attach local demo files and review the six steps.
3. Submit and follow the tracker link.
4. Open Department console → MahaSetu simulator; preview and receive another application.
5. Compare the two source labels in the register and dashboard.
6. Open an application, change review/verification status, and inspect its timeline and audit logs.
7. Use Manual entry to demonstrate an officer recording a direct application.

## Verification

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Unit tests cover eligibility boundaries, both sources, unique IDs, unknown records, missing documents, verification state, required review notes, audit events, snapshot isolation and invalid/oversize documents. Browser tests exercise discovery, eligibility, the six-step citizen and officer forms, document handling, tracking, MahaSetu simulation, review updates, source filtering and audit logs. Every route is checked at 390, 768 and 1440 px widths.

## Source files

- `.gitignore` — excludes generated dependencies, builds and test output.
- `package.json`, `package-lock.json` — independent dependencies and commands.
- `index.html`, `vite.config.js` — entry point and standalone Vite configuration.
- `src/main.jsx` — navigation, citizen pages and department console.
- `src/data.js` — services, institutions, fictional students and eligibility rules.
- `src/service.js` — asynchronous in-memory application lifecycle and document validation.
- `css/main.css`, `css/forms.css`, `css/dashboard.css`, `css/responsive.css` — portal styles.
- `playwright.config.js` — local browser-test configuration.
- `tests/service.test.js`, `tests/portal.spec.js` — service and browser verification.
- `README.md` — operation, boundaries, routes and walkthrough.

## Inter-department data exchange video demo

This is a frontend-only mock data exchange.
No real inter-application communication or backend is implemented.

Run the portals in separate terminals from the repository root:

```bash
cd mock-education-frontend
npm install
npm run dev
```

```bash
cd mock-employment-frontend
npm install
npm run dev -- --port 5176 --strictPort
```

1. Open http://localhost:5175/apply and click **Fill fictional student details**.
2. Continue twice to **Family / Eligibility**. Under **Employment Information**, click **Fetch from Employment Department**.
3. The panel shows a connecting phase, animated transfer dots, a fetching phase, and the received record after two seconds. Show the Employment source label and click **Refresh Employment Data** to replay.
4. Continue with the normal document and review steps. The received employment record appears in Review and is retained for the department officer after submission. It is optional and does not alter scholarship eligibility criteria.
5. Open http://localhost:5176/apply?job=JOB-2023-001. In **Educational Qualification**, click **Fetch from Education Department**.
6. Show the two-second animation, Education source label and academic details. **Highest Qualification** is populated with B.Tech. **Refresh Education Data** replays the exchange and reapplies that qualification.
7. Complete the existing form and PDF attachment to submit normally. The academic record is retained with the citizen data for the Employment officer's review.

Each portal contains its own fictional sample data. Neither portal needs the other one running. There is no applicant lookup, external verification, shared storage or persistence. Reloading clears the data. Existing documents and eligibility requirements still apply. Animation respects reduced-motion preferences; status text remains available.

Automated verification (from `mock-education-frontend/`):

```bash
npx playwright install chromium
npm test
npm run test:e2e
npm run build
npm --prefix ../mock-employment-frontend run build
```

Install both portals' dependencies first. Browser tests start Education on 5175 and Employment on 5176 automatically, or reuse existing servers. The exchange tests check both directions, a visible delay, source attribution, refresh, no fetch/XHR traffic, received data in submitted applications, and 390/768/1440 px panel layouts.

Added exchange source files in each portal: `src/DepartmentExchange.jsx` and `css/department-exchange.css`. Cross-portal browser coverage lives in `tests/exchange.spec.js` in Education.
