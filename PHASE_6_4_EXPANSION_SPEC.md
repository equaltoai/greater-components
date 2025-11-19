# Phase 6.4 Expansion Specification - Structured Data Updates

**Current Situation:** Agent replaced original YAML files instead of expanding them  
**Originals Restored To:** `knowledgebase/restored/`  
**Task:** Expand original files by ADDING new content, not replacing

---

## File Comparison

### Current vs Original

| File | Original (restored) | Current (replaced) | Change |
|------|-------------------|-------------------|---------|
| _concepts.yaml | 404 lines (11KB) | 423 lines (12KB) | +19 lines |
| _patterns.yaml | 618 lines (21KB) | 39 lines (1.6KB) | **-579 lines ❌** |
| _decisions.yaml | 469 lines (18KB) | 54 lines (2.1KB) | **-415 lines ❌** |

**Issue:** _patterns.yaml and _decisions.yaml were gutted, not expanded

---

## TASK 1: Restore and Expand _patterns.yaml

### Step 1.1: Copy Original as Base

```bash
cp knowledgebase/restored/_patterns.yaml knowledgebase/_patterns.yaml
```

**Result:** 618 lines restored

---

### Step 1.2: Add NEW Patterns to _patterns.yaml

**Location:** Append to END of file (after line 618)

**Add These 2 New Pattern Blocks:**

