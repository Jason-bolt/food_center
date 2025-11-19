# Food Center - Modern Food Discovery Platform

A modern web platform featuring beautiful liquid glass UI components, advanced search and filtering capabilities, food video integration, and a comprehensive food discovery experience.

## 🌍 About

Food Center is a modern food discovery platform built with React and TypeScript, featuring stunning liquid glass UI components, advanced filtering capabilities, and integrated food video content. The platform showcases diverse cuisines from around the world with an emphasis on beautiful, interactive user experiences, including video content from food creators and influencers.

## ✨ Features

### 🎨 Liquid Glass UI Components

- **Glassmorphism Design**: Beautiful semi-transparent components with backdrop blur effects
- **Animated Shimmer Effects**: Subtle liquid glass animations that enhance user experience
- **Interactive Modals**: Search, country, region, and creator selection modals with stunning visual effects
- **Video Player Modal**: Full-screen YouTube video player with glassmorphism styling
- **Responsive Design**: Optimized for all screen sizes with smooth transitions

### 🔍 Advanced Search & Filtering

- **Smart Search**: Real-time search functionality with beautiful glass modal interface
- **Country Selection**: Choose from 18+ countries with interactive selection modal
- **Regional Filtering**: Filter by 10+ global regions with visual selection interface
- **Creator Filtering**: Filter food videos by specific creators/influencers
- **URL-based State**: Search and filter parameters synced with URL query strings
- **Dynamic State Management**: Seamless data flow using React Context API

### 🍽️ Food Discovery

- **Grid Layout**: Clean responsive grid displaying food items with rounded borders
- **Interactive Cards**: Hover effects and smooth transitions on food items
- **Food Detail Pages**: Comprehensive single food pages with cultural stories and ingredients
- **Pagination**: Navigate through paginated food listings
- **Responsive Grid**: Adapts to different screen sizes automatically

### 🎥 Food Video Integration

- **Video Gallery**: Browse food videos from various creators and influencers
- **Video Cards**: Interactive video cards with GSAP hover animations and scale effects
- **YouTube Integration**: Embedded YouTube video player with full-screen modal
- **Creator Information**: Display creator names and video publication dates
- **Video Filtering**: Filter videos by specific creators
- **Smooth Animations**: Staggered card animations on page load

### 🎯 User Experience

- **GSAP Animations**: Smooth ingredient dropping animations, brand name effects, and card transitions
- **Observer Plugin**: Advanced hover interactions using GSAP Observer
- **State Synchronization**: Real-time updates between search/filter components
- **Visual Feedback**: Selected values displayed with glassmorphism styling
- **Intuitive Navigation**: Clean navbar with dynamic button text updates
- **Loading States**: Elegant loading indicators for async operations
- **Error Handling**: 404 page for invalid routes and missing content

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API server (see Environment Variables section)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd food_center
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
VITE_SERVER_BASE_URL=http://localhost:3000/api
```

Replace `http://localhost:3000/api` with your backend API base URL.

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

- `VITE_SERVER_BASE_URL`: Base URL for the backend API (required)

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 with custom glassmorphism effects
- **Animations**: GSAP (GreenSock) with Observer plugin for advanced interactions
- **State Management**: React Context API (FoodSectionProvider, InitialLoadProvider)
- **Icons**: Lucide React for modern iconography
- **Video Integration**: YouTube iframe API
- **Development**: ESLint for code quality

## 📱 User Experience

1. **Home Page**: Animated ingredient dropping effects with colorful brand name and GSAP animations
2. **Search & Filter**: Click search button to open beautiful liquid glass modal, filter by country and region
3. **Browse Foods**: View food collection in responsive grid layout with pagination
4. **Food Details**: Navigate to individual food pages to see cultural stories, ingredients, and descriptions
5. **Watch Videos**: Explore food videos from creators, filter by creator, and watch in full-screen modal
6. **Interact**: Enjoy smooth hover effects, transitions, and GSAP-powered animations throughout

## 🗺️ Routes

- `/` - Home page with food listings, search, and filters
- `/foods/:id` - Single food detail page with cultural information
- `/foods/:id/videos` - Food videos page with creator filtering
- `*` - 404 Not Found page for invalid routes

## 🔌 API Endpoints

The application expects the following backend API endpoints:

- `GET /foods` - Get paginated list of foods (supports query parameters: `search`, `country`, `region`, `page`)
- `GET /foods/:id` - Get single food details by ID
- `GET /foods/:id/influencers` - Get food videos/influencers for a specific food

All endpoints should return JSON responses matching the TypeScript interfaces defined in `src/types/`.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── RootLayout.tsx       # Main layout wrapper
│   ├── loadings/
│   │   └── SingleFoodLoading.tsx # Loading components
│   ├── CountryRegionFilter.tsx   # Country/region filter modal
│   ├── FoodCard.tsx              # Individual food card
│   ├── FoodCardSection.tsx       # Food cards grid section
│   ├── FoodVideoCard.tsx         # Video card with GSAP animations
│   ├── FoodVideoPlayer.tsx       # YouTube video player modal
│   ├── Navbar.tsx                # Navigation with search/filter modals
│   ├── Pagination.tsx            # Pagination component
│   └── PopUpModal.tsx            # Reusable popup modal
├── contexts/
│   ├── FoodSectionContext.ts     # Context for food section ref
│   ├── FoodSectionProvider.tsx   # Provider for food section
│   ├── InitialLoadContext.ts     # Context for initial load state
│   └── InitialLoadProvider.tsx   # Provider for initial load
├── pages/
│   ├── FoodVideos.tsx            # Food videos page
│   ├── Home.tsx                  # Home page with listings
│   ├── NotFound.tsx                # 404 page
│   └── SingleFood.tsx           # Single food detail page
├── types/
│   ├── food.ts                   # Food and video type definitions
│   ├── general.ts                # General type definitions
│   └── homeScreen.ts             # Home screen types
├── utils/
│   ├── constants.ts              # App constants
│   ├── helpers/
│   │   └── general.ts            # Helper functions
│   └── mocks/
│       └── foods.ts              # Mock data
└── assets/
    ├── ingredients/              # Food ingredient SVGs
    └── utensils/                # Utensil SVGs
```

## 🌟 Vision

Food Center aims to:

- Create beautiful, modern food discovery experiences
- Showcase diverse cuisines from around the world
- Provide intuitive search and filtering capabilities
- Integrate video content from food creators and influencers
- Demonstrate modern UI/UX patterns with glassmorphism design
- Build a comprehensive platform connecting food enthusiasts with cultural culinary content

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## 🤝 Contributing

We welcome contributions from food enthusiasts, developers, and anyone passionate about global cuisine. Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Building beautiful food discovery experiences with modern UI/UX design._
