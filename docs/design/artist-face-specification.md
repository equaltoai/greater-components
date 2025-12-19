# Artist Face Design Specification

> **Status:** Draft  
> **Version:** 0.1.0  
> **Last Updated:** December 13, 2024  
> **Author:** Greater Components Team  
> **Vendored Path:** `$lib/components/*` (via `npx @equaltoai/greater-components-cli add faces/artist`)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Design Philosophy](#design-philosophy)
- [Core Requirements](#core-requirements)
- [Component Inventory](#component-inventory)
- [View Modes](#view-modes)
- [Design System Extensions](#design-system-extensions)
- [AI Integration Requirements](#ai-integration-requirements)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Requirements](#performance-requirements)
- [Community Features](#community-features)
- [Monetization Components](#monetization-components)
- [Technical Architecture](#technical-architecture)
- [Implementation Phases](#implementation-phases)
- [Success Metrics](#success-metrics)

---

## Executive Summary

The **Artist Face** is a specialized component bundle designed for visual artist communities and portfolio-centric social platforms. Unlike the `social` face which prioritizes text-based microblogging (Twitter/Mastodon-style), the Artist Face reimagines the visual hierarchy to place **artwork first** and social elements second.

### Target Applications

- Artist portfolio platforms
- Visual art social networks
- Gallery and exhibition platforms
- Creative community hubs
- Art marketplace frontends

### Key Differentiators from Social Face

| Aspect              | Social Face              | Artist Face                        |
| ------------------- | ------------------------ | ---------------------------------- |
| **Primary Content** | Text with optional media | Visual artwork as hero             |
| **Layout**          | Chronological timeline   | Gallery/masonry grids              |
| **Profiles**        | Bio + stats              | Gallery space + portfolio sections |
| **Interactions**    | Likes/boosts/replies     | Critiques/collections/commissions  |
| **Discovery**       | Hashtags/trends          | Style/color/composition AI search  |

---

## Design Philosophy

### Visual Hierarchy: Art First, Everything Else Second

**REQ-PHIL-001:** All UI chrome MUST recede to let artwork breathe. Interaction elements (likes, boosts, comments) SHOULD be subtle until hover/focus.

**REQ-PHIL-002:** Large, high-resolution image previews MUST be the primary content element in all views.

**REQ-PHIL-003:** Artist attribution MUST be prominently displayed but MUST NOT compete visually with the artwork itself.

**REQ-PHIL-004:** The platform MUST position AI as a creative assistant, never a replacement for human creativity.

### Ethical Principles

**REQ-PHIL-005:** The Artist Face MUST maintain transparency about AI usage through clear disclosure labels.

**REQ-PHIL-006:** Artists MUST have full control over how their work is used for AI training (opt-out controls).

**REQ-PHIL-007:** No algorithmic promotion tied to payment—all artists get fair visibility.

**REQ-PHIL-008:** All metrics shown to users MUST be transparent and real (no inflation).

---

## Core Requirements

### Functional Requirements

#### FR-001: Gallery Views

The system MUST provide three distinct viewing modes that users can toggle between:

- Gallery Grid View (default for browsing)
- Portfolio View (artist-centric presentation)
- Timeline View (social interaction context)

#### FR-002: Artist Profiles as Gallery Spaces

Artist profiles MUST function as legitimate portfolio experiences with:

- Hero artwork banner (signature piece or rotating showcase)
- Customizable gallery sections
- Artist statement with rich formatting
- Professional badges (verified artists, educators, institutions)
- Dynamic statistics

#### FR-003: Advanced Media Viewer

The platform MUST provide an immersive viewing experience with:

- Full-screen lightbox with true black background option
- High-resolution zoom with pan capabilities
- Multi-image navigation for series
- Metadata display (medium, dimensions, year, materials)
- Context toggle to show/hide social elements

#### FR-004: AI-Powered Discovery

The discovery engine MUST leverage AI for:

- Style recognition and automatic tagging
- Color palette extraction and search
- Composition analysis
- Mood/emotional resonance mapping

#### FR-005: Community Curation

The platform MUST support:

- Guest curator programs
- Themed exhibitions (time-based showcases)
- Artist spotlights (daily/weekly features)
- Collaborative collections

#### FR-006: Creative Tools Integration

The platform MUST support the artistic process with:

- Work-in-progress threads with version control
- Reference/mood boards
- Structured critique mode with annotations
- Commission workflow tools

### Non-Functional Requirements

#### NFR-001: Performance

- Progressive image loading (low-res to high-res transitions)
- First Contentful Paint < 1.5s for gallery views
- Time to Interactive < 3s
- Lighthouse Performance score ≥ 90

#### NFR-002: Accessibility

- WCAG 2.1 AA compliance
- Comprehensive alt text (AI-assisted but artist-editable)
- High contrast modes that preserve artwork visibility
- Full keyboard navigation through gallery views
- Screen reader optimization for artwork descriptions

#### NFR-003: Responsiveness

- Mobile-first design
- Touch-optimized interactions (swipe galleries, pinch-to-zoom)
- One-thumb navigation capability
- Offline gallery support for saved works

---

## Component Inventory

### 1. Artwork Display Components

#### Artwork.Root

**Description:** Container compound component for artwork display with context.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artwork` | `ArtworkData` | required | Artwork data object |
| `config` | `ArtworkConfig` | `{}` | Display configuration |
| `handlers` | `ArtworkHandlers` | `{}` | Event handlers |

**Sub-components:**

- `Artwork.Image` - High-resolution image with progressive loading
- `Artwork.Title` - Artwork title with optional link
- `Artwork.Attribution` - Artist name, avatar, link
- `Artwork.Metadata` - Medium, dimensions, year, materials
- `Artwork.Stats` - Views, likes, collections, comments
- `Artwork.Actions` - Like, collect, share, comment buttons
- `Artwork.AIDisclosure` - AI usage transparency badge

---

#### ArtworkCard

**Description:** Compact artwork representation for grid views.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artwork` | `ArtworkData` | required | Artwork data |
| `size` | `'sm' \| 'md' \| 'lg' \| 'auto'` | `'auto'` | Card size variant |
| `showOverlay` | `boolean` | `true` | Show info on hover |
| `aspectRatio` | `'preserve' \| '1:1' \| '4:3' \| '16:9'` | `'preserve'` | Aspect ratio handling |

---

#### MediaViewer

**Description:** Full-screen immersive artwork viewing experience.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artworks` | `ArtworkData[]` | required | Array of artworks |
| `currentIndex` | `number` | `0` | Currently displayed index |
| `background` | `'dark' \| 'black' \| 'blur'` | `'black'` | Background style |
| `showMetadata` | `boolean` | `true` | Display metadata panel |
| `showSocial` | `boolean` | `false` | Display social elements |
| `enableZoom` | `boolean` | `true` | Enable pinch/scroll zoom |
| `enablePan` | `boolean` | `true` | Enable pan on zoomed images |

**Events:**

- `onClose` - Viewer closed
- `onNavigate` - Navigation between artworks
- `onZoom` - Zoom level changed
- `onInteraction` - Like/collect/share from viewer

---

### 2. Gallery Components

#### GalleryGrid

**Description:** Masonry-style grid layout for artwork display.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `columns` | `number \| 'auto'` | `'auto'` | Column count or auto-responsive |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between items |
| `clustering` | `'none' \| 'artist' \| 'theme' \| 'smart'` | `'none'` | Smart grouping mode |
| `virtualScrolling` | `boolean` | `true` | Enable virtual scrolling |
| `onLoadMore` | `() => void` | - | Infinite scroll callback |

---

#### GalleryRow

**Description:** Horizontal scrolling row for curated selections.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `title` | `string` | - | Row title |
| `showAllLink` | `string` | - | Link to full collection |
| `cardSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size in row |

---

#### GalleryMasonry

**Description:** Variable-height masonry layout respecting artwork aspect ratios.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArtworkData[]` | `[]` | Artworks to display |
| `columnWidth` | `number` | `300` | Target column width (px) |
| `gap` | `number` | `16` | Gap between items (px) |

---

### 3. Artist Profile Components

#### ArtistProfile.Root

**Description:** Container compound component for artist gallery/portfolio.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artist` | `ArtistData` | required | Artist profile data |
| `isOwnProfile` | `boolean` | `false` | Viewing own profile |
| `handlers` | `ProfileHandlers` | `{}` | Event handlers |

**Sub-components:**

- `ArtistProfile.HeroBanner` - Signature artwork banner (rotating or static)
- `ArtistProfile.Avatar` - Artist avatar with status
- `ArtistProfile.Name` - Display name with verification badge
- `ArtistProfile.Badges` - Professional badges (verified, educator, institution)
- `ArtistProfile.Statement` - Rich-formatted artist statement
- `ArtistProfile.Stats` - Followers, works, exhibitions, collaborations
- `ArtistProfile.Sections` - Customizable gallery sections
- `ArtistProfile.Actions` - Follow, message, commission buttons
- `ArtistProfile.Edit` - Profile editing mode
- `ArtistProfile.Timeline` - Artist activity timeline

---

#### ArtistBadge

**Description:** Professional verification/credential badge.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'verified' \| 'educator' \| 'institution' \| 'mentor' \| 'curator'` | required | Badge type |
| `tooltip` | `string` | - | Explanation tooltip |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |

---

#### PortfolioSection

**Description:** Customizable gallery section within a profile.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Section title |
| `description` | `string` | - | Section description |
| `items` | `ArtworkData[]` | `[]` | Artworks in section |
| `layout` | `'grid' \| 'row' \| 'featured'` | `'grid'` | Section layout |
| `editable` | `boolean` | `false` | Enable editing |

**Pre-defined Section Types:**

- "Recent Work"
- "Featured"
- "Collections"
- "Commissions"
- "Work in Progress"
- "Archived"

---

### 4. Discovery Components

#### DiscoveryEngine.Root

**Description:** AI-powered art discovery and search interface.

**Sub-components:**

- `DiscoveryEngine.SearchBar` - Text and visual search input
- `DiscoveryEngine.Filters` - Style, color, medium, mood filters
- `DiscoveryEngine.Results` - Search results with gallery layout
- `DiscoveryEngine.Suggestions` - AI-generated similar work suggestions
- `DiscoveryEngine.ColorSearch` - Search by color palette
- `DiscoveryEngine.StyleSearch` - Search by artistic style

---

#### ColorPaletteSearch

**Description:** Search artworks by color harmony.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | `[]` | Selected color values |
| `tolerance` | `number` | `15` | Color matching tolerance (0-100) |
| `mode` | `'any' \| 'all' \| 'dominant'` | `'any'` | Match mode |
| `onSearch` | `(colors: string[]) => void` | - | Search callback |

---

#### StyleFilter

**Description:** Filter artworks by artistic style/movement.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `styles` | `ArtStyle[]` | AI-detected | Available styles |
| `selected` | `string[]` | `[]` | Selected style IDs |
| `showCount` | `boolean` | `true` | Show artwork counts |

---

#### MoodMap

**Description:** Visual mood/emotion-based discovery interface.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dimensions` | `['x-axis', 'y-axis']` | `['energy', 'valence']` | Mood axes |
| `selection` | `{x: number, y: number}` | - | Selected mood point |

---

### 5. Curation Components

#### Exhibition.Root

**Description:** Themed exhibition/showcase container.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `exhibition` | `ExhibitionData` | required | Exhibition data |
| `layout` | `'gallery' \| 'narrative' \| 'timeline'` | `'gallery'` | Exhibition layout |

**Sub-components:**

- `Exhibition.Banner` - Hero image and title
- `Exhibition.Statement` - Curator statement
- `Exhibition.Artists` - Featured artists list
- `Exhibition.Gallery` - Artwork display
- `Exhibition.Navigation` - Exhibition navigation

---

#### CuratorSpotlight

**Description:** Featured curator or artist spotlight card.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `curator` | `CuratorData` | required | Curator information |
| `collection` | `ArtworkData[]` | `[]` | Curated selection |
| `statement` | `string` | - | Curator statement |

---

#### CollectionCard

**Description:** User-created or themed collection display.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collection` | `CollectionData` | required | Collection data |
| `preview` | `number` | `4` | Number of preview images |
| `collaborative` | `boolean` | `false` | Multi-contributor collection |

---

### 6. Creative Tools Components

#### WorkInProgress.Root

**Description:** Work-in-progress documentation thread.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `thread` | `WIPThreadData` | required | WIP thread data |
| `handlers` | `WIPHandlers` | `{}` | Event handlers |

**Sub-components:**

- `WorkInProgress.Header` - Thread title and artist
- `WorkInProgress.VersionList` - Chronological versions
- `WorkInProgress.VersionCard` - Individual version with notes
- `WorkInProgress.Compare` - Side-by-side comparison
- `WorkInProgress.Timeline` - Visual progress timeline
- `WorkInProgress.Comments` - Threaded discussion

---

#### CritiqueMode.Root

**Description:** Structured artwork critique interface.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artwork` | `ArtworkData` | required | Artwork being critiqued |
| `config` | `CritiqueConfig` | `{}` | Critique settings |

**Sub-components:**

- `CritiqueMode.Image` - Annotatable artwork display
- `CritiqueMode.Annotations` - Visual annotation layer
- `CritiqueMode.Questions` - Artist's specific questions
- `CritiqueMode.Feedback` - Structured feedback form
- `CritiqueMode.Critics` - Verified critic badges

---

#### ReferenceBoard

**Description:** Mood board / reference collection tool.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `board` | `ReferenceBoardData` | required | Board data |
| `editable` | `boolean` | `false` | Enable editing |
| `showSources` | `boolean` | `true` | Show artwork sources |

---

#### CommissionWorkflow.Root

**Description:** Commission management interface.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `commission` | `CommissionData` | required | Commission data |
| `role` | `'artist' \| 'client'` | required | User role |

**Sub-components:**

- `CommissionWorkflow.Request` - Initial commission request
- `CommissionWorkflow.Quote` - Artist quote/proposal
- `CommissionWorkflow.Contract` - Terms agreement
- `CommissionWorkflow.Progress` - WIP updates
- `CommissionWorkflow.Delivery` - Final delivery
- `CommissionWorkflow.Payment` - Payment handling

---

### 7. Community Components

#### CritiqueCircle.Root

**Description:** Structured critique group/space.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `circle` | `CritiqueCircleData` | required | Circle data |
| `membership` | `'member' \| 'moderator' \| 'viewer'` | `'viewer'` | User role |

**Sub-components:**

- `CritiqueCircle.Queue` - Critique request queue
- `CritiqueCircle.Session` - Active critique session
- `CritiqueCircle.History` - Past critiques
- `CritiqueCircle.Members` - Circle membership

---

#### Collaboration.Root

**Description:** Multi-artist collaboration space.

**Sub-components:**

- `Collaboration.Project` - Project overview
- `Collaboration.Contributors` - Artist attribution chain
- `Collaboration.Uploads` - Contribution management
- `Collaboration.Gallery` - Collaborative gallery
- `Collaboration.Split` - Revenue/credit split

---

#### MentorMatch

**Description:** Mentor-mentee connection interface.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'find-mentor' \| 'find-mentee' \| 'active'` | required | Interface mode |
| `filters` | `MentorFilters` | `{}` | Matching criteria |

---

### 8. Transparency Components

#### AIDisclosure

**Description:** AI usage transparency badge and details.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `usage` | `AIUsageData` | required | AI usage details |
| `variant` | `'badge' \| 'detailed' \| 'inline'` | `'badge'` | Display variant |
| `expandable` | `boolean` | `true` | Show detailed breakdown |

---

#### ProcessDocumentation

**Description:** Human creativity documentation for AI-assisted work.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `ProcessStep[]` | `[]` | Process documentation |
| `showAIContribution` | `boolean` | `true` | Highlight AI vs human steps |

---

## View Modes

### REQ-VIEW-001: Gallery Grid View (Default)

**Description:** Masonry layout optimized for browsing large collections.

**Requirements:**

- Variable-sized tiles based on artwork aspect ratios
- Hover effects revealing title, artist, quick stats
- Infinite scroll with smooth lazy loading
- Smart clustering by artist or theme (optional)
- Configurable column count (auto-responsive by default)

**Component:** `GalleryGrid` with `ArtworkCard` children

---

### REQ-VIEW-002: Portfolio View (Artist-Centric)

**Description:** Full-width presentation mode for professional display.

**Requirements:**

- Full-width artwork display with minimal distractions
- Side panel for artist info, statement, navigation
- Project-based organization (sections/collections)
- "Professional mode" toggle that hides all social elements
- Suitable for sharing portfolio links externally

**Component:** `ArtistProfile.Root` with `layout="portfolio"`

---

### REQ-VIEW-003: Timeline View (Social Interaction)

**Description:** Hybrid social feed with larger image previews.

**Requirements:**

- Larger image previews than standard social timeline
- Threaded conversations anchored to specific artworks
- Work-in-progress tracking showing piece evolution
- Similar interaction patterns to `social` face for familiarity

**Component:** `ArtistTimeline` (extends social Timeline patterns)

---

## Design System Extensions

### Color Strategy

**REQ-DESIGN-001:** Neutral base palette that lets artwork colors dominate.

```css
/* Artist Face Color Tokens */
:root {
	/* Neutral base - recedes behind artwork */
	--gr-artist-bg-primary: var(--gr-color-gray-950);
	--gr-artist-bg-secondary: var(--gr-color-gray-900);
	--gr-artist-bg-elevated: var(--gr-color-gray-850);

	/* True black for media viewer */
	--gr-artist-bg-immersive: #000000;

	/* Subtle accents - never compete with artwork */
	--gr-artist-accent-primary: var(--gr-color-gray-400);
	--gr-artist-accent-hover: var(--gr-color-gray-300);

	/* Adaptive UI - adjusts based on displayed artwork */
	--gr-artist-adaptive-text: var(--gr-color-gray-100);
	--gr-artist-adaptive-muted: var(--gr-color-gray-500);
}
```

**REQ-DESIGN-002:** Optional artist profile themes within defined bounds.

**REQ-DESIGN-003:** Adaptive UI darkness based on displayed artwork (optional feature).

### Typography

**REQ-DESIGN-004:** Clean, minimal type for UI elements; premium serif option for artist statements.

```css
:root {
	/* UI Typography - minimal, clean */
	--gr-artist-font-ui: var(--gr-typography-fontFamily-sans);

	/* Statement/long-form - premium serif */
	--gr-artist-font-statement: 'Playfair Display', 'Georgia', serif;

	/* Artwork titles - slightly more prominent */
	--gr-artist-font-title: var(--gr-typography-fontFamily-sans);
	--gr-artist-title-weight: 500;
}
```

### Motion & Interaction

**REQ-DESIGN-005:** Smooth, purposeful animations that don't distract from art.

```css
:root {
	--gr-artist-transition-hover: 200ms ease-out;
	--gr-artist-transition-reveal: 300ms ease-out;
	--gr-artist-transition-modal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Requirements:**

- Parallax scrolling for gallery views (optional, respect reduced motion)
- Gentle hover states that reveal information progressively
- Loading states that build anticipation for viewing art
- All animations MUST respect `prefers-reduced-motion`

### Mobile Experience

**REQ-DESIGN-006:** Touch-optimized interactions.

- Swipe-through galleries with haptic feedback
- Pinch-to-zoom on all artwork
- One-thumb navigation for browsing modes
- Quick upload from camera roll with basic editing
- Offline gallery for saving favorite works

---

## AI Integration Requirements

### Discovery Features

**REQ-AI-001:** Style Recognition

- Automatically tag and group artworks by artistic style
- Confidence scores for style classifications
- User-editable override capability

**REQ-AI-002:** Color Palette Extraction

- Extract dominant and accent colors from artworks
- Enable search by color harmony
- Generate complementary color suggestions

**REQ-AI-003:** Composition Analysis

- Identify compositional patterns (rule of thirds, golden ratio, etc.)
- Find works with similar visual structure
- Optional composition feedback for artists

**REQ-AI-004:** Mood Mapping

- Classify emotional resonance of artworks
- Enable discovery by emotional tone
- Connect works across emotional themes

### Creative Assistant Features

**REQ-AI-005:** Reference Finding

- Suggest references that respect copyright
- Attribute and link original sources
- Filter by permission level

**REQ-AI-006:** Color Harmony Suggestions

- Based on artist preferences and past work
- Non-prescriptive, optional guidance
- Respect artist's established palette

**REQ-AI-007:** Trend Identification

- Surface emerging styles and themes
- Present as information, not pressure to conform
- Artist controls trend visibility in own feed

### Transparency Requirements

**REQ-AI-008:** AI Usage Disclosure

- Clear, prominent labels when AI tools are used in creation
- Graduated disclosure (badge → detailed breakdown)
- Consistent iconography across platform

**REQ-AI-009:** Process Documentation

- Tools to document human creativity in AI-assisted work
- Visual timeline of human vs. AI contributions
- Exportable process documentation

**REQ-AI-010:** Ethical Sourcing Verification

- Verify AI training data respects artist rights
- Surface model provenance information
- Flag potentially problematic AI sources

**REQ-AI-011:** Opt-Out Controls

- Artists choose how their work trains AI systems
- Granular controls (discovery AI vs. generative AI vs. none)
- Clear, accessible privacy settings
- Retroactive opt-out capability

---

## Accessibility Requirements

### Core Accessibility

**REQ-A11Y-001:** WCAG 2.1 AA compliance for all components.

**REQ-A11Y-002:** Comprehensive alt text system.

- AI-assisted alt text generation
- Artist-editable descriptions
- Required before publishing (with skip option for time-sensitive posts)
- Character limit appropriate for image complexity

**REQ-A11Y-003:** High contrast modes.

- Preserve artwork visibility while enhancing UI contrast
- Don't invert or modify artwork colors
- Ensure all interactive elements meet 4.5:1 contrast ratio

**REQ-A11Y-004:** Full keyboard navigation.

- Navigate gallery grids with arrow keys
- Enter to open media viewer, Escape to close
- Tab through all interactive elements
- Skip links for gallery sections

**REQ-A11Y-005:** Screen reader optimization.

- Meaningful artwork descriptions read aloud
- Gallery structure announced (e.g., "Gallery, 24 artworks, row 1 of 6")
- State changes announced (zoom level, view mode)

### Visual Accessibility

**REQ-A11Y-006:** Color blind friendly UI.

- Don't rely solely on color to convey meaning
- Badge types distinguishable by shape/icon
- Interaction states have non-color indicators

**REQ-A11Y-007:** Reduced motion support.

- Honor `prefers-reduced-motion`
- Provide static alternatives to parallax
- Instant transitions when reduced motion preferred

---

## Performance Requirements

### Image Optimization

**REQ-PERF-001:** Progressive image loading.

- Blur-up placeholder during load
- Low-resolution preview (< 1KB) immediate
- Full resolution lazy-loaded
- Smooth transition between states

**REQ-PERF-002:** Smart caching.

- Predictive loading based on browse patterns
- Cache recently viewed artists' work
- Offline viewing for saved collections

**REQ-PERF-003:** CDN optimization.

- Global edge delivery
- WebP with fallbacks
- Responsive image srcsets
- HTTP/2 push for critical images

### Runtime Performance

**REQ-PERF-004:** Bundle size limits.

- Core Artist Face: < 50KB gzipped
- With all features: < 100KB gzipped
- Tree-shakeable components

**REQ-PERF-005:** Virtual scrolling.

- Required for galleries > 50 items
- Maintain scroll position on navigation
- Smooth scroll for gallery views

**REQ-PERF-006:** Lighthouse targets.

- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

---

## Community Features

### Critique Circles

**REQ-COMM-001:** Structured critique spaces.

- Opt-in critique requests with specific questions
- Credentialed critics (verified educators/professionals)
- Anonymous feedback option
- Side-by-side version comparison

### Collaboration

**REQ-COMM-002:** Multi-artist project spaces.

- Attribution chains tracking contributions
- Split handling for collaborative sales
- Shared galleries for group exhibitions

### Learning & Growth

**REQ-COMM-003:** Educational integration.

- Technique tags (filter by methods/tools)
- Tutorial integration (link process videos to finished works)
- Mentor matching (emerging ↔ established artists)
- Skill badges (expertise recognition)

---

## Monetization Components

### Artist-Friendly Economics

**REQ-ECON-001:** Direct transactions.

- No platform commission on sales
- Direct artist-to-collector payment routing
- Integration with standard payment processors

**REQ-ECON-002:** Optional platform support.

- Pay-what-you-want contributions
- Clearly voluntary, no feature gating
- Recognition for supporters (optional)

**REQ-ECON-003:** Premium features.

- Advanced analytics
- Unlimited storage
- Priority support
- Extended history

**REQ-ECON-004:** Institutional accounts.

- Schools, galleries, museums pay for features
- Multiple user management
- Bulk upload tools
- Exhibition curation tools

### Anti-Exploitation Measures

**REQ-ECON-005:** Fair visibility.

- No pay-for-prominence algorithms
- Transparent discovery metrics
- Equal opportunity for visibility

**REQ-ECON-006:** Strong protections.

- DMCA and attribution tools
- Watermarking options
- Reverse image search integration
- Theft reporting workflow

---

## Technical Architecture

### Package Structure

```
packages/faces/artist/
├── manifest.json              # Face metadata
├── package.json               # npm configuration
├── README.md                  # Documentation
├── src/
│   ├── index.ts               # Main exports
│   ├── components/
│   │   ├── Artwork/
│   │   │   ├── Root.svelte
│   │   │   ├── Image.svelte
│   │   │   ├── Attribution.svelte
│   │   │   ├── Metadata.svelte
│   │   │   ├── Actions.svelte
│   │   │   ├── context.ts
│   │   │   └── index.ts
│   │   ├── ArtistProfile/
│   │   ├── Gallery/
│   │   │   ├── Grid.svelte
│   │   │   ├── Masonry.svelte
│   │   │   ├── Row.svelte
│   │   │   └── index.ts
│   │   ├── MediaViewer/
│   │   ├── Discovery/
│   │   ├── Curation/
│   │   ├── CreativeTools/
│   │   ├── Community/
│   │   └── Transparency/
│   ├── patterns/
│   │   ├── exhibition.ts
│   │   ├── commission.ts
│   │   ├── critique.ts
│   │   └── index.ts
│   ├── stores/
│   │   ├── galleryStore.ts
│   │   ├── discoveryStore.ts
│   │   ├── commissionStore.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── artwork.ts
│   │   ├── artist.ts
│   │   ├── discovery.ts
│   │   ├── commission.ts
│   │   └── index.ts
│   └── theme.css              # Artist Face theme tokens
├── tests/
│   ├── components/
│   ├── stores/
│   └── setup.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Dependencies

**Internal:**

- `$lib/greater/primitives` (Button, Card, Modal, etc.)
- `$lib/greater/headless` (behavior primitives)
- `$lib/greater/icons`
- `$lib/greater/adapters` (WebSocket, GraphQL)
- `$lib/greater/tokens`

**Shared Modules:**

- `shared/auth` - Authentication flows
- `shared/upload` - Media upload handling
- `shared/notifications` - Notification system

### API Integration

The Artist Face should integrate with a backend providing:

- **Artwork CRUD** - Create, read, update, delete artworks
- **Gallery Management** - Collections, sections, exhibitions
- **Discovery API** - AI-powered search and recommendations
- **Commission System** - Request, quote, contract, delivery workflow
- **Critique System** - Circle management, feedback submission
- **Analytics API** - View counts, engagement metrics

---

## Lesser/ActivityPub Federation

The Artist Face integrates with the broader Fediverse through [Lesser](https://github.com/equaltoai/lesser), a serverless, cost-optimized ActivityPub implementation built on AWS Lambda.

### Federation Overview

Lesser provides full ActivityPub federation capabilities that the Artist Face leverages:

| Capability          | Lesser Implementation        | Artist Face Usage                         |
| ------------------- | ---------------------------- | ----------------------------------------- |
| **Inbox/Outbox**    | Complete activity processing | Artwork posts, boosts, favorites federate |
| **WebFinger**       | User discovery               | Artists discoverable across Fediverse     |
| **HTTP Signatures** | Secure federation            | Authenticated cross-instance interactions |
| **Relay Support**   | Optional relay configuration | Artwork discovery across instances        |
| **Instance Blocks** | Moderation tools             | Protect artists from harmful instances    |

### Artwork Federation Requirements

**REQ-FED-001:** Artwork as ActivityPub Note

- Artworks MUST federate as ActivityPub `Note` objects with `Image` attachments
- High-resolution images delivered via S3 + CloudFront CDN
- Alt text MUST federate as `name` property on attachments
- Aspect ratio hints for proper display on remote instances

**REQ-FED-002:** Artist Attribution

- Artist identity MUST be preserved when artworks federate
- `attributedTo` MUST link to canonical artist Actor
- Display name, avatar, and verified badges MUST federate
- Remote instances SHOULD display attribution prominently

**REQ-FED-003:** Artwork Metadata

- Medium, dimensions, year, materials SHOULD federate as structured data
- Use ActivityPub extensions or `attachment` properties
- Graceful degradation on instances that don't support extended metadata

**REQ-FED-004:** Collections and Exhibitions

- Galleries/collections MAY federate as ActivityPub `Collection` objects
- Exhibitions MAY federate as `OrderedCollection` with curatorial statement
- Remote followers receive updates when collections change

**REQ-FED-005:** Commission Workflow (Local Only)

- Commission negotiations SHOULD remain local (not federated)
- Completed commission announcements MAY federate with client consent

### API Integration with Lesser

The Artist Face uses Lesser's APIs:

> **Implementation Note:** The full Lesser GraphQL schema is already available in this repository. We leverage the existing `codegen.ts` configuration and generated types for type-safe API integration. Artist-specific queries and mutations can be added to the schema and regenerated as needed.

#### GraphQL API (60+ Operations)

```graphql
# Artwork mutations
mutation CreateArtwork($input: CreateArtworkInput!) {
	createArtwork(input: $input) {
		id
		uri # ActivityPub URI for federation
		url # Web URL for sharing
		mediaAttachments {
			id
			url
			previewUrl
			meta {
				width
				height
				aspect
			}
		}
	}
}

# Discovery queries
query DiscoverArtworks($style: String, $colors: [String!], $mood: String) {
	discoverArtworks(filter: { style: $style, colors: $colors, mood: $mood }, first: 20) {
		edges {
			node {
				...ArtworkFields
				account {
					...ArtistFields
				}
			}
		}
	}
}

# Federation queries
query FederatedArtwork($uri: String!) {
	lookupArtwork(uri: $uri) {
		id
		content
		account {
			acct # user@remote.instance format
			displayName
			avatar
		}
	}
}
```

#### WebSocket Streaming

```typescript
// Real-time gallery updates
client.subscribe('user:gallery', (event) => {
	if (event.type === 'artwork.created') {
		gallery.prepend(event.artwork);
	}
});

// Federation events
client.subscribe('federation:artwork', (event) => {
	if (event.type === 'artwork.boosted') {
		updateBoostCount(event.artworkId, event.count);
	}
});
```

#### REST API (Mastodon-Compatible)

- Full Mastodon v1 API compatibility for artwork posts
- OAuth 2.0 authentication flows
- Existing Mastodon clients can display Artist Face content

### Adapter Configuration

```typescript
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';

const adapter = new LesserGraphQLAdapter({
	httpEndpoint: import.meta.env.VITE_LESSER_GRAPHQL,
	wsEndpoint: import.meta.env.VITE_LESSER_WS,
	token: import.meta.env.VITE_LESSER_TOKEN,
});

// Artist Face uses same adapter as Social Face
// with extended queries for artwork-specific features
const artistAdapter = adapter.extend({
	schema: artistFaceSchema,
});
```

### Cross-Instance Artist Discovery

**REQ-FED-006:** Federated Search

- Artists MUST be discoverable via WebFinger (`@artist@instance.art`)
- Style/color/mood search works on local instance
- Remote artwork discovery via relay or direct fetch

**REQ-FED-007:** Following Remote Artists

- Users CAN follow artists on any ActivityPub instance
- Remote artist profiles display with available metadata
- Artwork posts from followed remote artists appear in timeline

### Rights and Attribution in Federation

**REQ-FED-008:** License Propagation

- If artist specifies a license (CC-BY, etc.), it MUST federate
- License SHOULD be displayed on remote instances
- No license = All Rights Reserved (default)

**REQ-FED-009:** AI Training Opt-Out

- `noai` flag MUST federate with artwork
- Remote instances SHOULD respect opt-out preferences
- Cannot enforce on non-compliant instances (best-effort)

---

## Open Questions (Post-PoC)

> **Note:** The following questions will be addressed after the initial Proof of Concept is operational. They are not blockers for Phase 1 implementation.

1. **Rights Management:** What level of copyright/licensing integration is needed? Creative Commons, custom licenses, etc.?

2. **Marketplace Scope:** Full marketplace with payments, or integration with external platforms (Gumroad, Ko-fi, etc.)?

3. **AI Model Selection:** Which AI models/services power discovery features? Self-hosted vs. cloud (AWS Bedrock)?

4. **Moderation:** Art-specific content moderation (nudity in fine art context, etc.)? How does this interact with Lesser's AI moderation via Bedrock?

5. **Print-on-Demand:** Integration with print services for physical sales?

6. **Extended ActivityPub Vocabulary:** Should we propose Fediverse Enhancement Proposals (FEPs) for artist-specific metadata (medium, dimensions, materials)?

---

## References

- [Original Design Research](https://www.perplexity.ai/page/designing-the-artist-oriented-g9DDjgSkQzu3YaYGBqOv.Q)
- [Greater Components Social Face](../packages/faces/social/README.md)
- [Face Development Guide](./face-development.md)
- [Core Patterns](./core-patterns.md)
- [API Reference](./api-reference.md)

---

_Last Updated: December 13, 2024_
