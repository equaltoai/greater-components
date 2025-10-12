# Compose Utilities: UnicodeCounter

**Module**: Unicode-Aware Character Counting  
**Package**: `@greater/fediverse`  
**Export**: `Compose.UnicodeCounter` or direct imports

---

## 📋 Overview

The `UnicodeCounter` utility provides accurate Unicode-aware character counting for text content. It properly handles grapheme clusters (emojis, combining characters, CJK characters) and implements Twitter/Mastodon-style URL weighting for consistent character limits across different platforms.

### **Key Features**:
- ✅ **Grapheme cluster counting** using `Intl.Segmenter`
- ✅ **Emoji support** (counts 👨‍👩‍👧‍👦 as 1 character, not 7)
- ✅ **URL weighting** (URLs count as ~23 characters)
- ✅ **CJK character support** (Chinese, Japanese, Korean)
- ✅ **Combining character handling** (é as 1 character, not 2)
- ✅ **Fallback** for browsers without `Intl.Segmenter`
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
interface CharacterCountOptions {
  /** Weight for URLs (default: 23) */
  urlWeight?: number;
  
  /** Whether to include URL weighting (default: true) */
  weightUrls?: boolean;
  
  /** Locale for grapheme segmentation (default: 'en') */
  locale?: string;
}
```

### **Functions**

#### **countGraphemes()**

Count grapheme clusters in text (correctly handles emoji and combining characters).

```typescript
function countGraphemes(text: string, locale: string = 'en'): number
```

**Parameters**:
- `text`: Text to count
- `locale`: Locale for segmentation (default: 'en')

**Returns**: Number of grapheme clusters.

**Example**:
```typescript
import { countGraphemes } from '@greater/fediverse/Compose';

console.log(countGraphemes('Hello'));        // 5
console.log(countGraphemes('Hello 👋'));     // 7 (not 8)
console.log(countGraphemes('Café'));          // 4 (not 5)
console.log(countGraphemes('👨‍👩‍👧‍👦'));     // 1 (not 7)
```

---

#### **countWeightedCharacters()**

Count characters with URL weighting (main counting function).

```typescript
function countWeightedCharacters(
  text: string,
  options?: CharacterCountOptions
): number
```

**Parameters**:
- `text`: Text to count
- `options`: Counting options

**Returns**: Weighted character count.

**Example**:
```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

// Simple text
console.log(countWeightedCharacters('Hello world'));
// 11

// With URL
console.log(countWeightedCharacters('Check out https://example.com'));
// "Check out " (10) + URL (23) = 33

// With emoji
console.log(countWeightedCharacters('Hello 👋🌍'));
// 9

// Custom URL weight
console.log(countWeightedCharacters('Link: https://example.com', {
  urlWeight: 30
}));
// "Link: " (6) + URL (30) = 36
```

---

#### **exceedsLimit()**

Check if text exceeds a character limit.

```typescript
function exceedsLimit(
  text: string,
  limit: number,
  options?: CharacterCountOptions
): boolean
```

**Parameters**:
- `text`: Text to check
- `limit`: Character limit
- `options`: Counting options

**Returns**: `true` if exceeds limit, `false` otherwise.

**Example**:
```typescript
import { exceedsLimit } from '@greater/fediverse/Compose';

const text = 'This is a test post with a link https://example.com';

console.log(exceedsLimit(text, 50));  // false
console.log(exceedsLimit(text, 40));  // true
```

---

#### **remainingCharacters()**

Calculate remaining characters within a limit.

```typescript
function remainingCharacters(
  text: string,
  limit: number,
  options?: CharacterCountOptions
): number
```

**Parameters**:
- `text`: Current text
- `limit`: Character limit
- `options`: Counting options

**Returns**: Number of remaining characters (negative if over limit).

**Example**:
```typescript
import { remainingCharacters } from '@greater/fediverse/Compose';

const limit = 500;
const text = 'Hello world';

console.log(remainingCharacters(text, limit));  // 489
```

---

#### **truncateToLimit()**

Truncate text to fit within character limit.

```typescript
function truncateToLimit(
  text: string,
  limit: number,
  options?: CharacterCountOptions
): string
```

**Parameters**:
- `text`: Text to truncate
- `limit`: Character limit
- `options`: Counting options

**Returns**: Truncated text.

**Example**:
```typescript
import { truncateToLimit } from '@greater/fediverse/Compose';

