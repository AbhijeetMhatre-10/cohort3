
export default function Footer({ onNavigate }) {
  const iconSize = {
    backgroundSize: "cover",
    backgroundPosition: "center"
  }
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo-name" style={{ fontSize: '1.5rem' }}>Apex<span>Store</span></div>
          <p>
            Your premier destination for high quality Electronics, Home, Furniture, Sports, Clothing & Accessories. Fast delivery & secure payments guaranteed.
          </p>
          <div className="social-icons">
            <button className="social-btn" title="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </button>
            <button className="social-btn" title="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </button>
            <button className="social-btn" title="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </button>
            <button className="social-btn" title="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </button>
          </div>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Shop Products</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About Us</a></li>
            <li><a href="#checkout" onClick={(e) => { e.preventDefault(); onNavigate('checkout'); }}>Checkout</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Categories</h5>
          <ul className="footer-links">
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Electronics</a></li>
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Furniture</a></li>
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Home Essentials</a></li>
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Sports & Outdoor</a></li>
            <li><a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Clothing & Fashion</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Customer Care</h5>
          <ul className="footer-links">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Help Center</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Shipping & Delivery</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Returns & Refunds</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Privacy Policy</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ApexStore Inc. All rights reserved. Designed with React.js</p>
      </div>
    </footer>
  );
}
