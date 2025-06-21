# 🎮 Pokémon Team Builder

> A modern React application for building, managing, and battling with custom Pokémon teams using the PokéAPI.

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-38B2AC.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.5-orange.svg)](https://zustand-demo.pmnd.rs/)
[![Jest](https://img.shields.io/badge/Jest-30.0.2-green.svg)](https://jestjs.io/)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🖼️ Screenshots](#️-screenshots)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing](#-testing)
- [📦 Tech Stack](#-tech-stack)
- [🎨 Architecture](#-architecture)

## 🎯 Overview

Pokémon Team Builder is a comprehensive React application that allows users to create, manage, and battle with custom Pokémon teams. Built with modern web technologies, it features a clean, responsive interface and robust battle simulation system.

The application demonstrates advanced React patterns, state management, API integration, and comprehensive testing practices suitable for production environments.

## ✨ Features

### 🎮 Core Functionality

- [x] **Pokémon Team Creation** - Build teams of up to 6 Pokémon using PokéAPI data
- [x] **Drag & Drop Reordering** - Intuitive team management with visual feedback
- [x] **Team Persistence** - Save, load, and delete custom teams with localStorage
- [x] **Battle Simulation** - Turn-based combat system with realistic Pokémon stats
- [x] **Real-time Animations** - Smooth battle animations and visual effects

### 🔍 Search & Filtering

- [x] **Pokémon Search** - Find Pokémon by name with real-time filtering
- [x] **Type Filtering** - Filter Pokémon by type combinations
- [x] **Infinite Scrolling** - Efficient pagination for large Pokémon lists
- [x] **Debounced Search** - Optimized search performance

### 🎯 Team Management

- [x] **Team Validation** - Ensure teams meet battle requirements
- [x] **Random Team Generation** - Generate random teams for quick battles
- [x] **Team Sorting** - Sort teams by attack stats
- [x] **Team Randomization** - Shuffle team order for variety

### ⚔️ Battle System

- [x] **Turn-based Combat** - Strategic battles based on speed, attack, and defense
- [x] **Battle History** - Track and display battle progression
- [x] **Survivor Calculation** - Determine battle outcomes and survivors
- [x] **Visual Battle Arena** - Immersive battle interface

### Home Screen

_Pokémon selection and team building interface_

### Battle Arena

_Real-time battle simulation with animations_

### Team Management

_Saved teams and team editing interface_

## 🏗️ Project Structure

```
src/
├── app/                    # Main application pages
│   ├── Home.jsx           # Team building interface
│   └── Battle.jsx         # Battle simulation page
├── components/             # Shared UI components
│   ├── ActionButton.jsx   # Reusable action buttons
│   ├── Notification.jsx   # Toast notifications
│   ├── Pokeball.jsx       # Animated Pokéball component
│   └── NotificationProvider.jsx
├── features/              # Feature-based architecture
│   ├── battle/           # Battle system
│   │   ├── components/   # Battle UI components
│   │   ├── hooks/        # Battle-related hooks
│   │   ├── services/     # Battle logic and API calls
│   │   └── __tests__/    # Battle system tests
│   ├── home/             # Home page features
│   │   └── components/   # Home page components
│   ├── pokemon/          # Pokémon data management
│   │   ├── api/          # PokéAPI integration
│   │   ├── components/   # Pokémon UI components
│   │   ├── hooks/        # Pokémon data hooks
│   │   └── __tests__/    # Pokémon feature tests
│   └── team/             # Team management
│       ├── components/   # Team UI components
│       ├── hooks/        # Team action hooks
│       ├── store/        # Zustand state management
│       └── __tests__/    # Team management tests
├── hooks/                # Shared custom hooks
│   ├── useDebounce.js    # Search debouncing
│   └── useInfiniteScroll.js
├── lib/                  # Utility libraries
│   └── queryClient.js    # React Query configuration
└── styles/               # Global styles
    └── index.css         # TailwindCSS imports
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pokemon-team-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run test suite
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

The project follows a comprehensive testing strategy:

- **Unit Tests** - Individual component and hook testing
- **Integration Tests** - Feature workflow testing
- **Mock Testing** - API and external service mocking
- **Accessibility Tests** - Component accessibility validation

### Test Coverage

- **Components** - All major UI components tested
- **Hooks** - Custom hooks with edge case coverage
- **Services** - API integration and business logic
- **Store** - State management and persistence

## 📦 Tech Stack

### Core Technologies

- **React 19.1.0** - Modern React with latest features
- **Vite 6.3.5** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### State Management & Data Fetching

- **Zustand 5.0.5** - Lightweight state management
- **TanStack Query 5.80.7** - Server state management and caching
- **React Router DOM 7.6.2** - Client-side routing

### UI & Styling

- **TailwindCSS 4.1.10** - Utility-first CSS framework
- **Lucide React 0.516.0** - Beautiful icon library
- **React DnD 16.0.1** - Drag and drop functionality

### Testing & Quality

- **Jest 30.0.2** - Testing framework
- **React Testing Library 16.3.0** - Component testing utilities
- **ESLint 9.29.0** - Code linting and formatting

### Development Tools

- **Babel** - JavaScript transpilation
- **TypeScript Types** - Type definitions for better DX

## 🎨 Architecture

### Design Patterns

- **Feature-based Architecture** - Organized by business domains
- **Custom Hooks** - Reusable logic extraction
- **Component Composition** - Flexible and maintainable components
- **Service Layer** - Clean separation of concerns

### State Management

- **Zustand Store** - Global application state
- **React Query** - Server state and caching
- **Local State** - Component-specific state
- **URL State** - Route-based state management

### Performance Optimizations

- **Code Splitting** - Route-based lazy loading
- **Memoization** - React.memo and useMemo usage
- **Debouncing** - Search input optimization
- **Infinite Scrolling** - Efficient data loading
- **Image Optimization** - Lazy loading and caching

### API Integration

- **PokéAPI** - Comprehensive Pokémon data
- **Error Handling** - Graceful error management
- **Loading States** - User feedback during data fetching
- **Caching Strategy** - Optimized data caching

---

## 👨‍💻 Author

Eduardo García
