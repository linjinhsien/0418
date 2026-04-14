# Implementation Plan: Climber App

**Branch**: `001-climber-app` | **Date**: 2026-04-14 | **Spec**: [specs/001-climber-app/spec.md]

## Summary
Climber is a mobile-first web application designed to help climbers log their climbs, track progress via a dashboard, and receive AI-powered route suggestions using Gemini. The implementation will focus on a clean, responsive UI and seamless integration with the Gemini API.

## Technical Context

**Language/Version**: TypeScript / HTML5  
**Primary Dependencies**: React (for UI), Gemini API (via Google AI SDK), Chart.js (for dashboard)  
**Storage**: LocalStorage (v1) / IndexedDB (for structured climb data)  
**Testing**: Vitest / Testing Library  
**Target Platform**: Mobile Web (Responsive)  
**Project Type**: Web application  
**Performance Goals**: Initial load < 3s, Smooth chart rendering  
**Constraints**: Client-side only for v1, Offline-capable (PWA)  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **AI-First**: Gemini integration is a core feature (US3).
- [x] **Simple UX**: Mobile-first responsive design planned.
- [x] **Data Integrity**: Schema defined for climb logging; validation required.
- [x] **Testability**: Vitest planned for unit and integration tests.

## Project Structure

### Documentation (this feature)

```text
specs/001-climber-app/
├── plan.md              # This file
├── research.md          # Gemini API integration & Local Storage best practices
├── data-model.md        # Climb and UserProfile schemas
├── quickstart.md        # Setup and local dev instructions
└── tasks.md             # Implementation task list
```

### Source Code (repository root)

```text
src/
├── components/          # UI Components (LogForm, Dashboard, AIBox)
├── services/            # GeminiService, StorageService
├── models/              # TypeScript interfaces
├── styles/              # theme.css and component styles
└── index.html           # Entry point
```

## Phase 0: Outline & Research

1. **Research Task**: Gemini API authentication and prompt engineering for climbing suggestions.
2. **Research Task**: Local storage vs IndexedDB for persisting structured JSON data on mobile web.
3. **Research Task**: Mobile-responsive chart libraries (Chart.js vs Recharts).

## Phase 1: Design & Contracts

1. **Data Model**: Define `ClimbEntry` and `UserProfile` interfaces.
2. **AI Contract**: Define the prompt template and response format for Gemini suggestions.
3. **Agent Update**: Run `.specify/scripts/bash/update-agent-context.sh gemini`.
