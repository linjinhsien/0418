# Requirements Document

## Introduction

The Climber App is a mobile-first React Native application for rock climbers to log their climbs, track progress over time, view aggregated stats on a dashboard, and receive AI-powered route suggestions via the Gemini API. All data is stored locally via SQLite with no authentication or cloud sync in v1.

## Glossary

- **Climb**: A single climbing attempt or send, recorded with grade, date, result, and optional metadata.
- **Grade**: A difficulty rating in V-scale (V0–V17), YDS (5.0–5.15d), or freetext with a warning flag.
- **GradeSystem**: The grading system used — `v-scale`, `yds`, or `unknown`.
- **Result**: The outcome of a climb attempt — `sent` (completed) or `attempt` (did not complete).
- **Dashboard**: A read-only view of aggregated climbing statistics and charts.
- **Suggestions**: AI-generated route recommendations produced by the Gemini API.
- **SuggestionsService**: The single service responsible for all Gemini API interactions.
- **UserProfile**: A singleton record storing optional user metadata such as name, home gym, and goals.
- **ClimbsRepository**: The data-layer component responsible for SQLite read/write operations on climbs.
- **ProfileRepository**: The data-layer component responsible for SQLite read/write operations on the user profile.
- **StatsAggregator**: The domain-layer component that computes read-only statistics from climb data.
- **GradeUtils**: The shared utility module that owns all grade validation and normalization logic.
- **Domain Layer**: The middle layer containing use cases and entities; mediates between UI and Data layers.

---

## Requirements

### Requirement 1: Log a Climb

**User Story:** As a climber, I want to log a climb with its grade, date, and result, so that I can keep a record of my climbing activity.

#### Acceptance Criteria

1. WHEN a user submits the climb form with a valid route name, grade, date, and result, THE ClimbsService SHALL create a new Climb record and persist it via ClimbsRepository.
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
3. THE Dashboard SHALL display a breakdown of climbs by grade.
4. THE StatsAggregator SHALL only read climb data and SHALL NOT write or mutate any Climb records.
5. WHEN no climbs have been logged, THE Dashboard SHALL display zero-state values for all statistics.

---

### Requirement 4: AI Route Suggestions

**User Story:** As a climber, I want to receive AI-powered route suggestions based on my max grade and preferred style, so that I can discover routes suited to my ability.

#### Acceptance Criteria

1. WHEN a user provides a max grade and climbing style and requests suggestions, THE SuggestionsService SHALL construct a prompt and call the Gemini API.
2. THE SuggestionsService SHALL include a system instruction in every Gemini prompt that caps the response to route suggestions only.
3. WHEN the Gemini API returns a successful response, THE SuggestionsScreen SHALL display the suggested routes to the user.
4. WHEN the device is offline, THE SuggestionsService SHALL return an `offline` error state without making a network call.
5. WHEN the Gemini API call fails, THE SuggestionsService SHALL return an `api_error` error state.
6. WHEN the user has no climb history, THE SuggestionsService SHALL return a `no_history` error state.
7. IF an error state is present, THEN THE SuggestionsScreen SHALL display a non-blocking error banner corresponding to the error type (`api_error`, `offline`, or `no_history`).
8. WHILE the device is offline, THE SuggestionsScreen SHALL display a non-blocking offline banner and all local features SHALL remain fully functional.
9. THE SuggestionsService SHALL NOT persist any Gemini API responses to local storage.
10. WHERE a UserProfile exists with a max grade or style preference, THE SuggestionsScreen SHALL pre-fill the suggestion input fields with that data but SHALL NOT auto-submit the request.

---

### Requirement 5: User Profile

**User Story:** As a climber, I want to manage my profile with my name, home gym, and climbing goals, so that I can personalize my experience.

#### Acceptance Criteria

1. WHEN a user saves their profile, THE ProfileRepository SHALL persist the UserProfile record to SQLite using the singleton id `'singleton'`.
2. WHEN the profile screen is displayed, THE ProfileScreen SHALL load and display the current UserProfile from ProfileRepository.
3. THE ProfileScreen SHALL NOT trigger any AI or Gemini API calls.
4. WHEN no profile has been saved, THE ProfileScreen SHALL display empty fields with placeholder text.

---

### Requirement 6: Grade Validation

**User Story:** As a climber, I want my grades to be validated consistently, so that my climb data is accurate and comparable.

#### Acceptance Criteria

1. THE GradeUtils SHALL be the sole location for grade validation and normalization logic — no inline grade validation SHALL exist elsewhere in the codebase.
2. WHEN a grade string is evaluated, THE GradeUtils SHALL return a `gradeSystem` value of `v-scale`, `yds`, or `unknown`.
3. WHEN a grade is classified as `unknown`, THE GradeUtils SHALL return a warning flag alongside the grade result.
4. THE GradeUtils SHALL accept freetext grades without rejecting them silently — all grades SHALL be stored.

---

### Requirement 7: Offline Resilience

**User Story:** As a climber, I want the app to remain fully functional without a network connection, so that I can log climbs anywhere.

#### Acceptance Criteria

1. WHILE the device is offline, THE App SHALL allow users to log climbs, view climb history, view the dashboard, and manage their profile without degradation.
2. WHEN a network state check is performed before a Gemini API call and the device is offline, THE SuggestionsService SHALL return an `offline` error state immediately.
3. THE App SHALL check network state before every Gemini API call.

---

### Requirement 8: Layered Architecture

**User Story:** As a developer, I want a clean layered architecture, so that the codebase is maintainable and each module has clear responsibilities.

#### Acceptance Criteria

1. THE UI layer SHALL NOT import from or directly call the Data layer — all data access SHALL flow through the Domain layer.
2. THE `climbs` module SHALL NOT import from the `suggestions` or `dashboard` modules.
3. THE `dashboard` module SHALL NOT write or mutate Climb data.
4. THE `suggestions` module SHALL NOT persist any data to SQLite.
5. THE `profile` module SHALL NOT trigger Gemini API calls.
6. THE `shared` module SHALL NOT import from any feature module (`climbs`, `dashboard`, `suggestions`, `profile`).

---

### Requirement 9: Localization (Traditional Chinese)

**User Story:** As a Traditional Chinese-speaking climber, I want the app UI to be available in Traditional Chinese (zh-TW), so that I can use the app in my preferred language.

#### Acceptance Criteria

1. THE App SHALL support Traditional Chinese (zh-TW) as a display language alongside English.
2. WHEN the device locale is set to zh-TW, THE App SHALL render all UI labels, buttons, error messages, and empty-state text in Traditional Chinese.
3. WHEN the device locale is not zh-TW, THE App SHALL render UI text in English as the default language.
4. THE Localization system SHALL provide translated strings for all user-facing text across all screens (ClimbForm, ClimbList, Dashboard, SuggestionsScreen, ProfileScreen).
5. IF a translation key is missing for the active locale, THEN THE Localization system SHALL fall back to the English string for that key.

---

### Requirement 10: Database Migrations

**User Story:** As a developer, I want versioned database migrations, so that the SQLite schema can evolve safely over time.

#### Acceptance Criteria

1. THE Database SHALL version its schema migrations from the initial release.
2. WHEN the app initializes, THE Database SHALL apply any pending migrations in version order.
3. IF a migration fails, THEN THE Database SHALL surface a typed error and halt further migration steps.

---

## Glossary (additions)

- **Locale**: The device's language/region setting used to determine the active display language.
- **Localization**: The system responsible for mapping translation keys to locale-specific strings.
- **zh-TW**: Traditional Chinese as used in Taiwan — the supported non-English locale for v1.
