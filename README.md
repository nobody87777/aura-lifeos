# LifeOS – My Daily Life Tracker

> **A daily personal operating system engineered for a Computer Engineering student in Kerala, India.**
> Built as a 100% client-side, zero-backend, offline-capable Progressive Web App (PWA). Designed to run anywhere and deploy directly to GitHub Pages.

---

## Features
- **"⚡ What should I do now?" Intelligent Decision Engine**: Eliminates decision paralysis by analyzing the current time, energy level, deadlines, and schedule to recommend a single high-leverage action.
- **Top 3 Priority Matrix**: Prevents cognitive overload by enforcing a strict 3-task daily focus rule.
- **Kerala Technical Education 75% Attendance Guard**: Real-time compliance tracker calculating exact safe bunk limits or required recovery lectures under state board regulations.
- **Native Web Audio Ambient Synthesizer**: Generative in-browser audio engine (Lo-Fi binaural beats, rain acoustic filter, white noise) with zero audio file dependencies.
- **Gamified Progression System**: Experience points (XP), leveling tiers ("Algorithm Knight"), milestone badges, and streak shields.
- **Deep Work Sanctuary**: Distraction-free full-screen environment stripping away all chrome and badges.
- **Kerala Student Finance Engine**: Instant 1-tap tracking for daily bus pass (₹30), snacks (₹50), canteen meals (₹80), and lab records (₹150) against a monthly budget.
- **Spaced Repetition Study Engine**: 1-3-7-14 day review cycle tracking 10 core Computer Engineering subjects with confidence scoring.
- **Midnight Rollover Automation**: Timezone-safe daily automation rolling open loops, calculating streaks, and generating fresh daily task containers.

---

## Screens

### 1. Dashboard (`#home`)
The executive command center displaying:
- Current greeting and localized date
- Next Recommended Action hero card ("⚡ What should I do now?")
- Horizontal weekly calendar with daily progress dots
- Today's Top 3 priorities
- Quick 1-tap logging widgets (Water, Habit checkoffs, Gym)
- Contextual modes (College Mode during 9 AM – 5 PM weekdays; Recovery Mode sanctuary)

### 2. Tasks (`#tasks`)
Task management matrix organized by priority and timeframe:
- Priority tiers: 🔴 Must-Do (max 3), 🟡 Should-Do, and 🟢 Could-Do
- Contextual tabs: Today, Tomorrow, Upcoming, Someday / Later, and Completed
- Category tagging: College, MultitaskCoder, Coding, Fitness, Personal
- 1-tap transition from any task directly into a Deep Work focus session

### 3. Habits (`#home` & `#profile`)
Visual habit tracking grid with consistency streaks:
- Morning routines, hydration, calisthenics, and evening wind-down
- Streak preservation with streak shield protection
- 1-tap checkoff with instant XP rewards

### 4. Focus (`#focus`)
Dedicated deep work and Pomodoro timer suite:
- Presets: 25m Pomodoro, 45m Deep Work sprint, 60m Marathon, 15m Speed run
- Built-in sound generator (Lo-Fi synth, rain generator, white noise)
- Distraction-free full-screen mode
- Post-session reflection rating (1–5 stars) with focus notes and +20 XP

### 5. Study (`#study`)
Computer Engineering academic hub:
- 10 curriculum subjects: Java Programming, Python & Scripting, C Programming, Data Structures & Algorithms, Web Development, DBMS & SQL, Computer Networks, Operating Systems, Microprocessors & IoT, Engineering Mathematics
- Spaced repetition review queues (1-3-7-14 day intervals)
- Subject mastery confidence meters (0–100%)
- Theory and practical lab exam countdown clocks
- Weekly study velocity chart

### 6. Goals (`#goals`)
5-tier strategic breakdown cascade turning long-term vision into daily execution:
1. 1-Year Vision (SDE Placement)
2. 3-Month Milestone (MultitaskCoder v1 & Java DSA)
3. 1-Month Target (Binary Search, Linked Lists, Java Streams)
4. 1-Week Sprint (LeetCode challenges)
5. Today's Action Step (Single 40-minute push convertible to Top 3 with 1 tap)

### 7. Health (`#health`)
Daily vitality and physical conditioning tracker:
- Hydration grid: 8-glass visual water tracker (2,000 ml target)
- Calisthenics fast counters: Pushups, Pullups, Plank timer
- Weekly gym split schedule (Chest/Triceps through Rest Day)
- Sleep tracker: Bedtime, wake time, quality rating, and gentle behavioral tips

### 8. Finance (`#finance`)
Lightweight personal finance tracker tailored for college students:
- Currency: Indian Rupee (₹ INR)
- Monthly budget allowance vs. spent progress bar
- 1-tap quick logging shortcuts (₹30 Bus Pass, ₹50 Tea & Snack, ₹80 Canteen Meals, ₹150 Lab Records)
- Categorized expense history (Food, Travel, Education, Subscriptions, Gym, Personal)

