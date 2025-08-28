# Web App

This is a React web application for food ordering and delivery services.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. View in browser:
   The application will be available at http://localhost:3000 by default.

## Project Structure

- `src/` - Application source code
  - `app/` - Next.js app directory structure
  - `client-integrations/` - Client-side integrations
  - `utils/` - Utility functions
- `plugins/` - Build plugins
- `public/` - Static assets

## Dependencies

This project uses:
- React
- Next.js
- Tailwind CSS
- Various client integrations (Chakra UI, React Markdown, etc.)

## Development

- The application uses modern React patterns
- Tailwind is used for styling
- API routes are available in the `src/app/api` directory

## Features

### Home Page
- Redesigned UI with consistent color scheme
- "Best Ordered Food Today" featured section
- "Best Food Store of the Week" featured section
- Shop listings with icons and names
- Improved shop details page with enhanced UI

### Shopping Experience
- Seamless add-to-cart functionality with session persistence
- Wishlist for saving favorite items
- Order timing system with:
  - Default time intervals (5-20 minutes)
  - Custom time selection (hour first, then minutes in 5-minute increments)
  - Available times from current time until 10PM
  - Pickup/dine options available only at checkout

### User Profile
- Enhanced profile UI
- Order history with review options
- Wishlist items display

### Food Details
- Redesigned page for better user experience
- Prominent display of all reviews

### Search Functionality
- Toggle between "Food" (default) and "Shop" modes
- Mode-specific search results
- Advanced filters:
  - Location (BH1, BH6, BH4, Apartment, GH1, GH2, GH4, Library, Main Gate)
  - Price range
  - Other relevant filters
- Improved search results UI

## Troubleshooting

If you encounter issues:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for any errors in the console output