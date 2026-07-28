import { useState } from 'react';
import { PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Toast from './components/Toast';
import DetailedCard from './components/DetailedCard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

export default function App() {
  // Theme state with lazy initialization & synchronous DOM attribute setting
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
  });

  // Logged-in user state
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation state ('login' | 'register' | 'home' | 'shop' | 'about' | 'checkout')
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    return savedUser ? 'home' : 'login';
  });

  // Currently selected product for detailed view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart items state
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Orders history state
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Cart sidebar visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter category state for Shop page
  const [selectedCategory, setSelectedCategory] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Helper function to show Toast notifications without useEffect
  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Helper: Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Theme`);
  };

  // Helper: Login
  const handleLogin = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    setCurrentPage('home');
    setSelectedProduct(null);
    showToast('Logged In Successfully 👋');
  };

  // Helper: Logout
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    setCurrentPage('login');
    setSelectedProduct(null);
    setIsCartOpen(false);
    showToast('Logged Out Successfully');
  };

  // Helper: Register Success
  const handleRegisterSuccess = () => {
    setCurrentPage('login');
    showToast('Account Created! Please login');
  };

  // Helper: Navigation Handler
  const handleNavigate = (page) => {
    if (!loggedInUser && page !== 'register') {
      setCurrentPage('login');
      return;
    }
    setSelectedProduct(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper: Select Product for Detailed View
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper: Cart Management
  const handleAddToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, Number(quantity) || 1);
    let updatedCart;
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      updatedCart = cartItems.map((item, idx) => 
        idx === existingIndex ? { ...item, quantity: item.quantity + qtyToAdd } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: qtyToAdd }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    showToast(`Added ${qtyToAdd > 1 ? qtyToAdd + 'x ' : ''}"${product.title}" to Cart 🛒`);
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    let updatedCart;
    if (newQuantity <= 0) {
      updatedCart = cartItems.filter((item) => item.id !== productId);
      showToast('Item removed from Cart');
    } else {
      updatedCart = cartItems.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      showToast('Cart Quantity Updated');
    }

    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    showToast('Removed from Cart 🗑️');
  };

  // Helper: Place Order
  const handlePlaceOrder = (orderData) => {
    const newOrders = [orderData, ...orders];
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));

    // Clear Cart
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    showToast('Order Placed Successfully! 🎉');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If user is not logged in, force Login or Register view
  if (!loggedInUser) {
    return (
      <div className="app-container">
        {currentPage === 'register' ? (
          <RegisterPage 
            onRegisterSuccess={handleRegisterSuccess} 
            onNavigateToLogin={() => setCurrentPage('login')} 
          />
        ) : (
          <LoginPage 
            onLogin={handleLogin} 
            onNavigateToRegister={() => setCurrentPage('register')} 
          />
        )}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sticky Top Navbar */}
      <Navbar 
        user={loggedInUser}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      {/* Main Page Area */}
      <main className="main-content">
        {selectedProduct ? (
          <DetailedCard 
            product={selectedProduct}
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onBack={() => setSelectedProduct(null)}
          />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage 
                user={loggedInUser}
                products={PRODUCTS}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
                onSelectCategoryFilter={setSelectedCategory}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentPage === 'shop' && (
              <ShopPage 
                products={PRODUCTS}
                onAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage 
                user={loggedInUser}
                cartItems={cartItems}
                onPlaceOrder={handlePlaceOrder}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Slide-in Cart Sidebar Panel */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onNavigate={handleNavigate}
      />

      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
