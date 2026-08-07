# @equaltoai/greater-components-utils

Utility functions for Greater Components (sanitization, time formatting, markdown conversion, preferences, IDs).

## Usage (recommended)

```ts
import { relativeTime, sanitizeHtml, useStableId } from '@equaltoai/greater-components/utils';
```

## Standalone package

```ts
import { relativeTime, sanitizeHtml, useStableId } from '@equaltoai/greater-components-utils';
```

## SSR-stable absolute timestamps

Absolute date labels use the runtime's local time zone unless one is supplied. Pin an IANA time
zone whenever the same label is rendered on the server and hydrated in the browser:

```ts
import { formatDateTime } from '@equaltoai/greater-components/utils';

const published = formatDateTime(article.publishedAt, {
	timeZone: 'UTC',
	timeStyle: 'long', // Includes the zone in the visible en-US label.
});
```

The returned `iso` value remains the canonical machine-readable instant for a `<time datetime>`
attribute.
