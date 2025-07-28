# 🎧 PodcastHub - Professional Podcast Discovery Platform

A modern, feature-rich React application for discovering, listening to, and managing your favorite podcasts. Built with cutting-edge web technologies and designed for an exceptional user experience.

## 🚀 Live Demo

**🌐 Deployed Application**: [https://podcasthub.vercel.app](https://podcasthub.vercel.app)

## 🎯 Project Overview

PodcastHub is a comprehensive podcast discovery platform that combines intuitive browsing with powerful audio playback capabilities. Users can explore podcasts, track listening progress, manage favorites, and enjoy a seamless audio experience across all devices.

## ✨ Core Features

### 🔊 **Global Audio Player**

- **Persistent Playback** - Audio continues playing while navigating between pages
- **Progress Tracking** - Automatic saving of listening position every 5 seconds
- **Resume Functionality** - Pick up where you left off on any episode
- **Visual Progress** - Real-time progress bar and completion percentage
- **Smart Controls** - Play, pause, seek, and volume controls
- **Episode Information** - Current episode title and show details

### 📊 **Listening Progress System**

- **Per-Episode Tracking** - Individual progress for each episode
- **Completion Detection** - Episodes marked as complete at 90% progress
- **Progress Indicators** - Visual progress bars on episode listings
- **Statistics Dashboard** - Track total listening time and completion rates
- **Resume Playback** - Automatically resume from last position
- **Progress Reset** - Option to reset listening history

### ❤️ **Advanced Favorites Management**

- **One-Click Favoriting** - Easy heart button to save episodes
- **Persistent Storage** - Favorites saved in localStorage across sessions
- **Organized Display** - Favorites grouped by show with metadata
- **Sorting Options** - Sort by title (A-Z, Z-A) or date added (newest/oldest)
- **Rich Metadata** - Show title, season info, and date added
- **Visual Feedback** - Clear indication of favorited items

### 🎠 **Recommended Shows Carousel**

- **Horizontal Scrolling** - Smooth carousel with navigation arrows
- **Show Previews** - High-quality images with titles and genre tags
- **Interactive Navigation** - Click to view show details
- **Responsive Design** - Adapts to different screen sizes
- **Smooth Animations** - CSS transitions for professional feel

### 🌗 **Theme System**

- **Light/Dark Mode** - Toggle between themes with smooth transitions
- **Persistent Preference** - Theme choice saved in localStorage
- **Comprehensive Theming** - All components respond to theme changes
- **Smooth Transitions** - 0.3s ease transitions for all theme changes
- **Visual Indicators** - Sun/moon icons with rotation animations

### 🔍 **Advanced Search & Filtering**

- **Real-time Search** - Instant results as you type
- **Genre Filtering** - Filter by podcast categories
- **Smart Sorting** - Multiple sorting options (newest, A-Z, popularity)
- **State Preservation** - Filters maintained across navigation
- **Integrated Experience** - All features work together seamlessly

### 📱 **Responsive Design**

- **Mobile-First** - Optimized for all device sizes
- **Touch-Friendly** - Large touch targets and smooth interactions
- **Progressive Enhancement** - Works on all modern browsers
- **Accessibility** - ARIA labels and keyboard navigation support

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.2.0 with Hooks
- **Routing**: React Router DOM 7.7.0
- **Build Tool**: Vite 7.0.6 for fast development and optimized builds
- **Styling**: CSS3 with CSS Variables for theming
- **State Management**: React Context API + Custom Hooks
- **Storage**: localStorage for persistence
- **Date Handling**: date-fns 2.30.0
- **Deployment**: Vercel with custom domain support

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- Modern web browser with ES6+ support

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd podcast-discovery-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment Guide

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

3. **Custom Domain Setup**
   - Go to your Vercel dashboard
   - Select your project
   - Navigate to Settings → Domains
   - Add your custom domain

### Manual Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder** to your hosting provider

3. **Configure SPA routing** - Ensure your server redirects all routes to `index.html`

### Environment Configuration

The app works out of the box with no environment variables required. It uses:

- **API**: `https://podcast-api.netlify.app/` (public API)
- **Storage**: Browser localStorage
- **Assets**: Bundled with the application

## 🏗️ Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── ErrorBoundary.jsx   # Error handling wrapper
│   ├── FavouriteButton.jsx # Heart button for favorites
│   ├── Header.jsx          # App header with navigation
│   ├── LoadingSpinner.jsx  # Loading state component
│   ├── Modal.jsx           # Modal dialog component
│   ├── Pagination.jsx      # Page navigation controls
│   ├── PodcastCard.jsx     # Individual podcast cards
│   ├── PodcastGrid.jsx     # Grid layout for podcasts
│   ├── ProgressIndicator.jsx # Episode progress visualization
│   ├── RecommendedCarousel.jsx # Homepage carousel
│   ├── Search.jsx          # Search input component
│   └── Filters.jsx         # Genre and sort controls
├── contexts/               # React Context providers
│   ├── AudioPlayerContext.jsx # Global audio state
│   └── ThemeContext.jsx    # Theme management
├── hooks/                  # Custom React hooks
│   ├── useFavourites.js    # Favorites management
│   └── useListeningProgress.js # Progress tracking
├── data/                   # Static data files
│   └── genres.js           # Genre mapping data
├── utils/                  # Utility functions
│   └── imageProxy.js       # Image handling utilities
├── HomePage.jsx            # Main landing page
├── ShowDetailPage.jsx      # Individual show details
├── FavouritesPage.jsx      # Favorites management page
└── App.jsx                 # Root application component
```

## 🎨 Key Implementation Details

### Audio Player System

- **Global State Management** - AudioPlayerContext manages playback across components
- **Progress Persistence** - Automatic saving every 5 seconds during playback
- **Resume Functionality** - Picks up from last saved position
- **Visual Feedback** - Real-time progress bars and completion indicators

### Theme System

- **CSS Variables** - Dynamic theme switching with CSS custom properties
- **Smooth Transitions** - 0.3s ease transitions for all theme changes
- **Persistent Storage** - Theme preference saved in localStorage
- **Component Integration** - All components respond to theme changes

### Favorites Management

- **localStorage Persistence** - Favorites survive browser sessions
- **Rich Metadata** - Stores episode, show, and timestamp information
- **Sorting & Filtering** - Multiple organization options
- **Visual Indicators** - Clear feedback for favorited items

### Error Handling

- **Error Boundaries** - Graceful error recovery with user-friendly messages
- **API Error Handling** - Robust error states for network issues
- **Development Tools** - Detailed error information in development mode

## 🔧 Performance Optimizations

- **Code Splitting** - Automatic route-based code splitting with Vite
- **Image Optimization** - Lazy loading and responsive images
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategy** - Efficient asset caching with Vercel
- **Memory Management** - Proper cleanup of intervals and event listeners

## 🎯 Production Features

✅ **Professional UI/UX** - Polished design with smooth animations
✅ **Full Audio Integration** - Complete playback system with progress tracking
✅ **Persistent Data** - Favorites and progress saved across sessions
✅ **Theme Support** - Light/dark mode with smooth transitions
✅ **Error Boundaries** - Graceful error handling and recovery
✅ **SEO Optimized** - Rich meta tags and social media previews
✅ **Mobile Responsive** - Optimized for all device sizes
✅ **Accessibility** - ARIA labels and keyboard navigation
✅ **Performance** - Optimized bundle size and loading times

## 🚀 Deployment Status

- **✅ Production Build** - Optimized and ready for deployment
- **✅ Vercel Configuration** - SPA routing and caching configured
- **✅ Custom Favicon** - Professional branding assets
- **✅ Meta Tags** - Rich social media previews
- **✅ Error Handling** - Production-ready error boundaries
- **✅ Performance** - Lighthouse-optimized build

## 📊 Bundle Analysis

- **HTML**: 3.15 kB (gzipped: 0.91 kB)
- **CSS**: 9.76 kB (gzipped: 2.32 kB)
- **JavaScript**: 211.68 kB (gzipped: 68.99 kB)
- **Total**: ~225 kB (gzipped: ~72 kB)

## 📝 API Integration

**Primary API**: `https://podcast-api.netlify.app/`

- Show listings and metadata
- Episode information and descriptions
- Genre classifications

**Audio Placeholder**: Demo audio files for testing playback functionality

## 🎉 Project Completion

This podcast discovery platform is **production-ready** with all core features implemented:

- ✅ Global audio player with progress tracking
- ✅ Favorites system with persistent storage
- ✅ Recommended shows carousel
- ✅ Light/dark theme toggle
- ✅ Robust error handling
- ✅ Professional deployment configuration
- ✅ Comprehensive documentation

Ready for deployment to Vercel or any modern hosting platform!
