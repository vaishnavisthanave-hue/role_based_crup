# Project Review: role_based_crup

**Review date:** August 6, 2026  
**Project type:** Node.js / Express / Sequelize — Role-based CRUD API with JWT auth, permissions, and business management

---

## Ratings (out of 10)

| Category | Score | Summary |
|----------|-------|---------|
| **Code standards** | **4 / 10** | Basic MVC patterns exist, but naming, security, consistency, and production readiness are weak. |
| **File structure** | **5 / 10** | Reasonable `src/` layout, but duplicate folders, missing project hygiene, and half-finished TypeScript setup hurt it. |

> These scores are relative to **production-grade** Node/Express projects. For a learning/demo project, it shows effort; for a team or production repo, it needs significant cleanup.

---

## What Is Done Well

1. **Layered layout under `src/`** — `controllers`, `routes`, `models`, `middleware`, `database/migrations`, `database/seeders`.
2. **Auth flow** — JWT middleware, bcrypt hashing, role checks in some endpoints.
3. **RBAC concept** — roles, permissions, `UserPermission` join table, `checkPermission` middleware.
4. **API docs** — Swagger/OpenAPI via `swagger-jsdoc`.
5. **Database versioning** — Sequelize migrations and seeders (good intent).

---

## File Structure Snapshot

```
role_based_crup/
├── app.js                 ← entry point
├── swagger.js
├── tsconfig.json          ← unused (no TS source)
├── config/                ← legacy duplicate (unused)
├── models/                ← legacy duplicate (unused)
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── uploads/           ← user files (should not be in git)
```

**Good:** Clear separation inside `src/`.  
**Bad:** Duplicate root folders, no `services/`, `validators/`, `utils/`, `tests/`, or `.gitignore`.

---

## Issues List

### Critical (Security & Data Integrity)

| # | Issue | Location |
|---|--------|----------|
| 1 | **`.env` is committed to git** — secrets (DB creds, JWT secret) may be exposed | Root `.env`, tracked in git |
| 2 | **`node_modules` is committed** — huge repo, wrong practice, security/update risk | Entire `node_modules/` in git |
| 3 | **Demo user seeded with plaintext password** `"123456"` — not hashed | `src/database/seeders/20260805051336-demo-user.js` |
| 4 | **`createUser` returns full user object including password hash** | `AuthController.createUser` → `data: user` |
| 5 | **`assignPermission` has no authorization** — any logged-in user can assign permissions | `authRoutes.js` + `AuthController.assignPermission` |
| 6 | **No input validation** — email format, password strength, required fields on admin create-user | All controllers |
| 7 | **Error messages leak internal details** — `error.message` returned to client | All controllers |
| 8 | **Hardcoded ngrok URL in Swagger** — dev tunnel in docs | `swagger.js` |
| 9 | **Uploaded media files committed** — binary files in repo | `src/uploads/*` |

### High (Bugs & Broken Behavior)

| # | Issue | Location |
|---|--------|----------|
| 10 | **`roleId` vs `roleid` mismatch** — vendor query uses `roleId` but model/DB column is `roleid`; vendors query likely returns nothing | `UserController.getAllVendors` |
| 11 | **Role name case mismatch** — seeder inserts `'vendor'`, code searches `"Vendor"` | Seeder vs `UserController.js` |
| 12 | **Duplicate Permissions migrations** — two migrations create `Permissions` table | `20260805100423-*` and `20260805100632-*` |
| 13 | **Role model has confusing `roleid` field** on a table that already has `id` | `src/models/role.js`, migration |
| 14 | **No `User.belongsTo(Role)` association** — role logic done manually everywhere | `src/models/user.js` |
| 15 | **Swagger docs don't match API** — e.g. business uses `title`/`discription`, docs say `businessName`/`address`/`phone` | `businessRoutes.js` vs `BusinessController` |
| 16 | **Typo `discription`** used consistently instead of `description` | Model, migrations, controller |
| 17 | **Response typo `mageSize`** instead of `imageSize` | `BusinessController.createBusiness` |
| 18 | **Root route registered after `app.listen`** — `/` handler may never behave as expected depending on Express version/timing | `app.js` lines 25–31 |
| 19 | **No static serving of uploads** — clients can't access uploaded images/videos via HTTP | Missing in `app.js` |
| 20 | **No global error handler** — multer/upload errors not handled centrally | `app.js` |

### Medium (Structure & Consistency)

