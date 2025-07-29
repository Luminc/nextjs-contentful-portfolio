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
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

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
    CONTENTFUL_SPACE_ID=...
    CONTENTFUL_ACCESS_TOKEN=...
    CONTENTFUL_PREVIEW_ACCESS_TOKEN=...
    CONTENTFUL_PREVIEW_SECRET=...
    ```

4.  **Run the development server.**

    ```shell
    npm run dev
    ```

5.  **Open your browser.**

    Your site is now running at http://localhost:3000!

## 📚 Learn More

- Next.js Documentation - learn about Next.js features and API.
- Learn Next.js - an interactive Next.js tutorial.
- Contentful Documentation - learn about Contentful.

## ▲ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

[!Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo-name)