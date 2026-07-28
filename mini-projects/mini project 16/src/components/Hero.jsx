
export default function Hero({ userName, onNavigate }) {
  return (
    <div className="hero-card">
      <div className="hero-content">
        <span className="hero-welcome">
          ✨ Welcome Back, {userName?.split(" ")[0] || 'Customer'}
        </span>
        <h1 className="hero-title">
          Elevate Your Daily Lifestyle with Premium Products
        </h1>
        <p className="hero-desc">
          Discover curated collections across Electronics, Furniture, Home decor, Sports, and Fashion. Enjoy lightning-fast delivery and 100% buyer protection.
        </p>
        <div className="hero-btns">
          <button className="btn-hero-light" onClick={() => onNavigate('shop')}>
            Shop Now 🛍️
          </button>
          <button className="btn-hero-outline" onClick={() => onNavigate('shop')}>
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
