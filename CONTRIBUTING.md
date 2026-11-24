# Contributing to Salon Management & Booking System

Thanks for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Project Structure](#project-structure)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

- Be respectful and inclusive
- Give and receive constructive feedback
- Focus on what is best for the project and community

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 14+
- **Git**

### Setup

1. **Fork** the repository on GitHub

2. **Clone** your fork locally:

```bash
git clone https://github.com/your-username/salon-management-and-booking-system.git
cd salon-management-and-booking-system
```

3. **Add upstream remote:**

```bash
git remote add upstream https://github.com/original-owner/salon-management-and-booking-system.git
```

4. **Install dependencies (server):**

```bash
cd server
cp .env.example .env    # Edit with your PostgreSQL credentials
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

5. **Install dependencies (client):**

```bash
cd ../client
cp .env.example .env    # Set NEXT_PUBLIC_API_URL=http://localhost:5000
pnpm install
```

6. **Start both servers:**

In one terminal:

```bash
cd server
pnpm dev        # http://localhost:5000
```

In another terminal:

```bash
cd client
pnpm dev        # http://localhost:3000
```

---

## Development Workflow

### 1. Sync with upstream

Before starting any work, always sync your fork:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make your changes

- Write your code following the [Code Style](#code-style) guidelines
- Keep commits focused and atomic
- Test your changes locally against both client and server

### 4. Push and create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

---

## Branch Naming

Use descriptive branch names with prefixes:

| Prefix      | Purpose           | Example                        |
| ----------- | ----------------- | ------------------------------ |
| `feature/`  | New features      | `feature/salon-creation-form`  |
| `fix/`      | Bug fixes         | `fix/double-booking-logic`     |
| `refactor/` | Code refactoring  | `refactor/appointment-service` |
| `docs/`     | Documentation     | `docs/api-routes`              |
| `test/`     | Adding tests      | `test/booking-validation`      |
| `chore/`    | Maintenance tasks | `chore/update-dependencies`    |

---

## Commit Messages

Write clear, concise commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

### Types

| Type       | Description                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | New feature                                      |
| `fix`      | Bug fix                                          |
| `docs`     | Documentation changes                            |
| `style`    | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring (no feature or fix)             |
| `test`     | Adding or updating tests                         |
| `chore`    | Maintenance tasks                                |

### Scopes

Use `client` or `server` to indicate which part of the monorepo:

```
feat(server): add salon creation endpoint
feat(client): add salon creation form
fix(server): prevent double booking for same time slot
fix(client): handle loading state in booking flow
```

### Examples

```
feat(server): add salon CRUD endpoints with Zod validation
feat(client): add salon listing page with shadcn table
fix(server): check stylist availability before booking
docs(readme): update getting started section
refactor(server): extract appointment service from controller
test(server): add unit tests for time slot validation
chore(deps): update prisma to latest version
```

---

## Pull Requests

### Before Submitting

- [ ] Code follows the project's [Code Style](#code-style)
- [ ] No TypeScript errors in client (`cd client && npx tsc --noEmit`)
- [ ] No TypeScript errors in server (`cd server && npx tsc --noEmit`)
- [ ] No linting errors
- [ ] Changes are tested locally
- [ ] Branch is up to date with `main`
- [ ] PR clearly states if it's a `client`, `server`, or `both` change

### PR Template

```markdown
## Description

Brief description of changes.

## Component

- [ ] Client (Next.js)
- [ ] Server (Express.js)
- [ ] Both
- [ ] Documentation

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation
- [ ] Other (describe)

## Related Issues

Closes #123

## Testing

Describe how you tested your changes.

## Screenshots (if applicable)

Add screenshots for UI changes.
```

### Review Process

1. At least **one maintainer** must approve the PR
2. All **CI checks** must pass
3. Resolve any **review comments**
4. PR will be **squash merged** into `main`

---

## Code Style

### TypeScript

- Use **TypeScript** for all new files
- Define proper types and interfaces
- Avoid `any` type — use proper typing
- Use `interface` for object shapes, `type` for unions/intersections

```typescript
// Good
interface Salon {
	id: string;
	name: string;
	address: string;
	phone?: string;
}

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// Bad
const salon: any = { id: "1", name: "Test" };
```

### React Components (Client)

- Use **functional components** with hooks
- Use **named exports** (not default exports)
- Keep components focused — one component per file
- Use descriptive component and variable names

```tsx
// Good
export function SalonCard({ salon }: SalonCardProps) {
	return <div>{salon.name}</div>;
}

// Bad
export default function ({ salon }) {
	return <div>{salon.name}</div>;
}
```

### Express.js (Server)

- Use **controllers** for route handlers
- Use **services** for business logic
- Use **middleware** for cross-cutting concerns (auth, validation)
- Validate all input with **Zod** before processing

```
server/
├── routes/          # Route definitions
├── controllers/     # Request/response handlers
├── services/        # Business logic
├── middleware/       # Auth, validation, error handling
└── lib/             # Prisma client, utilities
```

### API Response Format

Return **consistent response format** from all endpoints:

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

Use proper **HTTP status codes**:

| Code  | Meaning               |
| ----- | --------------------- |
| `200` | OK                    |
| `201` | Created               |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `500` | Internal Server Error |

### Prisma (Server)

- Use **meaningful model names** (PascalCase)
- Add **proper relations** with clear field names
- Use **UUID** for primary keys
- Add **timestamps** (`createdAt`, `updatedAt`) on all models

### Tailwind CSS (Client)

- Use **utility classes** over custom CSS
- Follow the existing **color palette**
- Use **responsive design** (mobile-first)
- Keep class names **organized**:

```tsx
// Good — grouped logically
<div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">

// Bad — random order
<div className="p-4 border rounded-lg flex shadow-sm items-center justify-between">
```

---

## Project Structure

```
salon-management-and-booking-system/
│
├── salon-web/                      # Next.js frontend
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   ├── components/             # Shared components (ui/, layout, shared)
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── features/               # Feature-based modules
│   │   │   ├── landing/
│   │   │   │   ├── components/     # Landing-specific components
│   │   │   │   ├── api/            # Landing API calls (if needed)
│   │   │   │   ├── hooks/          # Landing-specific hooks (if needed)
│   │   │   │   └── index.ts        # Feature barrel export
│   │   │   ├── booking/
│   │   │   │   ├── components/
│   │   │   │   ├── api/
│   │   │   │   ├── hooks/
│   │   │   │   └── index.ts
│   │   │   └── salon/
│   │   │       ├── components/
│   │   │       ├── api/
│   │   │       ├── hooks/
│   │   │       └── index.ts
│   │   ├── lib/                    # API client, utilities
│   │   └── types/                  # TypeScript type definitions
│   ├── .env.example
│   ├── tailwind.config.ts
│   └── package.json
│
├── server/                         # Express.js backend
│   ├── src/
│   │   ├── routes/                 # API route definitions
│   │   ├── controllers/            # Request/response handlers
│   │   ├── services/               # Business logic
│   │   ├── middleware/              # Auth, validation, errors
│   │   ├── lib/                    # Prisma client, utilities
│   │   └── types/                  # TypeScript type definitions
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── seed.ts                 # Seed data
│   │   └── migrations/             # Auto-generated migrations
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

### Feature Module Convention

Each feature lives in `src/features/<feature-name>/` with this structure:

```
features/
└── <feature-name>/
    ├── components/     # Feature-specific React components
    ├── api/            # API client functions for this feature
    ├── hooks/          # Feature-specific custom hooks
    └── index.ts        # Barrel export for clean imports
```

**Usage:**
```typescript
// Import from feature barrel
import { Hero, Navbar } from "@/features/landing";

// Import specific component (less common)
import { Hero } from "@/features/landing/components/hero";
```

**Rule of thumb:**
- `src/components/` → shared, layout, shadcn/ui
- `src/features/` → feature-specific code (components, api, hooks)

### File Naming

| Type          | Convention                | Example               |
| ------------- | ------------------------- | --------------------- |
| **Client**    |                           |                       |
| Components    | `PascalCase.tsx`          | `SalonCard.tsx`       |
| Pages         | `page.tsx` (Next.js)      | `page.tsx`            |
| API client    | `camelCase.ts`            | `salonApi.ts`         |
| **Server**    |                           |                       |
| Routes        | `camelCase.routes.ts`     | `salon.routes.ts`     |
| Controllers   | `camelCase.controller.ts` | `salon.controller.ts` |
| Services      | `camelCase.service.ts`    | `salon.service.ts`    |
| Middleware    | `camelCase.middleware.ts` | `auth.middleware.ts`  |
| Prisma schema | `schema.prisma`           | `schema.prisma`       |

---

## Reporting Issues

### Bug Reports

Include:

- **Description** of the bug
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Component** — client or server?
- **Screenshots** (if applicable)
- **Environment** (OS, browser, Node version)

### Feature Requests

Include:

- **Description** of the feature
- **Use case** — why is this needed?
- **Proposed solution** (if any)
- **Alternatives considered**

---
