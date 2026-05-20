# Blog Face: Lesser CMS Contract Audit

This audit records the adapter boundary between Greater's reusable Blog face view-model types and
Lesser's pinned CMS GraphQL contract.

## Evidence

- Lesser pin: `docs/lesser/contracts/LESSER_REF.txt` (`v1.4.9`, commit `8a9325a76a09c47f8c42b80b378ea25e366a01cf`)
- Contract source: `docs/lesser/contracts/graphql-schema.graphql`
- Greater Blog public types: `packages/faces/blog/src/types.ts`
- Article display implementation: `packages/faces/blog/src/components/Article/Content.svelte`

## Boundary decision

Greater Blog types remain reusable UI view models. Lesser CMS fields are mapped by adapters before
reaching `Article.Root`, `Editor.Root`, or `Publication.Root`; Lesser-only moderation, workflow, and
membership fields do not leak into reusable UI types until a concrete app integration proves a UI need.

Field direction legend:

- **Matches Greater** — the Greater field already exists with the same semantic value.
- **Adapter mapping** — an adapter should rename, normalize, collapse, or derive a Greater field.
- **Out of scope for MVP** — keep out of this support milestone; revisit only with a proven Emdash gap.
- **Do not leak** — Lesser field is backend/workflow/admin state and should not become reusable UI data.

## `Article` field audit

| Lesser field         | Direction            | Greater boundary                                                                                                                 |
| -------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | Matches Greater      | `ArticleData.id`                                                                                                                 |
| `slug`               | Matches Greater      | `ArticleData.slug`                                                                                                               |
| `author`             | Adapter mapping      | Map `Actor` to `AuthorData` (`id`, display name, username/handle, avatar, bio, links as available).                              |
| `title`              | Adapter mapping      | `ArticleData.metadata.title`                                                                                                     |
| `subtitle`           | Adapter mapping      | `ArticleData.metadata.subtitle`                                                                                                  |
| `excerpt`            | Adapter mapping      | Prefer for `ArticleData.metadata.description` when present; fall back to `seoDescription`/`subtitle` as app policy.              |
| `content`            | Matches Greater      | `ArticleData.content`; for public articles this should be server-rendered/sanitized HTML when available.                         |
| `contentFormat`      | Adapter mapping      | Convert Lesser `HTML`/`MARKDOWN` to Greater `html`/`markdown`. `markdown` is escaped fallback text in public `Article.Content`.  |
| `featuredImage`      | Adapter mapping      | Map `Media` URL/description to `metadata.featuredImage` and `metadata.featuredImageAlt`.                                         |
| `generatedBy`        | Do not leak          | Generation provenance is workflow state; do not surface in reusable public Article UI without a proven app provenance design.    |
| `tableOfContents`    | Out of scope for MVP | `Article.Content` currently derives headings from rendered HTML. Do not add a server-TOC prop without a proven app need.         |
| `readingTimeMinutes` | Adapter mapping      | `ArticleData.metadata.readingTime`                                                                                               |
| `wordCount`          | Adapter mapping      | `ArticleData.metadata.wordCount`                                                                                                 |
| `series`             | Out of scope for MVP | Greater `SeriesData` is a richer navigation model and requires article-list context not present on the `Series` object alone.    |
| `seriesOrder`        | Out of scope for MVP | Only map with `series` once a proven series navigation UI exists.                                                                |
| `categories`         | Adapter mapping      | Map a primary category to `metadata.category`; navigation/category lists can map to `CategoryData` separately.                   |
| `seoTitle`           | Adapter mapping      | SEO-layer input; may feed page metadata outside the Article components.                                                          |
| `seoDescription`     | Adapter mapping      | SEO-layer input; may backfill `metadata.description` when `excerpt` is absent.                                                   |
| `canonicalUrl`       | Adapter mapping      | `ArticleData.metadata.canonicalUrl`                                                                                              |
| `ogImage`            | Adapter mapping      | `SEOData.ogImage` or host page metadata, not Article display by default.                                                         |
| `editorNotes`        | Do not leak          | Editorial/private workflow state; keep out of public reusable Article UI.                                                        |
| `reviewStatus`       | Do not leak          | Review workflow state; keep out of public reusable Article UI for this MVP.                                                      |
| `reviewedBy`         | Do not leak          | Review actor state is backend/workflow provenance; keep out of reusable Article UI until an app-specific moderation UI needs it. |
| `publishedBy`        | Do not leak          | Publishing actor state is workflow provenance; public author attribution remains `author`.                                       |
| `publishedAt`        | Adapter mapping      | `ArticleData.metadata.publishedAt`                                                                                               |
| `createdAt`          | Out of scope for MVP | Not displayed by existing Blog face components.                                                                                  |
| `updatedAt`          | Adapter mapping      | `ArticleData.metadata.updatedAt`                                                                                                 |

Greater-only `ArticleData` fields (`isPublished`, `isFeatured`, `viewCount`, `reactions`,
`commentCount`) are not in the Lesser M0 CMS contract. Set `isPublished: true` for returned public
`Article` objects; treat the rest as out-of-scope social/product signals unless a later integration
proves them.

## `Draft` field audit

