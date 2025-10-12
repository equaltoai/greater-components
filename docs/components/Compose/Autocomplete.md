# Compose Utilities: Autocomplete

**Module**: Autocomplete Logic Utility  
**Package**: `@greater/fediverse`  
**Export**: `Compose.Autocomplete` or direct imports

---

## 📋 Overview

The `Autocomplete` utility provides comprehensive logic for implementing hashtag, mention, and emoji autocomplete in text editors. It handles context detection, suggestion filtering with fuzzy matching, text insertion, and cursor positioning.

### **Key Features**:
- ✅ **Context detection** for hashtags (#), mentions (@), and emojis (:)
- ✅ **Fuzzy matching** with scoring
- ✅ **Cursor position management**
- ✅ **Text insertion** with proper replacement
- ✅ **Validation** for hashtags and mentions
- ✅ **Parsing utilities** for extracting mentions/hashtags
- ✅ **TypeScript** fully typed
- ✅ **Zero dependencies**

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🔧 API Reference

### **Types**

```typescript
interface AutocompleteSuggestion {
  type: 'hashtag' | 'mention' | 'emoji';
  value: string;
  label: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

interface AutocompleteMatch {
  type: 'hashtag' | 'mention' | 'emoji';
  query: string;
  startPos: number;
  endPos: number;
}
```

### **Functions**

#### **detectAutocompleteContext()**

Detect if the cursor is in an autocomplete context (hashtag, mention, emoji).

```typescript
function detectAutocompleteContext(
  text: string,
  cursorPosition: number
): AutocompleteMatch | null
```

**Parameters**:
- `text`: Full text content
- `cursorPosition`: Current cursor position

**Returns**: Match object if in autocomplete context, `null` otherwise.

**Example**:
```typescript
import { detectAutocompleteContext } from '@greater/fediverse/Compose';

const text = 'Hello @john';
const match = detectAutocompleteContext(text, 11);

console.log(match);
// { type: 'mention', query: 'john', startPos: 6, endPos: 11 }
```

---

#### **filterSuggestions()**

Filter and score suggestions based on the query using fuzzy matching.

```typescript
function filterSuggestions(
  query: string,
  suggestions: AutocompleteSuggestion[],
  maxResults: number = 10
): AutocompleteSuggestion[]
```

**Parameters**:
- `query`: Search query
- `suggestions`: Array of available suggestions
- `maxResults`: Maximum number of results (default: 10)

**Returns**: Filtered and sorted array of suggestions.

**Example**:
```typescript
import { filterSuggestions } from '@greater/fediverse/Compose';

const suggestions = [
  { type: 'mention', value: '@johnsmith', label: 'John Smith' },
  { type: 'mention', value: '@johndoe', label: 'John Doe' },
  { type: 'mention', value: '@jane', label: 'Jane Wilson' }
];

const filtered = filterSuggestions('joh', suggestions, 5);
console.log(filtered); // Returns @johnsmith and @johndoe
```

---

#### **insertSuggestion()**

Insert a selected suggestion into the text at the match position.

```typescript
function insertSuggestion(
  text: string,
  match: AutocompleteMatch,
  suggestion: AutocompleteSuggestion
): { text: string; cursorPosition: number }
```

**Parameters**:
- `text`: Original text
- `match`: Autocomplete match
- `suggestion`: Selected suggestion

**Returns**: Object with new text and cursor position.

**Example**:
```typescript
import { insertSuggestion } from '@greater/fediverse/Compose';

const text = 'Hello @joh';
const match = { type: 'mention', query: 'joh', startPos: 6, endPos: 10 };
const suggestion = { type: 'mention', value: '@johnsmith', label: 'John Smith' };

const result = insertSuggestion(text, match, suggestion);
console.log(result.text); // "Hello @johnsmith "
console.log(result.cursorPosition); // 18
```

---

#### **getCursorPosition()**

Get the current cursor position in a text input/textarea element.

```typescript
function getCursorPosition(element: HTMLInputElement | HTMLTextAreaElement): number
```

**Parameters**:
- `element`: Input or textarea element

**Returns**: Cursor position (selection start).

**Example**:
```typescript
import { getCursorPosition } from '@greater/fediverse/Compose';

const textarea = document.querySelector('textarea');
const position = getCursorPosition(textarea);
console.log(`Cursor at position: ${position}`);
```

---

#### **setCursorPosition()**

Set the cursor position in a text input/textarea element.

```typescript
function setCursorPosition(
  element: HTMLInputElement | HTMLTextAreaElement,
  position: number
): void
```

**Parameters**:
- `element`: Input or textarea element
- `position`: Target cursor position

**Example**:
```typescript
import { setCursorPosition } from '@greater/fediverse/Compose';

const textarea = document.querySelector('textarea');
setCursorPosition(textarea, 10); // Move cursor to position 10
```

---

#### **extractHashtags()**

Extract all hashtags from text.

```typescript
function extractHashtags(text: string): string[]
```

**Parameters**:
- `text`: Text to extract hashtags from

**Returns**: Array of hashtag strings (without #).

**Example**:
```typescript
import { extractHashtags } from '@greater/fediverse/Compose';

const text = 'Check out #javascript and #typescript!';
const tags = extractHashtags(text);
console.log(tags); // ['javascript', 'typescript']
```

---

#### **extractMentions()**

Extract all mentions from text.

```typescript
function extractMentions(text: string): string[]
```

**Parameters**:
- `text`: Text to extract mentions from

**Returns**: Array of mention strings (with @).

**Example**:
```typescript
import { extractMentions } from '@greater/fediverse/Compose';

const text = 'Thanks @alice and @bob@example.com!';
const mentions = extractMentions(text);
console.log(mentions); // ['@alice', '@bob@example.com']
```

---

#### **formatHashtag()**

Format a hashtag string (add # if missing, validate format).

```typescript
function formatHashtag(tag: string): string
```

**Parameters**:
- `tag`: Hashtag string (with or without #)

**Returns**: Formatted hashtag with #.

**Example**:
```typescript
import { formatHashtag } from '@greater/fediverse/Compose';

console.log(formatHashtag('javascript')); // "#javascript"
console.log(formatHashtag('#typescript')); // "#typescript"
```

---

#### **formatMention()**

Format a mention string (add @ if missing, validate format).

```typescript
function formatMention(mention: string): string
```

**Parameters**:
- `mention`: Mention string (with or without @)

**Returns**: Formatted mention with @.

**Example**:
```typescript
import { formatMention } from '@greater/fediverse/Compose';

console.log(formatMention('alice')); // "@alice"
console.log(formatMention('@bob')); // "@bob"
```

---

#### **parseMention()**

Parse a mention into username and domain parts.

```typescript
function parseMention(mention: string): {
  username: string;
  domain?: string;
}
```

**Parameters**:
- `mention`: Mention string (@user or @user@domain)

**Returns**: Object with username and optional domain.

**Example**:
```typescript
import { parseMention } from '@greater/fediverse/Compose';

console.log(parseMention('@alice'));
// { username: 'alice' }

console.log(parseMention('@bob@example.com'));
// { username: 'bob', domain: 'example.com' }
```

---

#### **isValidHashtag()**

Validate if a string is a valid hashtag.

```typescript
function isValidHashtag(tag: string): boolean
```

**Parameters**:
- `tag`: Hashtag string to validate

**Returns**: `true` if valid, `false` otherwise.

**Example**:
```typescript
import { isValidHashtag } from '@greater/fediverse/Compose';

console.log(isValidHashtag('#javascript')); // true
console.log(isValidHashtag('#java-script')); // true
console.log(isValidHashtag('#123')); // false (must start with letter)
console.log(isValidHashtag('#')); // false (empty)
```

---

#### **isValidMention()**

Validate if a string is a valid mention.

```typescript
function isValidMention(mention: string): boolean
```

**Parameters**:
- `mention`: Mention string to validate

**Returns**: `true` if valid, `false` otherwise.

**Example**:
```typescript
import { isValidMention } from '@greater/fediverse/Compose';

console.log(isValidMention('@alice')); // true
console.log(isValidMention('@bob@example.com')); // true
console.log(isValidMention('@')); // false (empty username)
console.log(isValidMention('@123')); // false (must start with letter)
```

---

## 💡 Usage Examples

### **Example 1: Basic Autocomplete Implementation**

Implement simple autocomplete:

```typescript
import {
  detectAutocompleteContext,
  filterSuggestions,
  insertSuggestion
} from '@greater/fediverse/Compose';

const textarea = document.querySelector('textarea');
const suggestionBox = document.querySelector('.suggestions');

const allSuggestions = [
  { type: 'mention', value: '@alice', label: 'Alice Smith' },
  { type: 'mention', value: '@bob', label: 'Bob Jones' },
  { type: 'hashtag', value: '#javascript', label: '#javascript' },
  { type: 'hashtag', value: '#typescript', label: '#typescript' }
];

let currentMatch = null;

textarea.addEventListener('input', () => {
  const text = textarea.value;
  const cursorPos = textarea.selectionStart;
  
  currentMatch = detectAutocompleteContext(text, cursorPos);
  
  if (currentMatch) {
    const filtered = filterSuggestions(
      currentMatch.query,
      allSuggestions.filter(s => s.type === currentMatch.type)
    );
    
    showSuggestions(filtered);
  } else {
    hideSuggestions();
  }
});

function selectSuggestion(suggestion) {
  if (!currentMatch) return;
  
  const result = insertSuggestion(
    textarea.value,
    currentMatch,
    suggestion
  );
  
  textarea.value = result.text;
  textarea.selectionStart = textarea.selectionEnd = result.cursorPosition;
  
  hideSuggestions();
}
```

### **Example 2: Keyboard Navigation**

Add keyboard navigation to autocomplete:

```typescript
import {
  detectAutocompleteContext,
  filterSuggestions,
  insertSuggestion
} from '@greater/fediverse/Compose';

let suggestions = [];
let selectedIndex = 0;

textarea.addEventListener('keydown', (e) => {
  if (suggestions.length === 0) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % suggestions.length;
      highlightSuggestion(selectedIndex);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
      highlightSuggestion(selectedIndex);
      break;
      
    case 'Enter':
    case 'Tab':
      if (suggestions[selectedIndex]) {
        e.preventDefault();
        selectSuggestion(suggestions[selectedIndex]);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      hideSuggestions();
      break;
  }
});
```

### **Example 3: Fetch Suggestions from API**

Load suggestions dynamically:

```typescript
import {
  detectAutocompleteContext,
  filterSuggestions
} from '@greater/fediverse/Compose';

let debounceTimer;

async function fetchSuggestions(type, query) {
  const endpoints = {
    mention: `/api/accounts/search?q=${query}`,
    hashtag: `/api/tags/search?q=${query}`,
    emoji: `/api/emojis/search?q=${query}`
  };
  
  const response = await fetch(endpoints[type]);
  const data = await response.json();
  
  return data.map(item => ({
    type,
    value: type === 'mention' ? `@${item.username}` : `#${item.name}`,
    label: item.display_name || item.name,
    avatar: item.avatar
  }));
}

