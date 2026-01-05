Scanning for CSP violations...

# CSP Violation Report

Generated: 2026-01-05T21:38:39.812Z

## Summary

- Total Violations: 1657
- Ship-Blocking: 21
- Follow-Up: 1636

## Ship-Blocking Components

- packages/primitives/src/components/Avatar.svelte
- packages/primitives/src/components/Container.svelte
- packages/primitives/src/components/Section.svelte
- packages/primitives/src/components/Skeleton.svelte
- packages/primitives/src/components/Text.svelte
- packages/primitives/src/components/Theme/ColorHarmonyPicker.svelte
- packages/primitives/src/components/Theme/ContrastChecker.svelte
- packages/primitives/src/components/Theme/ThemeWorkbench.svelte
- packages/primitives/src/components/ThemeProvider.svelte
- packages/primitives/src/components/ThemeSwitcher.svelte
- packages/primitives/src/components/Tooltip.svelte

## Source Violations

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-0nPOSf/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/components/Article/ReadingProgress.svelte:55:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="gr-blog-reading-progress__bar" style="width: {progress * 100}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-1sPblg/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/components/Article/ReadingProgress.svelte:55:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="gr-blog-reading-progress__bar" style="width: {progress * 100}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-4V7rT3/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-FsAQc2/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-GjHjwx/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-J24WUF/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-JqeQqS/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-LbPf9q/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-LjIGWj/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-QJAdZ7/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-VNuhFS/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-YOBVLv/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Artwork/Image.svelte:119:51

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<figure class="gr-artist-artwork-image-container" style={aspectRatioStyle()}>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Artwork/Title.svelte:61:54

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<svelte:element this={HeadingTag} class={titleClass} style="--max-lines: {maxLines}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/ArtworkCard.svelte:151:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={aspectRatioStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Community/Collaboration/Root.svelte:135:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="collaboration__status" style="background: {statusBadge.color}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Community/Collaboration/Split.svelte:116:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collab-split__bar-fill" style="width: {currentValue}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Community/CritiqueCircle/Members.svelte:109:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="critique-members__badge" style="background: {badge.color}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/CritiqueMode/Annotations.svelte:70:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background: {getColor(annotation.category)}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:152:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="clip-path: inset(0 {100 - comparison.sliderPosition}% 0 0)"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:157:47

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="wip-compare__slider-handle" style="left: {comparison.sliderPosition}%">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:185:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="opacity: {comparison.overlayOpacity}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:38:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {thread.currentProgress}%"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:55:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position}%"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:71:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position + ((1 / (thread.updates.length - 1)) * 100) / 2}%"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/CreativeTools/WorkInProgress/VersionCard.svelte:79:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {displayUpdate.progress}%"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Curation/CollectionCard.svelte:145:40

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collection-card__preview" style="--preview-count: {Math.min(preview, 4)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Curation/CuratorSpotlight.svelte:204:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="--preview-count: {previewArtworks.length}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Exhibition/Gallery.svelte:78:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-gallery__grid" style="--columns: {columns}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/Exhibition/Navigation.svelte:83:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-nav__progress-bar" style="width: {progress}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-artist2-E7Uevb/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/components/Article/ReadingProgress.svelte:55:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="gr-blog-reading-progress__bar" style="width: {progress * 100}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog-nHnV38/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/components/Article/ReadingProgress.svelte:55:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="gr-blog-reading-progress__bar" style="width: {progress * 100}%"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-blog2-AgtC0r/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm-NK9OvP/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-comm2-AliOdE/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-manual-jvwAjI/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-smoke-comm-NAdE70/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-tPwEJi/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-u5UbBR/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/cli-fixture-uYICzW/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/debug-community-p6afd5/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Artwork/Image.svelte:119:51

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<figure class="gr-artist-artwork-image-container" style={aspectRatioStyle()}>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Artwork/Title.svelte:61:54

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<svelte:element this={HeadingTag} class={titleClass} style="--max-lines: {maxLines}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/ArtworkCard.svelte:151:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={aspectRatioStyle()}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Community/Collaboration/Root.svelte:135:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="collaboration__status" style="background: {statusBadge.color}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Community/Collaboration/Split.svelte:116:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collab-split__bar-fill" style="width: {currentValue}%"></div>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Community/CritiqueCircle/Members.svelte:109:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="critique-members__badge" style="background: {badge.color}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/CritiqueMode/Annotations.svelte:70:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background: {getColor(annotation.category)}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:152:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="clip-path: inset(0 {100 - comparison.sliderPosition}% 0 0)"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:157:47

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="wip-compare__slider-handle" style="left: {comparison.sliderPosition}%">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:185:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="opacity: {comparison.overlayOpacity}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:38:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {thread.currentProgress}%"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:55:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position}%"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:71:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position + ((1 / (thread.updates.length - 1)) * 100) / 2}%"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/CreativeTools/WorkInProgress/VersionCard.svelte:79:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {displayUpdate.progress}%"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Curation/CollectionCard.svelte:145:40

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collection-card__preview" style="--preview-count: {Math.min(preview, 4)}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Curation/CuratorSpotlight.svelte:204:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="--preview-count: {previewArtworks.length}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Exhibition/Gallery.svelte:78:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-gallery__grid" style="--columns: {columns}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/Exhibition/Navigation.svelte:83:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-nav__progress-bar" style="width: {progress}%"></div>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/docs-check-clean-FDOijd/src/lib/greater/primitives/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Artwork/Image.svelte:119:51

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<figure class="gr-artist-artwork-image-container" style={aspectRatioStyle()}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Artwork/Title.svelte:61:54

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<svelte:element this={HeadingTag} class={titleClass} style="--max-lines: {maxLines}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/ArtworkCard.svelte:151:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={aspectRatioStyle()}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Community/Collaboration/Root.svelte:135:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="collaboration__status" style="background: {statusBadge.color}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Community/Collaboration/Split.svelte:116:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collab-split__bar-fill" style="width: {currentValue}%"></div>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Community/CritiqueCircle/Members.svelte:109:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="critique-members__badge" style="background: {badge.color}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/CritiqueMode/Annotations.svelte:70:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background: {getColor(annotation.category)}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:152:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="clip-path: inset(0 {100 - comparison.sliderPosition}% 0 0)"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:157:47

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="wip-compare__slider-handle" style="left: {comparison.sliderPosition}%">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Compare.svelte:185:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="opacity: {comparison.overlayOpacity}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:38:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {thread.currentProgress}%"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:55:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position}%"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/Timeline.svelte:71:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position + ((1 / (thread.updates.length - 1)) * 100) / 2}%"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/CreativeTools/WorkInProgress/VersionCard.svelte:79:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {displayUpdate.progress}%"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Curation/CollectionCard.svelte:145:40

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collection-card__preview" style="--preview-count: {Math.min(preview, 4)}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Curation/CuratorSpotlight.svelte:204:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="--preview-count: {previewArtworks.length}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Exhibition/Gallery.svelte:78:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-gallery__grid" style="--columns: {columns}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/Exhibition/Navigation.svelte:83:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-nav__progress-bar" style="width: {progress}%"></div>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:63:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:75:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:86:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/docs-check-waflUG/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/manual-community-2-upmRDN/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/manual-community-3-LOi2hi/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/manual-community-X9Uo55/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/.tmp/manual-community-noref-OQqyyH/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/admin/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/compose/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/compose/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/compose/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/messaging/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/components/notifications/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Container.svelte:188:31

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Section.svelte:237:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Text.svelte:154:47

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:63:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:75:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Theme/ThemeWorkbench.svelte:86:27

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/greater/primitives/components/Tooltip.svelte:328:4

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/PollComposer.svelte:506:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/cli/tests/fixtures/cli-fixture/src/lib/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/faces/artist/src/components/Artwork/Image.svelte:119:51

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<figure class="gr-artist-artwork-image-container" style={aspectRatioStyle()}>`

### packages/faces/artist/src/components/Artwork/Title.svelte:61:54

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<svelte:element this={HeadingTag} class={titleClass} style="--max-lines: {maxLines}">`