```yaml

  landing_page_layout:
    name: "Building Landing Pages with Layout Components"
    problem: "Need to build marketing landing page with Greater Components"
    solution: "Use Container + Section for structure, Card for features, Heading + Text for typography, Button for CTAs"
    correct_example: |
      <script>
        import { 
          Container, 
          Section, 
          Heading, 
          Text, 
          Button, 
          Card 
        } from '@equaltoai/greater-components-primitives';
        import { ArrowRightIcon, CheckCircleIcon } from '@equaltoai/greater-components-icons';
      </script>

      <main>
        <!-- Hero Section -->
        <Section spacing="xl">
          <Container maxWidth="lg" padding="md">
            <Heading level={1} size="5xl" align="center">
              Build Amazing Products
            </Heading>
            
            <Text size="xl" color="secondary" align="center">
              Transform your ideas into reality with our platform
            </Text>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
              <Button variant="solid" size="lg">
                Get Started
                {#snippet suffix()}<ArrowRightIcon />{/snippet}
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </Container>
        </Section>
        
        <!-- Features Section -->
        <Section spacing="lg">
          <Container maxWidth="xl">
            <Heading level={2} align="center">
              Features
            </Heading>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem;">
              <Card variant="outlined" hoverable>
                {#snippet header()}
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <CheckCircleIcon />
                    <Heading level={3} size="xl">Feature One</Heading>
                  </div>
                {/snippet}
                
                <Text color="secondary">
                  Description of your amazing feature goes here.
                </Text>
              </Card>
              
              <Card variant="outlined" hoverable>
                {#snippet header()}
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <CheckCircleIcon />
                    <Heading level={3} size="xl">Feature Two</Heading>
                  </div>
                {/snippet}
                
                <Text color="secondary">
                  Another feature description.
                </Text>
              </Card>
            </div>
          </Container>
        </Section>
      </main>

    why_this_works:
      - container_constrains_width_for_readability
      - section_provides_vertical_rhythm
      - heading_maintains_semantic_structure
      - text_provides_consistent_typography
      - card_groups_related_content
      - css_grid_handles_responsive_layout

    anti_patterns:
      - name: "Looking for Grid component"
        why: "Grid component doesn't exist, use CSS Grid"
        incorrect_example: |
          // WRONG: Grid component does not exist
          import { Grid } from '@equaltoai/greater-components-primitives';
          
          <Grid columns={3}>
            <Card>...</Card>
          </Grid>
        correct_example: |
          // CORRECT: Use CSS Grid directly
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
            <Card>...</Card>
            <Card>...</Card>
            <Card>...</Card>
          </div>
        consequences:
          - import_error_grid_not_found
          - should_use_css_grid_instead
          
      - name: "Looking for Nav/Navbar component"
        why: "Navigation components don't exist, build with HTML + primitives"
        incorrect_example: |
          // WRONG: Nav component does not exist
          import { Navbar } from '@equaltoai/greater-components-primitives';
        correct_example: |
          // CORRECT: Build nav with HTML + Container + Button
          <nav>
            <Container maxWidth="xl" padding="md">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <Heading level={1} size="lg">Logo</Heading>
                <div style="display: flex; gap: 1rem;">
                  <Button variant="ghost">About</Button>
                  <Button variant="ghost">Pricing</Button>
                  <Button variant="solid">Sign Up</Button>
                </div>
              </div>
            </Container>
          </nav>
        consequences:
          - import_error_navbar_not_found
          - should_use_html_nav_with_primitives

  typography_composition:
    name: "Typography with Heading and Text Components"
    problem: "Need consistent typography across pages with semantic structure"
    solution: "Use Heading for all headings (h1-h6), Text for body content with variants"
    correct_example: |
      <script>
        import { Heading, Text } from '@equaltoai/greater-components-primitives';
      </script>

      <article>
        <!-- Main title -->
        <Heading level={1} size="4xl">
          Article Title
        </Heading>
        
        <!-- Meta info -->
        <Text size="sm" color="secondary">
          Published on Nov 19, 2025 · 5 min read
        </Text>
        
        <!-- Section -->
        <Heading level={2} size="2xl">
          Introduction
        </Heading>
        
        <!-- Body paragraphs -->
        <Text size="base">
          First paragraph of content goes here with consistent typography.
        </Text>
        
        <Text size="base" color="secondary">
          Secondary information or quotes can use different color variants.
        </Text>
        
        <!-- Subsection -->
        <Heading level={3} size="xl">
          Subsection Title
        </Heading>
        
        <Text>
          More content here.
        </Text>
      </article>

    why_this_works:
      - proper_heading_hierarchy_for_seo
      - screen_reader_friendly_structure
      - consistent_typography_via_design_tokens
      - visual_size_independent_of_semantic_level
      - color_variants_for_visual_hierarchy

    anti_patterns:
      - name: "Using Heading for non-heading content"
        why: "Heading component is semantic (h1-h6), not just for large text"
        incorrect_example: |
          // WRONG: Using h6 just to get small bold text
          <Heading level={6}>Call us at: 555-1234</Heading>
        correct_example: |
          // CORRECT: Use Text with styling for non-heading content
          <Text size="sm" weight="bold">Call us at: 555-1234</Text>
        consequences:
          - breaks_heading_hierarchy
          - confuses_screen_readers
          - poor_seo_structure
          
      - name: "Skipping heading levels"
        why: "Must maintain heading hierarchy (h1 → h2 → h3, not h1 → h3)"
        incorrect_example: |
          <Heading level={1}>Page Title</Heading>
          <Heading level={3}>Skipped h2!</Heading>  // WRONG
        correct_example: |
          <Heading level={1}>Page Title</Heading>
          <Heading level={2}>Section Title</Heading>
          <Heading level={3}>Subsection Title</Heading>
        consequences:
          - accessibility_violation
          - screen_reader_confusion
          - seo_penalty

  card_composition:
    name: "Using Card Component for Content Blocks"
    problem: "Need to display grouped content with visual separation"
    solution: "Use Card component with header/footer snippets for structured content"
    correct_example: |
      <script>
        import { Card, Button } from '@equaltoai/greater-components-primitives';
      </script>

      <!-- Static card -->
      <Card variant="elevated" padding="lg">
        {#snippet header()}
          <h3>Pricing Plan</h3>
        {/snippet}
        
        <p>$29/month</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
        
        {#snippet footer()}
          <Button variant="solid">Choose Plan</Button>
        {/snippet}
      </Card>

      <!-- Interactive card -->
      <Card 
        variant="outlined" 
        clickable 
        hoverable
        onclick={() => navigateTo('/product/123')}
      >
        <h3>Product Name</h3>
        <p>Product description...</p>
      </Card>

    why_this_works:
      - visual_separation_with_borders_shadows
      - header_footer_provide_structure
      - clickable_makes_entire_card_interactive
      - hoverable_provides_visual_feedback
      
    anti_patterns:
      - name: "Nesting cards too deeply"
        why: "Cards within cards can look cluttered"
        incorrect_example: |
          <Card>
            <Card>
              <Card>Content</Card>
            </Card>
          </Card>
        consequences:
          - visual_confusion
          - excessive_borders
          - poor_visual_hierarchy
```

