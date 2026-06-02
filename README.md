# Food Center — Client

A React + TypeScript single-page application for Food Center, an African food discovery platform. It lets users browse and search a curated food catalogue, watch creator recipe videos, generate AI-powered recipes from ingredients they have on hand, save recipes into personal collections, plan weekly meals, manage an ingredient pantry, and track cooking streaks with XP gamification.

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Animations | GSAP 3 + @gsap/react |
| Icons | Lucide React |
| PDF | @react-pdf/renderer |
| Markdown | react-markdown |
| Forms | react-hook-form |

---

## Features

### Food Discovery
- Paginated food grid with live search (by name), country, and region filters
- URL-synced query params — shareable filtered links
- Individual food detail pages with cultural story, description, and ingredient list
- Skeleton loading states; 404 page for unknown routes

### Food Videos
- Per-food video gallery from linked influencers/creators
- Filter videos by creator
- GSAP-animated video cards; full-screen YouTube embed modal

### AI Chef
- Enter up to 20 ingredients and get 2–3 streaming AI-generated recipes (Google Gemini 2.5 Flash via SSE)
- Progressive loading bar: `Generating → Parsing → Fetching images → Ready`
- Shimmer skeleton cards while Cloudinary images load
- Each recipe card shows: difficulty, estimated time, regional origin, and a serving-size stepper that scales ingredient quantities in real time
- Filter results by difficulty (Easy / Medium / Hard) and cook time (< 30 min / 30–60 min / 60+ min)
- Ingredient autocomplete with fuzzy-match dropdown (keyboard-navigable)
- "Use my pantry" toggle — pre-fills the input from the saved pantry
- Download any recipe as a PDF
- Save any recipe to a collection (prompts sign-in if not authenticated)
- Generates and saves XP / streak progress after each generation

### User Accounts
- Email + password registration and login (JWT, 7-day session stored in `localStorage`)
- `GuestGuard` redirects authenticated users away from `/login` and `/register`
- Mailgun welcome email on registration

### Saved Recipes & Collections
- Save AI-generated recipes to named personal collections
- `/my-recipes` page:
  - Collections sidebar (desktop) / horizontal chip strip (mobile)
  - Recipe grid filtered by selected collection
  - View full recipe in a modal
  - Move a recipe between collections
  - Delete a recipe or an entire collection
- Saving a recipe awards XP and updates streak in real time (navbar badge refreshes)

### Meal Planner
- `/meal-planner` page — week-at-a-glance calendar
- Week navigation (Previous / Next)
- 7-column grid (desktop) → 2-column (tablet) → stacked (mobile)
- Click a day to add a recipe from the saved recipes picker (searchable)
- Click × to remove a recipe from a day
- Completing all 7 slots awards a weekly +50 XP bonus
- **Generate Shopping List** — deduplicates ingredients from all planned meals into a checklist with individual checkboxes and a Print button

### Ingredient Pantry
- `/pantry` page — add and remove ingredients you regularly have at home
- "Use my pantry" toggle on AI Chef pre-fills the ingredient input from the pantry
- Ingredients organised for easy scanning

### Trending Feed
- Home page `TrendingSection` shows the week's top 10 searched ingredients (sourced from the API's Redis sorted set)
- Top 3 shown as a "Popular combo" with a shortcut button to pre-fill AI Chef
- Remaining 7 shown as clickable chips — each navigates to AI Chef with that ingredient pre-filled

### Streaks & Gamification
- XP awards: **+10** generate · **+20** save · **+50** full week (once per week)
- Daily streak increments on any generate or save action on a new calendar day
- **Streak toast** — bottom-centre notification on login showing current streak count and XP level (auto-dismisses after 4.5 s)
- **Navbar badge** — flame icon + streak count overlaid on the avatar when streak ≥ 2; XP chip in the dropdown
- **`/profile` page** — level progress bar (Novice Cook → Master Chef), 6-stat grid, XP earning guide
- Navbar badge updates in real time after every generate or save event

### Admin Panel
- `/admin` — admin-key protected section for food and influencer CRUD
- Separate `AdminGuard` for auth
- Admin layout with its own navbar

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- The Food Center API running (see `food_center_api/README.md`)

### Installation