### packages/faces/artist/src/components/ArtworkCard.svelte:151:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={aspectRatioStyle()}`

### packages/faces/artist/src/components/Community/Collaboration/Root.svelte:135:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="collaboration__status" style="background: {statusBadge.color}">`

### packages/faces/artist/src/components/Community/Collaboration/Split.svelte:116:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collab-split__bar-fill" style="width: {currentValue}%"></div>`

### packages/faces/artist/src/components/Community/CritiqueCircle/Members.svelte:109:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="critique-members__badge" style="background: {badge.color}">`

### packages/faces/artist/src/components/CreativeTools/CritiqueMode/Annotations.svelte:70:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="background: {getColor(annotation.category)}"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Compare.svelte:152:9

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="clip-path: inset(0 {100 - comparison.sliderPosition}% 0 0)"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Compare.svelte:157:47

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="wip-compare__slider-handle" style="left: {comparison.sliderPosition}%">`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Compare.svelte:185:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="opacity: {comparison.overlayOpacity}"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Timeline.svelte:38:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {thread.currentProgress}%"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Timeline.svelte:55:6

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position}%"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/Timeline.svelte:71:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="left: {position + ((1 / (thread.updates.length - 1)) * 100) / 2}%"`

### packages/faces/artist/src/components/CreativeTools/WorkInProgress/VersionCard.svelte:79:7

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {displayUpdate.progress}%"`

