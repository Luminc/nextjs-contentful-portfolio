#!/usr/bin/env node

/**
 * FRONTMATTER STANDARDIZATION SCRIPT
 * 
 * This script standardizes frontmatter across all markdown files in the dark-intelligibility vault.
 * It ensures consistent structure for:
 * - tags/topics (converts tags to topics)
 * - published status
 * - author information
 * - proper YAML formatting
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const glob = require('glob')

const DARK_INTEL_DIR = path.join(__dirname, '../src/content/dark-intelligibility')

/**
 * Extract hashtags from markdown content
 */
function extractHashtags(content) {
  // Match hashtags but exclude headers (# ## ###)
  const hashtagRegex = /(?:^|[^#\w])#([a-zA-Z][a-zA-Z0-9_-]*)/g
  const hashtags = []
  let match
  
  while ((match = hashtagRegex.exec(content)) !== null) {
    const hashtag = match[1].toLowerCase()
    if (!hashtags.includes(hashtag)) {
      hashtags.push(hashtag)
    }
  }
  
  return hashtags
}

/**
 * Generate standard frontmatter for a file
 */
function generateStandardFrontmatter(data, filePath, content) {
  const folderPath = path.dirname(path.relative(DARK_INTEL_DIR, filePath))
  const fileName = path.basename(filePath, '.md')
  
  // Determine category from folder structure
  const category = folderPath.split('/')[0] || 'general'
  
  // Extract hashtags from content
  const contentHashtags = extractHashtags(content)
  
  // Merge tags, topics, and extracted hashtags
  const allTopics = [
    ...(data.topics || []),
    ...(data.tags || []),
    ...contentHashtags
  ]
  
  // Remove duplicates and ensure we have dark-intelligibility
  const uniqueTopics = [...new Set(allTopics)]
  if (!uniqueTopics.includes('dark-intelligibility')) {
    uniqueTopics.push('dark-intelligibility')
  }
  
  // Standard frontmatter structure
  const standardFrontmatter = {
    title: data.title || fileName,
    published: data.published !== false, // Default to published
    topics: uniqueTopics.length > 0 ? uniqueTopics : ['dark-intelligibility'],
    author: data.author || 'Jeroen Kortekaas',
    category: category.replace(/^\d+\s*/, '').toLowerCase().replace(/\s+/g, '-'),
    date: data.date || new Date().toISOString().split('T')[0]
  }
  
  // Add aliases if they exist
  if (data.aliases && data.aliases.length > 0) {
    standardFrontmatter.aliases = data.aliases
  }
  
  // Add excerpt if it exists
  if (data.excerpt) {
    standardFrontmatter.excerpt = data.excerpt
  }
  
  return standardFrontmatter
}

/**
 * Process a single markdown file
 */
function processFile(filePath) {
  try {
    console.log(`Processing: ${path.relative(DARK_INTEL_DIR, filePath)}`)
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    // Generate standardized frontmatter
    const standardFrontmatter = generateStandardFrontmatter(data, filePath, content)
    
    // Create new file content with standardized frontmatter
    const newContent = matter.stringify(content, standardFrontmatter)
    
    // Write back to file
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    console.log(`✓ Updated: ${path.relative(DARK_INTEL_DIR, filePath)}`)
    
    return true
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message)
    return false
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting frontmatter standardization...\n')
  
  if (!fs.existsSync(DARK_INTEL_DIR)) {
    console.error('❌ Dark intelligibility directory not found:', DARK_INTEL_DIR)
    process.exit(1)
  }
  
  // Find all markdown files
  const pattern = path.join(DARK_INTEL_DIR, '**/*.md')
  const files = glob.sync(pattern)
  
  console.log(`📁 Found ${files.length} markdown files\n`)
  
  let successful = 0
  let failed = 0
  
  // Process each file
  files.forEach(file => {
    if (processFile(file)) {
      successful++
    } else {
      failed++
    }
  })
  
  console.log('\n📊 Summary:')
  console.log(`✅ Successfully processed: ${successful} files`)
  console.log(`❌ Failed to process: ${failed} files`)
  
  if (failed === 0) {
    console.log('\n🎉 All files standardized successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Review the changes in git')
    console.log('2. Commit the standardized frontmatter')
    console.log('3. Push to sync across Obsidian instances')
  } else {
    console.log('\n⚠️  Some files had issues. Please review the errors above.')
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { processFile, generateStandardFrontmatter, extractHashtags }