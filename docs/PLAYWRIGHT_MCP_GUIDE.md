# Playwright MCP Guide for Cursor Agents

## Overview

The Playwright MCP (Model Context Protocol) server provides browser automation capabilities to Cursor agents through a browser extension. This allows AI agents to interact with web pages, navigate, click elements, fill forms, and perform other browser automation tasks.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI assistants to access external tools and resources. In this case, the `cursor-browser-extension` MCP server exposes Playwright browser automation capabilities to Cursor agents.

## Available Tools

The Playwright MCP provides the following tools:

### Navigation
- `browser_navigate` - Navigate to a URL
- `browser_navigate_back` - Go back to the previous page
- `browser_tabs` - List, create, close, or select browser tabs

### Page Inspection
- `browser_snapshot` - Capture accessibility snapshot of the current page (recommended over screenshots for actions)
- `browser_take_screenshot` - Take a screenshot (PNG or JPEG)
- `browser_console_messages` - Get all console messages
- `browser_network_requests` - Get all network requests since page load

### Interaction
- `browser_click` - Click on an element
- `browser_hover` - Hover over an element
- `browser_type` - Type text into an editable element
- `browser_select_option` - Select option(s) in a dropdown
- `browser_drag` - Perform drag and drop between elements
- `browser_fill_form` - Fill multiple form fields at once
- `browser_press_key` - Press a keyboard key

### Advanced
- `browser_evaluate` - Execute JavaScript on the page or element
- `browser_wait_for` - Wait for text to appear/disappear or time to pass
- `browser_handle_dialog` - Handle alert, confirm, or prompt dialogs
- `browser_resize` - Resize the browser window

## How to Use with Cursor Agents

### Basic Workflow

1. **Start with a snapshot** - Always begin by taking a snapshot to understand the current page state:
   ```
   "Take a snapshot of the current browser page"
   ```

2. **Navigate if needed** - If you need to go to a specific page:
   ```
   "Navigate to https://example.com"
   ```

3. **Interact with elements** - Use the snapshot to identify elements, then interact:
   ```
   "Click on the login button"
   "Fill in the email field with test@example.com"
   ```

### Best Practices for Prompting Agents

#### ✅ DO: Be Specific About Actions

**Good:**
```
"Take a snapshot of the page, then click the 'Sign In' button in the top navigation"
```

**Bad:**
```
"Go to the website and log in"
```

#### ✅ DO: Use Element Descriptions from Snapshots

When referencing elements, use the descriptions from snapshots:
```
"Click the button labeled 'Submit Form' (ref=e42)"
```

#### ✅ DO: Break Down Complex Tasks

**Good:**
```
"First, take a snapshot. Then fill in the email field with 'user@example.com', 
fill in the password field with 'password123', and click the submit button."
```

**Bad:**
```
"Fill out the login form"
```

#### ✅ DO: Request Verification

**Good:**
```
"Navigate to the dashboard and take a snapshot to confirm we're on the right page"
```

#### ✅ DO: Use Snapshots for Element Discovery

**Good:**
```
"Take a snapshot, then find and click the 'Settings' link"
```

### Common Patterns

#### Pattern 1: Form Filling

```
"Take a snapshot of the page. Then fill the form:
- Email field: user@example.com
- Password field: secret123
- Check the 'Remember me' checkbox
Then click the submit button."
```

#### Pattern 2: Multi-Step Navigation

```
"Navigate to https://example.com/login. Take a snapshot. 
Click the 'Forgot Password' link. Wait for the page to load, 
then take another snapshot."
```

#### Pattern 3: Element Discovery and Interaction

```
"Take a snapshot. Find the search box and type 'test query'. 
Then click the search button."
```

#### Pattern 4: Verification and Debugging

```
"Take a snapshot. Check the console messages for any errors. 
Also check the network requests to see if the API call succeeded."
```

## Understanding Snapshots

Snapshots provide an accessibility tree representation of the page. They include:

- **Element types**: button, link, textbox, checkbox, etc.
- **Labels/Text**: Visible text content
- **References**: Unique ref IDs (e.g., `ref=e42`) for targeting elements
- **Attributes**: ARIA labels, roles, states (checked, disabled, etc.)
- **Hierarchy**: Parent-child relationships

### Example Snapshot Structure

```yaml
- button "Sign In" [ref=e12] [cursor=pointer]:
  - generic [ref=e13]:
    - img [ref=e16]
    - generic [ref=e17]: Sign In
- textbox "Email" [ref=e23]: 
- button "Submit" [ref=e42] [cursor=pointer]
```

### Using Refs for Reliable Targeting

When an agent needs to interact with an element, it should use both:
1. **Human-readable description**: "Sign In button"
2. **Ref ID**: `ref=e12`

