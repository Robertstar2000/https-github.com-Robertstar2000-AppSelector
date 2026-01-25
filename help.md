# Tallman App Selector - Help & User Guide

## Application Description
The Tallman App Selector allows authorized users to browse, select, and manage applications within the Tallman suite. It serves as a central gateway, enforcing identity governance and providing intelligent navigation via AI orchestration.

## Features
- **Secure Authentication**: Email-first identity with governance overrides for admin domains (`@tallmanequipment.com`).
- **Resilient AI**: Integrated Gemini AI with "Industrial Retry" logic for robust content generation.
- **Dual Persistence**: Seamlessly switches between PostgreSQL (Docker) and SQLite (Local).
- **Admin Control**: Drag-and-drop ordering, rich metadata (Owner, Source URL), and toggleable Admin Mode.

## User Instructions

### 1. Authentication
- **Sign Up**: Register with your email.
  - Users with `@tallmanequipment.com` emails are automatically granted **Admin** privileges.
  - Other domains default to **User** role.
- **Login**: Use your registered credentials to access the dashboard.

### 2. Dashboard
- **View Apps**: Browse available applications.
- **Search**: Use the AI-powered search to find functionality across the suite.

### 3. Administration (Admins Only)
- **Manage Users**: View and manage authorized users.
- **System Health**: Monitor database connections and AI service status.

## Troubleshooting

### Connection Issues
### Connection Issues
- **Database Error**: Ensure Docker is running. If on local, check `local.db` permissions.
- **Site Unreachable**: Confirm you are accessing port **3100** (moved from 3000 to avoid conflicts).
- **AI Timeout**: The system retries 5 times. If it persists, check your Internet connection and `GEMINI_API_KEY`.

### Admin Queries
- **Stuck in Admin**: Click the "EXIT ADMIN" button in the header (visible only to admins).
- **Missing Apps**: If DB was reset, try re-seeding or adding apps manually.

### Support
For additional support, contact the IT department or open an issue in the repository.