### packages/faces/artist/src/components/Curation/CollectionCard.svelte:145:40

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="collection-card__preview" style="--preview-count: {Math.min(preview, 4)}">`

### packages/faces/artist/src/components/Curation/CuratorSpotlight.svelte:204:5

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="--preview-count: {previewArtworks.length}"`

### packages/faces/artist/src/components/Exhibition/Gallery.svelte:78:41

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-gallery__grid" style="--columns: {columns}">`

### packages/faces/artist/src/components/Exhibition/Navigation.svelte:83:46

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="exhibition-nav__progress-bar" style="width: {progress}%"></div>`

### packages/faces/artist/src/components/Transparency/AIDisclosure.svelte:173:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {usage.humanContribution}%"`

### packages/faces/artist/src/components/Transparency/AIDisclosure.svelte:186:8

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="width: {usage.aiContribution}%"`

### packages/faces/blog/src/components/Article/ReadingProgress.svelte:55:45

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="gr-blog-reading-progress__bar" style="width: {progress * 100}%"></div>`

### packages/faces/social/src/components/ComposeBox.svelte:384:5

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${cwLength > maxCwLength ? 'var(--gr-semantic-action-error-default)' : 'var(--gr-semantic-foreground-secondary)'}`}`

### packages/faces/social/src/components/ComposeBox.svelte:414:5

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${characterCountColor()}`}`

### packages/faces/social/src/components/NotificationItem.svelte:149:33

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="notification-icon" style={`color: ${iconColor}`}>`

### packages/faces/social/src/components/NotificationsFeed.svelte:232:30

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="virtual-list" style={`height: ${totalSize}px; position: relative;`}>`

### packages/faces/social/src/components/NotificationsFeedReactive.svelte:369:30

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="virtual-list" style={`height: ${totalSize}px; position: relative;`}>`

### packages/faces/social/src/components/Profile/AccountMigration.svelte:249:56

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="account-migration__target-avatar" style="background: #ccc;"></div>`

### packages/faces/social/src/components/ProfileHeader.svelte:216:4

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={bannerStyle()}`

### packages/faces/social/src/components/ProfileHeader.svelte:229:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`display: ${bannerLoaded ? 'block' : 'none'}`}`

### packages/faces/social/src/components/TimelineVirtualizedReactive.svelte:325:29

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="virtual-list" style={`height: ${totalSize}px; position: relative;`}>`

### packages/faces/social/src/patterns/BookmarkManager.svelte:649:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}`

### packages/faces/social/src/patterns/ContentWarningHandler.svelte:279:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:424:8

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:433:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:483:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:489:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:520:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:526:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:571:12

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:577:13

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:617:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/CustomEmojiPicker.svelte:623:10

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${emojiSize}px; height: ${emojiSize}px;`}`

