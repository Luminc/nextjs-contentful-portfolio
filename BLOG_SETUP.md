# Blog Integration Setup

This branch includes blog functionality integrated with your Obsidian vault via git submodules.

## 🚀 Quick Start

### 1. Create Your Blog Repository

Create a separate repository for your published blog posts:

```bash
# On your local machine where you have Obsidian
mkdir my-blog-posts
cd my-blog-posts
git init
# Add your published blog posts (markdown files)
git add .
git commit -m "Initial blog posts"
git remote add origin https://github.com/Luminc/blog-posts.git
git push -u origin main
```

### 2. Add as Submodule

In this project directory:

```bash
# Remove the placeholder content
rm -rf src/content/blog

# Add your blog repository as a submodule
git submodule add https://github.com/Luminc/blog-posts.git src/content/blog

# Commit the submodule
git add .gitmodules src/content/blog
git commit -m "Add blog posts submodule"
```

### 3. Deploy Branch Preview

Push this branch to create a live preview:

```bash
git push -u origin feature/blog-integration
```

This will create a Vercel deployment at:
`https://nextjs-contentful-portfolio-git-feature-blog-integration-luminc.vercel.app`

## 📝 Blog Post Format

Your markdown files should include frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-07-30"
excerpt: "Brief description for previews"
tags: ["tag1", "tag2"]
published: true
author: "Your Name"
---

# Your Content Here

Regular markdown content with support for:
- [[Wikilinks]] (converted to internal blog links)
- Code blocks
- Images
- All standard markdown features
```

## 🔄 Publishing Workflow

1. **Write in Obsidian** - Use your normal Obsidian workflow
2. **Copy to blog folder** - Copy finished posts to your blog repository
3. **Commit and push** - `git add . && git commit -m "New post" && git push`
4. **Auto-deploy** - Vercel automatically redeploys the site

## 🛠️ Features

- **Server-side rendering** for excellent SEO
- **Responsive design** matching your portfolio
- **Tag system** for organizing posts  
- **Reading time estimation**
- **Wikilink support** for Obsidian-style linking
- **Code syntax highlighting**
- **Automatic excerpts** if not provided

## 📱 Testing Locally

```bash
npm run dev
# Visit http://localhost:3000/blog
```

## 🔧 Customization

- **Styles**: Edit `src/scss/pages/_blog.scss`
- **Blog logic**: Modify `src/lib/blog.ts`
- **Templates**: Update components in `src/app/blog/`

## 🚀 Going Live

Once you're happy with the blog:

1. **Merge to main**: `git checkout main && git merge feature/blog-integration`
2. **Push**: `git push origin main`
3. **Update domain** (optional): Point your main domain to the Next.js version

---

*Happy blogging! 🎉*