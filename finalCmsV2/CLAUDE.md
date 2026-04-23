# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FinalCmsV2 is a multi-site content management system built with Vue 3 (frontend) and Express.js (backend). It features a role-based permission system for both system-level and website-level access control.

## Commands

### Root (src directory)
```bash
npm run pro          # Start backend server (port 17514) + frontend server (port 20829)
```

### Frontend (src/IDE/mageFrontEnd)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Architecture

```
src/
├── Front/                    # Static site output (served by FrontServer)
│   ├── ROOT/                 # Default site
│   ├── zhaosheng/            # Admission site
│   ├── jwc/                  # Academic affairs site
│   └── ...                   # Other sites
├── IDE/
│   ├── mageFrontEnd/         # Vue 3 admin panel (Vite + Pinia + Vue Router)
│   │   ├── src/
│   │   │   ├── views/        # Page components (Login, Console, FunctionPages)
│   │   │   ├── components/   # Reusable components (baseElements, element)
│   │   │   ├── request/      # API client (axios-based)
│   │   │   ├── store/        # Pinia stores (systemStore)
│   │   │   └── router/       # Vue Router config
│   │   └── dist/             # Production build output
│   └── server/
│       ├── main.js           # Server entry point
│       ├── server/
│       │   ├── backEndServer/    # Express API server (port 17514)
│       │   ├── FrontServer/      # Static file server (port 20829)
│       │   └── webappsController/# Sync controller
│       ├── DataBase/
│       │   ├── systemData.json   # JSON database (users, roles, menus)
│       │   └── SystemController.js # DB operations
│       └── utils/
```

## Key Technologies

- **Frontend**: Vue 3, Pinia, Vue Router, Vite, Element UI, CodeMirror, Three.js
- **Backend**: Express.js, Socket.IO, lowdb (JSON file storage)
- **Port Config**: Frontend 20829, Backend 17514 (src/IDE/server/server/SystemConfig.js)

## Authentication & Authorization

Token-based authentication with in-memory token pool (src/IDE/server/DataBase/SystemController.js):
- Tokens expire after 2 hours, idle timeout 15 minutes
- Two permission scopes:
  - **System Level**: systemMenu, systemRole, systemUserRole, systemRoleMenu
  - **Website Level**: website, websiteMenu, websiteRole, websiteUserRole

Default admin user: 刘军 (created by system)

## Data Model (systemData.json)

Core entities: user, systemRole, systemMenu, systemUserRole, systemRoleMenu, website, websiteMenu, websiteRole, websiteUserRole. All CRUD operations go through SystemController.

## Front-End Routing

Base path: `/finalCms/` (vite.config.js). Main views:
- Login.vue - Authentication
- Index.vue - Main layout with menu
- Console/ - System management (user, role, menu, website management)
- FunctionPages/ - Feature modules (FileController, ListController, RoleController, UserController)

## Server Architecture

Two servers run simultaneously:
1. **BackEndServer**: Express API with token authentication middleware (`app.tokenPost`, `app.tokenFileUpload`)
2. **FrontServer**: Static file server with dynamic site resolution and per-site status control

## Front Website Structure

Each subdirectory under src/Front/ represents a separate website with its own index.html, list.json, and assets. The ROOT site serves as default. Sites can be enabled/disabled via systemData.json configuration.