const longText = 'This is a very long post that exceeds the character limit...';
const truncated = truncateToLimit(longText, 50);

console.log(truncated);  // "This is a very long post that exceeds the chara"
```

---

#### **formatCharacterCount()**

Format character count for display (e.g., "150 / 500").

```typescript
function formatCharacterCount(
  current: number,
  limit: number
): string
```

**Parameters**:
- `current`: Current character count
- `limit`: Character limit

**Returns**: Formatted string.

**Example**:
```typescript
import { formatCharacterCount, countWeightedCharacters } from '@greater/fediverse/Compose';

const text = 'Hello world';
const count = countWeightedCharacters(text);
const formatted = formatCharacterCount(count, 500);

console.log(formatted);  // "11 / 500"
```

---

#### **estimateCharacterCount()**

Quickly estimate character count without full parsing (for performance).

```typescript
function estimateCharacterCount(text: string): number
```

**Parameters**:
- `text`: Text to estimate

**Returns**: Estimated character count.

**Example**:
```typescript
import { estimateCharacterCount } from '@greater/fediverse/Compose';

// Use for real-time counting during typing (faster)
const estimate = estimateCharacterCount(longText);

// Use accurate counting before submission
const accurate = countWeightedCharacters(longText);
```

---

#### **splitIntoChunks()**

Split text into chunks that fit within character limit.

```typescript
function splitIntoChunks(
  text: string,
  chunkSize: number,
  options?: CharacterCountOptions
): string[]
```

**Parameters**:
- `text`: Text to split
- `chunkSize`: Maximum characters per chunk
- `options`: Counting options

**Returns**: Array of text chunks.

**Example**:
```typescript
import { splitIntoChunks } from '@greater/fediverse/Compose';

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';
const chunks = splitIntoChunks(longText, 100);

console.log(chunks.length);  // Number of chunks
console.log(chunks[0]);      // First chunk
```

---

## 💡 Usage Examples

### **Example 1: Real-Time Character Counter**

Display character count as user types:

```typescript
import { countWeightedCharacters, remainingCharacters } from '@greater/fediverse/Compose';

const textarea = document.querySelector('textarea');
const counter = document.querySelector('.character-count');
const limit = 500;

textarea.addEventListener('input', () => {
  const text = textarea.value;
  const count = countWeightedCharacters(text);
  const remaining = remainingCharacters(text, limit);
  
  counter.textContent = `${count} / ${limit}`;
  counter.classList.toggle('over-limit', remaining < 0);
  counter.classList.toggle('near-limit', remaining < 50 && remaining >= 0);
});
```

### **Example 2: Visual Progress Bar**

Show character usage as a progress bar:

```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

const textarea = document.querySelector('textarea');
const progressBar = document.querySelector('.progress-bar');
const limit = 500;

textarea.addEventListener('input', () => {
  const count = countWeightedCharacters(textarea.value);
  const percentage = Math.min((count / limit) * 100, 100);
  
  progressBar.style.width = `${percentage}%`;
  
  if (percentage > 100) {
    progressBar.style.backgroundColor = '#ef4444';  // Red
  } else if (percentage > 80) {
    progressBar.style.backgroundColor = '#fbbf24';  // Yellow
  } else {
    progressBar.style.backgroundColor = '#10b981';  // Green
  }
});
```

### **Example 3: Twitter-Style URL Weighting**

Implement Twitter's URL counting:

```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

// Twitter counts all URLs as 23 characters
const twitterOptions = {
  urlWeight: 23,
  weightUrls: true
};

const tweets = [
  'Check out https://example.com',
  'Multiple links: https://a.com and https://b.com',
  'Short URL: http://t.co/abc'
];

tweets.forEach(tweet => {
  const count = countWeightedCharacters(tweet, twitterOptions);
  console.log(`"${tweet}": ${count} characters`);
});

// Output:
// "Check out https://example.com": 33 characters
// "Multiple links: https://a.com and https://b.com": 56 characters
// "Short URL: http://t.co/abc": 33 characters
```

### **Example 4: Thread Splitter**

Split long text into thread posts:

```typescript
import { splitIntoChunks } from '@greater/fediverse/Compose';

