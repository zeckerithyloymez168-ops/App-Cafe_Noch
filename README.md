# ☕ Coffee Shop Management System & Telegram Mini App

A full-stack, production-quality Coffee Shop Management System & Telegram Mini App built with **React 19**, **Vite**, **Tailwind CSS**, **Google Apps Script REST API**, **Google Sheets**, and **Telegram Bot Integration**.

---

## 🌟 Key Features

### 🛒 Customer Telegram Mini App
- **Modern Coffee Shop Aesthetic**: Glassmorphism UI, rounded cards, smooth transitions, dark/light theme switcher.
- **Product Customization**: Drink customization (ice level, sweetness level, special preparation notes).
- **Cart & Order Breakdown**: Item customization notes, discount promo coupons (e.g. `COFFEE10`, `WELCOME5`), 10% tax, service charge calculation.
- **Cashless Payment Integration**: Bakong KHQR & ABA Pay QR code payment modal with payload copying and instant payment confirmation.
- **Real-Time Order Tracker**: Pipeline tracking (`Pending` → `Preparing` → `Ready` → `Completed`) with automatic Telegram Bot status update alerts.
- **Telegram Mini App SDK**: Automatic user greeting, haptic feedback on button clicks, bottom mobile navigation.

### 🛡️ Admin Management Dashboard
- **Executive Metrics**: Today's Revenue, Today's Orders, Monthly Revenue, Low Stock Alerts.
- **Interactive Analytics Charts**: Weekly revenue trend area chart and top selling drinks bar chart powered by Recharts.
- **Menu Management**: Add/Edit/Delete coffee drinks and food items, category filters, image URL upload, stock levels.
- **Orders Pipeline**: Instant order status change buttons (`Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled`) which automatically alert customer via Telegram.
- **Stock Inventory**: Ingredient tracking (coffee beans, milk, syrups, matcha, cups) with low-stock warnings.
- **Financial Reports & Exports**: Log operational expenses, view Profit & Loss statement, export to **Excel (`.xlsx`)** and **PDF (`.pdf`)**.
- **Settings & Looker Studio**: Configure shop details, Telegram Bot Token, Admin Chat ID, and step-by-step Looker Studio dashboard guide.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Axios, Tailwind CSS, Lucide Icons, Recharts, React Hot Toast, React Hook Form
- **Backend API**: Google Apps Script (`gas/Code.gs` REST Web App)
- **Database**: Google Sheets (7 relational worksheets)
- **Notifications**: Telegram Bot API
- **Exports**: `xlsx` (Excel), `jspdf` & `jspdf-autotable` (PDF)
- **Hosting**: Vercel (Frontend), Google Apps Script (Backend)

---

## 📋 Google Sheets Setup Guide

Create a new Google Sheet named **Coffee Shop Database** and create 7 worksheets with the exact header names below:

### 1. `Menu`
`id` | `name` | `category` | `price` | `image` | `description` | `stock` | `status`

### 2. `Orders`
`order_id` | `customer_name` | `telegram_id` | `order_date` | `total` | `payment_method` | `status`

### 3. `OrderItems`
`order_id` | `menu_id` | `menu_name` | `qty` | `price` | `subtotal`

### 4. `Stock`
`id` | `ingredient` | `qty` | `unit`

### 5. `Users`
`id` | `username` | `password` | `role`

*Seed default admin row:* `USR-101` | `admin` | `admin123` | `Admin`

### 6. `Expense`
`id` | `title` | `amount` | `date`

### 7. `Settings`
`shop_name` | `address` | `phone` | `telegram_bot_token` | `chat_id`

---

## ⚙️ Google Apps Script Deployment Guide

1. In your Google Sheet, open **Extensions > Apps Script**.
2. Replace all content in `Code.gs` with the code in `gas/Code.gs`.
3. Click **Deploy > New Deployment**:
   - Select type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, authorize permissions, and copy the **Web App URL**.
5. Paste the URL into your frontend `.env` file:
   ```env
   VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

---

## 🤖 Telegram Bot & Mini App Setup Guide

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, choose a name (e.g. `My Artisanal Cafe Bot`) and username (e.g. `MyArtisanalCafeBot`).
3. Copy the **HTTP API Bot Token** provided by BotFather.
4. Set up the Telegram Mini App:
   - Send `/newapp` to `@BotFather`.
   - Select your bot.
   - Enter your deployed Vercel URL (e.g., `https://your-cafe-app.vercel.app`) as the Web App URL.
5. Enter your Bot Token and Admin Chat ID in the Admin Dashboard **Settings** page to enable instant customer notifications.

---

## 📊 Google Looker Studio Integration

1. Go to [Google Looker Studio](https://lookerstudio.google.com/).
2. Click **Create > Blank Report**.
3. Select **Google Sheets** as the connector and choose your **Coffee Shop Database**.
4. Select the **Orders** sheet.
5. Add Scorecards for **Total Revenue** and **Total Orders**, and an Area Chart for **Revenue Trend over Time**.

---

## 🚀 Local Setup & Vercel Deployment

### Local Development
```bash
npm install
npm run dev
```

### Vercel Deployment
1. Push this repository to GitHub.
2. Import project into Vercel.
3. Add Environment Variable:
   - `VITE_GAS_API_URL` = your Google Apps Script Web App URL
4. Click **Deploy**.
