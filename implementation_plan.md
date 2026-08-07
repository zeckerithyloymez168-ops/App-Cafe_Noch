# Implementation Plan - Complete Coffee Shop Management System

Building a production-quality, responsive Coffee Shop Management System with React 19, Vite, Tailwind CSS, Google Apps Script REST API, Google Sheets database, Telegram Bot & Mini App integration, and Looker Studio reporting.

## User Review Required

> [!IMPORTANT]
> - **Backend API Architecture**: Google Apps Script (GAS) Web Apps run standard HTTP `GET` and `POST` calls. Since `PUT` and `DELETE` requests in web browsers can face CORS/GAS redirects limitations, the GAS script will support both native HTTP methods and `action` parameters/headers (e.g. `POST` with `action: 'PUT_MENU'` or `action: 'DELETE_MENU'`) to ensure 100% reliable execution across all browsers and Telegram Mini App embedded webviews.
> - **Dual Data Engine (Hybrid Mode)**: To ensure immediate out-of-the-box usability and testing before connecting your live Google Sheet, the app includes a fallback Mock Data Service with realistic coffee shop data. Switching to your live Google Apps Script backend requires simply setting `VITE_GAS_API_URL` in `.env`.

## Proposed System Architecture & Directory Structure

```
App Cafe/
├── gas/
│   └── Code.gs                  # Full Google Apps Script REST API & Telegram Webhook
├── public/
│   ├── favicon.svg
│   └── telegram-web-app.js      # Telegram Mini App SDK script tag support
├── src/
│   ├── assets/                  # Icons and static images
│   ├── components/
│   │   ├── common/              # Button, Input, Modal, Badge, Toast, Skeleton, EmptyState
│   │   ├── customer/            # ProductCard, CategoryTabs, CartDrawer, BottomNav, KHQRModal
│   │   └── admin/               # StatCard, SalesChart, MenuModal, StockModal, OrderRow
│   ├── context/
│   │   ├── AuthContext.jsx       # Admin Auth state management
│   │   ├── CartContext.jsx       # Shopping cart, discounts, tax & service charges
│   │   └── ThemeContext.jsx      # Light/Dark mode state
│   ├── hooks/
│   │   ├── useApi.js            # Axios hook for GAS REST API
│   │   └── useTelegram.js       # Telegram Mini App SDK wrapper
│   ├── layouts/
│   │   ├── AdminLayout.jsx      # Sidebar & Admin Header
│   │   └── CustomerLayout.jsx   # Topbar, Content & Telegram Mini App BottomNav
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MenuManagement.jsx
│   │   │   ├── OrdersManagement.jsx
│   │   │   ├── StockManagement.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx
│   │   └── customer/
│   │       ├── Home.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── OrderSuccess.jsx
│   │       ├── OrderHistory.jsx
│   │       └── Profile.jsx
│   ├── services/
│   │   ├── api.js               # Main Axios API service
│   │   ├── exportService.js     # Excel & PDF generation service
│   │   └── mockData.js          # Realistic Coffee Shop seed data
│   ├── utils/
│   │   ├── formatters.js        # Currency ($ & ៛), date formatting, status mapping
│   │   └── cn.js                # Tailwind class merger
│   ├── App.jsx                  # Main Router setup
│   ├── index.css                # Custom CSS variables, Glassmorphism, animations
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md                    # Setup guides (Google Sheets, GAS, Telegram Bot, Looker Studio, Vercel)
```

---

## Proposed Changes

### 1. Configuration & Styling Infrastructure

#### [NEW] [package.json](file:///c:/Users/PN/Desktop/App Cafe/package.json)
- React 19, Vite, React Router v6, Axios, Recharts, Lucide-React, jspdf, jspdf-autotable, xlsx, clsx, tailwind-merge, react-hot-toast, react-hook-form.

#### [NEW] [tailwind.config.js](file:///c:/Users/PN/Desktop/App Cafe/tailwind.config.js)
- Coffee shop color palette (Warm Amber, Espresso Dark, Mocha Brown, Sage Green status, Latte Cream).
- Glassmorphism backdrop utilities, custom shadows, and micro-animations.

#### [NEW] [src/index.css](file:///c:/Users/PN/Desktop/App Cafe/src/index.css)
- Tailwind directives, CSS variables for dark/light themes, custom scrollbars, and skeleton pulse effects.

---

### 2. Google Apps Script Backend & Guides (`gas/Code.gs`)

#### [NEW] [gas/Code.gs](file:///c:/Users/PN/Desktop/App Cafe/gas/Code.gs)
- Complete Google Apps Script implementation supporting Google Sheets database tables:
  1. `Menu`: id, name, category, price, image, description, stock, status
  2. `Orders`: order_id, customer_name, telegram_id, order_date, total, payment_method, status
  3. `OrderItems`: order_id, menu_id, menu_name, qty, price, subtotal
  4. `Stock`: id, ingredient, qty, unit
  5. `Users`: id, username, password, role
  6. `Expense`: id, title, amount, date
  7. `Settings`: shop_name, address, phone, telegram_bot_token, chat_id