function createThread(longText: string, limit: number = 500) {
  const chunks = splitIntoChunks(longText, limit - 10); // Leave room for " (X/Y)"
  
  return chunks.map((chunk, index) => ({
    content: `${chunk} (${index + 1}/${chunks.length})`,
    order: index
  }));
}

const longPost = `
  This is a very long post that needs to be split into multiple tweets...
  [Content continues for many paragraphs]
`;

const thread = createThread(longPost, 280);
console.log(`Split into ${thread.length} posts`);
```

### **Example 5: Multi-Language Support**

Handle different character systems:

```typescript
import { countGraphemes } from '@greater/fediverse/Compose';

const texts = {
  english: 'Hello world',
  japanese: 'こんにちは世界',
  chinese: '你好世界',
  korean: '안녕하세요 세계',
  emoji: '👨‍👩‍👧‍👦 Family',
  arabic: 'مرحبا بالعالم',
  thai: 'สวัสดีชาวโลก'
};

for (const [lang, text] of Object.entries(texts)) {
  const count = countGraphemes(text);
  console.log(`${lang}: "${text}" = ${count} characters`);
}
```

### **Example 6: Validation Before Submission**

Validate content length:

```typescript
import { exceedsLimit, countWeightedCharacters } from '@greater/fediverse/Compose';

function validatePost(content: string, limit: number = 500): {
  valid: boolean;
  count: number;
  errors: string[];
} {
  const count = countWeightedCharacters(content);
  const errors = [];
  
  if (content.trim().length === 0) {
    errors.push('Post cannot be empty');
  }
  
  if (exceedsLimit(content, limit)) {
    errors.push(`Post exceeds ${limit} character limit (${count} characters)`);
  }
  
  return {
    valid: errors.length === 0,
    count,
    errors
  };
}

form.addEventListener('submit', (e) => {
  const validation = validatePost(textarea.value);
  
  if (!validation.valid) {
    e.preventDefault();
    alert(validation.errors.join('\n'));
  }
});
```

### **Example 7: Truncation with Ellipsis**

Smartly truncate long text:

```typescript
import { truncateToLimit, countWeightedCharacters } from '@greater/fediverse/Compose';

function smartTruncate(text: string, limit: number): string {
  if (countWeightedCharacters(text) <= limit) {
    return text;
  }
  
  // Leave room for ellipsis
  const truncated = truncateToLimit(text, limit - 3);
  
  // Try to truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > limit * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

const longText = 'This is a very long post that needs to be truncated properly';
console.log(smartTruncate(longText, 30));
// "This is a very long post..."
```

### **Example 8: Performance Optimization**

Optimize counting for real-time typing:

```typescript
import { estimateCharacterCount, countWeightedCharacters } from '@greater/fediverse/Compose';

let typingTimeout;
let lastAccurateCount = 0;

textarea.addEventListener('input', () => {
  // Use fast estimate while typing
  const estimate = estimateCharacterCount(textarea.value);
  updateUI(estimate);
  
  // Debounce accurate count
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    lastAccurateCount = countWeightedCharacters(textarea.value);
    updateUI(lastAccurateCount);
  }, 500);
});

// Before submission, ensure accurate count
form.addEventListener('submit', () => {
  const accurate = countWeightedCharacters(textarea.value);
  if (accurate !== lastAccurateCount) {
    updateUI(accurate);
  }
});
```

---

## 🧪 Testing

```typescript
import { describe, it, expect } from 'vitest';
import {
  countGraphemes,
  countWeightedCharacters,
  exceedsLimit,
  remainingCharacters,
  truncateToLimit,
  splitIntoChunks
} from '@greater/fediverse/Compose';

