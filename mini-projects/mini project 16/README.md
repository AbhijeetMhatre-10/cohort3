# 🛒 Modern React E-Commerce Application
A feature-rich, responsive e-commerce web application built with **React 19**, **Vite**, and **Vanilla CSS**. This application offers full shopping capabilities including product discovery, category filtering, search, detailed product views, persistent shopping cart management, user authentication, checkout workflows, and a dark/light theme switcher.
---
## ✨ Features
- 🔐 **User Authentication**
  - Simulated Login and Registration flows with form validation.
  - Persistent user session stored in `localStorage`.
  - Protected navigation ensuring authenticated access to shopping features.
- 🛍️ **Product Catalog & Discovery**
  - Grid presentation of diverse product categories (Electronics, Fashion, Home & Kitchen, Books, Accessories, etc.).
  - Real-time search by product title and description.
  - Category filtering and price sorting (low-to-high, high-to-low).
  - Detailed single-product view (`DetailedCard`) showing rating, stock availability, detailed descriptions, and related recommendations.
- 🛒 **Interactive Shopping Cart**
  - Slide-in sidebar cart accessible from any page.
  - Increment/decrement item quantity and quick item removal.
  - Dynamic subtotal and total calculation.
  - Persistent cart state saved in `localStorage`.
- 💳 **Checkout & Order Flow**
  - Dedicated Checkout page with shipping address input and order summary.
  - Order placement flow that automatically clears the cart and logs completed orders into session history.
- 🌓 **Dark / Light Theme**
  - Modern design system supporting seamless toggling between Light and Dark themes.
  - CSS custom properties (variables) dynamically driven by `data-theme` on the root HTML element.
  - Saved theme preference in `localStorage`.
- 🔔 **Toast Notification System**
  - Non-intrusive banner notifications for user feedback (e.g., item added to cart, quantity modified, theme switched, login status changes).
---
## 🛠️ Tech Stack
- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool / Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Design System with CSS Variables)
- **Icons**: [FontAwesome 7](https://fontawesome.com/)
- **Code Quality**: ESLint 10 with React Hooks & React Refresh plugins
---
## 📂 Project Structure
```
react-app/
├── index.html               # Main HTML entry point
├── package.json             # Project dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint setup
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Core app container, routing, and state logic
    ├── App.css              # Main application styling & theme variables
    ├── index.css            # Base global styles and resets
    ├── components/          # Reusable UI components
    │   ├── Navbar.jsx       # Top navigation bar with theme switch & cart counter
    │   ├── CartSidebar.jsx  # Slide-in drawer for cart item management
    │   ├── DetailedCard.jsx # Comprehensive product view & details
    │   ├── ProductCard.jsx  # Single product card item
    │   ├── ProductGrid.jsx  # Grid layout container for products
    │   ├── SearchBar.jsx    # Input bar for keyword search
    │   ├── FilterPanel.jsx  # Category filter controls
    │   ├── SortDropdown.jsx # Price & rating sorting dropdown
    │   ├── CheckoutForm.jsx # Form container for checkout shipping/payment
    │   ├── CategoryCard.jsx # Featured category highlight card
    │   ├── DashboardCards.jsx# Dashboard statistics / feature highlights
    │   ├── CompanyFeatures.jsx# Trust badges & perks (shipping, returns, etc.)
    │   ├── Footer.jsx       # Application footer
    │   └── Toast.jsx        # Floating user feedback toast component
    ├── pages/               # Top-level view pages
    │   ├── HomePage.jsx     # Main landing page with featured products & hero
    │   ├── ShopPage.jsx     # Catalog browsing page with search & filters
    │   ├── AboutPage.jsx    # Company story, mission, and stats
    │   ├── CheckoutPage.jsx # Order review and payment page
    │   ├── LoginPage.jsx    # User login screen
    │   └── RegisterPage.jsx # Account registration screen
    └── data/
        └── products.js      # Mock product inventory database
```
---
## 🚀 Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (comes with Node.js)
### Installation & Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal).
---
## 📜 Available Scripts
In the project directory, you can run:
- **`npm run dev`**: Launches the Vite local development server with hot module replacement (HMR).
- **`npm run build`**: Compiles and bundles optimized static assets into the `dist/` folder for production deployment.
- **`npm run preview`**: Serves the production build locally for verification prior to deployment.
- **`npm run lint`**: Runs ESLint to check for syntax and style issues across JavaScript and JSX files.
---
## 💾 State Persistence & Storage
The application leverages browser `localStorage` to ensure a consistent experience across page reloads:
- `loggedInUser`: Tracks active user session.
- `theme`: Preserves preferred color scheme (`light` | `dark`).
- `cartItems`: Keeps track of items added to cart and their quantities.
- `orders`: Retains past completed purchases.
---
## 📄 License
This project is open source and available under the [MIT License](LICENSE).