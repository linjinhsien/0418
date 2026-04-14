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