This ensures reliable targeting even if the page structure changes slightly.

## Tips for Better Agent Performance

### 1. Always Start with Context

Before asking an agent to interact with a page, have it take a snapshot first:
```
"Take a snapshot of the current page so we can see what's available"
```

### 2. Be Explicit About Element Selection

Don't assume the agent can infer which element you mean:
```
❌ "Click the button"
✅ "Click the 'Submit' button (ref=e42)"
```

### 3. Use Wait Commands for Dynamic Content

If content loads dynamically:
```
"Click the 'Load More' button, then wait for 'Loading complete' text to appear, 
then take a snapshot"
```

### 4. Verify Actions Were Successful

After important actions, verify:
```
"Click the submit button, then wait 2 seconds and take a snapshot to verify 
the form was submitted"
```

### 5. Use Console and Network Inspection for Debugging

When troubleshooting:
```
"Take a snapshot, then check the console messages and network requests 
to see if there are any errors"
```

## Common Use Cases

### Testing Web Applications

```
"Navigate to http://localhost:3000. Take a snapshot. 
Fill in the login form with test credentials and submit. 
Wait for the dashboard to load, then take another snapshot."
```

### Web Scraping

```
"Navigate to https://example.com/products. Take a snapshot. 
Extract all product names using browser_evaluate to run JavaScript 
that collects the text content."
```

### Form Automation

```
"Navigate to https://example.com/contact. Take a snapshot. 
Fill the contact form:
- Name: John Doe
- Email: john@example.com  
- Message: Test message
Then click submit and wait for confirmation."
```

### E2E Testing

```
"Navigate to the app. Take a snapshot. Click 'Create Account'. 
Fill in registration form. Submit. Wait for welcome message. 
Take final snapshot to verify success."
```

## Troubleshooting

### Issue: Agent Can't Find Elements

**Solution:** Always have the agent take a snapshot first, then reference specific elements by their labels and refs.

```
"Take a snapshot. Now click the button labeled 'Submit' (ref=e42)"
```

### Issue: Actions Happen Too Fast

**Solution:** Use `browser_wait_for` to wait for content to load:

```
"Click the button, then wait for 'Success' text to appear"
```

### Issue: Agent Uses Wrong Element

**Solution:** Be more specific with element descriptions:

```
❌ "Click the button"
✅ "Click the 'Save Changes' button in the form footer (ref=e89)"
```

### Issue: Page State Not Updating

**Solution:** Take snapshots before and after actions to verify state:

```
"Take a snapshot. Click the toggle. Wait 1 second. Take another snapshot 
to see the updated state."
```

## Advanced Techniques

### Using JavaScript Evaluation

For complex interactions or data extraction:

```
"Use browser_evaluate to run this JavaScript:
() => {
  const products = Array.from(document.querySelectorAll('.product-name'));
  return products.map(p => p.textContent);
}"
```

### Handling Dialogs

```
"Click the delete button. When the confirm dialog appears, 
accept it using browser_handle_dialog."
```

### Multi-Tab Management

```
"Open a new tab and navigate to https://example.com. 
List all tabs. Switch to tab 1."
```

## Example: Complete Workflow

Here's a complete example of a well-structured request:

```
"Navigate to https://example.com/login. Take a snapshot to see the login form.

Fill in the form:
- Email field: test@example.com
- Password field: testpassword123

Click the 'Sign In' button. Wait for the dashboard to load (wait for 'Dashboard' heading).

Take another snapshot to verify we're logged in. Check the console messages 
for any errors."
```

## Key Takeaways

1. **Always start with snapshots** - They provide the context agents need
2. **Be specific** - Use element labels and refs from snapshots
3. **Break down tasks** - Complex tasks into smaller, explicit steps
4. **Verify actions** - Take snapshots after important actions
5. **Use waits** - For dynamic content that loads asynchronously
6. **Debug with console/network** - When things go wrong, inspect these

## For Codex Users

If you're using Codex and it's not performing well with browser automation:

1. **Provide explicit step-by-step instructions** - Don't assume it will infer the workflow
2. **Always request snapshots first** - Codex needs context before acting
3. **Use refs explicitly** - Reference elements by both label and ref ID
4. **Break complex tasks into multiple prompts** - One action per prompt if needed
5. **Verify each step** - Request snapshots after each major action
6. **Use simple, direct language** - Avoid ambiguous instructions

Example prompt structure for Codex:
```
Step 1: Take a snapshot of the current page
Step 2: Find the email input field (look for ref starting with 'e' and type 'textbox')
Step 3: Type 'user@example.com' into that field
Step 4: Take another snapshot to verify the field was filled
```

