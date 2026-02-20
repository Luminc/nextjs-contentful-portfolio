import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {types as schemaTypes} from './schema'
import {structure} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Jeroen Kortekaas Portfolio',

  projectId: 'd2u6yqsx',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
