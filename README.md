# Feature Specification: Climber App

**Feature Branch**: `001-climber-app`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "A climbing companion app built with AI (Gemini) to help climbers track routes, progress, and get AI-powered route suggestions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log a Climb (Priority: P1)

A climber finishes a session and wants to record what they climbed — route name, grade, result, and notes.

**Why this priority**: Core value of the app. Without logging, nothing else works.

**Independent Test**: Can be fully tested by opening the app, filling in a climb form, and verifying it appears in the climb history list.

**Acceptance Scenarios**:

1. **Given** the user is on the home screen, **When** they tap "Log Climb" and fill in route name, grade, date, and result, **Then** the climb is saved and appears in their history.
2. **Given** a saved climb, **When** the user views their history, **Then** they see all logged climbs sorted by date.
3. **Given** a form with missing required fields, **When** the user submits, **Then** validation errors are shown.

---

### User Story 2 - View Progress Dashboard (Priority: P2)

A climber wants to see how their grades and success rates have changed over time.

**Why this priority**: Motivates continued use and shows the value of logging.

**Independent Test**: Can be tested independently by seeding climb data and verifying charts render correctly with accurate stats.

**Acceptance Scenarios**:

1. **Given** the user has logged at least 3 climbs, **When** they open the Dashboard, **Then** they see a chart of grades climbed over time.
2. **Given** climb history exists, **When** viewing the dashboard, **Then** success rate per grade is displayed.
3. **Given** no climbs logged, **When** viewing the dashboard, **Then** an empty state with a prompt to log a climb is shown.

---

### User Story 3 - AI Route Suggestions via Gemini (Priority: P3)

A climber wants personalized route suggestions based on their current level and goals.

**Why this priority**: Differentiating AI feature, but requires climb history to be useful.

**Independent Test**: Can be tested by providing a mock skill level and style preference, then verifying Gemini returns relevant suggestions.

**Acceptance Scenarios**:

1. **Given** the user inputs their max grade and preferred style (bouldering/sport/trad), **When** they request suggestions, **Then** Gemini returns 3+ route recommendations with reasoning.
2. **Given** a Gemini API error, **When** suggestions are requested, **Then** a friendly error message is shown with a retry option.

---

### Edge Cases

- What happens when the user logs a climb with an unrecognized grade format?
- How does the system handle offline usage (no internet for Gemini API)?
- What if the user has no climb history when requesting AI suggestions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to log a climb with: route name, grade, date, location, result (sent/attempt), and optional notes.
- **FR-002**: System MUST display a history list of all logged climbs sorted by date descending.
- **FR-003**: System MUST show a progress dashboard with grade trends and success rate charts.
- **FR-004**: System MUST integrate with Gemini API to generate route suggestions based on user skill level and style.
- **FR-005**: System MUST validate required fields before saving a climb entry.
- **FR-006**: System MUST handle Gemini API failures gracefully with user-friendly error messages.
- **FR-007**: System MUST persist climb data locally [NEEDS CLARIFICATION: local storage vs cloud database not specified].

### Key Entities

- **Climb**: route name, grade, date, location, result (sent/attempt), notes
- **User Profile**: name, home gym, climbing since, goals
- **AI Suggestion**: input grade + style → list of recommended routes with reasoning

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log a climb in under 60 seconds.
- **SC-002**: Dashboard loads and renders charts in under 2 seconds with up to 500 climb entries.
- **SC-003**: Gemini route suggestions are returned in under 5 seconds under normal network conditions.
- **SC-004**: 90% of users can complete their first climb log without needing help.

## Assumptions

- Users have a stable internet connection for Gemini AI features.
- Mobile-first design; desktop is secondary for v1.
- Authentication/accounts are out of scope for v1 (single user, local data).
- Gemini API key is provided via environment configuration.
- Grade formats supported: V-scale (bouldering) and YDS (sport/trad) for v1.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app on your phone (easiest), or iOS Simulator / Android Emulator

### Run

```bash
# 1. Install dependencies
npm install

# 2. Set your Gemini API key
echo "EXPO_PUBLIC_GEMINI_API_KEY=your_key_here" > .env.local

# 3. Start the dev server
npx expo start
```

Then press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

Get a Gemini API key at [aistudio.google.com](https://aistudio.google.com).

### Tests

```bash
npx jest
```


---

## Speckit Workflow

This project uses [speckit](https://github.com/speckit) for AI-assisted specification and implementation. Available commands:

| Command | Description |
|---|---|
| `speckit.specify` | Create or update the feature specification |
| `speckit.clarify` | Clarify ambiguous requirements interactively |
| `speckit.analyze` | Cross-artifact consistency and quality analysis |
| `speckit.constitution` | Generate or update the project architecture constitution |
| `speckit.plan` | Generate implementation plan, research, and data model |
| `speckit.tasks` | Generate dependency-ordered task list from the plan |
| `speckit.implement` | Execute the task list and implement the feature |
| `speckit.checklist` | Generate a requirements quality checklist |
| `speckit.taskstoissues` | Convert tasks to GitHub issues (requires GitHub MCP) |

### speckit.checklist

Generates a "unit test for requirements" — validates the quality, clarity, and completeness of the spec rather than the implementation.

**Q1 — Focus area**

| Option | Focus | Why It Matters |
|--------|-------|----------------|
| A | Requirements completeness & clarity (spec.md quality) | Validates FR/SC coverage, ambiguities, edge cases |
| B | AI / Gemini integration requirements | High-risk external dependency with error states |
| C | Data integrity & offline resilience requirements | SQLite, grade validation, offline behaviour |
| D | Localisation & accessibility requirements | zh-TW mandate + WCAG 2.1 AA in constitution |
| E | All of the above (comprehensive) | Full pre-implementation gate |

**Q2 — Depth & audience**

| Option | Depth | Audience |
|--------|-------|----------|
| A | Lightweight (quick author self-check, ~15 items) | Author before PR |
| B | Standard (thorough reviewer gate, ~30 items) | Peer reviewer / PR |
| C | Formal (release gate, ~40+ items) | QA / release sign-off |

**Q3 — Scope boundary**

Should the checklist include items for `.kiro/specs/climber-app/requirements.md` (the more detailed authoritative doc) in addition to `specs/001-climber-app/spec.md`, or stay limited to the `specs/` artifacts only?

| Option | Scope |
|--------|-------|
| A | `specs/` artifacts only |
| B | Both `specs/` and `.kiro/specs/` |

Checklists are saved to `specs/001-climber-app/checklists/` (e.g., `ux.md`, `security.md`, `api.md`).
