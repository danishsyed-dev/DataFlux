<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# ⚡ DataFlux

**Real-time sales analytics dashboard with revenue tracking, product performance, and payment insights.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](https://opensource.org/licenses/Apache-2.0)

</div>

---

## 📋 Overview

DataFlux is an interactive, single-page analytics dashboard built to visualize sales data across multiple dimensions. It features a polished dark-themed UI with animated charts, filterable transaction tables, and key performance metric cards — designed to demonstrate modern frontend engineering with React 19 and the latest tooling.

## ✨ Features

- **📊 Revenue Trend Chart** — Area chart showing daily revenue over time with smooth gradient fills
- **💳 Payment Split Breakdown** — Donut chart visualizing revenue distribution across payment methods (Credit Card, Debit Card, eWallet, Cash)
- **📦 Top Products Ranking** — Animated horizontal bar chart ranking products by revenue
- **📋 Transaction Table** — Recent orders with product details, payment methods, and amounts
- **🔍 Search & Filter** — Real-time filtering by product name, order number, or payment method
- **📱 Responsive Design** — Adaptive sidebar and layout for desktop, tablet, and mobile
- **🎨 Dark Theme** — Warm slate color palette with amber gold accents
- **✨ Micro-Animations** — Staggered card reveals, bar growth animations, and smooth transitions via Framer Motion

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts 3 |
| **Animations** | Framer Motion (via `motion`) |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)
- A **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danishsyed-dev/DataFlux.git
   cd DataFlux
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your API key:**

   Create a `.env.local` file in the project root (this file is gitignored and won't be committed):

   ```bash
   cp .env.example .env.local
   ```

   Then open `.env.local` and replace the placeholder with your actual key:

   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

   > 💡 You can generate a free API key at [Google AI Studio → API Keys](https://aistudio.google.com/apikey)

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open in browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove the `dist/` folder |

## 📁 Project Structure

```
DataFlux/
├── index.html              # Entry HTML
├── vite.config.ts           # Vite + Tailwind config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies & scripts
├── src/
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Main dashboard layout & components
│   ├── index.css            # Design tokens, component styles, responsive rules
│   ├── types.ts             # TypeScript interfaces (Sale, DailySales, etc.)
│   ├── data.ts              # Static sales dataset (117 transactions)
│   └── utils/
│       └── data-processing.ts  # Aggregation, filtering, and metric computation
└── dist/                    # Production build output (gitignored)
```

## 📊 Dataset

The dashboard is powered by a curated static dataset of **117 sales transactions** from a fictional apparel/trousers retail store, spanning **August 15 – October 7, 2025**.

### Product Catalog (12 items)

| Product | Price |
|---|---|
| Premium Tailored Trousers | $175 |
| Tailored Wool Dress Trousers | $145 |
| Classic Denim Overalls | $115 |
| Flannel-Lined Canvas Work Pants | $98 |
| Striped Seersucker Trousers | $95 |
| Drawstring Linen Trousers | $92 |
| Slim-Fit Denim Jeans | $88 |
| Relaxed Fit Corduroy Trousers | $85 |
| Double-Pleated Khaki Trousers | $82 |
| Classic Fit Chinos | $78 |
| Technical Performance Joggers | $75 |
| Multi-Pocket Cargo Shorts | $58 |

### Payment Methods

`Credit Card` · `Debit Card` · `eWallet` · `Cash`

### Data Schema

Each transaction record in [`src/data.ts`](src/data.ts) follows this structure:

```typescript
interface Sale {
  orderNumber: string;    // e.g. "TT-1001" — unique per order, multi-item orders share the same number
  product: string;        // Product name from the catalog above
  price: number;          // Item price in USD
  date: string;           // ISO format YYYY-MM-DD
  paymentMethod: string;  // One of the 4 payment methods
}
```

The data processing layer in [`src/utils/data-processing.ts`](src/utils/data-processing.ts) aggregates this raw data into daily revenue trends, product rankings, payment breakdowns, and overall metrics — all computed on the fly as filters change.

## 🖼️ Screenshots

<!-- Add screenshots of your dashboard here -->
<!-- ![Dashboard Overview](./screenshots/dashboard.png) -->

## 📝 License

This project is licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0).

## 👤 Author

**Danish Syed** — [@danishsyed-dev](https://github.com/danishsyed-dev)

---