### packages/faces/social/src/patterns/InstancePicker.svelte:299:44

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>`

### packages/faces/social/src/patterns/MediaComposer.svelte:416:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${attachment.uploadProgress}%`}`

### packages/faces/social/src/patterns/MediaComposer.svelte:441:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${pos.x}; top: ${pos.y}`}`

### packages/faces/social/src/patterns/PollComposer.svelte:504:11

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`width: ${getPercentage(option)}%`}`

### packages/faces/social/src/patterns/ThreadNodeView.svelte:59:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`--depth: ${node.depth}`}`

### packages/primitives/src/components/Avatar.svelte:247:4

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: {imageLoaded ? 'block' : 'none'}"`

### packages/primitives/src/components/Avatar.svelte:258:7

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/primitives/src/components/Avatar.svelte:263:36

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/primitives/src/components/Avatar.svelte:284:7

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/primitives/src/components/Avatar.svelte:309:6

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/primitives/src/components/Avatar.svelte:315:35

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<span class="gr-avatar__icon" style="background-color: {initialsBackgroundColor};">`

### packages/primitives/src/components/Avatar.svelte:338:6

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {initialsBackgroundColor}; color: white;"`

### packages/primitives/src/components/Container.svelte:188:31

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class={containerClass()} style={customGutterStyle} {...restProps}>`

### packages/primitives/src/components/Section.svelte:237:33

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `<section class={sectionClass()} style={customStyle} {...restProps}>`

### packages/primitives/src/components/Skeleton.svelte:150:4

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/primitives/src/components/Skeleton.svelte:171:4

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={skeletonStyle()}`

### packages/primitives/src/components/Text.svelte:154:47

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>`

### packages/primitives/src/components/Theme/ColorHarmonyPicker.svelte:32:4

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {seedColor}"`

### packages/primitives/src/components/Theme/ColorHarmonyPicker.svelte:45:5

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="background-color: {color}"`

### packages/primitives/src/components/Theme/ContrastChecker.svelte:21:32

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="contrast-preview" style="color: {foreground}; background-color: {background}">`

### packages/primitives/src/components/Theme/ThemeWorkbench.svelte:67:9

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<div style="height: 1rem;"></div>`

### packages/primitives/src/components/Theme/ThemeWorkbench.svelte:79:9

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### packages/primitives/src/components/Theme/ThemeWorkbench.svelte:90:27

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `<div class="swatch" style="background-color: {color}" title="Primary {key}"></div>`

### packages/primitives/src/components/ThemeProvider.svelte:110:52

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `<div class="gr-theme-provider" data-theme-provider style={customCSS}>`

### packages/primitives/src/components/ThemeSwitcher.svelte:547:9

- Type: style-binding
- Category: ship-blocking
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`background-color: ${primaryColor}; color: ${previewButtonTextColor()}`}`

### packages/primitives/src/components/Tooltip.svelte:332:4

- Type: style-attribute
- Category: ship-blocking
- Remediation: Replace inline style with CSS class
- Snippet: `style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"`

### packages/shared/admin/src/Analytics.svelte:90:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/shared/admin/src/Analytics.svelte:126:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/shared/admin/src/Analytics.svelte:162:9

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`height: ${height}%`}`

### packages/shared/admin/src/Insights/AIAnalysis.svelte:161:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.textAnalysis.toxicityScore)}">`

### packages/shared/admin/src/Insights/AIAnalysis.svelte:189:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.imageAnalysis.violenceScore)}">`

### packages/shared/admin/src/Insights/AIAnalysis.svelte:209:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.aiDetection.aiGeneratedProbability)}">`

### packages/shared/admin/src/Insights/AIAnalysis.svelte:227:11

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<dd style="color: {getSeverityColor(analysis.spamAnalysis.spamScore)}">`

### packages/shared/chat/src/ChatThreadView.svelte:161:30

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `<div role="listitem" style="display: contents;">`

### packages/shared/compose/src/AutocompleteMenu.svelte:115:2

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${position.x}px; top: ${position.y}px;`}`

### packages/shared/compose/src/ImageEditor.svelte:238:6

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}`

