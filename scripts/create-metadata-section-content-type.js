/**
 * Create metadataSection content type in Contentful
 *
 * This script:
 * 1. Creates the metadataSection content type
 * 2. Updates the project content type to add metadataSections field
 * 3. Publishes both changes
 */

import pkg from 'contentful-management'
const { createClient } = pkg
import 'dotenv/config'

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'i8pavhwzt1ca'
const ENVIRONMENT_ID = 'master'
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_PERSONAL_ACCESS_TOKEN

async function main() {
  console.log('🚀 Starting Contentful content type setup...\n')

  // Create management client
  const client = createClient({
    accessToken: MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(SPACE_ID)
  const environment = await space.getEnvironment(ENVIRONMENT_ID)

  // Step 1: Create metadataSection content type
  console.log('📝 Creating metadataSection content type...')

  try {
    const metadataSection = await environment.createContentTypeWithId('metadataSection', {
      name: 'Metadata Section',
      description: 'Flexible metadata sections for projects with configurable titles and rich text content',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          localized: false,
          required: true,
          validations: [
            {
              enabledMarks: ['bold', 'italic', 'underline', 'code'],
              message: 'Only bold, italic, underline, and code marks are allowed',
            },
            {
              enabledNodeTypes: [
                'paragraph',
                'heading-2',
                'heading-3',
                'heading-4',
                'hyperlink',
                'unordered-list',
                'ordered-list',
                'hr',
              ],
              message: 'Only paragraph, headings, links, lists, and horizontal rules are allowed',
            },
          ],
          disabled: false,
          omitted: false,
        },
        {
          id: 'displayStyle',
          name: 'Display Style',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [
            {
              in: ['caption', 'paragraph', 'list'],
              message: 'Display style must be one of: caption, paragraph, list',
            },
          ],
          disabled: false,
          omitted: false,
        },
      ],
    })

    console.log('✅ metadataSection content type created')

    // Publish the content type
    await metadataSection.publish()
    console.log('✅ metadataSection content type published\n')

  } catch (error) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️  metadataSection content type already exists, skipping creation\n')
    } else {
      throw error
    }
  }

  // Step 2: Update project content type to add metadataSections field
  console.log('📝 Updating project content type...')

  const projectContentType = await environment.getContentType('project')

  // Check if field already exists
  const fieldExists = projectContentType.fields.some(f => f.id === 'metadataSections')

  if (!fieldExists) {
    projectContentType.fields.push({
      id: 'metadataSections',
      name: 'Metadata Sections',
      type: 'Array',
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
      items: {
        type: 'Link',
        validations: [
          {
            linkContentType: ['metadataSection'],
            message: 'Only metadataSection entries are allowed',
          },
        ],
        linkType: 'Entry',
      },
    })

    const updatedProjectType = await projectContentType.update()
    console.log('✅ project content type updated')

    await updatedProjectType.publish()
    console.log('✅ project content type published\n')
  } else {
    console.log('ℹ️  metadataSections field already exists on project content type\n')
  }

  console.log('🎉 Content type setup complete!')
  console.log('\nNext steps:')
  console.log('1. Go to Contentful web UI')
  console.log('2. Create a test metadataSection entry (e.g., title: "Materials")')
  console.log('3. Link it to a project to test the new flexible metadata system')
}

main().catch(error => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
