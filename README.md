# QR Code Badge Generator# React + TypeScript + Vite



A web application for generating QR codes and placing them in printable PDFs with configurable layouts. Built with React, TypeScript, and Material-UI.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## FeaturesCurrently, two official plugins are available:



- **QR Code Generation**: Create QR codes for links or email messages- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **CSV Import**: Bulk import QR code data from CSV files- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Customizable Templates**: Configure PDF layout including page size, orientation, and element positioning

- **Local Storage**: All data persists in your browser - no backend required## React Compiler

- **Printable PDFs**: Generate professional PDFs ready for printing

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Technology Stack

## Expanding the ESLint configuration

- **React 18** with TypeScript

- **Material-UI (MUI)** for UI componentsIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Vite** for fast development and building

- **QRCode.js** for QR code generation```js

- **jsPDF** for PDF creationexport default defineConfig([

- **PapaParse** for CSV parsing  globalIgnores(['dist']),

- **LocalStorage** for data persistence  {

    files: ['**/*.{ts,tsx}'],

## Getting Started    extends: [

      // Other configs...

### Prerequisites

      // Remove tseslint.configs.recommended and replace with this

- Node.js (v18 or higher)      tseslint.configs.recommendedTypeChecked,

- npm or yarn      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

### Installation      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

1. Clone the repository:

```bash      // Other configs...

git clone <repository-url>    ],

cd qrcode-badge    languageOptions: {

```      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

2. Install dependencies:        tsconfigRootDir: import.meta.dirname,

```bash      },

npm install      // other options...

```    },

  },

3. Start the development server:])

```bash```

npm run dev

```You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



4. Open your browser and navigate to `http://localhost:5173````js

// eslint.config.js

## Usageimport reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

### Adding QR Code Entries

export default defineConfig([

1. Navigate to the **QR Code Data** tab  globalIgnores(['dist']),

2. Click **Add Entry** to manually create a new QR code entry  {

3. Select the type (Link or Email) and fill in the required fields:    files: ['**/*.{ts,tsx}'],

   - **Link**: Provide a URL    extends: [

   - **Email**: Provide recipient, CC (optional), subject, and body      // Other configs...

4. Add a title and subtitle for the QR code label      // Enable lint rules for React

      reactX.configs['recommended-typescript'],

### Importing from CSV      // Enable lint rules for React DOM

      reactDom.configs.recommended,

1. Click **Download Template** to get a sample CSV file    ],

2. Fill in your data following the template format:    languageOptions: {

   - `type`: "link" or "email"      parserOptions: {

   - `title`: Main title text        project: ['./tsconfig.node.json', './tsconfig.app.json'],

   - `subtitle`: Subtitle text        tsconfigRootDir: import.meta.dirname,

   - `link`: URL (for link type)      },

   - `email_to`, `email_cc`, `email_subject`, `email_body`: Email parameters (for email type)      // other options...

3. Click **Import CSV** and select your file    },

  },

### Configuring PDF Templates])

```

1. Navigate to the **PDF Template** tab
2. Select an existing template or create a new one
3. Configure the following settings:
   - **Page Size**: A4, Letter, or A5
   - **Orientation**: Portrait or Landscape
   - **QR Code Settings**: Size and position
   - **Title Settings**: Font size and position
   - **Subtitle Settings**: Font size and position
   - **Items Per Page**: Number of QR codes per page
4. Click **Save Template** to persist your changes

### Generating PDFs

1. Ensure you have added QR code entries
2. Configure your desired PDF template
3. Click the **Generate PDF** button in the top navigation bar
4. The PDF will be automatically downloaded

## CSV Format

The CSV file should have the following columns:

```csv
type,title,subtitle,link,email_to,email_cc,email_subject,email_body
link,Example Link,Visit our website,https://example.com,,,
email,Example Email,Contact us,,contact@example.com,cc@example.com,Hello,This is the email body
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Data Storage

All data (QR code entries and PDF templates) is stored locally in your browser's LocalStorage. This means:
- No data is sent to any server
- Data persists between sessions
- Data is specific to your browser and device
- Clearing browser data will delete all entries

## Browser Support

This application works best in modern browsers that support:
- ES6+ JavaScript features
- LocalStorage API
- Canvas API (for QR code generation)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
