# React Assignment Spreadsheet

A modern spreadsheet-like web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project features a custom table UI with sorting, grouping, and interactive controls, styled to resemble modern productivity tools.

## Features

- ⚡️ Fast development with Vite
- 📋 Spreadsheet-style table with custom columns and grouping
- 🔍 Search, filter, and sort functionality (UI)
- 🎨 Beautiful UI with Tailwind CSS and Lucide icons
- 🟢 Interactive buttons with alert feedback
- 🧩 Modular React components

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [react-table](https://tanstack.com/table/v7) (for table logic)

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd react_Assignment
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production

```sh
npm run build
# or
yarn build
```

### Lint

```sh
npm run lint
# or
yarn lint
```

## Project Structure

```
src/
  components/
    Spreadsheet.tsx   # Main spreadsheet UI
  App.tsx
  main.tsx
  ...
public/
  vite.svg
index.html
```

## Customization

- To change columns, data, or UI, edit `src/components/Spreadsheet.tsx`.
- All buttons currently show an alert when clicked (for demo purposes).

## License

This project is for educational/demo purposes.
