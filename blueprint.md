# Application Blueprint

## Overview
This is a modern web application built with **Angular v21** and **Tailwind CSS v4**. It features a modular architecture with distinct features for Authentication, Dashboard, and a "Board" functionality (LifeBoard).

## Technology Stack
- **Framework**: Angular v21
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript ~5.9.2
- **Build Tool**: Angular CLI
- **Testing**: Vitest

## Project Structure
The application follows a standard Angular CLI structure with a feature-based folder organization in `src/app`:

- `src/app/auth`: Authentication feature (Login, Signup, Forgot Password).
- `src/app/board`: Core "LifeBoard" feature.
- `src/app/dashboard`: User dashboard area.
- `src/app/core`: Singleton services, models, and global themes.

## Features

### Authentication (`/auth`)
Handles user access and registration.
- **Login**: `LoginComponent`
- **Signup**: `SignupComponent`
- **Forgot Password**: `ForgotPasswordComponent`
- **Layout**: Uses `AuthLayoutComponent` wrapper.
- **Landing**: `AuthLandingComponent`

### Dashboard (`/dashboard`)
The main user area after login.
- **Home**: `HomeComponent`
- **Layout**: `DashboardComponent` acts as the layout container.

### Board (`/board`)
The primary interactive feature of the "LifeBoard".
- **Page**: `BoardComponent`

### Core
Contains shared utilities and singleton services.
- **Theme**: `ThemeService` for managing application theming.
- **Models**: Shared data models like `nav-item.model.ts` and `board.types.ts` handling Google Keep Note properties.

## Routes
The application uses lazy-loading for its main features:
- `/auth`: Loads `AUTH_ROUTES`
- `/dashboard`: Loads `DASHBOARD_ROUTES`
- `/board`: Loads `BOARD_ROUTES`
- Default route redirects to `/auth`.

## Configuration
- **Firebase**: Configured via `.firebaserc` and `firebase.json`.
- **Styling**: Global styles in `src/styles.css` using Tailwind directives.

## Future Plans
- [ ] Implement actual Firebase integration for backend.
- [ ] Expanding Board feature interactions (connections, grouping, zooming to objects).
- [ ] Adding more Dashboard widgets.

## Current Plan: Mobile & Touch Screen Responsiveness (Board Component)

### Phase 1: Touch Events for Panning & Zooming
- Map standard `HostListener` mouse events to their mobile equivalents (`touchstart`, `touchmove`, `touchend`).
- Implement pinch-to-zoom functionality by calculating the distance between two touches on `touchmove` events.
- Maintain smooth UX by mapping a single touch to "pan" functionality without needing a dedicated pan-mode toggle, or using a two-finger swipe while a single finger interacts with objects.

### Phase 2: Mobile UI Element Adaptations
- **Note Items Tools Toolbar**: Remove the Tailwind `hidden md:flex` classes from the drag and edit icons layout (`board.component.html`) so touch gestures can actually interact with the handles. Show these controls when the user taps once (selecting the item), or just display them proactively on mobile.
- **Floating Action Button (FAB)**: Update the "Add Item" button layout for mobile devices using responsive styling to condense it into a circular FAB, saving screen real estate.
- **Board Metrics Window**: Hide or minimize the debug zoom/coordinate overlay on smaller screens (`max-width: 768px`) to remove visual clutter.

### Phase 3: Resize and Drag Handling for Mobile
- Add `touchstart`, `touchmove`, `touchend` event handlers to the `.resize-handle` div to ensure users can resize notes using touch natively.
- Make sure that Angular CDK `cdkDrag` works cleanly with mobile browser behaviours by ensuring `.viewport` retains `touch-action: none`.

### Phase 4: Verification and Polish
- Ensure the application doesn't accidentally trigger browser "pull-to-refresh" or local zooming text inputs.
- Test drag capabilities across variable device form-factors by mimicking device dimensions in dev tools.