**Lines to Add:** ~280 lines

**Result:** 618 (original) + 280 (new) = **~898 lines**

---

## TASK 2: Restore and Expand _decisions.yaml

### Step 2.1: Copy Original as Base

```bash
cp knowledgebase/restored/_decisions.yaml knowledgebase/_decisions.yaml
```

**Result:** 469 lines restored

---

### Step 2.2: Add NEW Decision Trees to _decisions.yaml

**Location:** Append to END of file (after line 469)

**Add These Decision Trees:**

```yaml

  layout_component_selection:
    question: "Which component should I use for page layout?"
    decision_tree:
      - condition: "Need to center content with max-width constraint"
        check: "Is this page-level content centering?"
        if_yes:
          choice: "Use Container component"
          reason: "Container provides max-width constraints and horizontal centering"
          example: |
            <Container maxWidth="lg" padding="md" centered>
              <h1>Content constrained to 1024px, centered on page</h1>
            </Container>
        if_no:
          check: "Need vertical spacing between sections?"
          if_yes:
            choice: "Use Section component"
            reason: "Section provides consistent vertical margins"
            example: |
              <Section spacing="lg">
                <h2>Section with 6rem top/bottom margin</h2>
              </Section>
          if_no:
            check: "Need grouped content with borders/shadows?"
            if_yes:
              choice: "Use Card component"
              reason: "Card provides visual container with elevation"
            if_no:
              check: "Need complex grid layout?"
              if_yes:
                choice: "Use CSS Grid (no component exists)"
                reason: "Greater Components doesn't provide Grid/Flex components, use CSS directly"
                example: |
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                    <Card>Item 1</Card>
                    <Card>Item 2</Card>
                    <Card>Item 3</Card>
                  </div>
              if_no:
                choice: "Use standard HTML elements"
                reason: "Not all layout needs a component"

  typography_component_selection:
    question: "Should I use Heading, Text, or HTML elements?"
    decision_tree:
      - condition: "What type of text content is this?"
        check: "Is this a page or section title?"
        if_yes:
          choice: "Use Heading component with appropriate level"
          reason: "Ensures semantic HTML (h1-h6) with consistent typography"
          example: |
            <Heading level={1} size="5xl">Page Title</Heading>
            <Heading level={2} size="3xl">Section Title</Heading>
            <Heading level={3}>Subsection</Heading>
          requirements:
            - must_use_correct_level_for_hierarchy
            - can_override_size_for_visual_design
            - maintain_heading_order_h1_h2_h3
        if_no:
          check: "Does text need color, size, or weight variants?"
          if_yes:
            choice: "Use Text component"
            reason: "Provides typography variants and semantic colors"
            example: |
              <Text size="lg" weight="medium">Intro text</Text>
              <Text color="secondary">Muted text</Text>
              <Text size="sm" color="error">Error message</Text>
          if_no:
            check: "Is this simple paragraph with default styling?"
            if_yes:
              choice: "Use HTML <p> directly or Text component"
              reason: "Both work fine; Text adds convenience, HTML is simpler"
              example: |
                <!-- Option 1: HTML -->
                <p>Simple paragraph text.</p>
                
                <!-- Option 2: Text component -->
                <Text>Simple paragraph text.</Text>
            if_no:
              check: "Do you need inline text (span) or label?"
              if_yes:
                choice: "Use Text component with as prop"
                reason: "Text can render as p, span, div, or label"
                example: |
                  <Text as="span">Inline text</Text>
                  <Text as="label" for="input-id">Form label</Text>

  icon_discovery_decision:
    question: "How do I find and use the right icon?"
    decision_tree:
      - condition: "Looking for a specific icon"
        check: "Do you know the exact icon name?"
        if_yes:
          choice: "Verify icon exists in component-inventory.md"
          reason: "Check complete icon list to confirm availability"
          steps:
            - open_component_inventory_md
            - search_for_icon_name_kebab_case
            - convert_to_PascalCase_plus_Icon
            - verify_in_imports
          example: |
            # If you need "code" icon:
            # 1. Check inventory: "code" is listed
            # 2. Convert: code → CodeIcon
            # 3. Import: import { CodeIcon } from '@equaltoai/greater-components-icons';
        if_no:
          check: "Do you have a semantic concept (API, workflow, etc.)?"
          if_yes:
            choice: "Use semantic alternatives from component-inventory.md"
            reason: "Document provides alternatives for common concepts that don't have specific icons"
            examples:
              api_concept:
                requested: "ApiIcon"
                exists: false
                alternatives: 
                  - ServerIcon
                  - DatabaseIcon
                  - CloudIcon
                  - CodeIcon
                recommendation: "Use ServerIcon for backend APIs, CodeIcon for code/SDKs"
              
              workflow_concept:
                requested: "WorkflowIcon"  
                exists: false
                alternatives:
                  - GitBranchIcon
                  - GitMergeIcon
                  - LayersIcon
                  - ToolIcon
                recommendation: "Use GitBranchIcon for branching workflows, LayersIcon for stacked processes"
              
              dashboard_concept:
                requested: "DashboardIcon"
                exists: false
                alternatives:
                  - BarChartIcon
                  - PieChartIcon
                  - ActivityIcon
                  - GridIcon
                recommendation: "Use BarChartIcon for analytics dashboards, GridIcon for layout-focused dashboards"
              
              network_concept:
                requested: "NetworkIcon"
                exists: false
                alternatives:
                  - WifiIcon
                  - ShareIcon
                  - LinkIcon
                  - GlobeIcon
                recommendation: "Use WifiIcon for network status, ShareIcon for sharing/connections"
          if_no:
            choice: "Browse icon categories in component-inventory.md"
            reason: "12 categories help discover icons by purpose"

  container_vs_section_usage:
    question: "Should I use Container, Section, or both?"
    decision_tree:
      - condition: "Understanding the difference"
        check: "What are you trying to achieve?"
        options:
          max_width_centering:
            choice: "Container component"
            reason: "Container constrains width and centers horizontally"
            use_for:
              - preventing_text_lines_too_long
              - centering_content_on_large_screens
              - responsive_max_width_constraints
            example: |
              <Container maxWidth="lg">
                <!-- Content constrained to 1024px -->
              </Container>
          
          vertical_spacing:
            choice: "Section component"
            reason: "Section provides vertical margins between page sections"
            use_for:
              - spacing_between_hero_and_features
              - visual_separation_of_content_blocks
              - consistent_vertical_rhythm
            example: |
              <Section spacing="lg">
                <!-- 6rem top and bottom margin -->
              </Section>
          
          both_together:
            choice: "Nest Container inside Section"
            reason: "Section for vertical spacing, Container for width constraint"
            pattern: "Section wraps full-width backgrounds, Container constrains inner content"
            example: |
              <!-- Full-width background section -->
              <Section spacing="xl" style="background: #f5f5f5;">
                <!-- Constrained content within -->
                <Container maxWidth="lg" padding="md">
                  <Heading level={2}>Section Title</Heading>
                  <Text>Content here...</Text>
                </Container>
              </Section>
            when_to_use:
              - full_width_background_colors
              - alternating_section_backgrounds
              - max_width_content_with_section_spacing

  card_variant_selection:
    question: "Which Card variant should I use?"
    decision_tree:
      - condition: "Choosing card visual style"
        check: "What's the visual context?"
        options:
          elevated:
            choice: "variant='elevated'"
            reason: "Best for cards on plain backgrounds, provides depth"
            use_when:
              - default_choice
              - white_or_solid_color_background
              - need_visual_depth
            example: |
              <Card variant="elevated">
                <!-- Card with shadow -->
              </Card>
          
          outlined:
            choice: "variant='outlined'"
            reason: "Best for cards on textured/gradient backgrounds, cleaner look"
            use_when:
              - background_has_texture_or_pattern
              - prefer_minimal_design
              - cards_within_elevated_containers
            example: |
              <Card variant="outlined">
                <!-- Card with border, no shadow -->
              </Card>
          
          filled:
            choice: "variant='filled'"
            reason: "Best for subtle differentiation without borders"
            use_when:
              - need_subtle_background_differentiation
              - cards_in_dense_layouts
              - secondary_content_blocks
            example: |
              <Card variant="filled">
                <!-- Card with filled background -->
              </Card>
```

