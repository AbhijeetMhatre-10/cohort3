import { useState } from 'react';

export default function CheckoutForm({
  user,
  cartItems,
  onPlaceOrder,
  onNavigate
}) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + shippingFee;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    const orderData = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...cartItems],
      totalAmount: grandTotal,
      shippingDetails: { ...formData }
    };

    setCompletedOrderDetails(orderData);
    setOrderComplete(true);
    onPlaceOrder(orderData);
  };

  if (orderComplete) {
    return (
      <div className="order-placed-success">
        <div className="success-icon-badge">🎉</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Order Placed Successfully!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Thank you for your purchase. Your Order ID is <strong style={{ color: 'var(--accent-color)' }}>{completedOrderDetails?.id}</strong>. A confirmation email has been sent to {formData.email}.
        </p>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Summary Details</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Total Items: <strong>{completedOrderDetails?.items.reduce((a, c) => a + c.quantity, 0)}</strong>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Paid Amount: <strong>${completedOrderDetails?.totalAmount.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Delivery Address: <strong>{formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</strong>
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => onNavigate('shop')}
          style={{ maxWidth: '300px', margin: '0 auto' }}
        >
          Browse Products 🛍️
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-state" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', border: '1px solid var(--border-color)' }}>
        <div className="empty-cart-icon">🛒</div>
        <h4>No items to checkout</h4>
        <p>Your cart is currently empty. Add products to proceed with checkout.</p>
        <button
          className="btn-primary"
          onClick={() => onNavigate('shop')}
          style={{ maxWidth: '240px', margin: '0 auto' }}
        >
          Browse Products 🔍
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      {/* Billing Form Left */}
      <div className="checkout-box">
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Billing & Shipping Details
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              required
              type="text"
              className="form-input"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Alex Johnson"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                required
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="alex@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                minLength={10}
                maxLength={10}
                required
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="eg.: 9801287645"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              required
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street, Suite 4B"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                required
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="New York"
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input
                required
                type="text"
                className="form-input"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="NY"
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PIN / Postal Code</label>
            <input
              required
              minLength={5}
              maxLength={5}
              type="number"
              className="form-input"
              value={formData.pinCode}
              onChange={(e) => handleChange('pinCode', e.target.value)}
              placeholder="10001"
            />
            {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Place Order (${grandTotal.toFixed(2)}) 🚀
          </button>
        </form>
      </div>

      {/* Order Summary Right */}
      <div className="order-summary-box">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Order Summary
        </h3>

        <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.3rem' }}>
          {cartItems.map((item) => (
            <div key={item.id} className="order-summary-item">
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="cart-summary-line">
            <span>Subtotal ({totalItems} items):</span>
            <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-line">
            <span>Shipping:</span>
            <span style={{ fontWeight: 700, color: shippingFee === 0 ? 'var(--success-color)' : 'inherit' }}>
              {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="cart-summary-line cart-summary-total" style={{ marginTop: '0.5rem' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--accent-color)' }}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