textarea.addEventListener('input', () => {
  const text = textarea.value;
  const cursorPos = textarea.selectionStart;
  const match = detectAutocompleteContext(text, cursorPos);
  
  if (match && match.query.length >= 2) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const suggestions = await fetchSuggestions(match.type, match.query);
      showSuggestions(suggestions);
    }, 300);
  } else {
    hideSuggestions();
  }
});
```

### **Example 4: Fuzzy Matching with Scoring**

Implement custom fuzzy matching:

```typescript
import { filterSuggestions } from '@greater/fediverse/Compose';

function fuzzyScore(query: string, target: string): number {
  query = query.toLowerCase();
  target = target.toLowerCase();
  
  // Exact match
  if (target === query) return 100;
  
  // Starts with query
  if (target.startsWith(query)) return 90;
  
  // Contains query
  if (target.includes(query)) return 70;
  
  // Fuzzy character matching
  let score = 0;
  let queryIndex = 0;
  
  for (let i = 0; i < target.length && queryIndex < query.length; i++) {
    if (target[i] === query[queryIndex]) {
      score += 10;
      queryIndex++;
    }
  }
  
  return queryIndex === query.length ? score : 0;
}

function customFilterSuggestions(query, suggestions, maxResults = 10) {
  return suggestions
    .map(s => ({
      ...s,
      score: fuzzyScore(query, s.label)
    }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
```

### **Example 5: Extract and Display Tags/Mentions**

Show extracted tags and mentions:

```typescript
import { extractHashtags, extractMentions } from '@greater/fediverse/Compose';

function updateMetadata(text) {
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  
  // Display hashtags
  const hashtagList = document.querySelector('.hashtags');
  hashtagList.innerHTML = hashtags
    .map(tag => `<span class="tag">#${tag}</span>`)
    .join(' ');
  
  // Display mentions
  const mentionList = document.querySelector('.mentions');
  mentionList.innerHTML = mentions
    .map(mention => `<span class="mention">${mention}</span>`)
    .join(' ');
}

textarea.addEventListener('input', (e) => {
  updateMetadata(e.target.value);
});
```

### **Example 6: Validation Before Submission**

Validate mentions and hashtags:

```typescript
import {
  extractHashtags,
  extractMentions,
  isValidHashtag,
  isValidMention
} from '@greater/fediverse/Compose';

function validateContent(text) {
  const errors = [];
  
  const hashtags = extractHashtags(text);
  for (const tag of hashtags) {
    if (!isValidHashtag(`#${tag}`)) {
      errors.push(`Invalid hashtag: #${tag}`);
    }
  }
  
  const mentions = extractMentions(text);
  for (const mention of mentions) {
    if (!isValidMention(mention)) {
      errors.push(`Invalid mention: ${mention}`);
    }
  }
  
  return errors;
}

form.addEventListener('submit', (e) => {
  const text = textarea.value;
  const errors = validateContent(text);
  
  if (errors.length > 0) {
    e.preventDefault();
    alert('Validation errors:\n' + errors.join('\n'));
  }
});
```

### **Example 7: Mention Parsing for Federation**

Parse federated mentions:

```typescript
import { extractMentions, parseMention } from '@greater/fediverse/Compose';

async function resolveMentions(text) {
  const mentions = extractMentions(text);
  const resolved = [];
  
  for (const mention of mentions) {
    const parsed = parseMention(mention);
    
    if (parsed.domain) {
      // Federated mention - resolve from remote server
      const account = await fetchRemoteAccount(parsed.username, parsed.domain);
      resolved.push(account);
    } else {
      // Local mention - resolve from local database
      const account = await fetchLocalAccount(parsed.username);
      resolved.push(account);
    }
  }
  
  return resolved;
}

async function fetchRemoteAccount(username, domain) {
  const response = await fetch(
    `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`
  );
  return response.json();
}

async function fetchLocalAccount(username) {
  const response = await fetch(`/api/accounts/${username}`);
  return response.json();
}
```

### **Example 8: Custom Emoji Support**

Add custom emoji autocomplete:

```typescript
import {
  detectAutocompleteContext,
  filterSuggestions,
  insertSuggestion
} from '@greater/fediverse/Compose';

const customEmojis = [
  { type: 'emoji', value: ':partyparrot:', label: 'Party Parrot', url: '/emojis/partyparrot.gif' },
  { type: 'emoji', value: ':thinkingface:', label: 'Thinking Face', url: '/emojis/thinking.png' },
  { type: 'emoji', value: ':heartfire:', label: 'Heart on Fire', url: '/emojis/heartfire.gif' }
];

function showEmojiSuggestions(suggestions) {
  suggestionBox.innerHTML = suggestions.map(emoji => `
    <div class="emoji-suggestion" onclick="selectEmoji('${emoji.value}')">
      <img src="${emoji.url}" alt="${emoji.label}" />
      <span>${emoji.value}</span>
    </div>
  `).join('');
}

textarea.addEventListener('input', () => {
  const match = detectAutocompleteContext(textarea.value, textarea.selectionStart);
  
  if (match && match.type === 'emoji') {
    const filtered = filterSuggestions(match.query, customEmojis);
    showEmojiSuggestions(filtered);
  }
});
```

---

## 🧪 Testing

```typescript
import { describe, it, expect } from 'vitest';
import {
  detectAutocompleteContext,
  filterSuggestions,
  insertSuggestion,
  extractHashtags,
  extractMentions,
  isValidHashtag,
  isValidMention,
  parseMention
} from '@greater/fediverse/Compose';

describe('Autocomplete', () => {
  describe('detectAutocompleteContext', () => {
    it('detects hashtag context', () => {
      const match = detectAutocompleteContext('Hello #java', 11);
      expect(match).toEqual({
        type: 'hashtag',
        query: 'java',
        startPos: 6,
        endPos: 11
      });
    });

    it('detects mention context', () => {
      const match = detectAutocompleteContext('Hey @alice', 10);
      expect(match).toEqual({
        type: 'mention',
        query: 'alice',
        startPos: 4,
        endPos: 10
      });
    });

    it('detects emoji context', () => {
      const match = detectAutocompleteContext('Hello :smil', 11);
      expect(match).toEqual({
        type: 'emoji',
        query: 'smil',
        startPos: 6,
        endPos: 11
      });
    });

    it('returns null when not in context', () => {
      const match = detectAutocompleteContext('Hello world', 5);
      expect(match).toBeNull();
    });
  });

  describe('filterSuggestions', () => {
    const suggestions = [
      { type: 'mention', value: '@alice', label: 'Alice' },
      { type: 'mention', value: '@bob', label: 'Bob' },
      { type: 'mention', value: '@charlie', label: 'Charlie' }
    ];

    it('filters by query', () => {
      const filtered = filterSuggestions('ali', suggestions);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].value).toBe('@alice');
    });

    it('respects maxResults', () => {
      const filtered = filterSuggestions('', suggestions, 2);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('extractHashtags', () => {
    it('extracts hashtags', () => {
      const tags = extractHashtags('Hello #javascript and #typescript!');
      expect(tags).toEqual(['javascript', 'typescript']);
    });

    it('handles no hashtags', () => {
      const tags = extractHashtags('Hello world');
      expect(tags).toEqual([]);
    });
  });

  describe('extractMentions', () => {
    it('extracts mentions', () => {
      const mentions = extractMentions('Thanks @alice and @bob!');
      expect(mentions).toEqual(['@alice', '@bob']);
    });

    it('extracts federated mentions', () => {
      const mentions = extractMentions('Hey @user@example.com');
      expect(mentions).toEqual(['@user@example.com']);
    });
  });

  describe('validation', () => {
    it('validates hashtags', () => {
      expect(isValidHashtag('#javascript')).toBe(true);
      expect(isValidHashtag('#')).toBe(false);
      expect(isValidHashtag('#123')).toBe(false);
    });

    it('validates mentions', () => {
      expect(isValidMention('@alice')).toBe(true);
      expect(isValidMention('@bob@example.com')).toBe(true);
      expect(isValidMention('@')).toBe(false);
    });
  });

  describe('parseMention', () => {
    it('parses local mention', () => {
      expect(parseMention('@alice')).toEqual({ username: 'alice' });
    });

    it('parses federated mention', () => {
      expect(parseMention('@bob@example.com')).toEqual({
        username: 'bob',
        domain: 'example.com'
      });
    });
  });
});
```

---

## 🔗 Related

- [Compose.EditorWithAutocomplete](./EditorWithAutocomplete.md) - Component using this utility
- [Compose.AutocompleteMenu](./AutocompleteMenu.md) - Suggestion menu component

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Mastodon API Documentation](https://docs.joinmastodon.org/methods/accounts/#search)

---

## ❓ FAQ

### **Q: How do I customize the trigger characters?**

The trigger characters (#, @, :) are hardcoded. To customize, fork and modify the `detectAutocompleteContext` function.

### **Q: Can I add custom autocomplete types?**

Yes, extend the `AutocompleteSuggestion` type and modify the detection logic.

### **Q: How do I handle special characters in queries?**

Use proper regex escaping in your filtering logic or implement custom validation.

### **Q: What about performance with large suggestion lists?**

Implement debouncing, limit `maxResults`, and consider virtualized rendering for the UI.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

