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

## Folllow up questions

### What additional features or improvements could be added to enhance the game experience?

- multiplayer mode: multiple players could fill in the sections at the same time and compare results, or get mixed results depending on the other players' choices

- saving game history

### How could AI be leveraged to make the game more engaging or personalized?

- smart auto complete / auto suggestions
- contextual suggestions based on the user's other suggestions
- generate more complex narratives based on the choices

### What infrastructure would be required to support AI-enhanced functionality?

- backend API with rate limiting and load balancing capabilities
- CDN and analytics
- designated AI services with fit-for-purpose infrastructure that allows for more bandwidth and bigger storage than a regular web API
- caching layer

### How would you ensure that any AI-generated content or recommendations are accurate and appropriate?

- content filtering that would detect and filter out inappropriate text
    - these can also be flagged by users via a report system
- auditing of the AI generated suggestions
- keep AI model up-to-date with the latest regulations and guidelines

