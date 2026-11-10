# Siva Kumar Eekalpa Portfolio

A recruiter-focused React + Vite portfolio for Sivakumar Eekalpa, a Java full stack developer based in Hyderabad. It includes route-aware section navigation, responsive layouts, dark/light mode, Framer Motion transitions, eight project case studies positioned directly after the hero, a scrollable project archive, live GitHub profile data, a professional portrait, and an ATS-friendly Google Drive resume view.

## Run locally

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run lint
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy

### Netlify

1. Push this repository to GitHub.
2. Create a new site in Netlify and select the repository.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.

### Vercel

1. Import the repository into Vercel.
2. Keep the detected framework as Vite.
3. Set the build command to `npm run build` and output directory to `dist`.

The app uses `HashRouter`, so section routes work on static hosting without rewrite configuration.

## Dynamic profile data

- GitHub repositories and profile metadata are fetched at runtime from the public GitHub API in `src/hooks/useGithubRepositories.js`. The UI shows public repository and star counts, leading languages, four recent repositories, detected repository/homepage links, and loading/error states while keeping the featured case studies available.
- The GitHub activity link opens the canonical profile contribution view. GitHub's unauthenticated REST API does not expose a complete contribution history, so the portfolio does not fabricate a contribution total.
- LinkedIn does not expose public profile data to unauthenticated browser requests. LinkedIn profile fields are therefore kept in `src/data.js` as a safe static snapshot with a link to the canonical profile. To synchronize headline, experience, education, or certifications automatically, add a small authenticated serverless endpoint using LinkedIn OAuth and point the frontend at that endpoint. Never put a LinkedIn client secret in Vite client code.
- The supplied passport image is stored at `public/professional-passport-image.jpeg` and is included in production builds.
- The resume is embedded from Google Drive using the provided preview URL, with direct Drive download and open-in-Drive actions.
- The main portfolio page is lazy-loaded by Vite, the resume iframe uses native lazy loading, and motion respects the user's reduced-motion preference.

## Continuous deployment

Connect the GitHub repository to Netlify or Vercel and enable deploys from the default branch. Every push will run the configured `npm run build` command and publish `dist/`. Pull request preview deployments are supported by both providers.

## Content updates

Candidate profile data, skills, education, and journey milestones live in `src/data.js`. Featured case studies and archive entries use the shared project schema in `src/data/projects.js`. Reusable UI lives in `src/components/PortfolioComponents.jsx`; the GitHub integration and active-section observer live in `src/hooks/`. Global layout, design tokens, and responsive styling live in `src/App.css`; the small browser reset lives in `src/index.css`.
