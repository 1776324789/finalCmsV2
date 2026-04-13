# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend Server
```bash
cd src
npm run pro
```
Starts the CMS backend server (Express.js) on port 17514 and frontend server on port 20829.

### Frontend Development
```bash
cd src/IDE/mageFrontEnd
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

This is a **dual-stack CMS (Content Management System)** with:

### Backend Stack (Node.js/Express)
- **`src/`** - Main backend server
  - `IDE/server/main.js` - Entry point, starts both backend API and frontend static servers
  - `IDE/server/server/backEndServer/` - Express API server (port 17514) with token-based auth
  - `IDE/server/server/FrontServer/` - Static file server for frontend sites (port 20829)
  - `IDE/server/DataBase/` - JSON-file based database with controllers:
    - `SystemController.js` - User management, token pool, menu/role-based access control
    - `WebsiteController.js` - CRUD for website lists, nodes, and content
  - `IDE/server/webapps/` - Website data storage (list.json, content/*.node files)
  - `server/webappsController/WebsiteDataSync.js` - File watcher that syncs `webapps/data/` changes to `Front/`

### Frontend Stack (Vue 3 + Vite)
- **`src/IDE/mageFrontEnd/`** - Admin dashboard SPA
  - Vue 3 with Composition API, Pinia for state management
  - Element Plus UI, Vue Router
  - Custom base elements: `CmsInput`, `CmsTextarea`, `CmsButton`, `ImageUpload`, `Dialog`, `CmsSwitch`
  - Router: `/listController`, `/nodeController`, `/dataAnalysis`, `/systemDataAnalysis`
  - `request/` - Axios instances for API calls with token auth

### Frontend Sites (Static)
- **`src/Front/`** - Deployed static sites
  - `ROOT/` - Default site
  - `zhaosheng/` - Example subsite (招生网)
  - Each site has: `index.html`, `css/`, `js/`, `data/` (synced from webapps)
  - Sites load `FinalCms.js` for CMS functionality

### Data Flow
1. Admin dashboard (`:20829/finalCms/`) → API calls to backend (`:17514`)
2. Backend CRUD operations → `webapps/{site}/data/`
3. `WebsiteDataSync` watches data changes → syncs to `Front/{site}/data/`
4. Static sites (`:20829/{site}/`) read from synced data files

### Key Conventions
- Token-based authentication (2-hour expiry, 15-min idle timeout)
- Tree-structured data with `children` and `nodes` arrays
- Soft delete via `delFlag: 1`
- Node content stored in separate `.node` files
- Role-based menu access (system roles + website roles)
