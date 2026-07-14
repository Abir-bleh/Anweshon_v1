# Anweshon (v1)

**RUET Club Collaboration Interface** — a full-stack web platform for discovering, managing, and engaging with university clubs and their events, built for CSE 3200 at Rajshahi University of Engineering and Technology (RUET).

## Overview

Anweshon is a club management and collaboration platform that lets students explore clubs and events, join clubs, and engage with club activities, while giving club administrators tools to manage their club's profile, executives, and events — with real-time notifications powered by SignalR.

## Features

- **Explore Clubs & Events** — Public, searchable pages to browse all clubs and upcoming events without needing to log in.
- **Club Profiles with Custom Branding** — Clubs can set a logo, banner, and choose from 8 predefined color presets (or custom hex colors) that are applied dynamically across the club's page.
- **Role-Based Navigation** — Different navigation and capabilities for guests, authenticated students, and club admins.
- **Executive Management** — Club admins can assign executives from existing club members, with membership validation.
- **Real-Time Notifications (SignalR)** — Club executives get live notifications when a member joins the club or registers for an event.
- **Authentication & Account Management** — JWT-based auth, forgot-password flow with email OTP verification, and a user profile editor.
- **File Uploads** — Logo and banner image uploads with client-side preview.
- **Interactive Dashboard** — Home page stat cards link directly to relevant explore pages.

## Tech Stack

**Frontend**
- React 18+ (Hooks)
- React Router
- Tailwind CSS
- Axios
- SignalR client (for real-time notifications)

**Backend**
- ASP.NET Core 8.0
- Entity Framework Core
- SignalR
- JWT Authentication
- Role-based authorization

## Project Structure

```
Anweshon_v1/
├── backend/
│   └── Anweshon.Api/          # ASP.NET Core Web API (controllers, hubs, DTOs, EF Core)
├── frontend/                  # React application (pages, components, API client)
├── Anweshon.sln                # Visual Studio solution file
├── FEATURES_IMPLEMENTED.md     # Detailed feature changelog
├── IMPLEMENTATION_GUIDE.md     # Implementation notes
├── IMPLEMENTATION_TRACKER.md   # Progress tracker
├── IMAGE_URLS_GUIDE.md         # Guide for setting club logo/banner URLs
└── UPDATES_SUMMARY.md          # Summary of recent updates
```

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Auth/forgot-password` | Request a password reset OTP |
| `POST` | `/api/Auth/reset-password` | Reset password using OTP |
| `GET` | `/api/Users/{id}` | Get a user's profile |
| `PUT` | `/api/Users/{id}` | Update a user's profile |
| `POST` | `/api/Clubs/{id}/join` | Join a club (triggers notification to executives) |
| `GET` | `/api/Clubs/{id}/members` | Get club members (used for executive assignment) |
| `POST` | `/api/EventRegistrations` | Register for an event (triggers notification to executives) |

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (v18+ recommended) and npm
- A configured database connection for Entity Framework Core (see backend configuration)

### Backend Setup
```bash
cd backend/Anweshon.Api
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Documentation

This repo includes several supplementary docs worth checking for more detail:
- **FEATURES_IMPLEMENTED.md** — Full changelog of implemented features across development sessions
- **IMPLEMENTATION_GUIDE.md** — Guidance for implementing/extending features
- **IMPLEMENTATION_TRACKER.md** — Tracks implementation progress
- **IMAGE_URLS_GUIDE.md** — How to set club logo/banner image URLs

## Known Limitations

- Frontend notification UI (dropdown/toast) not yet implemented — notifications are sent via SignalR but not yet displayed in the UI
- No unread notification counter yet
- Profile picture upload not yet implemented

## Course Information

- **Course:** CSE 3200 — RUET
- **Institution:** Rajshahi University of Engineering and Technology (RUET)

## License

No license has been specified for this repository. All rights reserved by the author unless stated otherwise.
