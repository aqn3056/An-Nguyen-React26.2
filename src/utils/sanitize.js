import DOMPurify from 'dompurify';

// Strips all HTML tags and attributes, returning safe plain text.
// Run input validation before calling this.
export function sanitizeText(input) {
  return DOMPurify.sanitize(String(input ?? '').trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
