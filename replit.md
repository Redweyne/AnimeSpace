# AnimeMoments - Share Your Passion

## Overview
AnimeMoments is a community-driven web application where anime fans can discover, share, and celebrate epic anime moments. Users can post their favorite scenes, rate them, and engage with other fans through comments and likes.

## Recent Changes (November 14, 2024)
- **Project Import**: Successfully imported and configured Base44 application for Replit environment
- **Infrastructure Setup**: Created complete Vite + React setup with proper configuration
- **Frontend Configuration**: Set up dev server on port 5000 with proper Replit proxy support
- **Mock Backend**: Implemented Base44 client mock with localStorage-based data persistence
- **Sample Data**: Pre-loaded 3 sample anime moments (One Piece, Jujutsu Kaisen, Demon Slayer)
- **UI Components**: Added all required Shadcn-style components (Button, Input, Card, Textarea, etc.)

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query) v5
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.5
- **Icons**: Lucide React

### Directory Structure
```
/
├── src/
│   ├── pages/           # Page components (Feed, CreateMoment, MomentDetail)
│   ├── components/
│   │   ├── anime/       # Anime-specific components (MomentCard, FeaturedMoment)
│   │   └── ui/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── api/
│   │   └── base44Client.js  # Mock backend client with localStorage
│   ├── lib/             # Utility functions
│   ├── Layout.jsx       # Main layout with navigation
│   ├── App.jsx          # App routing configuration
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── backup/              # Original imported files backup
├── Components/          # Original component files (legacy)
├── Pages/               # Original page files (legacy)
├── Entities/            # JSON schemas for AnimeMoment and Comment
└── index.html           # HTML entry point
```

### Key Features
1. **Feed Page**: Browse and search anime moments with filtering (Latest/Most Popular)
2. **Create Moment**: Form to add new anime moments with title, anime name, episode, description, image URL, and tags
3. **Moment Detail**: View individual moments with comments and like functionality
4. **Authentication**: Simple mock auth system with demo user
5. **Responsive Design**: Works on mobile, tablet, and desktop

### Data Model

#### AnimeMoment Entity
- title: string (required)
- anime_name: string (required)
- episode: string
- description: string (required)
- image_url: string
- likes: array of user emails
- tags: array of strings
- created_date: ISO timestamp

#### Comment Entity
- moment_id: string
- user_email: string
- content: string
- created_date: ISO timestamp

### Configuration
- **Dev Server**: Runs on 0.0.0.0:5000 (Replit webview compatible)
- **HMR**: Configured for Replit proxy environment
- **Path Aliases**: `@/` maps to `./src/`
- **Allowed Hosts**: Set to `true` for Replit iframe proxy compatibility

## Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 5000
npm run build        # Build for production
```

## Notes
- The Base44 client is mocked using localStorage for demo purposes
- In a real Base44 deployment, this would connect to Replit's Base44 backend service
- Sample data is automatically loaded on first run
- Authentication uses a simple mock system (click "Sign In" to become demo user)

## User Preferences
- None specified yet

## Future Improvements
- Connect to real Base44 backend service
- Image upload functionality
- User profiles
- Advanced search and filtering
- Notifications system
- Social sharing features
