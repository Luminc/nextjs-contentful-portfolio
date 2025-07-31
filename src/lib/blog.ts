import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { format } from 'date-fns'
import slugify from '@sindresorhus/slugify'

/**
 * BLOG CONTENT MANAGEMENT SYSTEM
 * 
 * This module handles loading and processing of blog posts from an Obsidian vault
 * via git submodule. It provides functionality for:
 * - Loading markdown files with frontmatter
 * - Processing Obsidian-style [[wikilinks]]
 * - Converting markdown to HTML
 * - Generating slugs and metadata
 * - Sorting and filtering posts
 */

// Types for blog content
export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
  content: string
  topics?: string[]
  published?: boolean
  readingTime?: number
  author?: string
}

export interface BlogMatter {
  title?: string
  date?: string
  topics?: string[]
  published?: boolean
  excerpt?: string
  author?: string
}

// Directory where blog content is stored (will be git submodule)
const BLOG_DIRECTORY = path.join(process.cwd(), 'src/content/blog')

/**
 * Get all blog posts from the content directory
 * Filters out unpublished posts in production
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Check if blog directory exists (graceful degradation if submodule not initialized)
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    console.warn('Blog directory not found. Initialize git submodule to enable blog features.')
    return []
  }

  const files = fs.readdirSync(BLOG_DIRECTORY)
  const mdFiles = files.filter(file => file.endsWith('.md'))

  const posts = await Promise.all(
    mdFiles.map(async (filename) => {
      const post = await getPostByFilename(filename)
      return post
    })
  )

  // Filter out null posts and unpublished posts in production
  const validPosts = posts.filter((post): post is BlogPost => {
    if (!post) return false
    if (process.env.NODE_ENV === 'production' && post.published === false) return false
    return true
  })

  // Sort by date (newest first)
  return validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a specific blog post by its slug
 */
export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return null
  }

  const files = fs.readdirSync(BLOG_DIRECTORY)
  const filename = files.find(file => {
    const fileSlug = slugify(file.replace(/\.md$/, ''))
    return fileSlug === slug
  })

  if (!filename) return null

  return await getPostByFilename(filename)
}

/**
 * Load and process a blog post from a markdown file
 */
async function getPostByFilename(filename: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIRECTORY, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContent)
    const frontmatter = data as BlogMatter

    // Generate slug from filename
    const slug = slugify(filename.replace(/\.md$/, ''))

    // Process markdown content
    const processedContent = await processMarkdown(content)

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Use frontmatter title or derive from filename
    const title = frontmatter.title || filename.replace(/\.md$/, '').replace(/-/g, ' ')

    // Use frontmatter date or file modification date
    const date = frontmatter.date || getFileDate(path.join(BLOG_DIRECTORY, filename))

    return {
      slug,
      title,
      date,
      content: processedContent,
      excerpt: frontmatter.excerpt || generateExcerpt(content),
      topics: frontmatter.topics || [],
      published: frontmatter.published !== false, // Default to published
      readingTime,
      author: frontmatter.author || 'Jeroen Kortekaas'
    }
  } catch (error) {
    console.error(`Error processing blog post ${filename}:`, error)
    return null
  }
}

/**
 * Process markdown content with Obsidian-style features
 */
async function processMarkdown(content: string): Promise<string> {
  // Process Obsidian-style [[wikilinks]] (convert to regular links)
  const processedContent = content.replace(
    /\[\[([^\]]+)\]\]/g, 
    (match, linkText) => {
      const slug = slugify(linkText)
      return `[${linkText}](/blog/${slug})`
    }
  )

  // Convert markdown to HTML
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkHtml, { sanitize: false }) // Allow HTML in markdown
    .process(processedContent)

  return result.toString()
}

/**
 * Generate excerpt from content (first paragraph or 160 characters)
 */
function generateExcerpt(content: string): string {
  // Remove frontmatter and get first paragraph
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim()
  const firstParagraph = cleanContent.split('\n\n')[0]
  
  if (firstParagraph.length <= 160) {
    return firstParagraph
  }
  
  return firstParagraph.substring(0, 160).trim() + '...'
}

/**
 * Get file modification date as fallback for posts without date frontmatter
 */
function getFileDate(filePath: string): string {
  const stats = fs.statSync(filePath)
  return format(stats.mtime, 'yyyy-MM-dd')
}

/**
 * Get all unique topics from blog posts
 */
export async function getAllTopics(): Promise<string[]> {
  const posts = await getAllPosts()
  const topicSet = new Set<string>()
  
  posts.forEach(post => {
    post.topics?.forEach(topic => topicSet.add(topic))
  })
  
  return Array.from(topicSet).sort()
}

/**
 * Get posts filtered by topic
 */
export async function getPostsByTopic(topic: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.topics?.includes(topic))
}