### packages/shared/compose/src/MediaUpload.svelte:337:3

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="display: none;"`

### packages/shared/messaging/src/ConversationPicker.svelte:206:10

- Type: style-attribute
- Category: follow-up
- Remediation: Replace inline style with CSS class
- Snippet: `style="margin-left: {i > 0 ? '-8px' : '0'}"`

### packages/shared/notifications/src/LesserNotificationItem.svelte:152:3

- Type: style-binding
- Category: follow-up
- Remediation: Replace inline style binding with CSS class
- Snippet: `style={`color: ${colorMap[notification.type as LesserNotificationType]}`}`

## Build Violations

### apps/docs/build/404.html:57

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents">
			<script>
				{
					__sveltekit_9evwad = {
						base: "/greater-...`

### apps/docs/build/404.html:44

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
			// Theme detection
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localS...`

### apps/docs/build/404.html:58

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_9evwad = {
						base: "/greater-components/docs",
						assets: "/g...`

### apps/playground/build/artist/artwork.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/artwork.html:44

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/artwork.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<figure class="gr-artist-artwork-image-container svelte-7l6ful" style="aspect-ratio: 800 / 600"><img...`

### apps/playground/build/artist/artwork.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<h3 class="gr-artist-artwork-title svelte-y5e01w" style="--max-lines: 2"><span>Sunset Over Mountains...`

### apps/playground/build/artist/artwork.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="gr-artist-artwork-card gr-artist-artwork-card--md gr-artist-artwork-car...`

### apps/playground/build/artist/artwork.html:66

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/community.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/community.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/community.html:57

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/creative-tools.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/creative-tools.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/creative-tools.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="wip-timeline__progress svelte-19vsdh" style="width: 60%" role="progressbar" aria-valueno...`

### apps/playground/build/artist/creative-tools.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="wip-timeline__milestone svelte-19vsdh" style="left: 0%" aria-label="Ver...`

### apps/playground/build/artist/creative-tools.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="wip-timeline__time-between svelte-19vsdh" style="left: 50%">1 day</span>`

### apps/playground/build/artist/creative-tools.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="wip-timeline__milestone svelte-19vsdh active current" style="left: 100%...`

### apps/playground/build/artist/creative-tools.html:53

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/discovery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #FF6B6B;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #FFA07A;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #FFD93D;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #FF8C42;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #4ECDC4;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #45B7D1;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #96CEB4;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #88D8B0;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #8B4513;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #D2691E;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #CD853F;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #DEB887;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #2C3E50;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #34495E;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #7F8C8D;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="color-palette-search__preset-color svelte-14hibri" style="--color: #BDC3C7;"></span>`

### apps/playground/build/artist/discovery.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="mood-map__selection svelte-c9id2x" aria-hidden="true" style="left: 50%; top: 50%; --radi...`

### apps/playground/build/artist/discovery.html:54

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/gallery.html:44

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-grid  svelte-1bcty14" role="region" aria-label="Gallery with 12 artworks" aria-b...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="0" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-c...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="1" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="2" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="3" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="4" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="5" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-c...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="6" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="7" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="8" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="9" role="article" aria-label="Gallery, 12 artwo...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="10" role="article" aria-label="Gallery, 12 artw...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button type="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-c...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gallery-item svelte-1bcty14" data-index="11" role="article" aria-label="Gallery, 12 artw...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="0" style="--card-width: 280px;"><button class="item-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div role="button" class="gr-artist-artwork-card gr-artist-artwork-card--md gr-artist-artwork-card--...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="1" style="--card-width: 280px;"><button class="item-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="2" style="--card-width: 280px;"><button class="item-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="3" style="--card-width: 280px;"><button class="item-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="4" style="--card-width: 280px;"><button class="item-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="row-item svelte-ohth0w" data-index="5" style="--card-width: 280px;"><div class="item-pla...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-container svelte-fnquat" style="height: 192px;"><div class="masonry-item svelte-...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 1 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div role="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-card...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 2 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 3 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 4 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 5 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 6 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div role="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-card...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 7 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 8 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 9 by Jane Artist" style="...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 10 by Jane Artist" style=...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 11 by Jane Artist" style=...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div role="button" class="gr-artist-artwork-card gr-artist-artwork-card--auto gr-artist-artwork-card...`

### apps/playground/build/artist/gallery.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="masonry-item svelte-fnquat" role="article" aria-label="Artwork 12 by Jane Artist" style=...`

