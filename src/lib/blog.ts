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
 * - Simple in-memory caching for performance
 */

// Simple in-memory cache
let postsCache: BlogPost[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 300000 : 60000 // 5 min in prod, 1 min in dev

/**
 * Clear the posts cache (useful for development)
 */
export function clearCache() {
  postsCache = null
  cacheTimestamp = 0
}

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
  backlinks?: BacklinkContext[] // Posts that link to this one with context
  isDarkIntel?: boolean
}

export interface BlogMatter {
  title?: string
  date?: string
  topics?: string[]
  tags?: string[] // Support both tags and topics for consistency
  published?: boolean
  excerpt?: string
  author?: string
  aliases?: string[] // Support Obsidian aliases
  category?: string // Support categorization
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

// Types for backlink context
export interface BacklinkContext {
  slug: string
  title: string
  excerpt: string
  context: string // The paragraph or sentence containing the link
  folderPath?: string
  anchorId?: string // For deep linking to specific sections
  lineNumber?: number // For more precise linking
  textFragment?: string // For text fragment highlighting (#:~:text=)
}

/**
 * Clean markdown formatting from text
 */
function cleanMarkdownFormatting(text: string): string {
  return text
    // Remove wikilinks but keep the display text
    .replace(/\[\[([^\]]+?)\|([^\]]+?)\]\]/g, '$2') // [[link|display]] -> display
    .replace(/\[\[([^\]]+?)\]\]/g, '$1') // [[link]] -> link
    // Remove markdown links
    .replace(/\[([^\]]+?)\]\([^)]+?\)/g, '$1') // [text](url) -> text
    // Remove bold/italic
    .replace(/\*\*([^*]+?)\*\*/g, '$1') // **bold** -> bold
    .replace(/\*([^*]+?)\*/g, '$1') // *italic* -> italic
    .replace(/__([^_]+?)__/g, '$1') // __bold__ -> bold
    .replace(/_([^_]+?)_/g, '$1') // _italic_ -> italic  
    // Remove inline code
    .replace(/`([^`]+?)`/g, '$1') // `code` -> code
    // Remove heading markers
    .replace(/^#+\s*/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquote markers
    .replace(/^>\s*/gm, '')
    // Clean up whitespace
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Generate anchor ID from heading text
 */
function generateAnchorId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract rich context around a wikilink for backlink display
 */
function extractLinkContext(content: string, linkTitle: string, postTitle: string): {
  context: string
  anchorId?: string
  lineNumber?: number
  textFragment?: string
} {
  const lines = content.split('\n')
  
  // Find all possible wikilink patterns
  const wikilinkPatterns = [
    new RegExp(`\\[\\[${linkTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\]]*\\]\\]`, 'gi'),
    new RegExp(`\\[\\[([^\\]]+\\|)?${linkTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\]`, 'gi')
  ]
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    
    for (const pattern of wikilinkPatterns) {
      if (pattern.test(line)) {
        // Found the link! Now extract meaningful context
        let context = ''
        let anchorId: string | undefined
        
        // Check if we're in a heading - if so, include it for anchor linking
        if (line.match(/^#+\s/)) {
          const headingMatch = line.match(/^#+\s+(.+)$/)
          if (headingMatch) {
            anchorId = generateAnchorId(headingMatch[1])
            context = cleanMarkdownFormatting(line)
          }
        } else {
          // Extract paragraph context with surrounding sentences
          let contextStart = Math.max(0, lineIndex - 2)
          let contextEnd = Math.min(lines.length - 1, lineIndex + 2)
          
          // Find the paragraph boundaries
          for (let i = lineIndex; i >= 0; i--) {
            if (lines[i].trim() === '') {
              contextStart = i + 1
              break
            }
          }
          
          for (let i = lineIndex; i < lines.length; i++) {
            if (lines[i].trim() === '') {
              contextEnd = i - 1
              break
            }
          }
          
          // Build context from the paragraph
          const contextLines = lines.slice(contextStart, contextEnd + 1)
          const rawContext = contextLines.join(' ').trim()
          
          // Clean and format the context
          context = cleanMarkdownFormatting(rawContext)
          
          // Truncate if too long, but keep the citation visible
          if (context.length > 300) {
            const linkPosition = context.toLowerCase().indexOf(linkTitle.toLowerCase())
            if (linkPosition !== -1) {
              // Keep the citation in the middle of the excerpt
              const beforeLink = Math.max(0, linkPosition - 100)
              const afterLink = Math.min(context.length, linkPosition + linkTitle.length + 100)
              const beforeText = context.slice(beforeLink, linkPosition)
              const afterText = context.slice(linkPosition + linkTitle.length, afterLink)
              
              context = (beforeLink > 0 ? '...' : '') + 
                       beforeText + 
                       linkTitle + 
                       afterText + 
                       (afterLink < context.length ? '...' : '')
            } else {
              // Fallback truncation
              const cutoff = context.lastIndexOf(' ', 300)
              context = context.slice(0, cutoff > 0 ? cutoff : 300) + '...'
            }
          }
          
          // Look for nearby heading for anchor
          for (let i = lineIndex; i >= 0; i--) {
            const headingMatch = lines[i].match(/^#+\s+(.+)$/)
            if (headingMatch) {
              anchorId = generateAnchorId(headingMatch[1])
              break
            }
          }
        }
        
        // Generate text fragment for highlighting - use a portion of the context for better matching
        const textFragment = context.substring(0, 50).trim()
        
        return {
          context,
          anchorId,
          lineNumber: lineIndex + 1,
          textFragment
        }
      }
    }
  }
  
  return {
    context: `Referenced in ${postTitle}`,
    lineNumber: 1,
    textFragment: `Referenced in ${postTitle}`
  }
}

/**
 * Build backlink map with context for all posts
 */
function buildBacklinkMap(posts: BlogPost[]): Map<string, BacklinkContext[]> {
  const backlinkMap = new Map<string, BacklinkContext[]>()
  
  // Initialize map
  posts.forEach(post => {
    backlinkMap.set(post.title, [])
  })
  
  // Build backlinks with context
  posts.forEach(post => {
    if (post.wikilinks) {
      post.wikilinks.forEach(linkedTitle => {
        const backlinks = backlinkMap.get(linkedTitle) || []
        
        // Check if this post is already in backlinks
        if (!backlinks.find(bl => bl.slug === post.slug)) {
          let contextData: {
            context: string
            anchorId?: string
            lineNumber?: number
            textFragment?: string
          } = {
            context: `Referenced in ${post.title}`,
            anchorId: undefined,
            lineNumber: 1,
            textFragment: `Referenced in ${post.title}`
          }
          
          try {
            // Read the original markdown file to extract precise context
            let filePath: string
            if (post.isDarkIntel && post.folderPath) {
              // For dark-intel files, use folder path and title to construct path
              filePath = path.join(DARK_INTELLIGIBILITY_DIRECTORY, post.folderPath, `${post.title}.md`)
            } else {
              // For regular blog files
              filePath = path.join(BLOG_DIRECTORY, `${post.slug}.md`)
            }
            
            if (fs.existsSync(filePath)) {
              const rawContent = fs.readFileSync(filePath, 'utf-8')
              const { content } = matter(rawContent)
              contextData = extractLinkContext(content, linkedTitle, post.title)
            }
          } catch (error) {
            console.warn(`Could not extract context for ${post.title} -> ${linkedTitle}:`, error)
          }
          
          backlinks.push({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || '',
            context: contextData.context,
            folderPath: post.folderPath,
            anchorId: contextData.anchorId,
            lineNumber: contextData.lineNumber,
            textFragment: contextData.textFragment
          })
          
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
 * Uses in-memory caching for performance
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Check cache first
  const now = Date.now()
  if (postsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return postsCache
  }
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

  // Build backlink relationships with context
  const backlinkMap = buildBacklinkMap(validPosts)
  validPosts.forEach(post => {
    post.backlinks = backlinkMap.get(post.title) || []
  })

  // Sort by date (newest first)
  const sortedPosts = validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Cache the results
  postsCache = sortedPosts
  cacheTimestamp = Date.now()
  
  return sortedPosts
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

    // Use frontmatter title or derive from filename, clean any markdown
    const rawTitle = frontmatter.title || path.basename(filename, '.md').replace(/-/g, ' ')
    const title = cleanMarkdownFormatting(rawTitle)

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
      topics: frontmatter.topics || frontmatter.tags || (isFromDarkIntel ? ['dark-intelligibility'] : []),
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
 * Find dark-intel file path by title (for accurate slug generation)
 */
function findDarkIntelFileByTitle(title: string): string | null {
  if (!fs.existsSync(DARK_INTELLIGIBILITY_DIRECTORY)) {
    return null
  }
  
  const files = getAllMarkdownFiles(DARK_INTELLIGIBILITY_DIRECTORY)
  
  // Try exact match first
  const exactMatch = files.find(file => {
    const fileName = path.basename(file, '.md')
    return fileName.toLowerCase() === title.toLowerCase()
  })
  
  if (exactMatch) {
    return exactMatch
  }
  
  // Try partial match (title contained in filename)
  const partialMatch = files.find(file => {
    const fileName = path.basename(file, '.md').toLowerCase()
    return fileName.includes(title.toLowerCase()) || title.toLowerCase().includes(fileName)
  })
  
  return partialMatch || null
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
      
      // Find the actual file path to generate accurate slug
      const filePath = findDarkIntelFileByTitle(title)
      let linkedSlug: string
      
      if (filePath) {
        // Generate slug using the actual file path (matches the slug generation in getPostByFilename)
        linkedSlug = slugify(`dark-intel-${filePath.replace(/\.md$/, '').replace(/\//g, '-')}`)
      } else {
        // Fallback to simple slug generation if file not found
        linkedSlug = slugify(`dark-intel-${title.toLowerCase().replace(/\s+/g, '-')}`)
      }
      
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
export async function getBacklinksForPost(slug: string): Promise<BacklinkContext[]> {
  const allPosts = await getAllPosts()
  const targetPost = allPosts.find(p => p.slug === slug)
  
  if (!targetPost || !targetPost.backlinks) {
    return []
  }
  
  return targetPost.backlinks
}