describe('UnicodeCounter', () => {
  describe('countGraphemes', () => {
    it('counts basic ASCII', () => {
      expect(countGraphemes('Hello')).toBe(5);
    });

    it('counts emoji as single character', () => {
      expect(countGraphemes('👋')).toBe(1);
      expect(countGraphemes('👨‍👩‍👧‍👦')).toBe(1); // Family emoji
    });

    it('counts combining characters correctly', () => {
      expect(countGraphemes('Café')).toBe(4);  // é is one grapheme
    });

    it('counts CJK characters', () => {
      expect(countGraphemes('你好')).toBe(2);
      expect(countGraphemes('こんにちは')).toBe(5);
    });
  });

  describe('countWeightedCharacters', () => {
    it('counts text without URLs', () => {
      expect(countWeightedCharacters('Hello world')).toBe(11);
    });

    it('weights URLs correctly', () => {
      const text = 'Check https://example.com';
      // "Check " (6) + URL (23) = 29
      expect(countWeightedCharacters(text)).toBe(29);
    });

    it('handles multiple URLs', () => {
      const text = 'Links: https://a.com and https://b.com';
      // "Links: " (7) + " and " (5) + 2 URLs (46) = 58
      expect(countWeightedCharacters(text)).toBe(58);
    });

    it('respects custom URL weight', () => {
      const text = 'Link: https://example.com';
      expect(countWeightedCharacters(text, { urlWeight: 30 })).toBe(36);
    });
  });

  describe('exceedsLimit', () => {
    it('returns false when under limit', () => {
      expect(exceedsLimit('Hello', 10)).toBe(false);
    });

    it('returns true when over limit', () => {
      expect(exceedsLimit('Hello world', 5)).toBe(true);
    });
  });

  describe('remainingCharacters', () => {
    it('calculates remaining characters', () => {
      expect(remainingCharacters('Hello', 10)).toBe(5);
    });

    it('returns negative when over limit', () => {
      expect(remainingCharacters('Hello world', 5)).toBe(-6);
    });
  });

  describe('truncateToLimit', () => {
    it('truncates text to limit', () => {
      const text = 'Hello world';
      const truncated = truncateToLimit(text, 5);
      expect(truncated).toBe('Hello');
    });

    it('returns original if under limit', () => {
      const text = 'Hello';
      const truncated = truncateToLimit(text, 10);
      expect(truncated).toBe('Hello');
    });
  });

  describe('splitIntoChunks', () => {
    it('splits text into chunks', () => {
      const text = 'A'.repeat(250);
      const chunks = splitIntoChunks(text, 100);
      expect(chunks.length).toBe(3);
      expect(chunks[0].length).toBe(100);
      expect(chunks[1].length).toBe(100);
      expect(chunks[2].length).toBe(50);
    });

    it('handles text shorter than chunk size', () => {
      const text = 'Hello';
      const chunks = splitIntoChunks(text, 100);
      expect(chunks).toEqual(['Hello']);
    });
  });
});
```

---

## 🔒 Security Considerations

### **Performance with Very Long Text**

Be cautious with extremely long text:

```typescript
import { countWeightedCharacters } from '@greater/fediverse/Compose';

function safeCount(text: string, maxLength: number = 10000): number {
  if (text.length > maxLength) {
    console.warn(`Text exceeds ${maxLength} characters, truncating for count`);
    text = text.substring(0, maxLength);
  }
  
  return countWeightedCharacters(text);
}
```

### **Input Validation**

Always validate before processing:

```typescript
function validateInput(text: unknown): string {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (text.length > 100000) {
    throw new Error('Input too long');
  }
  
  return text;
}
```

---

## 🔗 Related

- [Compose.CharacterCount](./CharacterCount.md) - Component using this utility
- [Compose.Root](./Root.md) - Main compose component

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Intl.Segmenter API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
- [Twitter Text Library](https://github.com/twitter/twitter-text)

---

## ❓ FAQ

### **Q: Why do URLs count as 23 characters?**

Twitter/Mastodon automatically shorten URLs to t.co links (~23 chars), so all URLs are weighted equally regardless of their actual length.

### **Q: What's a grapheme cluster?**

A grapheme cluster is a user-perceived character. For example, 👨‍👩‍👧‍👦 (family emoji) is made of multiple Unicode code points but appears as one character.

### **Q: Does this work in all browsers?**

Yes, with a fallback for browsers that don't support `Intl.Segmenter` (currently only Safari/Chrome support it fully).

### **Q: Can I customize URL detection?**

Yes, modify the URL regex in the source code to match your requirements.

### **Q: How accurate is the fallback counting?**

The fallback uses `.split()` which is less accurate for complex emoji but works well for most text.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

