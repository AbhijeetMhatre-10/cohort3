# DSA Sheet | Sheryians

A responsive React dashboard for tracking DSA practice problems by week. The app includes progress summaries, problem search and filters, status tracking, and local browser persistence.

## Live Demo

[Open the deployed DSA Sheet](https://dsa-sheet-sheryians-one.vercel.app/)

## Features

- Dashboard with overall completion and Easy, Medium, and Hard progress summaries.
- Collapsible week sections with per-week completion progress.
- Search by problem title and filter by week, difficulty, or status.
- Add, edit, and delete problems with form validation and confirmation dialogs.
- Open a problem URL in a new tab; Pending problems become In Progress when opened.
- Mark problems as Pending, In Progress, or Completed.
- Light and dark themes with saved theme preference.
- LocalStorage persistence for custom problems, statuses, deleted starter problems, and theme settings.
- Reset action to restore the bundled starter problems.
- Responsive layout with keyboard-accessible controls and empty states.

## Technologies

- React 19
- Vite 8
- Tailwind CSS 4
- Lucide React
- Browser LocalStorage

## Getting Started

### Prerequisites

- Node.js and npm

### Install

From this directory:

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

### Validate and build

```bash
npm run lint
npm test
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Usage Notes and Assumptions

- The bundled dataset currently contains five starter problems in Week 1. More problems can be added from the **Add Problem** form.
- Data is client-side only. There is no backend, account system, or cross-device synchronization.
- Problem data and progress are stored in the browser's LocalStorage. Clearing site data removes the local changes.
- Problem URLs are optional, but when provided they must use `http://` or `https://`.
- A problem must have a title, a supported difficulty (`Easy`, `Medium`, or `Hard`), a supported status (`Pending`, `In Progress`, or `Completed`), and a positive integer week number.
- The reset action removes custom problems, saved statuses, and deleted-starter settings before restoring the bundled starter list. It does not change the selected theme.

## Project Structure

```text
src/
├── components/       # Dashboard, filters, forms, question cards, weeks, and theme toggle
├── data/              # Bundled starter questions
├── utils/             # LocalStorage persistence and migration helpers
├── App.jsx            # Application state, filtering, CRUD, and dialogs
├── index.css          # Tailwind imports and global styles
└── main.jsx           # React entry point
tests/
└── audit.test.js      # Data and LocalStorage behavior tests
```

## Screenshots


![Dashboard](https://res.cloudinary.com/dsxvmhffb/image/upload/v1792273840/Screenshot_2026-10-18_at_3.19.09_AM_yaxsmk.png)
![Dashboard](https://res.cloudinary.com/dsxvmhffb/image/upload/v1792273845/Screenshot_2026-10-18_at_3.19.26_AM_ms7w0k.png)
