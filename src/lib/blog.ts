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
  // Obsidian vault features
  folderPath?: string
  wikilinks?: string[] // Links this post contains
  backlinks?: string[] // Posts that link to this one
  isDarkIntel?: boolean
}

export interface BlogMatter {
  title?: string
  date?: string
  topics?: string[]
  published?: boolean
  excerpt?: string
  author?: string
}

// Directories where blog content is stored
const BLOG_DIRECTORY = path.join(process.cwd(), 'src/content/blog')
const DARK_INTELLIGIBILITY_DIRECTORY = path.join(process.cwd(), 'src/content/dark-intelligibility')

/**
 * Extract wikilinks from content
 */
function extractWikilinks(content: string): string[] {
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g
  const links: string[] = []
  let match
  
  while ((match = wikilinkRegex.exec(content)) !== null) {
    // Handle pipe links: [[Link|Display Text]] -> Link
    const linkText = match[1].split('|')[0].trim()
    if (!links.includes(linkText)) {
      links.push(linkText)
    }
  }
  
  return links
}

/**
 * Build backlink map for all posts
 */
function buildBacklinkMap(posts: BlogPost[]): Map<string, string[]> {
  const backlinkMap = new Map<string, string[]>()
  
  // Initialize map
  posts.forEach(post => {
    backlinkMap.set(post.title, [])
  })
  
  // Build backlinks
  posts.forEach(post => {
    if (post.wikilinks) {
      post.wikilinks.forEach(linkedTitle => {
        const backlinks = backlinkMap.get(linkedTitle) || []
        if (!backlinks.includes(post.slug)) {
          backlinks.push(post.slug)
          backlinkMap.set(linkedTitle, backlinks)
        }
      })
    }
  })
  
  return backlinkMap
}

/**
 * Recursively get all markdown files from a directory
 */
function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }
  
  const files: string[] = []
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      files.push(...getAllMarkdownFiles(fullPath, baseDir))
    } else if (item.endsWith('.md')) {
      // Store relative path from base directory
      const relativePath = path.relative(baseDir, fullPath)
      files.push(relativePath)
    }
  }
  
  return files
}

/**
 * Get all blog posts from multiple content directories
 * Filters out unpublished posts in production
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const allPosts: BlogPost[] = []
  
  // Get posts from regular blog directory
  if (fs.existsSync(BLOG_DIRECTORY)) {
    const blogFiles = fs.readdirSync(BLOG_DIRECTORY).filter(file => file.endsWith('.md'))
    const blogPosts = await Promise.all(
      blogFiles.map(async (filename) => {
        const post = await getPostByFilename(filename, BLOG_DIRECTORY)
        return post
      })
    )
    allPosts.push(...blogPosts.filter((post): post is BlogPost => post !== null))
  }
  
  // Get posts from dark-intelligibility repository
  if (fs.existsSync(DARK_INTELLIGIBILITY_DIRECTORY)) {
    const darkIntelFiles = getAllMarkdownFiles(DARK_INTELLIGIBILITY_DIRECTORY)
    const darkIntelPosts = await Promise.all(
      darkIntelFiles.map(async (relativePath) => {
        const post = await getPostByFilename(relativePath, DARK_INTELLIGIBILITY_DIRECTORY, true)
        return post
      })
    )
    allPosts.push(...darkIntelPosts.filter((post): post is BlogPost => post !== null))
  }

  // Filter out unpublished posts in production
  const validPosts = allPosts.filter((post): post is BlogPost => {
    if (!post) return false
    if (process.env.NODE_ENV === 'production' && post.published === false) return false
    return true
  })

  // Build backlink relationships
  const backlinkMap = buildBacklinkMap(validPosts)
  validPosts.forEach(post => {
    post.backlinks = backlinkMap.get(post.title) || []
  })

  // Sort by date (newest first)
  return validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a specific blog post by its slug
 */
export async function getPost(slug: string): Promise<BlogPost | null> {
  // First, try regular blog directory
  if (fs.existsSync(BLOG_DIRECTORY)) {
    const files = fs.readdirSync(BLOG_DIRECTORY)
    const filename = files.find(file => {
      const fileSlug = slugify(file.replace(/\.md$/, ''))
      return fileSlug === slug
    })
    
    if (filename) {
      return await getPostByFilename(filename, BLOG_DIRECTORY)
    }
  }
  
  // Then try dark-intelligibility directory
  if (fs.existsSync(DARK_INTELLIGIBILITY_DIRECTORY)) {
    const darkIntelFiles = getAllMarkdownFiles(DARK_INTELLIGIBILITY_DIRECTORY)
    const filename = darkIntelFiles.find(file => {
      const fileSlug = slugify(`dark-intel-${file.replace(/\.md$/, '').replace(/\//g, '-')}`)
      return fileSlug === slug
    })
    
    if (filename) {
      return await getPostByFilename(filename, DARK_INTELLIGIBILITY_DIRECTORY, true)
    }
  }
  
  return null
}

