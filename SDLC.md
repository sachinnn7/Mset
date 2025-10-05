## Software Development Life Cycle (SDLC) — Campus Market Place

This document maps standard SDLC phases to the Campus Market Place project, defining activities, deliverables, roles, acceptance criteria, and risks for each phase.

### 1) Requirements & Planning
- **Objectives**: Enable students to buy/sell notes, books, and services; provide search, filters, and contact options.
- **Stakeholders**: Students (buyers/sellers), College IT/Admin, Dev/Design team.
- **Functional requirements**:
  - Create, edit, delete listings with title, category (notes/books/services), price, condition, description, seller contact.
  - Browse listings, search by keyword, filter by category, sort by price/title/date.
  - View item details; contact seller.
  - Empty state and demo data seeding.
- **Non-functional requirements**:
  - Responsive UI (mobile-first), accessibility (keyboard focus, aria labels), performance: fast initial load (<2s on modern devices), persistence layer (MVP: localStorage).
  - Security (MVP, client-only): input validation, no XSS in rendered fields; future: auth, spam prevention, moderation.
- **Constraints**: No backend for MVP; purely static hosting. Future versions may add backend.
- **Deliverables**: Requirements doc (this section), initial scope, timeline, risks log.
- **Acceptance criteria**: Above functional requirements demonstrably work in latest Chrome/Edge/Firefox.

### 2) System Design & Architecture
- **Architecture (MVP)**:
  - Frontend-only SPA: `index.html` + `styles.css` + `script.js`.
  - Data persisted in `localStorage` under key `cmp_listings_v1`.
  - Dialog-based modals for create/edit/details/contact.
  - Template cloning for listing cards; in-memory filtering/sorting.
- **Data model**:
  - Listing: `{ id, title, category, price, condition, description, seller, email, phone?, image?, createdAt }`.
- **UX design**:
  - Header with brand and New Listing.
  - Toolbar: search, category chips, sort select.
  - Grid of cards; empty state when no data.
  - Modal forms and details layout.
- **Deliverables**: Architecture notes, UI wireframes (implicit in current UI), data contracts.
- **Acceptance criteria**: Design supports all requirements; documented model; no blocker gaps.

### 3) Implementation
- **Scope implemented**:
  - UI scaffold (`index.html`), styles (`styles.css`), logic (`script.js`), README.
  - CRUD flows, localStorage persistence, search/filter/sort, details and contact dialogs, sample data, empty state.
- **Standards**:
  - Clean, readable code; minimal global scope; semantic HTML; ARIA labels; keyboard operability.
- **Dependencies**: None (no build step).
- **Deliverables**: Source code in repo.
- **Acceptance criteria**: Features run with a static file server or direct file open.

### 4) Testing & Quality Assurance
- **Test types**:
  - Manual functional tests: create/edit/delete, search, filters, sorting, details, contact, seeding.
  - Cross-browser checks: Chrome, Edge, Firefox; responsive checks for 360px–1440px widths.
  - Accessibility smoke tests: keyboard navigation to cards and modals; aria-live regions for grid/empty state.
  - Performance checks: fast initial render on sample data.
- **Test data**: Built-in sample seed (3 items) + user-added items.
- **Defect handling**: Reproduce, fix, and re-test in same branch.
- **Acceptance criteria**: No high-severity defects; core paths work on target browsers; basic a11y pass.

### 5) Deployment
- **Target**: Static hosting (e.g., GitHub Pages, Netlify, Vercel, or institutional server).
- **Artifacts**: `index.html`, `styles.css`, `script.js`, `README.md` (and this `SDLC.md`).
- **Steps**:
  1. Push to `main`.
  2. Configure static hosting to serve repository root.
  3. Verify live URL; test features and seeding.
- **Rollback**: Revert to previous commit/version on hosting platform.
- **Acceptance criteria**: Live URL accessible; app loads and functions as in local testing.

### 6) Maintenance & Enhancements
- **Monitoring (manual)**: User feedback via issue tracker/email; periodically verify browsers.
- **Data migration**: If model changes, write migration from `cmp_listings_v1` to next key.
- **Backlog candidates**:
  - Authentication and user accounts; listing ownership and moderation.
  - Image uploads (move from URL to storage backend) and thumbnails.
  - Messaging between buyer and seller; notifications.
  - Backend API with database; pagination; infinite scroll.
  - Shareable deep links, SEO metadata, and Open Graph previews.
  - Spam prevention, rate limiting, abuse reporting.
  - Unit/E2E tests (Playwright/Cypress) once backend exists.
- **Acceptance criteria**: Stable operation, periodic updates, clear migration strategy.

### RACI (lightweight)
- **Responsible**: Frontend developer(s)
- **Accountable**: Project maintainer
- **Consulted**: Student representatives, college IT
- **Informed**: Stakeholders/administration

### Timeline (illustrative for MVP)
- Requirements/Planning: 0.5–1 day
- Design: 0.5 day
- Implementation: 1–2 days
- Testing: 0.5 day
- Deployment: 0.5 day
- Maintenance: ongoing

### Risks & Mitigations
- No backend → limited functionality for auth/messaging. Mitigate by planning phased backend.
- Client-only persistence → data tied to browser. Mitigate with clear messaging; future migration.
- Content quality/spam risk. Mitigate with future moderation and reporting tools.



