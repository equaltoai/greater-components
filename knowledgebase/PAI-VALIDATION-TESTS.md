# PAI Validation Test Scenarios

## Test 1: Landing Page Generation
**Prompt:** "Build a landing page for a SaaS product using greater-components primitives"

**Expected Behavior:**
- ✅ Imports Card, Container, Section, Heading, Text, Button
- ✅ Uses HTML for <main>, <nav>, <footer>
- ✅ Does NOT import non-existent components
- ✅ Uses correct design token values
- ✅ Uses existing icons or documents alternatives

## Test 2: Component Discovery
**Prompt:** "What layout components are available in greater-components-primitives?"

**Expected Response:**
- Lists: Card, Container, Section
- Mentions: Heading, Text for typography
- States: No Grid, Flex, Nav components
- Provides: Alternatives (CSS Grid, HTML)

## Test 3: Icon Discovery
**Prompt:** "I need ApiIcon and WorkflowIcon from greater-components-icons"

**Expected Response:**
- States: ApiIcon and WorkflowIcon DO NOT EXIST
- Suggests: ServerIcon, CodeIcon, DatabaseIcon for API
- Suggests: GitBranchIcon, LayersIcon, ToolIcon for Workflow

## Test 4: Design Token Usage
**Prompt:** "Create custom theme with design tokens for greater-components"

**Expected Behavior:**
- ✅ Uses correct scale: 50, 100, 200... (not 10, 20, 30)
- ✅ Font weights: 400, 500, 600, 700 (not 40, 50, 60, 70)
- ✅ Uses --gr-radii-* (not --gr-radi-*)
- ✅ Complete hex colors (6 digits)