### apps/playground/build/artist/gallery.html:61

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/janeartist.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<header class="hero-banner hero-banner--md  svelte-ffew9g" aria-label="Jane Artist's banner" style="...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="avatar avatar--lg  svelte-le5cfz" style="--avatar-size: 96px;"><button class="avatar__bu...`

### apps/playground/build/artist/janeartist.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="avatar__status svelte-le5cfz" title="Online" aria-hidden="true" style="--status-color: ...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="artist-badge artist-badge--verified artist-badge--md  svelte-e88rzh" aria-label="Veri...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="artist-badge artist-badge--curator artist-badge--md  svelte-e88rzh" aria-label="Curat...`

### apps/playground/build/artist/janeartist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="profile-statement__content svelte-p7fnzh" style="--max-lines: 5;">Digital artist explori...`

### apps/playground/build/artist/janeartist.html:51

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/monetization.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/monetization.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/monetization.html:51

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/profile.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<header class="hero-banner hero-banner--md  svelte-ffew9g" aria-label="Jane Artist's banner" style="...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="avatar avatar--lg  svelte-le5cfz" style="--avatar-size: 96px;"><button class="avatar__bu...`

### apps/playground/build/artist/profile.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="avatar__status svelte-le5cfz" title="Online" aria-hidden="true" style="--status-color: ...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="artist-badge artist-badge--verified artist-badge--md  svelte-e88rzh" aria-label="Veri...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="artist-badge artist-badge--curator artist-badge--md  svelte-e88rzh" aria-label="Curat...`

### apps/playground/build/artist/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="profile-statement__content svelte-p7fnzh" style="--max-lines: 5;">Digital artist explori...`

