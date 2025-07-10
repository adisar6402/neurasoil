# NeuraSoil - AI-Powered Soil Prediction System

## Overview

NeuraSoil is an offline-first, edge-AI system designed for the Africa Deep Tech Challenge 2025. It uses simulated sensors and lightweight machine learning models to help rural African farmers predict underground water movement, soil health, and crop suitability. The system is built with a focus on offline capability and low resource consumption to work effectively in rural environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 2025)

✅ **Enhanced User Experience & Structure** (July 10, 2025):
- **Reorganized codebase** into clear folder structure:
  - `/backend` → API routes, data storage, prediction endpoints  
  - `/frontend` → React dashboard components
  - `/ml` → Prediction logic (mock model/rules)
  - `/simulator` → Sensor simulation logic
- **Working Quick Action buttons**:
  - View Trends → Opens modal with historical data and charts
  - Export Data → Downloads sensor logs as CSV 
  - Settings → Language toggle, alert preferences, units selection
- **Farmer-friendly improvements**:
  - Larger, easier-to-read fonts throughout interface
  - Enhanced typography with `.farmer-friendly` CSS classes
  - Multi-language support (English, Yoruba, Hausa, Swahili, French)
- **Language Context Provider** for internationalization
- **Enhanced modals** for trends analysis and settings management
- **CSV export functionality** for sensor data

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and hot module replacement
- **UI Library**: Radix UI components with shadcn/ui for consistent, accessible design
- **Styling**: Tailwind CSS with custom color scheme reflecting agricultural themes
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Middleware**: Custom logging and error handling
- **Development**: Hot reload with tsx for server-side development

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Drizzle config)
- **Schema**: Centralized schema definition in shared directory
- **Validation**: Zod schemas for runtime type validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development

## Key Components

### Sensor Simulation System
- **Service**: `SensorService` generates realistic sensor data every 30 seconds
- **Sensors**: Moisture, pH, temperature, and pressure sensors
- **Data Flow**: Simulated readings stored in database with timestamps and status

### Machine Learning Prediction Engine
- **Service**: `MLService` processes sensor data to generate predictions
- **Prediction Types**: 
  - Soil health analysis
  - Underground water movement prediction
  - Crop suitability assessment
- **Implementation**: Rule-based prediction logic (mock ML for resource constraints)

### Alert System
- **Types**: Critical, warning, and info alerts
- **Triggers**: Automated based on sensor readings and predictions
- **Notifications**: Console-based SMS simulation for offline environment

### Dashboard Interface
- **Real-time Data**: Live sensor readings with 30-second refresh
- **Predictions**: AI-generated insights with confidence scores
- **Alerts**: Active alert management with dismiss functionality
- **History**: Historical data visualization and analysis

## Data Flow

1. **Sensor Data Generation**: Simulated sensors generate readings every 30 seconds
2. **Data Storage**: Readings stored in PostgreSQL via Drizzle ORM
3. **Prediction Trigger**: ML service processes latest sensor data
4. **Alert Generation**: System generates alerts based on thresholds and predictions
5. **Dashboard Update**: Frontend polls API endpoints for real-time updates
6. **User Interaction**: Farmers can view data, run predictions, and manage alerts

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, PostCSS, Autoprefixer
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack Query for server state

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, PostgreSQL client (@neondatabase/serverless)
- **Validation**: Zod for schema validation
- **Development**: tsx for hot reload, esbuild for production builds

### Development Tools
- **Replit Integration**: Replit-specific Vite plugins for development
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server for frontend, tsx for backend hot reload
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: NODE_ENV=development with debug logging

### Production Build
- **Frontend**: Vite build to static assets in dist/public
- **Backend**: esbuild bundle to dist/index.js with ESM format
- **Database**: Drizzle push for schema deployment
- **Startup**: Single node process serving both API and static files

### Resource Optimization
- **Memory**: Designed for ≤512MB RAM (Replit Free Tier)
- **Storage**: Local database with minimal storage footprint
- **Network**: Offline-first with no external API dependencies
- **Performance**: Optimized bundle sizes and lazy loading

### Offline Capability
- **Data Persistence**: Local database storage for all data
- **Functionality**: All features work without internet connection
- **Simulation**: Mock external services (SMS notifications via console)
- **Reliability**: Graceful degradation and error handling

The system is designed to be lightweight, modular, and easily extendable while maintaining full offline functionality for deployment in rural African environments.