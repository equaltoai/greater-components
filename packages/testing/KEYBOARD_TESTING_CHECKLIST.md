# Manual Keyboard Testing Checklist

This comprehensive checklist ensures all Greater Components are fully keyboard accessible and meet WCAG 2.1 AA requirements.

## General Keyboard Navigation Principles

### ✅ Basic Tab Navigation
- [ ] **Tab Order**: All interactive elements can be reached using Tab key
- [ ] **Logical Flow**: Tab order follows visual layout (left-to-right, top-to-bottom)
- [ ] **No Traps**: Focus never gets trapped (except in modals where expected)
- [ ] **Skip Links**: Skip links are available and functional
- [ ] **Reverse Navigation**: Shift+Tab works in reverse order

### ✅ Focus Management
- [ ] **Visible Indicators**: All focused elements have clear visual indicators
- [ ] **High Contrast**: Focus indicators remain visible in high contrast mode
- [ ] **Color Independence**: Focus doesn't rely solely on color changes
- [ ] **Programmatic Focus**: Focus moves logically after dynamic content changes
- [ ] **Restoration**: Focus returns to trigger element after modal/dropdown closes

## Component-Specific Testing

### 🔘 Button Component
- [ ] **Space/Enter Activation**: Both Space and Enter keys trigger button
- [ ] **Disabled State**: Disabled buttons cannot receive focus
- [ ] **Loading State**: Button remains focusable but indicates loading
- [ ] **Icon Buttons**: Icon-only buttons have proper accessible names
- [ ] **Button Groups**: Tab order flows through button groups logically

**Expected Keyboard Shortcuts:**
- `Space` or `Enter`: Activate button
- `Tab`: Move to next focusable element
- `Shift+Tab`: Move to previous focusable element

### 📝 TextField Component
- [ ] **Focus on Click**: Field receives focus when clicked or tabbed to
- [ ] **Cursor Position**: Text cursor appears in correct position
- [ ] **Selection**: Text can be selected using Shift+Arrow keys
- [ ] **Clear Function**: Clear button (if present) is keyboard accessible
- [ ] **Error States**: Error messages are announced to screen readers

**Expected Keyboard Shortcuts:**
- `Tab`: Enter/exit field
- `Arrow Keys`: Move cursor within text
- `Shift+Arrow`: Select text
- `Ctrl+A`: Select all text
- `Home/End`: Move to start/end of text
- `Ctrl+Home/End`: Move to start/end of document

### 🎛️ Menu Component
- [ ] **Arrow Navigation**: Up/Down arrows navigate menu items
- [ ] **Home/End**: Jump to first/last menu item
- [ ] **Escape**: Closes menu and returns focus to trigger
- [ ] **Enter/Space**: Activates menu item
- [ ] **Letter Keys**: Type-ahead navigation works
- [ ] **Submenu Navigation**: Right arrow opens submenus, Left arrow closes

**Expected Keyboard Shortcuts:**
- `Enter` or `Space`: Open menu
- `ArrowDown/ArrowUp`: Navigate menu items
- `Home/End`: Jump to first/last item
- `Escape`: Close menu
- `ArrowRight`: Open submenu (if applicable)
- `ArrowLeft`: Close submenu (if applicable)
- `A-Z`: Type-ahead search

### 🗂️ Tabs Component
- [ ] **Arrow Navigation**: Left/Right arrows navigate tab headers
- [ ] **Activation**: Enter or Space activates selected tab
- [ ] **Home/End**: Jump to first/last tab
- [ ] **Panel Focus**: Tab panel receives focus after activation
- [ ] **Roving Tabindex**: Only active tab is in tab order

**Expected Keyboard Shortcuts:**
- `ArrowLeft/ArrowRight`: Navigate between tab headers
- `Home/End`: Jump to first/last tab
- `Enter` or `Space`: Activate selected tab
- `Tab`: Move to tab panel content
- `Shift+Tab`: Return to tab headers

### 🪟 Modal/Dialog Component
- [ ] **Focus Trap**: Focus is trapped within modal
- [ ] **Initial Focus**: Focus moves to appropriate element in modal
- [ ] **Escape to Close**: Escape key closes modal
- [ ] **Return Focus**: Focus returns to trigger element on close
- [ ] **Background Interaction**: Background content is not accessible

