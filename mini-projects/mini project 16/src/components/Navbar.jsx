
export default function Navbar({
  user,
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  theme,
  onToggleTheme,
  onLogout
}) {
  const userInitial = user && user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Brand Logo & Name */}
        <div className="nav-left" onClick={() => onNavigate('home')}>
          <div className="logo-icon">A</div>
          <div className="logo-name">Apex<span>Store</span></div>
        </div>

        {/* Centre: Navigation Links */}
        <nav className="nav-centre">
          <button
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}
            onClick={() => onNavigate('shop')}
          >
            Shop
          </button>
          <button
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            About
          </button>
        </nav>

        {/* Right: User Avatar, Cart, Theme, Logout */}
        <div className="nav-right">
          {/* Circular Avatar + User Name */}
          <div className="user-profile">
            <div className="avatar-circle">{userInitial}</div>
            <span className="user-name-text">{user?.fullName || 'User'}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Cart Button with Count Badge */}
          <button
            className="btn-icon"
            onClick={onOpenCart}
            title="View Shopping Cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Logout Button */}
          <button
            className="btn-logout"
            onClick={onLogout}
            title="Logout"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
