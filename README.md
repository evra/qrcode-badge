# QR Code Badge Generator

A web application for generating QR codes and placing them in printable PDFs with a visual template designer. Supports bulk generation and CSV data import. Built with React, TypeScript, and Material-UI, featuring **PDFme** for powerful drag-and-drop PDF template editing.

Demo: https://evra.github.io/qrcode-badge/ 


## Features
A web application for generating QR codes and placing them in printable PDFs with configurable layouts. Built with React, TypeScript, and Material-UI.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



- **Visual PDF Template Designer**: Use PDFme's intuitive drag-and-drop interface to design your PDF layout

- **QR Code Generation**: Create QR codes for links or email messages

- **CSV Import**: Bulk import QR code data from CSV files## FeaturesCurrently, two official plugins are available:

- **Fully Customizable Templates**: Visually configure PDF layouts including:

  - Page size and orientation

  - QR code placement, size, and styling

  - Title and subtitle positioning and formatting- **QR Code Generation**: Create QR codes for links or email messages- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

  - Multiple items per page

- **Local Storage**: All data persists in your browser - no backend required- **CSV Import**: Bulk import QR code data from CSV files- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Printable PDFs**: Generate professional PDFs ready for printing

- **Customizable Templates**: Configure PDF layout including page size, orientation, and element positioning

## Technology Stack

- **Local Storage**: All data persists in your browser - no backend required## React Compiler

- **React 18** with TypeScript

- **Material-UI (MUI)** for UI components- **Printable PDFs**: Generate professional PDFs ready for printing

- **Vite** for fast development and building

- **PDFme** for visual PDF template design and generationThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **PapaParse** for CSV parsing

- **LocalStorage** for data persistence## Technology Stack



## Getting Started## Expanding the ESLint configuration



### Prerequisites- **React 18** with TypeScript



- Node.js (v18 or higher)- **Material-UI (MUI)** for UI componentsIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- npm or yarn

- **Vite** for fast development and building

### Installation