| Lesser field      | Direction            | Greater boundary                                                                                                        |
| ----------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `id`              | Matches Greater      | `DraftData.id`                                                                                                          |
| `author`          | Do not leak          | Existing editor UI does not display draft author state.                                                                 |
| `contentType`     | Out of scope for MVP | Greater Blog editor is article-shaped for this milestone.                                                               |
| `title`           | Adapter mapping      | `DraftData.title`; normalize nullable Lesser values to an empty/untitled string at the adapter boundary.                |
| `slug`            | Out of scope for MVP | Routing belongs to the consuming app until a concrete editor slug UI is needed.                                         |
| `content`         | Matches Greater      | `DraftData.content`                                                                                                     |
| `contentFormat`   | Adapter mapping      | Convert Lesser `HTML`/`MARKDOWN` to Greater `html`/`markdown`.                                                          |
| `status`          | Out of scope for MVP | Scheduling/publish lifecycle UI is explicitly outside this support milestone.                                           |
| `scheduledAt`     | Out of scope for MVP | No scheduling UI in scope.                                                                                              |
| `objectId`        | Out of scope for MVP | Backend linkage, not reusable editor display state.                                                                     |
| `autosaveVersion` | Out of scope for MVP | Use only if a later autosave-conflict UI is proven.                                                                     |
| `lastSavedAt`     | Adapter mapping      | `DraftData.savedAt`                                                                                                     |
| `generatedBy`     | Do not leak          | Generation provenance is workflow state; keep out of reusable editor data until an app-specific provenance UI needs it. |
| `reviewedBy`      | Do not leak          | Review actor state is workflow/moderation provenance and should not become reusable editor data by default.             |
| `createdAt`       | Out of scope for MVP | Not displayed by existing editor UI.                                                                                    |
| `updatedAt`       | Out of scope for MVP | Existing editor status uses `savedAt`; do not add another timestamp without a UI need.                                  |

Greater-only `DraftData.autoSave` and `DraftData.wordCount` remain local UI concerns. The editor can
derive word count and autosave behavior from configuration; Lesser does not need to mirror them.

Lesser v1.4.9 also exposes `DraftPreview` via `Query.draftPreview(id: ID!)`. That supports the
existing rendering boundary: adapters may use the server-rendered `renderedHtml` for draft/editor
preview surfaces, but it does not make Greater the canonical public Markdown renderer and does not
change `Article.Content` public fallback behavior.

## `Publication` field audit

| Lesser field   | Direction            | Greater boundary                                                                          |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| `id`           | Matches Greater      | `PublicationData.id`                                                                      |
| `name`         | Matches Greater      | `PublicationData.name`                                                                    |
| `tagline`      | Matches Greater      | `PublicationData.tagline`                                                                 |
| `description`  | Matches Greater      | `PublicationData.description`                                                             |
| `slug`         | Out of scope for MVP | Consuming app routing can retain the Lesser slug outside reusable Publication UI.         |
| `logoUrl`      | Adapter mapping      | `PublicationData.logo`                                                                    |
| `bannerUrl`    | Adapter mapping      | `PublicationData.banner`                                                                  |
| `customDomain` | Adapter mapping      | `PublicationData.website` when the app wants a public URL; keep routing policy app-owned. |
| `actor`        | Do not leak          | Actor ownership is backend/fediverse identity state, not current Publication UI data.     |
| `members`      | Out of scope for MVP | Member management is not part of reusable Publication display in this milestone.          |
| `createdAt`    | Out of scope for MVP | Not displayed by existing Publication components.                                         |
| `updatedAt`    | Out of scope for MVP | Not displayed by existing Publication components.                                         |

Greater-only `PublicationData.primaryColor`, `socialLinks`, `hasNewsletter`, and `subscriberCount` are
consumer/product presentation fields. They are not provided by the Lesser M0 CMS contract and should
not be invented by the adapter.

## Markdown/rendering decision for `Article.Content`

Lesser/server owns canonical public rendering and sanitization. `Article.Content` therefore has two
safe paths:

1. `contentFormat: 'html'` — Greater sanitizes the supplied HTML as defense-in-depth before `{@html}`.
   Lesser-backed public articles should use this path once Lesser returns rendered public HTML.
2. `contentFormat: 'markdown'` — Greater renders the raw source as escaped plain fallback text. It does
   not convert Markdown to public HTML and does not treat raw Markdown as trusted equivalent content.

The `content` package's `MarkdownRenderer` remains useful for draft/editor preview, but it is not the
canonical public article renderer for Lesser-backed publications.

## Adapter gap summary

Concrete adapter work needed by Emdash before handing Lesser CMS objects to the Blog face:

- Normalize `ContentFormat` casing (`HTML`/`MARKDOWN` → `html`/`markdown`).
- Map `Actor`, `Media`, `Category`, and SEO fields into Greater view-model fields.
- Normalize nullable `Draft.title` to a string for `DraftData.title`.
- Keep workflow/admin/provenance fields (`editorNotes`, `reviewStatus`, `generatedBy`, `reviewedBy`,
  `publishedBy`, `Draft.author`, `Publication.actor`) out
  of reusable Blog UI types.
- Leave `tableOfContents`, `series`, `seriesOrder`, draft scheduling, publication members, newsletter
  stats, reactions, comments, and view counts out of reusable Blog UI until Emdash proves a concrete
  display gap for each surface.

Issue #573's proven display gap is covered by `ArticleReader` and `ArticleCard` /
`ArticleIndexCard`; those components normalize the flat Lesser/Emdash ArticleData-shaped display
object without adding richer editor, comments, newsletter, search, RSS, timeline, trending, or
document-hosting scope.