### apps/playground/build/artist/profile.html:57

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/timeline.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/timeline.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/timeline.html:49

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist/transparency.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist/transparency.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist/transparency.html:52

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/artist.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/artist.html:38

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/artist.html:42

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/button-test.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/button-test.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/button-test.html:38

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/chat.html:22

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents">
			<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("....`

### apps/playground/build/chat.html:23

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/compose.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/compose.html:57

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/compose.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<input type="file" accept="image/*,video/*,audio/*" multiple style="display: none;">`

### apps/playground/build/compose.html:100

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/demos/alert.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/alert.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/alert.html:71

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/button.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/button.html:44

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/button.html:86

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/copy-export.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/copy-export.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/copy-export.html:53

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/dropdown-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/dropdown-menu.html:44

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/dropdown-menu.html:109

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/forms.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/forms.html:44

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/forms.html:108

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/icons.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/icons.html:55

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/icons.html:61

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/interactive.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/interactive.html:42

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/interactive.html:42

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/interactive.html:83

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/landing-page-example.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/landing-page-example.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/landing-page-example.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/landing-page-example.html:49

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/layout-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/layout-components.html:43

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/layout-components.html:45

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/layout.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://i.pravatar.cc/120?img=11" alt="Nina Briggs" style="displa...`

### apps/playground/build/demos/layout.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(144, 65%, 30%); color: white;">MA</sp...`

### apps/playground/build/demos/layout.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(330, 65%, 30%); color: white;">FA</sp...`

### apps/playground/build/demos/layout.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(280, 65%, 30%); color: white;">SI</sp...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--circular gr-skeleton--pulse" style="width: 48px; height: 48px" ...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 70%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 55%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 40%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--circular gr-skeleton--pulse" style="width: 48px; height: 48px" ...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 70%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 55%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 40%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--circular gr-skeleton--pulse" style="width: 48px; height: 48px" ...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 70%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 55%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-skeleton gr-skeleton--text gr-skeleton--pulse" style="width: 40%; height: 1em" aria-h...`

### apps/playground/build/demos/layout.html:85

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/phase-2-components.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-gradient-text " style="background-image: linear-gradient(to right, var(--gr-color-pr...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-gradient-text " style="background-image: linear-gradient(to right, var(--gr-color-su...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-gradient-text " style="background-image: linear-gradient(to right, var(--gr-color-wa...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-gradient-text " style="background-image: linear-gradient(to right, #FF0080, #7928CA)...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-icon-badge gr-icon-badge--filled gr-icon-badge--primary gr-icon-badge--circle" style=...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-icon-badge gr-icon-badge--filled gr-icon-badge--success gr-icon-badge--circle" style=...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-icon-badge gr-icon-badge--outlined gr-icon-badge--warning gr-icon-badge--circle" styl...`

### apps/playground/build/demos/phase-2-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-icon-badge gr-icon-badge--filled gr-icon-badge--error gr-icon-badge--square" style="w...`

### apps/playground/build/demos/phase-2-components.html:48

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/phase-3-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/phase-3-components.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/phase-3-components.html:62

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/phase-3-interactions.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/phase-3-interactions.html:48

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/phase-3-interactions.html:53

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/primitives.html:45

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-card gr-card--elevated gr-card--padding-md gr-card--hoverable" style="width: 300px;">...`

### apps/playground/build/demos/primitives.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<h3 style="margin: 0;">Elevated Card</h3>`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-card gr-card--outlined gr-card--padding-md" style="width: 300px;"><div class="gr-card...`

### apps/playground/build/demos/primitives.html:46

- Type: inline-style
- Category: follow-up
- Snippet: `<h3 style="margin: 0;">Outlined Card</h3>`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-container gr-container--max-sm gr-container--padded-md gr-container--centered demo-co...`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="border: 1px solid var(--gr-semantic-border-subtle);"><section class="gr-section gr-secti...`

### apps/playground/build/demos/primitives.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<p class="gr-text gr-text--size-base gr-text--weight-normal gr-text--color-primary gr-text--align-le...`

### apps/playground/build/demos/primitives.html:52

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/spinner.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/spinner.html:40

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/spinner.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="spinner-item svelte-1kdpe29" style="color: #3b82f6;"><span class="gr-spinner gr-spinner-...`

### apps/playground/build/demos/spinner.html:60

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/demos/typography-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/demos/typography-components.html:41

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/demos/typography-components.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<p class="gr-text gr-text--size-base gr-text--weight-normal gr-text--color-primary gr-text--align-le...`

### apps/playground/build/demos/typography-components.html:46

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/examples/oauth-signin.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/examples/oauth-signin.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/examples/oauth-signin.html:101

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/examples/settings-panel.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/examples/settings-panel.html:37

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/examples/settings-panel.html:44

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/examples/theme-customization.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="color-swatch base svelte-kxrd2a" style="background-color: #3b82f6" title="Base Color: #3...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="color-swatch harmony svelte-kxrd2a" style="background-color: #f6ae3b" title="complementa...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="contrast-preview svelte-upiapc" style="color: #1a1a1a; background-color: #f8f9fa"><div c...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="height: 1rem;"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="contrast-preview svelte-upiapc" style="color: #0b64f4; background-color: #f8f9fa"><div c...`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<h2 style="margin-top: 0;">Component Preview</h2>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #e7f0fe" title="Primary 50"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #cee0fd" title="Primary 100"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #9dc1fb" title="Primary 200"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #6da2f8" title="Primary 300"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #3c83f6" title="Primary 400"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #0b64f4" title="Primary 500"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #0950c3" title="Primary 600"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #073c92" title="Primary 700"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #042862" title="Primary 800"></div>`

### apps/playground/build/examples/theme-customization.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="swatch svelte-asxru9" style="background-color: #021431" title="Primary 900"></div>`

### apps/playground/build/examples/theme-customization.html:38

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane D...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(192, 65%, 30%); color: white;">JD</sp...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane D...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(192, 65%, 30%); color: white;">JD</sp...`

### apps/playground/build/examples/user-menu.html:75

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(246, 65%, 30%); color: white;">JS</sp...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane D...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(192, 65%, 30%); color: white;">JD</sp...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane D...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(192, 65%, 30%); color: white;">JD</sp...`

### apps/playground/build/examples/user-menu.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane D...`

### apps/playground/build/examples/user-menu.html:47

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(192, 65%, 30%); color: white;">JD</sp...`

### apps/playground/build/examples/user-menu.html:86

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/index.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/index.html:37

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/index.html:41

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/notifications.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/notifications.html:53

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/notifications.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-profile-header__banner" style="background-color: var(--gr-color-primary-500);" role="...`

### apps/playground/build/notifications.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img src="https://placehold.co/1600x480/0f172a/38bdf8?text=Greater+Components" alt="" class="gr-prof...`

### apps/playground/build/notifications.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/128x128/1e1b4b/ffffff?text=GC" alt="Greater ...`

### apps/playground/build/notifications.html:55

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(156, 65%, 30%); color: white;">GC</sp...`

### apps/playground/build/notifications.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="virtual-list" style="height: 0px; position: relative;"></div>`

### apps/playground/build/notifications.html:74

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/profile.html:53

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div class="gr-profile-header__banner" style="background-color: var(--gr-color-primary-500);" role="...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img src="https://placehold.co/1600x480/0f172a/38bdf8?text=Greater+Components" alt="" class="gr-prof...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/128x128/1e1b4b/ffffff?text=GC" alt="Greater ...`

### apps/playground/build/profile.html:53

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(156, 65%, 30%); color: white;">GC</sp...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/1d4ed8/ffffff?text=LR" alt="Lesser Res...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/0f172a/38bdf8?text=FI" alt="Fediverse ...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/0f766e/ffffff?text=DA" alt="Design for...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/ea580c/ffffff?text=OR" alt="OSS Relay"...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/f97316/ffffff?text=UX" alt="UX Weekly"...`

### apps/playground/build/profile.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/72x72/312e81/c7d2fe?text=SE" alt="Streaming ...`

### apps/playground/build/profile.html:55

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/search.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/search.html:52

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/search.html:55

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/settings.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/settings.html:42

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/settings.html:42

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/settings.html:44

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/status.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/status.html:53

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/status.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/96x96/1d4ed8/ffffff?text=AS" alt="Alicia She...`

### apps/playground/build/status.html:65

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(215, 65%, 30%); color: white;">AS</sp...`

### apps/playground/build/status.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/96x96/312e81/ffffff?text=DX" alt="Greater DX...`

### apps/playground/build/status.html:65

- Type: inline-style
- Category: follow-up
- Snippet: `<span class="gr-avatar__initials" style="background-color: hsl(275, 65%, 30%); color: white;">GD</sp...`

### apps/playground/build/status.html:96

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/tabs-test.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/tabs-test.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/tabs-test.html:38

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/tabs.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/tabs.html:36

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/tabs.html:38

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`

### apps/playground/build/timeline/mock.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/timeline/mock.html:50

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/timeline/mock.html:53

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL("..", location).pathname.slice(0, -1)...`

### apps/playground/build/timeline.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<div style="display: contents"><div class="gr-theme-provider" data-theme-provider=""><div class="app...`

### apps/playground/build/timeline.html:57

- Type: inline-style
- Category: follow-up
- Snippet: `<button class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary" style="...`

### apps/playground/build/timeline.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<input type="file" accept="image/*,video/*,audio/*" multiple style="display: none;">`

### apps/playground/build/timeline.html:1

- Type: inline-style
- Category: follow-up
- Snippet: `<img class="gr-avatar__image" src="https://placehold.co/128x128/1e1b4b/ffffff?text=GC" alt="Greater ...`

### apps/playground/build/timeline.html:63

- Type: inline-script
- Category: follow-up
- Snippet: `<script>
				{
					__sveltekit_bqdepd = {
						base: new URL(".", location).pathname.slice(0, -1),...`


