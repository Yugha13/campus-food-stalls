# Web App

This is a React web application.

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

## Troubleshooting

If you encounter issues:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for any errors in the console output