**Lines to Add:** ~300 lines

**Result:** 618 (original) + 300 (new) = **~918 lines**

---

## TASK 3: Restore and Expand _decisions.yaml

### Step 3.1: Copy Original as Base

```bash
cp knowledgebase/restored/_decisions.yaml knowledgebase/_decisions.yaml
```

**Result:** 469 lines restored

---

### Step 3.2: Add NEW Decision Trees to _decisions.yaml

**Location:** Append to END of file (after line 469)

**Add These Decision Trees:**

```yaml

  new_component_discovery:
    question: "How do I know if a component exists in Greater Components?"
    decision_tree:
      - condition: "Verifying component availability"
        check: "Which package would it be in?"
        if_primitives:
          steps:
            - "Check component-inventory.md primitives section (20 components listed)"
            - "If not in the list of 20, it DOES NOT EXIST"
            - "Check does_not_provide section for common requests"
            - "Use alternatives suggested in inventory"
          examples:
            exists:
              - Container
              - Section  
              - Card
              - Heading
              - Text
              - Button
              - Modal
              - TextField
            does_not_exist:
              - Grid (use CSS Grid)
              - Flex (use CSS Flexbox)
              - Nav (use HTML nav + Button)
              - Table (use HTML table)
              - Image (use HTML img)
        if_icons:
          steps:
            - "Check component-inventory.md icons section (300+ icons listed)"
            - "Icons listed alphabetically in 12 categories"
            - "If not listed, check icon_search_tips for alternatives"
            - "Convert kebab-case filename to PascalCase + Icon"
          examples:
            exists:
              - CodeIcon (from code.svelte)
              - ServerIcon (from server.svelte)
              - LayersIcon (from layers.svelte)
            does_not_exist:
              - ApiIcon (use ServerIcon or CodeIcon)
              - WorkflowIcon (use GitBranchIcon or LayersIcon)
              - DashboardIcon (use BarChartIcon or GridIcon)

  landing_page_component_choice:
    question: "What components do I need for a landing page?"
    decision_tree:
      - condition: "Building landing page sections"
        sections:
          hero:
            components:
              - Container (for width constraint)
              - Heading (for title)
              - Text (for subtitle/description)
              - Button (for CTAs)
            structure: |
              <Container maxWidth="lg">
                <Heading level={1} size="5xl">Hero Title</Heading>
                <Text size="xl" color="secondary">Subtitle</Text>
                <Button variant="solid" size="lg">Get Started</Button>
              </Container>
          
          features:
            components:
              - Section (for vertical spacing)
              - Container (for width constraint)
              - Card (for each feature)
              - Heading (for feature titles)
              - Text (for descriptions)
            structure: |
              <Section spacing="lg">
                <Container maxWidth="xl">
                  <div style="display: grid; ...">
                    <Card>
                      <Heading level={3}>Feature</Heading>
                      <Text>Description</Text>
                    </Card>
                  </div>
                </Container>
              </Section>
          
          cta:
            components:
              - Section (for spacing)
              - Container (for centering)
              - Heading (for CTA title)
              - Button (for action)
            structure: |
              <Section spacing="xl">
                <Container maxWidth="md" centered>
                  <Heading level={2} align="center">Ready to start?</Heading>
                  <Button variant="solid" size="lg">Sign Up Now</Button>
                </Container>
              </Section>
          
          footer:
            components:
              - Container (for width constraint)
              - Text (for footer text)
              - Button (for footer links, variant="ghost")
            note: "Use HTML <footer> element, Container inside for width control"

  responsive_layout_strategy:
    question: "How do I make my layout responsive?"
    decision_tree:
      - condition: "Implementing responsive design"
        check: "What needs to be responsive?"
        options:
          container_width:
            choice: "Use Container maxWidth prop"
            reason: "Container automatically adapts to smaller screens"
            behavior: "Max-width is constraint, content fluid below that"
            
          grid_columns:
            choice: "Use CSS Grid with auto-fit"
            reason: "No Grid component, use CSS"
            example: |
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <Card>...</Card>
              </div>
            
          section_spacing:
            choice: "Section spacing automatically scales"
            reason: "Design tokens use rem units which scale"
            note: "Can override with media queries in custom styles if needed"
            
          typography:
            choice: "Heading and Text components use responsive tokens"
            reason: "Font sizes in rem units scale with root font size"
            can_override: "Use size prop for explicit control per breakpoint"
```

