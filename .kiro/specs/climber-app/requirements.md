# Requirements Document

## Introduction

The Climber App is a React Web application (Vite + TypeScript) for rock climbers to log their climbs, track progress, view aggregated stats on a dashboard, and receive AI-powered route suggestions via the Gemini API. Data is persisted in Firebase Firestore. Authentication is out of scope for v1 (single-user).

## Glossary

- **Climb**: A single climbing attempt or send, recorded with grade, date, result, and optional metadata.
- **Grade**: A difficulty rating in V-scale (V0–V17), YDS (5.0–5.15d), or freetext with a warning flag.
- **GradeSystem**: The grading system used — `v-scale`, `yds`, or `unknown`.
- **Result**: The outcome of a climb attempt — `sent` (completed) or `attempt` (did not complete).
- **Dashboard**: A read-only view of aggregated climbing statistics and charts (Recharts).
- **Suggestions**: AI-generated route recommendations produced by the Gemini API (`gemini-2.0-flash`).
- **SuggestionsService**: The single service responsible for all Gemini API interactions.
- **UserProfile**: A singleton record storing optional user metadata such as name, home gym, and goals.
- **ClimbsRepository**: The data-layer component responsible for Firestore read/write operations on climbs.
- **ProfileRepository**: The data-layer component responsible for Firestore read/write operations on the user profile.
- **StatsAggregator**: The domain-layer component that computes read-only statistics from climb data.
- **GradeUtils**: The shared utility module that owns all grade validation and normalization logic.
- **Domain Layer**: The middle layer containing use cases and entities; mediates between UI and Data layers.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Language | TypeScript 5.x |
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (no inline styles) |
| Charts | Recharts |
| Backend / DB | Firebase Firestore |
| AI | Gemini API (`gemini-2.0-flash`) via `@google/generative-ai` |
| i18n | react-i18next (zh-TW default, en fallback) |
| Testing | Vitest + React Testing Library + fast-check |

---

## Requirements

### Requirement 1: Log a Climb

**User Story:** As a climber, I want to log a climb with its grade, date, and result, so that I can keep a record of my climbing activity.

#### Acceptance Criteria

1. WHEN a user submits the climb form with a valid route name, grade, date, and result, THE ClimbsService SHALL create a new Climb record and persist it via ClimbsRepository to Firestore.
2. WHEN a user submits a grade in V-scale format (V0–V17), THE GradeUtils SHALL classify the gradeSystem as `v-scale`.
3. WHEN a user submits a grade in YDS format (5.0–5.15d), THE GradeUtils SHALL classify the gradeSystem as `yds`.
4. WHEN a user submits a grade that matches neither V-scale nor YDS format, THE GradeUtils SHALL classify the gradeSystem as `unknown` and attach a warning flag to the Climb record.
5. IF a user submits the climb form with a missing required field (route name, grade, date, or result), THEN THE ClimbForm SHALL prevent submission and display a validation error for each missing field.
6. THE ClimbsService SHALL assign a UUID to each new Climb record at creation time.
7. THE ClimbsService SHALL record a `createdAt` ISO 8601 timestamp on each new Climb record.

---

### Requirement 2: View Climb History

**User Story:** As a climber, I want to view a list of my logged climbs, so that I can review my past activity.

#### Acceptance Criteria

1. WHEN the climb list screen is displayed, THE ClimbList SHALL render all persisted Climb records retrieved from ClimbsRepository.
2. WHEN no climbs have been logged, THE ClimbList SHALL display an empty-state message.
3. THE ClimbList SHALL display each climb's route name, grade, date, and result.

---

### Requirement 3: Dashboard Statistics

**User Story:** As a climber, I want to see aggregated statistics about my climbing, so that I can understand my progress over time.

#### Acceptance Criteria

1. WHEN the dashboard screen is displayed, THE StatsAggregator SHALL compute statistics from all persisted Climb records.
2. THE Dashboard SHALL display total climbs logged, total sends, and total attempts.
3. THE Dashboard SHALL display a breakdown of climbs by grade using Recharts.
4. THE StatsAggregator SHALL only read climb data and SHALL NOT write or mutate any Climb records.
5. WHEN no climbs have been logged, THE Dashboard SHALL display zero-state values for all statistics.

---

### Requirement 4: AI Route Suggestions

**User Story:** As a climber, I want to receive AI-powered route suggestions based on my max grade and preferred style, so that I can discover routes suited to my ability.

