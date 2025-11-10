# Debugging Empty QR Codes - Checklist

## Current Status
✅ **QR Code Generation Works**: Test script confirms the QR library can generate QR codes with the problematic body text
✅ **URL Length OK**: 604 characters (well under the 1663 char limit for High error correction)
✅ **Encoding Fixed**: Spaces encoded as %20, email addresses NOT encoded

## What We Fixed
1. **CSV Delimiter**: Added support for semicolon (`;`) delimiters
2. **mailto Encoding**: Replaced URLSearchParams with RFC 6068 compliant encoding
3. **Email Address Bug**: Fixed issue where `@` in email addresses was being encoded to `%40`
4. **Error Correction**: Increased from 'M' to 'H' for better reliability

## If QR Codes Still Appear Empty, Check:

### 1. Browser Console Logs
Open DevTools (F12) and check for:
- Console messages showing "Generating QR code for content"
- Any error messages from the QR code generation
- The actual mailto URL being generated

### 2. Import Process
When importing the CSV:
- Does it show "Import successful" notification?
- How many entries were imported?
- Check the browser's localStorage to see if data was saved

### 3. PDF Generation vs Table View
- Are QR codes empty in the **table view** or only in the **PDF**?
- The table might not show QR codes, only the text data
- Try generating a PDF to see the actual QR codes

### 4. CSV File Encoding
Your CSV file should be:
- UTF-8 encoded (with or without BOM)
- Semicolon delimited (`;`)
- Properly quoted if fields contain newlines

### 5. Check Specific Row Data
In the browser console, after import, run:
```javascript
// Check what was imported
const entries = JSON.parse(localStorage.getItem('qrcodeEntries') || '[]');
console.log('Total entries:', entries.length);
console.log('First entry:', entries[0]);
console.log('Email body length:', entries[0]?.email?.body?.length);
```

### 6. Test with Simple Data First
Create a test CSV with simple data:
```csv
type;title;subtitle;link;email_to;email_cc;email_subject;email_body
email;Test;Simple;;test@example.com;;Hello;World
```

If this works, gradually add:
- German umlauts (ü, ö, ä)
- En-dash (–)
- Longer body text
- Newlines in body

## Quick Test Steps

1. **Clear existing data**:
   - Open DevTools Console
   - Run: `localStorage.clear()`
   - Refresh page

2. **Import your CSV file**

3. **Check console for logs**:
   - Look for "Generating QR code for content"
   - Note the content length shown

4. **Generate PDF**:
   - Click "Generate PDF" button
   - Open the PDF
   - Check if QR codes are visible

5. **Scan a QR code**:
   - Use your phone to scan
   - Does it open the email client?
   - Is the subject/body correct?

## Common Issues and Solutions

### Issue: QR Code Image is All White
- **Cause**: The QR code content might be empty string
- **Solution**: Check that email_to, email_subject, and email_body fields are not empty

### Issue: QR Code Won't Scan
- **Cause**: mailto URL might be malformed
- **Solution**: Check console logs to see the actual URL being generated

### Issue: Characters Look Wrong in Email
- **Cause**: Email client doesn't support UTF-8 properly
- **Solution**: This is a client-side issue, the QR code itself is correct

### Issue: Import Shows 0 Entries
- **Cause**: CSV delimiter mismatch or malformed CSV
- **Solution**: Ensure CSV uses semicolons, check for proper quoting

## Files to Check

1. **src/services/qrCodeService.ts** - QR code generation with logging
2. **src/services/pdfService.ts** - PDF generation with QR codes
3. **src/components/CSVImport.tsx** - CSV parsing configuration

## Next Steps for Debugging

If QR codes are still empty after the fixes:

1. Run the dev server: `npm run dev`
2. Open browser to http://localhost:5173
3. Open DevTools Console (F12)
4. Import your CSV
5. Copy all console output and share it

The console logs will show exactly what mailto URL is being generated, which will help identify if there's a remaining encoding issue.