**Lines to Add:** ~180 lines

**Result:** 469 (original) + 180 (new) = **~649 lines**

---

## TASK 4: Update _concepts.yaml (Already Good)

**Current State:** 423 lines (was 404, already updated)

**Verify These Updates Present:**
- ✅ Line 48: Updated purpose to include "any website type"
- ✅ Lines 50-56: use_cases added (6 cases)
- ✅ Lines 72-76: All 5 new components in provides list
- ✅ Lines 80-86: does_not_provide section (NEW)
- ✅ Lines 88-93: use_html_for section (NEW)

**Additional Updates Needed:** None - this file was properly expanded, not replaced

---

## Implementation Instructions

### For the Agent

**DO NOT:** Replace existing content  
**DO:** Append new sections to the END of restored files

**Process:**

1. **Restore _patterns.yaml:**
   ```bash
   cp knowledgebase/restored/_patterns.yaml knowledgebase/_patterns.yaml
   ```

2. **Append to _patterns.yaml:**
   - Add blank line after line 618
   - Add the 3 new pattern blocks (landing_page_layout, typography_composition, card_composition)
   - Total: 618 + ~280 = 898 lines

3. **Restore _decisions.yaml:**
   ```bash
   cp knowledgebase/restored/_decisions.yaml knowledgebase/_decisions.yaml
   ```

