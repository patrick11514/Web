# Implementation Plan: Enhancing About Page with Solar System Visualization

## 1. Overview

The goal is to transform the `about` page into an interactive solar system visualization.

- **Center**: The Sun (Birth/Origin or just the Persona).
- **Planets**: Key life events (High School, University, Career milestones).
- **Distance**: Represents chronological order (Mercury = earliest, Neptune = latest).
- **Configurability**: Data driven by a config file.
- **Interactivity**: Clicking a planet reveals detailed information.

## 2. Data Structure

Create a strictly typed configuration for defining the "Universe" of the user's life.

**File**: `src/lib/config/about.ts` (or local to page `src/routes/[[lang=lang]]/about/config.ts`)

```typescript
export interface LifeEvent {
  id: string; // e.g., 'high-school'
  title: string;
  description: string;
  date: string; // or year range
  planet:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune';
  icon?: string; // Bootstrap icon name
  color?: string; // Specific color for the planet
  available: boolean; // Toggle visibility
}

export const solarSystemConfig: LifeEvent[] = [
  // ... data
];
```

## 3. Component Architecture

### A. `SolarSystem.svelte` (Container)

- **Role**: Main wrapper, handles absolute positioning logic and responsiveness.
- **Props**: `events: LifeEvent[]`
- **Logic**:
  - consistent aspect ratio container.
  - calculating orbit radii based on planet index.

### B. `Orbit.svelte`

- **Role**: Visual circle representing the path.
- **Props**: `radius: number` (percentage or pixels).

### C. `CelestialBody.svelte` (Sun & Planets)

- **Role**: The clickable circle representing the event.
- **Props**:
  - `type`: 'sun' | 'planet'
  - `size`: number
  - `color`: string
  - `distance`: number (orbit radius)
  - `angle`: number (starting position in degrees, maybe random or fixed)
  - `animationSpeed`: number
- **Features**:
  - Hover effects (scale up, glow).
  - Click handler to open Info Modal.
  - Tooltip on hover with `title`.

### D. `InfoPanel.svelte` (Detail View)

- **Role**: Display the `description` and details when a planet is selected.
- **Behavior**:
  - Desktop: Sidebar or Floating Card.
  - Mobile: Bottom Sheet or Modal.

## 4. Implementation Steps

### Step 1: Data Setup [COMPLETED]

1.  [x] Create `src/routes/[[lang=lang]]/about/data.ts`.
2.  [x] Define the `LifeEvent` interface and populate initial data (High School, University, etc.).

### Step 2: Basic Components

1.  Create `src/routes/[[lang=lang]]/about/components/SolarSystem.svelte`.
2.  Create `src/routes/[[lang=lang]]/about/components/Planet.svelte`.
3.  Implement basic Tailwind styling for circles and absolute positioning to center everything.

### Step 3: Layout & Orbits

1.  Implement the concentric circles ("orbits") in `SolarSystem.svelte`.
2.  Place the Sun in the center.
3.  Place planets on their respective orbits based on the config.

### Step 4: Interactivity

1.  Add `selectedEvent` state in `SolarSystem.svelte` (or parent page).
2.  Pass click handlers to `Planet.svelte`.
3.  Create `InfoPanel.svelte` that conditionally renders when `selectedEvent` is not null.

### Step 5: Enhancements & Polish

1.  **Animation**: Add CSS `@keyframes` for slow rotation of orbits (optional, nice to have).
2.  **Responsiveness**:
    - _Desktop_: Full 2D orbit view.
    - _Mobile_: Maybe condense to a vertical timeline or a static mini-system if screen width is too small.
3.  **Translations**: Ensure text in `data.ts` uses the i18n system or is translatable.

## 5. Technology Specifics

- **Svelte 5**: Use `Runes` (`$state`, `$props`) for managing selected planet state.
- **TailwindCSS 4**: Use utility classes for positioning (`absolute`, `top-1/2`, `left-1/2`, `-translate-x-1/2`) and styling (`rounded-full`, `border`, `shadow-lg`).
