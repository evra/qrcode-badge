# Fix Summary: Empty QR Codes with UTF-8 Characters (Ü, ö, ä, –, etc.)

## Problem
QR codes were appearing empty when email subjects or bodies contained UTF-8 characters such as:
- German umlauts: `Ü`, `ö`, `ä`, `ß`
- Special dashes: `–` (en-dash U+2013)
- Other non-ASCII characters

## Root Cause
The application was using `URLSearchParams` to build mailto URLs. This class uses **application/x-www-form-urlencoded** format which:
- Encodes spaces as `+` instead of `%20`
- Is designed for HTML form submission, NOT for mailto URLs
- Causes QR code libraries and email clients to malfunction

## The Critical Difference

### ❌ Wrong (URLSearchParams)
```javascript
const params = new URLSearchParams();
params.append('subject', 'Test – Ü');
// Result: "subject=Test+%E2%80%93+%C3%9C"
//         Spaces as + causes problems! ↑
```

### ✅ Correct (RFC 6068)
```javascript
const encodeMailtoParam = (value) => {
  return encodeURIComponent(value)
    .replace(/%20/g, '%20'); // Spaces as %20
};

// CRITICAL: Only encode subject/body, NOT email addresses!
if (email.cc) params.push(`cc=${email.cc}`); // NO encoding
if (email.subject) params.push(`subject=${encodeMailtoParam(email.subject)}`); // YES encoding
// Result: "cc=test@example.com&subject=Test%20%E2%80%93%20%C3%9C"
//         Email addresses keep @, subject is encoded! ↑
```

## Solution Applied

### 1. Created RFC 6068 Compliant Encoding Function
Added to both `qrCodeService.ts` and `pdfService.ts`:

```typescript
const encodeMailtoParam = (value: string): string => {
  return encodeURIComponent(value)
    .replace(/%20/g, '%20') // Keep spaces as %20 (not +)
    .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
};
```

### 2. Replaced URLSearchParams with Manual URL Construction

**Before:**
```typescript
const params = new URLSearchParams();
if (entry.email.cc) params.append('cc', entry.email.cc);
if (entry.email.subject) params.append('subject', entry.email.subject);
if (entry.email.body) params.append('body', entry.email.body);
const queryString = params.toString();
content = `${mailto}?${queryString}`;
```

**After:**
```typescript
const params: string[] = [];
// CRITICAL: Email addresses should NOT be encoded!
if (entry.email.cc) params.push(`cc=${entry.email.cc}`);
// Only subject and body need encoding
if (entry.email.subject) params.push(`subject=${encodeMailtoParam(entry.email.subject)}`);
if (entry.email.body) params.push(`body=${encodeMailtoParam(entry.email.body)}`);
content = params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
```

### 3. Improved QR Code Error Correction
Changed from Medium (M) to High (H) error correction:
```typescript
const dataUrl = await QRCode.toDataURL(content, {
  width: 300,
  margin: 1,
  errorCorrectionLevel: 'H', // 30% error correction
  type: 'image/png',
});
```

### 4. Fixed CSV Import for Semicolon Delimiters
```typescript
Papa.parse<CSVRow>(file, {
  header: true,
  skipEmptyLines: true,
  encoding: 'UTF-8',
  delimiter: ';',
  delimitersToGuess: [';', ',', '\t', '|'],
  // ...
});
```

## Files Modified
1. ✅ `src/services/qrCodeService.ts` - RFC 6068 encoding, improved error correction
2. ✅ `src/services/pdfService.ts` - RFC 6068 encoding for both generatePDF and previewEntry
3. ✅ `src/components/CSVImport.tsx` - Semicolon delimiter support, UTF-8 BOM handling

## Testing
Run the test script to see the difference:
```bash
node test-utf8-encoding.js
```

This demonstrates how the encoding has changed from the problematic `+` for spaces to the correct `%20`.

## Expected Results
✅ QR codes now generate successfully with UTF-8 characters
✅ Email clients properly decode subjects and bodies
✅ Characters like `Ü`, `ö`, `ä`, `ß`, `–` work correctly
✅ CSV files with semicolon delimiters and UTF-8 BOM are handled properly

## Technical References
- **RFC 6068**: The `mailto` URL Scheme
  - Specifies that spaces should be encoded as `%20`
  - UTF-8 characters should be percent-encoded
- **URLSearchParams**: Uses `application/x-www-form-urlencoded`
  - Encodes spaces as `+`
  - Designed for HTML form submission, NOT mailto URLs

## Example Output
```
Wrong #1: mailto:test@example.com?subject=Test+Ü           (+ instead of %20)
Wrong #2: mailto:test@example.com?cc=test%40example.com    (@ encoded to %40)
✅ Correct: mailto:test@example.com?cc=test@example.com&subject=Test%20%C3%9C
```

**The critical rules:**
1. Spaces: Use `%20` (not `+`)
2. Email addresses: Do NOT encode (keep `@` as `@`, not `%40`)
3. Subject/Body: DO encode UTF-8 characters