/**
 * Load and process a blog post from a markdown file
 */
async function getPostByFilename(filename: string, baseDir: string, isFromDarkIntel: boolean = false): Promise<BlogPost | null> {
  try {
    const filePath = path.join(baseDir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContent)
    const frontmatter = data as BlogMatter

    // Generate slug from filename (use relative path for dark-intel files to avoid conflicts)
    const slug = isFromDarkIntel 
      ? slugify(`dark-intel-${filename.replace(/\.md$/, '').replace(/\//g, '-')}`)
      : slugify(filename.replace(/\.md$/, ''))

    // Process markdown content (handle Obsidian wikilinks if from dark-intelligibility)
    const processedContent = await processMarkdown(content, isFromDarkIntel)

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Use frontmatter title or derive from filename
    const title = frontmatter.title || path.basename(filename, '.md').replace(/-/g, ' ')

    // Use frontmatter date or file modification date
    const date = frontmatter.date || getFileDate(filePath)

    // Extract wikilinks from content
    const wikilinks = isFromDarkIntel ? extractWikilinks(content) : []
    
    // Get folder path for dark-intel content
    const folderPath = isFromDarkIntel ? path.dirname(filename) : undefined

    return {
      slug,
      title,
      date,
      content: processedContent,
      excerpt: frontmatter.excerpt || generateExcerpt(content),
      topics: frontmatter.topics || (isFromDarkIntel ? ['dark-intelligibility'] : []),
      published: frontmatter.published !== false, // Default to published
      readingTime,
      author: frontmatter.author || 'Jeroen Kortekaas',
      // Obsidian vault features
      folderPath,
      wikilinks,
      backlinks: [], // Will be populated in getAllPosts
      isDarkIntel: isFromDarkIntel
    }
  } catch (error) {
    console.error(`Error processing blog post ${filename}:`, error)
    return null
  }
}

/**
 * Find post slug by title (for wikilink resolution)
 */
async function findPostSlugByTitle(title: string): Promise<string | null> {
  // This is a simplified version - in practice, you'd want to cache this
  // or pass a posts map to avoid re-reading files
  try {
    const allPosts = await getAllPosts()
    const post = allPosts.find(p => p.title.toLowerCase() === title.toLowerCase())
    return post?.slug || null
  } catch {
    return null
  }
}

/**
 * Process markdown content with Obsidian-style features
 */
async function processMarkdown(content: string, isFromDarkIntel: boolean = false): Promise<string> {
  let processedContent = content
  
  if (isFromDarkIntel) {
    // Process Obsidian-style [[wikilinks]] (make them clickable)
    const wikilinkRegex = /\[\[([^\]]+)\]\]/g
    const matches = Array.from(content.matchAll(wikilinkRegex))
    
    for (const match of matches) {
      const fullMatch = match[0]
      const linkText = match[1]
      
      // Handle pipe syntax: [[Title|Display Text]]
      const [title, displayText] = linkText.split('|').map(s => s.trim())
      const finalDisplayText = displayText || title
      
      // Generate slug for dark-intel content
      const linkedSlug = slugify(`dark-intel-${title.toLowerCase().replace(/\s+/g, '-')}`)
      
      // Replace with clickable link
      processedContent = processedContent.replace(
        fullMatch,
        `<a href="/writing/${linkedSlug}" class="wikilink" title="${title}">${finalDisplayText}</a>`
      )
    }
  } else {
    // Process Obsidian-style [[wikilinks]] (convert to regular links)
    processedContent = content.replace(
      /\[\[([^\]]+)\]\]/g, 
      (match, linkText) => {
        const slug = slugify(linkText)
        return `[${linkText}](/writing/${slug})`
      }
    )
  }

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

/**
 * Get folder structure from dark-intelligibility vault
 */
export function getFolderStructure(): { [key: string]: string[] } {
  if (!fs.existsSync(DARK_INTELLIGIBILITY_DIRECTORY)) {
    return {}
  }

  const structure: { [key: string]: string[] } = {}
  const files = getAllMarkdownFiles(DARK_INTELLIGIBILITY_DIRECTORY)
  
  files.forEach(filePath => {
    const folderPath = path.dirname(filePath)
    const fileName = path.basename(filePath, '.md')
    
    if (!structure[folderPath]) {
      structure[folderPath] = []
    }
    structure[folderPath].push(fileName)
  })
  
  return structure
}

/**
 * Get posts from a specific folder
 */
export async function getPostsByFolder(folderPath: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.folderPath === folderPath)
}

/**
 * Get backlinks for a specific post
 */
export async function getBacklinksForPost(slug: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  const targetPost = allPosts.find(p => p.slug === slug)
  
  if (!targetPost || !targetPost.backlinks) {
    return []
  }
  
  return allPosts.filter(p => targetPost.backlinks?.includes(p.slug))
}