- Complete REST endpoints implementation handling GET, POST, PUT, DELETE operations with CORS headers (`Access-Control-Allow-Origin: *`).
- Integrated Telegram Bot API wrapper to push instant HTML notifications on new orders to Admin and automatic status updates to Customer.

---

### 3. Core State & Services

#### [NEW] [src/services/api.js](file:///c:/Users/PN/Desktop/App Cafe/src/services/api.js)
- Axios API layer pointing to Google Apps Script Web App with automatic fallback to full local mock service when offline or unconfigured.

#### [NEW] [src/services/exportService.js](file:///c:/Users/PN/Desktop/App Cafe/src/services/exportService.js)
- Excel export utility using `xlsx` sheet generation for sales, expenses, and stock reports.
- PDF export utility using `jspdf` & `jspdf-autotable` with formatted tables, shop headers, and totals.

#### [NEW] [src/context/CartContext.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/context/CartContext.jsx)
- Cart state management with item add/remove/qty update, special requests, coupon discount logic (e.g. `COFFEE10` for 10% off), tax (10%), service charge (5%), total calculation.

#### [NEW] [src/hooks/useTelegram.js](file:///c:/Users/PN/Desktop/App Cafe/src/hooks/useTelegram.js)
- Wrapper for `@twa-dev/sdk` / `window.Telegram.WebApp` providing user info, haptic feedback, theme params, and main button controls for Telegram Mini App environment.

---

### 4. Admin Dashboard & Pages

#### [NEW] [src/pages/admin/Dashboard.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/Dashboard.jsx)
- Key Metrics Cards: Today's Revenue, Today's Orders, Monthly Revenue, Low Stock alerts.
- Recharts visualizations: Revenue trend area chart, Top selling drinks bar chart.
- Quick order processing table and stock warning banner.

#### [NEW] [src/pages/admin/MenuManagement.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/MenuManagement.jsx)
- Interactive menu grid with category filter, quick search, toggle active state, edit price/stock modal, and add new product form with image URL preview.

#### [NEW] [src/pages/admin/OrdersManagement.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/OrdersManagement.jsx)
- Order status workflow (Pending → Preparing → Ready → Completed → Cancelled) with direct Telegram update triggers. Filter by date/status.

#### [NEW] [src/pages/admin/StockManagement.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/StockManagement.jsx)
- Ingredients inventory monitor, edit stock levels, low-stock highlight thresholds.

#### [NEW] [src/pages/admin/Reports.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/Reports.jsx)
- Sales and Profit & Loss report summary, expense tracking, date-range filtering, and instant Excel/PDF export buttons.

#### [NEW] [src/pages/admin/Settings.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/admin/Settings.jsx)
- Store configuration, Telegram Bot Token & Admin Chat ID management, and Looker Studio integration guide.

---

### 5. Customer Telegram Mini App & Storefront Pages

#### [NEW] [src/pages/customer/Home.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/customer/Home.jsx)
- Hero Coffee banner, category filter pills, search input, popular items grid, and quick add-to-cart.

#### [NEW] [src/pages/customer/Cart.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/customer/Cart.jsx)
- Cart items list, special note per item, coupon code field, order summary breakdown, table # or takeaway selection.

#### [NEW] [src/pages/customer/Checkout.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/customer/Checkout.jsx)
- Payment choice (Cash, KHQR, ABA QR), real-time QR code modal popup, customer detail inputs, order placement action.

#### [NEW] [src/pages/customer/OrderSuccess.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/customer/OrderSuccess.jsx)
- Interactive order tracker timeline (Pending → Preparing → Ready → Completed), order summary details, and Telegram bot notification link.

#### [NEW] [src/pages/customer/OrderHistory.jsx](file:///c:/Users/PN/Desktop/App Cafe/src/pages/customer/OrderHistory.jsx)
- Customer order log with status badges and re-order button.

---

### 6. Documentation & Guides (`README.md`)

#### [NEW] [README.md](file:///c:/Users/PN/Desktop/App Cafe/README.md)
- Complete comprehensive guide covering:
  1. Google Sheets database creation (exact columns & sheet names).
  2. Google Apps Script Web App deployment step-by-step.
  3. Telegram Bot setup (BotFather, Web App setting, Bot token).
  4. Google Looker Studio report setup guide with pre-configured chart layouts.
  5. Vercel deployment instructions for the React frontend.

---

## Verification Plan

### Automated Build & Code Checks
- Run `npm install` to install all frontend dependencies.
- Run `npx vite build` to ensure zero compilation errors and clean production bundles.

### Manual Verification
- Test customer flow: Browse drinks -> Add to cart with note -> Apply coupon -> Checkout with KHQR -> View order status tracker.
- Test admin flow: Login -> Dashboard widgets load -> Manage menu item -> Change order status -> Export sales report to Excel and PDF.
- Verify Telegram Mini App responsive view with bottom navigation bar and theme toggle.