**Expected Keyboard Shortcuts:**
- `Escape`: Close modal
- `Tab`: Cycle through modal content (trapped)
- `Shift+Tab`: Reverse cycle through modal content
- `Enter`: Activate default action (if applicable)

### 💡 Tooltip Component
- [ ] **Hover/Focus**: Tooltip appears on both hover and focus
- [ ] **Escape**: Escape key dismisses tooltip
- [ ] **Persistent**: Tooltip remains visible while focused
- [ ] **No Interference**: Tooltip doesn't interfere with keyboard navigation

**Expected Keyboard Shortcuts:**
- `Tab`: Show tooltip on focus
- `Escape`: Hide tooltip
- `Tab/Shift+Tab`: Continue navigation (tooltip follows focus)

### 🎚️ Slider Component
- [ ] **Arrow Keys**: Left/Right (or Up/Down) adjust value
- [ ] **Page Keys**: Page Up/Down for larger increments
- [ ] **Home/End**: Jump to minimum/maximum values
- [ ] **Value Announcement**: Current value is announced on change
- [ ] **Step Increment**: Values change by appropriate step size

**Expected Keyboard Shortcuts:**
- `ArrowLeft/ArrowDown`: Decrease value
- `ArrowRight/ArrowUp`: Increase value
- `Home`: Set to minimum value
- `End`: Set to maximum value
- `PageUp/PageDown`: Large increment/decrement

### ☑️ Checkbox Component
- [ ] **Space Toggle**: Space key toggles checked state
- [ ] **State Announcement**: State changes are announced
- [ ] **Indeterminate State**: Mixed state is properly announced
- [ ] **Fieldset Navigation**: Tab order works correctly in groups

**Expected Keyboard Shortcuts:**
- `Space`: Toggle checked/unchecked state
- `Tab`: Move to next checkbox or control
- `Shift+Tab`: Move to previous checkbox or control

### 🔘 Radio Component
- [ ] **Arrow Navigation**: Arrow keys navigate within radio group
- [ ] **Space Selection**: Space selects radio button
- [ ] **Group Behavior**: Only one radio per group can be selected
- [ ] **Roving Tabindex**: Only selected radio is in tab order

**Expected Keyboard Shortcuts:**
- `ArrowUp/ArrowDown`: Navigate between radio buttons in group
- `Space`: Select radio button
- `Tab`: Enter/exit radio group
- `Shift+Tab`: Enter/exit radio group (reverse)

### 🎯 Dropdown/Select Component
- [ ] **Space/Enter**: Opens dropdown
- [ ] **Arrow Navigation**: Navigates options
- [ ] **Type-ahead**: Typing navigates to matching options
- [ ] **Escape**: Closes dropdown without selection
- [ ] **Enter Selection**: Selects highlighted option

**Expected Keyboard Shortcuts:**
- `Space` or `Enter`: Open dropdown
- `ArrowUp/ArrowDown`: Navigate options
- `Home/End`: First/last option
- `Escape`: Close without selecting
- `Enter`: Select highlighted option
- `A-Z`: Type-ahead to option

## Advanced Navigation Patterns

### 🔄 Roving Tabindex (for grids, toolbars, etc.)
- [ ] **Single Tab Stop**: Only one element in group is tabbable
- [ ] **Arrow Navigation**: Arrow keys move focus within group
- [ ] **Focus Memory**: Last focused element becomes tabbable
- [ ] **Boundary Behavior**: Navigation handles edges appropriately

### 🌐 Live Regions
- [ ] **Dynamic Content**: Screen readers announce changes
- [ ] **Appropriate Politeness**: Uses correct aria-live values
- [ ] **Focus Management**: Focus doesn't jump unexpectedly
- [ ] **Content Updates**: Updates are meaningful and clear

## Testing Procedures

### 🧪 Manual Testing Steps

1. **Disconnect Mouse**: Test with keyboard only
2. **Tab Through Interface**: Verify complete navigation path
3. **Test All Interactions**: Ensure all actions work via keyboard
4. **Check Focus Indicators**: Verify visibility in all themes
5. **Test Error Scenarios**: Ensure keyboard access during errors
6. **Verify Announcements**: Use screen reader to check announcements