- **QRCode.js** for QR code generation```js

1. Clone the repository:

```bash- **jsPDF** for PDF creationexport default defineConfig([

git clone <repository-url>

cd qrcode-badge- **PapaParse** for CSV parsing  globalIgnores(['dist']),

```

- **LocalStorage** for data persistence  {

2. Install dependencies:

```bash    files: ['**/*.{ts,tsx}'],

npm install

```## Getting Started    extends: [



3. Start the development server:      // Other configs...

```bash

npm run dev### Prerequisites

```

      // Remove tseslint.configs.recommended and replace with this

4. Open your browser and navigate to `http://localhost:5173`

- Node.js (v18 or higher)      tseslint.configs.recommendedTypeChecked,

## Usage

- npm or yarn      // Alternatively, use this for stricter rules

### Adding QR Code Entries

      tseslint.configs.strictTypeChecked,

1. Navigate to the **QR Code Data** tab

2. Click **Add Entry** to manually create a new QR code entry### Installation      // Optionally, add this for stylistic rules

3. Select the type (Link or Email) and fill in the required fields:

   - **Link**: Provide a URL      tseslint.configs.stylisticTypeChecked,

   - **Email**: Provide recipient, CC (optional), subject, and body

4. Add a title and subtitle for the QR code label1. Clone the repository:



### Importing from CSV```bash      // Other configs...



1. Click **Download Template** to get a sample CSV filegit clone <repository-url>    ],

2. Fill in your data following the template format:

   - `type`: "link" or "email"cd qrcode-badge    languageOptions: {

   - `title`: Main title text

   - `subtitle`: Subtitle text```      parserOptions: {

   - `link`: URL (for link type)

   - `email_to`, `email_cc`, `email_subject`, `email_body`: Email parameters (for email type)        project: ['./tsconfig.node.json', './tsconfig.app.json'],

3. Click **Import CSV** and select your file

2. Install dependencies:        tsconfigRootDir: import.meta.dirname,

### Designing PDF Templates with PDFme

```bash      },

1. Navigate to the **PDF Template** tab

2. Use the visual designer to customize your template:npm install      // other options...

   - **Drag and drop** elements to position them

   - **Resize** elements by dragging their corners```    },

   - **Configure properties** using the right-side panel

   - Add or remove fields as needed  },

3. Ensure your template includes these field names:

   - `qrcode`: For QR code display3. Start the development server:])

   - `title`: For entry titles

   - `subtitle`: For entry subtitles```bash```

4. Click **Save** to persist your template

npm run dev

### Generating PDFs

```You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

1. Ensure you have added QR code entries

2. Configure your desired PDF template using the visual designer

3. Click the **Generate PDF** button in the top navigation bar

4. The PDF will be automatically downloaded4. Open your browser and navigate to `http://localhost:5173````js



## CSV Format// eslint.config.js



The CSV file should have the following columns:## Usageimport reactX from 'eslint-plugin-react-x'



```csvimport reactDom from 'eslint-plugin-react-dom'

type,title,subtitle,link,email_to,email_cc,email_subject,email_body

link,Example Link,Visit our website,https://example.com,,,### Adding QR Code Entries

email,Example Email,Contact us,,contact@example.com,cc@example.com,Hello,This is the email body

```export default defineConfig([



## Why PDFme?1. Navigate to the **QR Code Data** tab  globalIgnores(['dist']),



[PDFme](https://github.com/pdfme/pdfme) provides a professional-grade PDF template designer with:2. Click **Add Entry** to manually create a new QR code entry  {

- **Visual Template Editor**: Drag-and-drop interface for easy layout design

- **Flexible Positioning**: Precise control over element placement3. Select the type (Link or Email) and fill in the required fields:    files: ['**/*.{ts,tsx}'],

- **Rich Schema Support**: Text, images, QR codes, barcodes, and more

- **Template Reusability**: Save and reuse your custom templates   - **Link**: Provide a URL    extends: [

- **No Backend Required**: All processing happens in the browser

   - **Email**: Provide recipient, CC (optional), subject, and body      // Other configs...

## Build for Production

4. Add a title and subtitle for the QR code label      // Enable lint rules for React

```bash

npm run build      reactX.configs['recommended-typescript'],

```

### Importing from CSV      // Enable lint rules for React DOM

The built files will be in the `dist` directory.

      reactDom.configs.recommended,

## Development

1. Click **Download Template** to get a sample CSV file    ],

```bash

# Run development server2. Fill in your data following the template format:    languageOptions: {

npm run dev

   - `type`: "link" or "email"      parserOptions: {

# Build for production

npm run build   - `title`: Main title text        project: ['./tsconfig.node.json', './tsconfig.app.json'],



# Preview production build   - `subtitle`: Subtitle text        tsconfigRootDir: import.meta.dirname,

npm run preview

   - `link`: URL (for link type)      },

# Lint code

npm run lint   - `email_to`, `email_cc`, `email_subject`, `email_body`: Email parameters (for email type)      // other options...

```

3. Click **Import CSV** and select your file    },

## Data Storage

  },

All data (QR code entries and PDF templates) is stored locally in your browser's LocalStorage. This means:

- No data is sent to any server### Configuring PDF Templates])

- Data persists between sessions

- Data is specific to your browser and device```

- Clearing browser data will delete all entries

1. Navigate to the **PDF Template** tab

## Browser Support2. Select an existing template or create a new one

3. Configure the following settings:

This application works best in modern browsers that support:   - **Page Size**: A4, Letter, or A5

- ES6+ JavaScript features   - **Orientation**: Portrait or Landscape

- LocalStorage API   - **QR Code Settings**: Size and position

- Canvas API (for QR code generation)   - **Title Settings**: Font size and position

   - **Subtitle Settings**: Font size and position

## License   - **Items Per Page**: Number of QR codes per page

4. Click **Save Template** to persist your changes

MIT

### Generating PDFs

## Contributing

1. Ensure you have added QR code entries

Contributions are welcome! Please feel free to submit a Pull Request.2. Configure your desired PDF template

3. Click the **Generate PDF** button in the top navigation bar

## Credits4. The PDF will be automatically downloaded



- PDF template design powered by [PDFme](https://github.com/pdfme/pdfme)## CSV Format

- UI components by [Material-UI](https://mui.com/)

- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)The CSV file should have the following columns:


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

## Deployment

This app is configured to automatically deploy to GitHub Pages when changes are merged into the `production` branch.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

**Live Demo**: The app will be available at `https://<your-username>.github.io/qrcode-badge/` after deployment.

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