#### Acceptance Criteria

1. WHEN a user provides a max grade and climbing style and requests suggestions, THE SuggestionsService SHALL construct a prompt and call the Gemini API (`gemini-2.0-flash`).
2. THE SuggestionsService SHALL include a system instruction in every Gemini prompt that caps the response to route suggestions only.
3. WHEN the Gemini API returns a successful response, THE SuggestionsScreen SHALL display the suggested routes to the user.
4. WHEN the device is offline, THE SuggestionsService SHALL return an `offline` error state without making a network call.
5. WHEN the Gemini API call fails, THE SuggestionsService SHALL return an `api_error` error state.
6. WHEN the user has no climb history, THE SuggestionsService SHALL return a `no_history` error state.
7. THE SuggestionsScreen SHALL display a non-blocking error banner for each error type (`api_error`, `offline`, `no_history`).
8. THE SuggestionsScreen SHALL pre-fill maxGrade and style from UserProfile if available, without auto-submitting.
9. THE SuggestionsService SHALL NOT persist AI suggestion responses to Firestore or any storage.
10. THE SuggestionsScreen SHALL show an offline banner while the device is offline.

---

### Requirement 5: User Profile

**User Story:** As a climber, I want to save my profile information, so that the app can pre-fill suggestion inputs.

#### Acceptance Criteria

1. WHEN a user saves their profile, THE ProfileRepository SHALL persist the UserProfile as a singleton document in Firestore.
2. WHEN the profile screen is loaded, THE ProfileScreen SHALL retrieve the UserProfile via ProfileRepository.
3. THE ProfileScreen SHALL display editable fields: name, homeGym, climbingSince, goals.
4. WHEN no profile has been saved, THE ProfileScreen SHALL display placeholder text for all fields.

---

### Requirement 6: Grade Validation

#### Acceptance Criteria

1. THE GradeUtils module SHALL be the single source of truth for all grade validation logic.
2. WHEN a grade matches V-scale format, GradeUtils SHALL return `{ gradeSystem: 'v-scale', gradeWarning: false }`.
3. WHEN a grade matches YDS format, GradeUtils SHALL return `{ gradeSystem: 'yds', gradeWarning: false }`.
4. WHEN a grade matches neither format, GradeUtils SHALL return `{ gradeSystem: 'unknown', gradeWarning: true }`.
5. THE ClimbForm SHALL display an inline warning when gradeWarning is true (does not block submission).

---

### Requirement 7: Offline Resilience

#### Acceptance Criteria

1. WHEN the device is offline, THE app SHALL display an offline banner on the Suggestions screen.
2. WHEN the device is offline, THE SuggestionsService SHALL not attempt any Gemini API call.
3. WHEN the device is offline, previously loaded climb history SHALL remain visible (Firestore offline cache).

---

### Requirement 8: Architecture Constraints

#### Acceptance Criteria

1. THE UI layer SHALL NOT import directly from the Data layer — all data flows through Services/Domain layer.
2. THE `shared/` module SHALL NOT import from any feature module.
3. THE `features/dashboard/` SHALL NOT write or mutate Climb data directly.
4. THE `features/suggestions/` SHALL NOT persist data.
5. Grade validation logic SHALL live exclusively in `shared/utils/gradeUtils.ts`.
6. All backend interactions SHALL be abstracted via `services/`.

---

### Requirement 9: Localisation

#### Acceptance Criteria

1. THE app SHALL use Traditional Chinese (zh-TW) as the default locale.
2. ALL user-facing strings SHALL be accessed via `t()` from react-i18next — no hardcoded strings.
3. THE app SHALL fall back to English (`en`) for any key missing from zh-TW translations.
4. Translation files SHALL cover: ClimbForm, ClimbList, Dashboard, SuggestionsScreen, ProfileScreen labels, buttons, errors, and empty states.
5. THE `t()` function SHALL never return null or empty string for any defined key in any supported locale.

---

### Requirement 10: Environment Configuration

#### Acceptance Criteria

1. THE Gemini API key SHALL be provided via the `VITE_GEMINI_API_KEY` environment variable.
2. THE `.env.local` file SHALL NOT be committed to version control (covered by `.gitignore`).
3. THE app SHALL fail gracefully (show `api_error` state) if `VITE_GEMINI_API_KEY` is missing or invalid.