### 9. Projects (`#projects` & `#career`)
- **MultitaskCoder**: Flagship student project roadmap, milestones, bug backlog, and 1-tap coding time logger (+20 XP).
- **Career Matrix**: Placement tracking for Infopark Kochi, KSUM, and IT opportunities, skill confidence bars, and verified credentials.

### 10. Analytics (`#reviews` & `#journal`)
Comprehensive self-reflection and performance insights:
- Weekly Retrospective: Study hours, coding velocity, workout consistency, and attendance trends
- Nightly Shutdown Protocol: Open-loop clearing, tomorrow's Top 3 planning, and chime celebration
- Daily Decompression Journal: Mood & energy check-in (20% – 100%) with 4 guided reflection prompts
- Distraction audit log tracking time lost to social media or procrastination

### 11. Profile (`#profile`)
User preferences and gamification headquarters:
- Player Level, XP progress bar, unlocked achievements gallery, and streak shields
- 5 Cyberpunk & Minimalist Theme Engines (Dark Neon, Midnight Blue, AMOLED Black, Matrix Emerald, Minimal Dark)
- Data export (Full JSON snapshot, Expenses CSV, Study CSV) and factory restore

---

## PWA
- **Installable**: Full Progressive Web App supporting Web App Manifest (`manifest.webmanifest`). Can be added to the home screen on iOS, Android, macOS, and Windows.
- **Offline Support**: Equipped with a Service Worker (`sw.js`) that caches all core application assets, styles, icons, and scripts for instant offline usability.
- **Mobile-First Design**: Optimized for 360px–430px smartphone displays with native touch targets, smooth transitions, and fixed ergonomic navigation.
- **Standalone Mode**: Launches without browser URL bars or chrome for an authentic native application experience.

---

## Storage
- **Local-First Architecture**: All tasks, habits, study logs, transactions, and reflections are stored locally in the browser's `localStorage`.
- **Zero Server Latency**: Operations are instantaneous with zero network round-trips.
- **Complete Data Portability**: Full JSON backup export and import, as well as CSV exports for financial records and study logs.

---

## Privacy
- **100% Client-Side**: The application does not require a backend server, database, or external API for normal daily use.
- **Zero Tracking**: Your personal schedule, financial transactions, health metrics, and journal entries never leave your device.
- **No Third-Party Telemetry**: Your thoughts, grades, and habits remain strictly yours.

---

## Technologies
- **Markup**: Semantic HTML5 with PWA meta tags and Web Manifest integration.
- **Styling**: Modern CSS3 (Custom Properties / CSS Variables, Glassmorphism, CSS Grid, Flexbox, Mobile-First Media Queries).
- **Logic**: Vanilla JavaScript (ES2022 Modules, Object-Oriented Architecture, Event-Driven State Pub/Sub).
- **Audio Engine**: Web Audio API (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`) for real-time procedural sound generation.
- **Visualizations**: Native SVG procedural charts (Bar charts, Donut charts, Sparklines) with zero third-party chart dependencies.
- **Storage**: Browser `localStorage` API with defensive parsing, schema versioning, and sanitization.
- **Service Worker**: Cache API for offline asset resolution and fast reloads.
- **Deployment**: Pure static hosting on GitHub Pages with automated GitHub Actions workflow.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Cmd/Ctrl + K` | Open Global Search across all tasks, subjects, projects, and notes |
| `N` | Universal Quick Add modal (Task, Expense, Study, Note, Distraction) |
| `Esc` | Close active modal or exit Deep Work mode |

---

## Running Locally

To run LifeOS on your local machine, serve the repository folder with any standard static HTTP server:

```bash
python -m http.server 5173
```

Then open:
```text
http://localhost:5173
```

Alternatively, if you have Node.js installed:
```bash
npx serve .
```

---

## Deployment

LifeOS is engineered to run as a 100% static site with zero build requirements or server dependencies. To deploy to **GitHub Pages**:
1. Push this repository to GitHub on the `main` branch.
2. In your GitHub repository, navigate to **Settings ➔ Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)`.
5. Click **Save**. Your site will be published at `https://<username>.github.io/<repository>/`.

*(An automated GitHub Actions workflow is also provided in `.github/workflows/deploy.yml` for continuous deployment).*

---

## Backup

LifeOS provides built-in local data management directly from the **Profile** screen (`#profile`):
- **JSON Snapshot Export & Restore**: Export the complete application state (tasks, habits, study sessions, finances, journal entries, and settings) as a structured `.json` backup file, which can be restored anytime.
- **CSV Data Exports**: Export structured spreadsheets for specific categories:
  - **Expenses CSV**: Date, description, amount, type, category.
  - **Study Sessions CSV**: Date, subject, duration, topics, difficulty, focus rating.
  - **Habits CSV**: Name, category, targets, streaks, completions.
  - **Workouts CSV**: Daily workout logs, pushups, pullups, planks.

---

## License

This project is open source and available under the [MIT License](LICENSE).

