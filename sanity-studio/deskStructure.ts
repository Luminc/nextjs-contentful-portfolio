import type {StructureResolver} from 'sanity/structure'

/**
 * Custom desk structure for Jeroen Kortekaas Portfolio Studio.
 *
 * Groups:
 *   Content       — the documents editors touch regularly (Projects, Hero Images, Pages)
 *   Sections      — reusable section blocks referenced by projects
 *   Metadata      — metadata section blocks
 *   Legacy        — migrated types no longer used by the live site, kept read-only
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Studio')
    .items([
      // ── Content ──────────────────────────────────────────────────────────
      S.listItem()
        .title('Content')
        .icon(() => '📁')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('project').title('Projects'),
              S.documentTypeListItem('heroImages').title('Hero Images'),
              S.documentTypeListItem('about').title('Pages'),
            ]),
        ),

      S.divider(),

      // ── Sections ─────────────────────────────────────────────────────────
      S.listItem()
        .title('Sections')
        .icon(() => '🧩')
        .child(
          S.list()
            .title('Sections')
            .items([
              S.documentTypeListItem('imageWide').title('Image Wide'),
              S.documentTypeListItem('documentation').title('Documentation'),
              S.documentTypeListItem('carousel').title('Carousel'),
              S.documentTypeListItem('containerVideo').title('Video'),
              S.documentTypeListItem('metadataSection').title('Metadata Section'),
            ]),
        ),

      S.divider(),

      // ── Legacy ───────────────────────────────────────────────────────────
      // Contentful migration artefacts — kept for reference, not used on the live site
      S.listItem()
        .title('Legacy (unused)')
        .icon(() => '🗄️')
        .child(
          S.list()
            .title('Legacy')
            .items([
              S.documentTypeListItem('assets').title('Assets'),
              S.documentTypeListItem('blogPost').title('Blog Posts'),
              S.documentTypeListItem('baseContent').title('Base Content'),
              S.documentTypeListItem('textSection').title('Text Section'),
              S.documentTypeListItem('contentSecion').title('Content Section'),
            ]),
        ),
    ])