```bash
cd food_center_client
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SERVER_BASE_URL=http://localhost:3000/api/v1
```

Point this at wherever your API server is running.

### Running

```bash
# Development server (hot reload)
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

The dev server runs on **http://localhost:5173** by default.

---

## Routes

| Path | Component | Auth |
|---|---|---|
| `/` | Home — food grid, search, filters, trending feed | — |
| `/foods/:id` | Single food — detail, cultural story, ingredients | — |
| `/foods/:id/videos` | Food videos — creator gallery with filter | — |
| `/ai` | AI Chef — ingredient input, recipe cards, PDF | — |
| `/my-recipes` | Saved recipes and collections | Soft (prompts sign-in to save) |
| `/meal-planner` | Weekly meal planner + shopping list | JWT |
| `/pantry` | Ingredient pantry | JWT |
| `/profile` | Stats, streak, XP level | JWT |
| `/login` | Sign in | Guest only |
| `/register` | Sign up | Guest only |
| `/admin` | Admin food/influencer management | Admin key |
| `/admin/login` | Admin sign in | — |
| `*` | 404 Not Found | — |

---

## Project Structure

```
src/
├── App.tsx                         # Router, providers, global StreakToast
├── main.tsx
├── contexts/
│   ├── AuthContext.ts              # AuthUser, UserStats, StreakToast types + context
│   ├── AuthProvider.tsx            # JWT bootstrap, login/register/logout, refreshUser
│   ├── FoodSectionContext.ts
│   ├── FoodSectionProvider.tsx     # Ref shared between Navbar search and food grid
│   ├── InitialLoadContext.ts
│   └── InitialLoadProvider.tsx     # Prevents re-running GSAP intro on navigation
├── components/
│   ├── layout/
│   │   ├── RootLayout.tsx          # Navbar + Outlet + StreakToast mount point
│   │   ├── AIChefLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── loadings/
│   │   └── SingleFoodLoading.tsx
│   ├── admin/
│   │   └── AdminFoodCardSection.tsx
│   ├── Navbar.tsx                  # Search modal, user dropdown (streak/XP), mobile menu
│   ├── FoodCard.tsx
│   ├── FoodCardSection.tsx         # Paginated food grid
│   ├── FoodVideoCard.tsx           # GSAP-animated video card
│   ├── FoodVideoPlayer.tsx         # YouTube embed modal
│   ├── CountryRegionFilter.tsx
│   ├── Pagination.tsx
│   ├── PopUpModal.tsx
│   ├── SaveRecipeModal.tsx         # Pick/create collection, save recipe, calls refreshUser
│   ├── TrendingSection.tsx         # Weekly trending ingredients
│   ├── StreakToast.tsx             # Bottom-centre streak notification
│   ├── RecipePDF.tsx               # @react-pdf/renderer recipe download
│   ├── AdminGuard.tsx
│   └── GuestGuard.tsx
├── pages/
│   ├── Home.tsx
│   ├── SingleFood.tsx
│   ├── FoodVideos.tsx
│   ├── AIChef.tsx                  # Ingredient input, SSE stream, recipe cards
│   ├── MyRecipes.tsx
│   ├── MealPlanner.tsx
│   ├── Pantry.tsx
│   ├── Profile.tsx                 # XP level, stats grid, XP guide
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── NotFound.tsx
│   └── admin/
│       ├── AdminHome.tsx
│       ├── AdminLogin.tsx
│       └── FoodModal.tsx
├── types/
│   ├── food.ts
│   ├── general.ts
│   ├── homeScreen.ts
│   └── influencers.ts
└── utils/
    ├── auth.ts                     # Token helpers
    └── helpers/
        ├── apiCalls.ts             # All fetch wrappers
        └── general.ts
```

---

## State Management

All state is managed with React Context (no external store):

| Context | What it holds |
|---|---|
| `AuthContext` | `user`, `token`, `login`, `register`, `logout`, `loading`, `streakToast`, `clearStreakToast`, `refreshUser` |
| `FoodSectionContext` | Ref to the food grid DOM node (used by Navbar to scroll/animate on search) |
| `InitialLoadContext` | Flag that prevents the GSAP intro from re-running on client-side navigation |
