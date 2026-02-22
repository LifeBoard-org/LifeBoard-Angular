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

## Current Plan: Google Keep Style Note Board Item (Completed)
- Completed the integration of Google Keep style responsive note board items. Notes now natively support local Material Design color palettes, nested checkmark lists with toggle functionality, image fetching from a FileReader, and rich animated text editors.
- Modal functionality allows pop-ups anchored to the dynamic background color. Added specific CSS easing animations to enhance Material 3 expressive principles.
