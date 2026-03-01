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

## Current Plan: Board State and Date Integration

### Phase 1: Global State Service & Model Updates
- **Type Definitions**: Extend `BoardItem` model to include `date?: string` and `dateRangeType?: 'day' | 'week' | 'month' | 'year'`.
- **BoardStateService**: Create a new singleton service (`providedIn: 'root'`) to manage the global state of board items using Angular Signals.
- **Service Logic**: Implement methods to add, update, delete items, and create derived `computed` signals to retrieve items for specific dates or ranges. 

### Phase 2: Board Component Refactoring
- **State Integration**: Replace the local `boardItems` state in `BoardComponent` with the global state from `BoardStateService`.
- **Date Filtering**: Update the board to only display items that match the currently selected `boardDate` (or if they fall into the selected date range).
- **Date Assignment**: Ensure that when new items are added, they are assigned to the currently selected `boardDate` and default to a 'day' range type.

### Phase 3: Dashboard Integration
- **Week View**: Integrate `BoardStateService` into the `WeekView` component. Map board items to corresponding days and display colored dots indicating the types of items available for each day.
- **Life Map**: Integrate `BoardStateService` into the `LifeMapComponent`. Calculate the count of board items per day to determine the intensity of the heatmap blocks dynamically.

### Phase 4: Verification
- Verify that adding an item on the board persists across navigation (Dashboard -> Board).
- Verify that items explicitly display only on their assigned dates or within their specific ranges.
- Validate the week view dots correctly depict the items assigned to each day.
- Validate the life map heatmap intensity reflects the correct item count per day.
