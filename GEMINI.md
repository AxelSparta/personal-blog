# Axel Sparta Personal Blog - Project Context

This is a personal blog built with Astro 5, featuring a clean, responsive design with dark/light mode support. It uses content collections for blog posts and Tailwind CSS for styling.

## Project Overview

- **Core Framework:** [Astro 5](https://astro.build/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin)
- **UI Integrations:** React 19
- **Content Management:** Astro Content Collections (Markdown files in `src/content/blogs/`)
- **Type Safety:** TypeScript
- **Deployment:** Netlify

## Building and Running

### Prerequisites
- Node.js
- pnpm (lockfile present) or npm/yarn

### Key Commands
- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the local development server at `http://localhost:4321`.
- `pnpm build`: Build the static site for production (output in `dist/`).
- `pnpm preview`: Preview the production build locally.
- `pnpm astro`: Execute Astro CLI commands directly.

## Development Conventions

### Project Structure
- `src/content/blogs/`: Markdown files for blog posts.
- `src/pages/`: File-based routing (e.g., `index.astro`, `blog/[id].astro`).
- `src/layouts/`: Base templates (e.g., `Layout.astro`).
- `src/components/`: Reusable Astro and React components.
- `src/icons/`: SVG icons wrapped in Astro components for easy usage.
- `src/styles/`: Global CSS and Tailwind directives.
- `public/`: Static assets like images and favicons.

### Blog Content Schema
Defined in `src/content/config.ts`. Every blog post must include the following frontmatter:
- `title`: string
- `img`: string (path to image in `/public`)
- `readtime`: number
- `description`: string
- `author`: string
- `date`: Date object

### Styling & UI
- **Tailwind CSS:** Preferred for all styling.
- **Dark Mode:** Implemented using CSS variables and Tailwind classes. Uses `dark:bg-neutral-950` etc.
- **Typography:** Uses `@tailwindcss/typography` for blog post content.
- **Transitions:** Uses `astro:transitions` for smooth navigation.

### Best Practices
- **Prerendering:** Pages use `export const prerender = true;` to ensure static generation where applicable.
- **Responsive Design:** Mobile-first approach using Tailwind's breakpoint prefixes.
- **Components:** Logic and styling should be encapsulated within Astro components unless complex client-side state is required (use React in that case).
