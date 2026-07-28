
export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onNavigate 
}) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Slide-in drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>
            <span>🛒</span> Shopping Cart
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </h3>
          <button className="btn-close" onClick={onClose} title="Close Cart">✕</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛍️</div>
              <h4>Your cart is empty</h4>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onClose();
                  onNavigate('shop');
                }}
              >
                Browse Products 🔍
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80';
                  }}
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="qty-controls">
                    <button 
                      className="btn-qty"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button 
                      className="btn-qty"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  className="btn-remove-item"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Total Items:</span>
              <span style={{ fontWeight: 700 }}>{totalItems}</span>
            </div>
            <div className="cart-summary-line cart-summary-total">
              <span>Total Price:</span>
              <span style={{ color: 'var(--accent-color)' }}>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button 
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onNavigate('checkout');
                }}
              >
                Proceed to Checkout 💳
              </button>
              <button 
                className="btn-secondary"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