4. **Append to _decisions.yaml:**
   - Add blank line after line 469
   - Add the 4 new decision trees (layout_component_selection, typography_component_selection, icon_discovery_decision, landing_page_component_choice, responsive_layout_strategy)
   - Total: 469 + ~180 = 649 lines

5. **Verify _concepts.yaml:**
   - Already properly updated (not replaced)
   - 423 lines includes original 404 + new sections
   - No action needed

---

## Validation Checklist

After expansion, verify:

### _patterns.yaml
- [ ] File is ~900 lines (not 39)
- [ ] Original 618 lines present
- [ ] landing_page_layout pattern added
- [ ] typography_composition pattern added
- [ ] card_composition pattern added
- [ ] All original patterns still present

### _decisions.yaml  
- [ ] File is ~650 lines (not 54)
- [ ] Original 469 lines present
- [ ] layout_component_selection added
- [ ] typography_component_selection added
- [ ] icon_discovery_decision added
- [ ] landing_page_component_choice added
- [ ] responsive_layout_strategy added
- [ ] All original decision trees still present

### _concepts.yaml
- [ ] File is ~423 lines (correct, already updated)
- [ ] All 5 new components in provides list
- [ ] does_not_provide section present
- [ ] use_html_for section present
- [ ] use_cases includes landing pages, marketing sites
- [ ] Original content preserved

---

## Success Criteria

**Phase 6.4 Complete When:**
- ✅ _concepts.yaml: 423 lines (already done)
- ✅ _patterns.yaml: ~900 lines (restore + append)
- ✅ _decisions.yaml: ~650 lines (restore + append)
- ✅ All original content preserved
- ✅ New patterns/decisions added
- ✅ No content loss

**Total YAML lines:** 423 + 900 + 650 = **~1,973 lines** (vs original 1,491 = +482 lines net addition)

