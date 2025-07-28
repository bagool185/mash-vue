# MASH Game

A fun Vue.js implementation of the classic MASH (Mansion, Apartment, Shack, House) fortune-telling game.

## Features

- Interactive step-by-step input for homes, spouses, jobs, and number of kids
- Tutorial popup explaining how to play
- Magic number elimination algorithm
- Responsive design with dark theme
- Built with Vue 3 and Vite

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## GitHub Pages Deployment

### Automatic Deployment
1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Enable GitHub Pages in repository settings (Source: GitHub Actions)

### Manual Deployment
```bash
# Build for production
NODE_ENV=production npm run build

# Deploy to gh-pages branch (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

The app will be available at: `https://bagool185.github.io/mash-vue/`
