# DSA Sheet Sheryians · Minimal DSA Practice Tracker

A clean, responsive, and minimal frontend application built with **React (Vite)** and **Tailwind CSS**. Designed as a distraction-free student practice dashboard inspired by the Sheryians Fastrack Sheet to track LeetCode DSA problems week by week.

---

## 🌟 Features

- **Minimal DSA-Only Dashboard**:
  - Live circular progress ring showing overall completion percentage.
  - Bold solved problem counter (`completed / total solved`) with horizontal accent progress bar.
  - Difficulty breakdown cards: **EASY**, **MEDIUM**, and **HARD** with live completed/total counts and individual progress bars.
  - Practice note banner.
  - All statistics are computed dynamically from the DSA question list without hardcoding or division-by-zero errors.
- **Weekly Collapsible Problem Sections**:
  - Organizes problems by week (Week 1, Week 2, Week 3, Week 4, etc.).
  - Shows completed count and week progress bar on each collapsible header.
  - Expand/collapse toggle for each week.
- **Smart Problem Link Interaction**:
  - Clicking any problem title opens its LeetCode URL in a new browser tab (`target="_blank" rel="noopener noreferrer"`).
  - **Automatic Status Transition**: If the question status is `Pending`, opening the link immediately moves it to `In Progress`.
  - If the question is already `In Progress` or `Completed`, its status is preserved.
  - **Manual Completion**: Checkbox toggle allows the student to explicitly mark problems `Completed` or reopen them to `Pending`.
  - Status dropdown allows explicit transitions (`Pending`, `In Progress`, `Completed`).
- **Search & Filters**:
  - Live case-insensitive search by problem title.
  - Filter by **Difficulty** (*All, Easy, Medium, Hard*).
  - Filter by **Status** (*All, Pending, In Progress, Completed*).
  - Filter by **Week** (*All weeks or an individual week*).
  - Quick **Clear Filters** button.
  - Helpful empty state when no problems match the search or filter criteria.
- **Basic Problem Management (CRUD)**:
  - Add new DSA problems with validation (title required, valid difficulty, valid status, positive week number, valid HTTP/HTTPS URL).
  - Edit existing problems.
  - Delete problems with confirmation dialog.
- **Light & Dark Mode**:
  - Header theme switcher button with Sun / Moon icons.
  - Persisted in LocalStorage and applied directly to the document.
- **Pure React State & LocalStorage**:
  - Uses only standard React `useState` and `useEffect`.
  - Zero external state management libraries (no Redux, no Context API).
  - LocalStorage keys: `dsa-practice-questions` and `dsa-theme`.
  - "Reset Demo" button restores initial 35+ dummy DSA problems.

---

## 🛠️ Tech Stack

- **React 19** (Functional components and standard hooks)
- **Vite 8** (Lightning fast dev server and bundler)
- **Tailwind CSS v4** (Utility styling and dark mode)
- **Lucide React** (Clean iconography)
- **LocalStorage** (Client-side persistence)

---

## 📁 Project Structure

```text
src/
  components/
    Dashboard.jsx         # Circular progress & difficulty breakdown summary
    WeekSection.jsx       # Collapsible weekly problem section
    QuestionCard.jsx      # Problem row with link opener, status, and actions
    QuestionForm.jsx      # Add and Edit modal form with validation
    QuestionFilters.jsx   # Search bar & dropdown filters
    ThemeToggle.jsx       # Sun/Moon theme switcher
  data/
    dummyQuestions.js     # 35+ initial DSA practice problems
  utils/
    localStorage.js       # Minimal LocalStorage helper
  App.jsx                 # Main application controller
  main.jsx                # Entry point
  index.css               # Tailwind CSS imports & styles
```

---

## 📊 Essential DSA Data Model

```json
{
  "id": "dsa-01",
  "title": "Two Sum",
  "difficulty": "Easy",
  "status": "Pending",
  "url": "https://leetcode.com/problems/two-sum/",
  "week": 1
}
```

- Supported difficulty values: `Easy`, `Medium`, `Hard`
- Supported status values: `Pending`, `In Progress`, `Completed`

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build

```bash
npm run build
```

---

## 📝 How to Replace Dummy Data

1. Open `src/data/dummyQuestions.js`.
2. Replace the `INITIAL_QUESTIONS` array with your desired DSA problems using the schema above.
3. Click **"Reset Demo"** in the app header (or clear LocalStorage) to load your new dataset into the tracker.

---

## 📄 License

MIT License. Designed for students preparing for DSA technical interviews.