| # | Issue | Location |
|---|--------|----------|
| 21 | **Duplicate legacy folders at root** — `config/config.json`, `models/index.js` unused; real config is `src/config/config.js` | Root vs `src/` |
| 22 | **TypeScript configured but no `.ts` files** — `tsconfig.json`, `build` script, `@types/*` unused | `package.json`, `tsconfig.json` |
| 23 | **Mixed controller styles** — `AuthController` object vs `UserController`/`BusinessController` classes | Controllers |
| 24 | **`cors` and `morgan` in dependencies but not used** | `package.json` vs `app.js` |
| 25 | **`package.json` `main: index.js`** but app entry is `app.js` | `package.json` |
| 26 | **Project name typo** — folder `role_based_crup`, package `role_based_crud` | Naming |
| 27 | **No `.gitignore`** — explains committed `.env`, `node_modules`, uploads | Root |
| 28 | **No README** — setup, env vars, migration commands undocumented | Root |
| 29 | **No tests** — `"test"` script is a placeholder | `package.json` |
| 30 | **No ESLint/Prettier** — inconsistent formatting (especially `UserController.js`) | Project-wide |
| 31 | **`UserController` imported in `authRoutes.js` but unused** | `authRoutes.js` |
| 32 | **Dead import `{ Business ,user}`** — `user` unused, wrong casing | `BusinessController.js` |
| 33 | **Admin check duplicated** instead of middleware/service | `AuthController`, `UserController` |
| 34 | **Permissions defined but barely used** — business routes don't use `checkPermission` | `businessRoutes.js` |
| 35 | **No CRUD completeness** — no delete business, no update/delete user | Controllers/routes |

### Low (Code Quality & Maintainability)

| # | Issue | Location |
|---|--------|----------|
| 36 | **Debug `console.log` left in production code** | `AuthController`, `UserController`, `BusinessController`, `swagger.js` |
| 37 | **Mixed comment languages** (English + Hindi) | `UserController.js` |
| 38 | **Inconsistent HTTP status codes** — duplicate email: 409 vs 400 | `register` vs `createUser` |
| 39 | **No pagination/filtering** on list endpoints | `getAllBusinesses`, `getAllVendors` |
| 40 | **Synchronous file I/O** (`readFileSync`, `statSync`) blocks event loop | `BusinessController.js` |
| 41 | **Weak duplicate-image logic** — comparing image vs video file size is unreliable | `createBusiness` |
| 42 | **No email uniqueness at DB level** — only app-level check | User migration |
| 43 | **No foreign keys in migrations** — `userid`, `roleid`, `userId`, `permissionId` not constrained | Migrations |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| ORM | Sequelize 6 |
| Database | MySQL |
| Auth | JWT + bcrypt |
| File upload | Multer |
| API docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Dev tools | nodemon, sequelize-cli, TypeScript (unused) |

---

## API Routes Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login |
| POST | `/auth/create-user` | JWT | Admin create user |
| POST | `/auth/assign-permission` | JWT | Assign permission to user |
| GET | `/user/vendors` | JWT (admin) | List vendors |
| GET | `/user/pervendors` | JWT + permission | List vendors via permission |
| POST | `/business` | JWT | Create business (with image/video) |
| GET | `/business` | JWT | List all businesses |
| GET | `/business/mybusiness` | JWT | List current user's businesses |
| GET | `/business/:id` | JWT | Get business by ID |
| PUT | `/business/:id` | JWT | Update business |
| GET | `/api-docs` | No | Swagger UI |

---

## Priority Fix Order

1. Add `.gitignore`; remove `.env`, `node_modules`, and `uploads/` from git.
2. Fix `roleId` → `roleid` and `"Vendor"` → `"vendor"`.
3. Remove duplicate Permissions migration; add FK constraints.
4. Hash demo user password; stop returning password in API responses.
5. Protect `assignPermission` with admin/permission checks.
6. Add validation (e.g. `express-validator` or Joi).
7. Remove debug logs; add global error handler.
8. Align Swagger with real request/response shapes.
9. Either migrate to TypeScript or remove TS tooling.
10. Add README + basic tests.

---

## Bottom Line

The project shows a **reasonable learning-level architecture** (Express + Sequelize + JWT + RBAC + Swagger), but **code standards and repo hygiene are below average** for anything beyond a personal demo.

**Code standards: 4/10** | **File structure: 5/10**

---

*Generated from full codebase review of controllers, models, routes, middleware, migrations, seeders, and configuration.*
