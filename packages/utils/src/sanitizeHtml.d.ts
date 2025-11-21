import type { Config } from 'dompurify';
export interface SanitizeOptions {
    /**
     * Allow specific HTML tags
     */
    allowedTags?: string[];
    /**
     * Allow specific attributes
     */
    allowedAttributes?: string[];
    /**
     * Allow data URIs in src attributes
     */
    allowDataUri?: boolean;
    /**
     * Custom DOMPurify configuration
     */
    customConfig?: Config;
}
/**
 * Sanitize HTML content using DOMPurify with an allow-list approach
 * @param dirty - The potentially unsafe HTML string
 * @param options - Sanitization options
 * @returns Sanitized HTML string
 */
export declare function sanitizeHtml(dirty: string, options?: SanitizeOptions): string;
/**
 * Sanitize HTML for preview/excerpt (strips all HTML)
 * @param dirty - The HTML string to strip
 * @param maxLength - Maximum length of the output
 * @returns Plain text string
 */
export declare function sanitizeForPreview(dirty: string, maxLength?: number): string;
//# sourceMappingURL=sanitizeHtml.d.ts.map