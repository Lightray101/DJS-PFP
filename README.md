# Podcast Discovery App

A modern, responsive React application for browsing and discovering podcasts with advanced filtering, sorting, and search capabilities.

## 🎯 Project Overview

This application provides an intuitive interface for exploring a curated collection of podcasts. Users can dynamically search, sort, filter, and paginate through podcast shows while maintaining a consistent, seamless experience throughout navigation.

## ✨ Key Features

### 🔍 **Search Functionality**

- **Real-time search** that matches any part of the podcast title
- **Dynamic results** that update as you type
- **Integrated filtering** - search works seamlessly with current filters, sorts, and pagination
- **No state reset** - search results maintain all other UI selections

### 📊 **Advanced Sorting Options**

- **Newest First** - Sort by last updated date (most recent first)
- **Title A-Z** - Alphabetical sorting ascending
- **Title Z-A** - Alphabetical sorting descending
- **Most Popular** - Sort by number of seasons
- **State synchronization** - sorting works with all other filters and search

### 🎭 **Genre Filtering**

- **Multi-genre support** with proper genre mapping
- **Dropdown selection** for easy filtering
- **Persistent filters** - selections maintained across pagination
- **Integrated with search** - filters work alongside search terms

### 📄 **Smart Pagination**

- **Configurable page size** (12 items per page)
- **Intelligent navigation** with ellipsis for large page counts
- **Smooth scrolling** to top when changing pages
- **State preservation** - all filters and search maintained across pages
- **Responsive design** - works on all screen sizes

### 🔄 **State Synchronization**

- **Centralized state management** using React hooks
- **Immediate UI updates** - all controls reflect changes instantly
- **Consistent experience** - no lost selections during navigation
- **Clean architecture** - modular, reusable components

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd podcast-discovery-app
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
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Search.jsx      # Search functionality
│   ├── Filters.jsx     # Genre and sort controls
│   ├── PodcastGrid.jsx # Main podcast display
│   ├── PodcastCard.jsx # Individual podcast cards
│   ├── Pagination.jsx  # Page navigation
│   ├── Modal.jsx       # Podcast detail modal
│   ├── Header.jsx      # Application header
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
├── data/
│   ├── genres.js       # Genre mapping data
│   └── podcasts.js     # Podcast data (if needed)
├── utils/
│   └── imageProxy.js   # Image handling utilities
└── App.jsx             # Main application component
```

## 🎨 Features in Detail

### Search Implementation

- **Debounced input** for optimal performance
- **Case-insensitive matching** for better user experience
- **Real-time filtering** without page reloads
- **Accessibility support** with proper ARIA labels

### Sorting Logic

- **Multiple sort criteria** with clear, descriptive labels
- **Stable sorting** - consistent results across page changes
- **Performance optimized** - efficient sorting algorithms
- **User-friendly options** - intuitive sort descriptions

### Filtering System

- **Genre-based filtering** using comprehensive genre mapping
- **Multi-select capability** (extensible for future features)
- **Visual feedback** - clear indication of active filters
- **Reset functionality** - easy to clear all filters

### Pagination Features

- **Smart page calculation** based on filtered results
- **Ellipsis navigation** for large page counts
- **Keyboard accessible** - full keyboard navigation support
- **Mobile responsive** - touch-friendly on all devices

## 🔧 Technical Implementation

### State Management

- **React hooks** for local state management
- **Centralized filtering logic** in main App component
- **Efficient re-rendering** with proper dependency arrays
- **Clean separation** of concerns between components

### Performance Optimizations

- **Lazy loading** for images
- **Debounced search** to prevent excessive API calls
- **Memoized calculations** for filtered results
- **Efficient pagination** with slice operations

### Accessibility Features

- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** for modal interactions

## 🎯 Success Criteria Met

✅ **No console errors** or broken UI on load  
✅ **All features work correctly** and together without losing state  
✅ **Clean, maintainable codebase** with comprehensive documentation  
✅ **Polished user experience** with responsive layout and real-time updates  
✅ **JSDoc documentation** for all major functions and modules  
✅ **Consistent formatting** and naming conventions  
✅ **Modular, reusable components**

## 🚀 Future Enhancements

- **Advanced search** with multiple criteria
- **Favorite/bookmark** functionality
- **User preferences** storage
- **Dark mode** theme
- **Podcast recommendations** based on listening history
- **Social sharing** features
- **Offline support** with service workers

## 📝 API Integration

The application fetches podcast data from:

```
https://podcast-api.netlify.app/
```

Genre mapping is handled locally using the comprehensive genre data provided in `src/data/genres.js`.