### 🔧 Testing Tools

- **Built-in Browser Tools**: Use browser's accessibility dev tools
- **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
- **Keyboard Only**: Physically unplug mouse or disable trackpad
- **axe DevTools**: Browser extension for automated checks
- **Accessibility Insights**: Microsoft's accessibility testing tools

### 📋 Test Matrix

| Component | Tab Navigation | Arrow Keys | Enter/Space | Escape | Home/End | Screen Reader |
|-----------|---------------|------------|-------------|--------|----------|---------------|
| Button    | ✅            | ❌         | ✅          | ❌     | ❌       | ✅            |
| TextField | ✅            | ✅*        | ❌*         | ❌     | ✅       | ✅            |
| Menu      | ❌*           | ✅         | ✅          | ✅     | ✅       | ✅            |
| Tabs      | ✅*           | ✅         | ✅          | ❌     | ✅       | ✅            |
| Modal     | ✅*           | ❌         | ✅*         | ✅     | ❌       | ✅            |
| Tooltip   | ✅            | ❌         | ❌          | ✅     | ❌       | ✅            |
| Slider    | ✅            | ✅         | ❌          | ❌     | ✅       | ✅            |
| Checkbox  | ✅            | ❌         | ✅          | ❌     | ❌       | ✅            |
| Radio     | ✅*           | ✅         | ✅          | ❌     | ❌       | ✅            |
| Dropdown  | ✅            | ✅*        | ✅          | ✅     | ✅*      | ✅            |

*\* = Context-dependent behavior*

## Common Issues and Solutions

### 🚨 Focus Traps
**Problem**: Focus gets stuck in a component
**Solution**: Implement proper tab cycling and escape routes

### 👻 Missing Focus Indicators
**Problem**: No visible focus indication
**Solution**: Ensure `:focus` and `:focus-visible` styles are implemented

### 🔀 Illogical Tab Order
**Problem**: Tab order doesn't match visual layout
**Solution**: Use `tabindex` sparingly and fix DOM order

### 🔇 Missing Announcements
**Problem**: State changes not announced to screen readers
**Solution**: Use appropriate ARIA live regions and labels

### ⚡ Unexpected Focus Movement
**Problem**: Focus jumps unexpectedly during interactions
**Solution**: Manage focus programmatically during dynamic content changes

## Acceptance Criteria

### ✅ Component Must Pass All Tests
- [ ] All keyboard shortcuts work as documented
- [ ] Focus indicators are visible in all themes
- [ ] Screen reader announcements are appropriate
- [ ] No keyboard traps (except intended ones)
- [ ] Navigation is logical and predictable

### 📊 Performance Standards
- [ ] Focus changes happen within 100ms
- [ ] No lag in keyboard response
- [ ] Smooth animations don't interfere with navigation
- [ ] Works consistently across browsers

### 🎯 User Experience Goals
- [ ] Keyboard-only users can complete all tasks
- [ ] Navigation feels natural and efficient
- [ ] Clear feedback for all actions
- [ ] No confusion about current location or state
- [ ] Consistent behavior across similar components

## Documentation Requirements

### 📚 Component Documentation
- [ ] Keyboard shortcuts documented in component docs
- [ ] Accessibility features highlighted
- [ ] Known limitations disclosed
- [ ] Testing instructions provided

### 🧑‍💻 Developer Guidelines
- [ ] Implementation patterns documented
- [ ] Common pitfalls and solutions listed
- [ ] Testing procedures outlined
- [ ] Review checklist available

---

## Quick Reference: Essential Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Navigate forward | `Tab` | Move to next interactive element |
| Navigate backward | `Shift+Tab` | Move to previous interactive element |
| Activate | `Enter` or `Space` | Activate buttons, links, form controls |
| Cancel/Close | `Escape` | Close dialogs, menus, cancel operations |
| Navigate within component | `Arrow Keys` | Move within menus, tabs, grids |
| Jump to beginning | `Home` | First item in lists, beginning of text |
| Jump to end | `End` | Last item in lists, end of text |
| Select all | `Ctrl+A` | Select all text or items |

> **Note**: This checklist should be used alongside automated accessibility testing tools. Manual testing catches many issues that automated tools miss, especially around user experience and context-specific interactions.