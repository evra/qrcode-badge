# UTF-8 Character Encoding Fix

## Problem
QR code generation was creating empty QR codes when the email subject or body contained UTF-8 characters such as:
- En-dash: `–` (U+2013)
- Em-dash: `—` (U+2014)
- Other special Unicode characters

## Root Causes Identified

1. **CSV File Format Issues:**
   - The CSV file uses **semicolons (`;`)** as delimiters instead of commas
   - The CSV file has a **UTF-8 BOM** (Byte Order Mark: `EF BB BF`)
   - Papa Parse was not configured to handle these specifics

2. **Incorrect URL Encoding:**
   - `URLSearchParams` uses `application/x-www-form-urlencoded` format (spaces as `+`)
   - Mailto URLs should use RFC 6068 encoding (spaces as `%20`)
   - Characters like `Ü`, `ö`, `ä`, `–` need proper percent-encoding for QR codes

3. **QR Code Error Correction:**
   - Lower error correction levels may have issues with longer UTF-8 encoded URLs
   - UTF-8 characters in mailto URLs get URL-encoded, making them longer

## Fixes Applied

### 1. CSV Import Component (`src/components/CSVImport.tsx`)

**Changed:**
```typescript
Papa.parse<CSVRow>(file, {
  header: true,
  skipEmptyLines: true,
  encoding: 'UTF-8',
  delimiter: ';', // Explicitly support semicolon delimiter
  delimitersToGuess: [';', ',', '\t', '|'], // Auto-detect delimiter
  complete: (results) => {
    // ... rest of the code
  }
});
```

**Template Download Updated:**
- Changed delimiter from comma to semicolon
- Added UTF-8 BOM to exported template for compatibility
- Updated charset to `text/csv;charset=utf-8`

### 2. QR Code Service (`src/services/qrCodeService.ts`)

**Added RFC 6068 compliant encoding:**
```typescript
const encodeMailtoParam = (value: string): string => {
  return encodeURIComponent(value)
    .replace(/%20/g, '%20') // Keep spaces as %20 (not +)
    .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
};
```

**Changed mailto URL construction:**
```typescript
// Old: URLSearchParams (wrong for mailto)
const params = new URLSearchParams();
params.append('subject', entry.email.subject);

// New: Manual construction with proper encoding
const params: string[] = [];
if (entry.email.subject) {
  params.push(`subject=${encodeMailtoParam(entry.email.subject)}`);
}
content = params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
```

**QR Code generation improvements:**
```typescript
const dataUrl = await QRCode.toDataURL(content, {
  width: 300,
  margin: 1,
  errorCorrectionLevel: 'H', // Changed from 'M' to 'H' for better UTF-8 reliability
  type: 'image/png',
});
```

**Improvements:**
- Replaced `URLSearchParams` with manual RFC 6068-compliant encoding
- Proper handling of UTF-8 characters like `Ü`, `ö`, `ä`, `ß`, `–`
- Increased error correction from 'M' (Medium ~15%) to 'H' (High ~30%)
- Added explicit `type: 'image/png'` parameter
- Added detailed logging showing content length and first 100 characters

### 3. PDF Service (`src/services/pdfService.ts`)

**Applied the same encoding fixes:**
- Added `encodeMailtoParam` function
- Replaced `URLSearchParams` with manual URL construction
- Applied to both `generatePDF` and `previewEntry` functions

## Technical Details

### UTF-8 BOM
The Byte Order Mark (`EF BB BF` or `\uFEFF`) indicates the file is UTF-8 encoded. Papa Parse handles this automatically when `encoding: 'UTF-8'` is set.

### Semicolon Delimiter
Many European locales use semicolons in CSV files because commas are used as decimal separators. The `delimitersToGuess` option allows Papa Parse to auto-detect the correct delimiter.

### QR Code Error Correction Levels
- **L (Low):** ~7% of codewords can be restored
- **M (Medium):** ~15% of codewords can be restored
- **Q (Quartile):** ~25% of codewords can be restored
- **H (High):** ~30% of codewords can be restored

Higher error correction is important when:
- QR codes contain lots of data (like long mailto URLs)
- The data includes UTF-8 characters that get URL-encoded
- You want better scanning reliability

### URL Encoding

**Problem with URLSearchParams:**
`URLSearchParams` uses `application/x-www-form-urlencoded` format which:
- Encodes spaces as `+` instead of `%20`
- Is designed for HTML form submission, not mailto URLs
- Can cause QR codes to be empty or malformed

**RFC 6068 Mailto URL Encoding:**
The proper encoding for mailto URLs:
- Spaces should be `%20` (not `+`)
- UTF-8 characters are percent-encoded: `Ü` → `%C3%9C`
- En-dash `–` (U+2013) becomes `%E2%80%93`
- This makes the mailto URL longer but more reliable
- Higher error correction helps ensure the QR code remains scannable

**Examples:**
- **Wrong:** `mailto:test@example.com?subject=Test+Ü` (URLSearchParams)
- **Correct:** `mailto:test@example.com?subject=Test%20%C3%9C` (RFC 6068)

## Testing

To test the fix:
1. Import the CSV file with UTF-8 characters
2. Verify QR codes are generated (not empty)
3. Scan QR codes to ensure they work properly
4. Check that email clients properly decode the UTF-8 characters

## Files Modified

- `src/components/CSVImport.tsx` - Added semicolon delimiter support and UTF-8 BOM handling
- `src/services/qrCodeService.ts` - **Replaced URLSearchParams with RFC 6068 encoding**, increased error correction, improved logging
- `src/services/pdfService.ts` - **Replaced URLSearchParams with RFC 6068 encoding** in both generatePDF and previewEntry functions

## Future Considerations

If issues persist with specific characters:
1. Consider using a custom URL encoding function that's more email-client friendly
2. Test with different QR code sizes (larger = more data capacity)
3. Consider stripping or replacing problematic characters as a fallback
4. Add validation to warn users about characters that may cause issues
