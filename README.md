<p align="center">
  <a href="https://nextjs.org">
    <img alt="Next.js" src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Next.js Contentful Portfolio
</h1>

## About

This is an artist portfolio website built with **Next.js** and **Contentful**. It leverages the power of the Next.js App Router and Contentful's flexible content modeling to create a dynamic and highly customizable experience.

The core feature is its use of conditional rendering for project pages. Components can be added, removed, and reordered directly from the Contentful CMS. This gives the site owner granular control over page layouts, allowing for more creative freedom without needing to touch the code. This is achieved by using Contentful's reference fields to create composable content models. The front-end inspects the incoming content types and renders the appropriate React components.

In its finished state, every component on the website will be configurable from the CMS, and new pages can be added seamlessly without any front-end code changes.

## 🚀 Getting Started

1.  **Clone the repository.**

    ```shell
    git clone --recurse-submodules https://github.com/luminc/nextjs-contentful-portfolio.git
    cd nextjs-contentful-portfolio
    ```
    
    *Note: The `--recurse-submodules` flag automatically initializes and updates any git submodules (like the blog content).*

2.  **Install dependencies.**

    ```shell
    npm install
    ```

3.  **Set up environment variables.**

    Create a `.env.local` file in the root of your project and add your Contentful credentials. You can copy the example file:

    ```shell
    cp .env.example .env.local
    ```

    Your `.env.local` should look like this:
    ```
    CONTENTFUL_SPACE_ID=your_space_id_here
    CONTENTFUL_ACCESS_TOKEN=your_access_token_here
    ```

4.  **Run the development server.**

    ```shell
    npm run dev
    ```

5.  **Open your browser.**

    Your site is now running at http://localhost:3000!

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking

### TypeScript

This project is built with TypeScript and includes:
- Strict type checking enabled
- Path aliases configured (`@/*` maps to `./src/*`)
- Next.js App Router types
- Contentful type definitions in `src/types/contentful.ts`

## 📝 Blog & Writing Features

This portfolio includes a full-featured blog system:

- **Writing section** at `/writing` with markdown support
- **Git submodule integration** for content management
- **Wikilink support** for Obsidian-style cross-references
- **Automatic backlinks** and topic organization
- **Folder-based content structure**

See `BLOG_SETUP.md` for detailed blog configuration instructions.

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── writing/      # Blog and writing features
│   ├── projects/     # Portfolio projects
│   └── api/         # API routes for Contentful
├── components/       # Reusable React components
├── content/          # Blog content (git submodules)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and API functions
├── scss/            # Sass stylesheets
└── types/           # TypeScript type definitions
```

## 📚 Learn More

- Next.js Documentation - learn about Next.js features and API.
- Learn Next.js - an interactive Next.js tutorial.
- Contentful Documentation - learn about Contentful.

## ▲ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/luminc/nextjs-contentful-portfolio)