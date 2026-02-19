import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {types as schemaTypes} from './schema'

export default defineConfig({
  name: 'default',
  title: 'Jeroen Kortekaas Portfolio',

  projectId: 'd2u6yqsx',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
