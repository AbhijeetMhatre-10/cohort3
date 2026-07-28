import CheckoutForm from '../components/CheckoutForm';
import Footer from '../components/Footer';

export default function CheckoutPage({ user, cartItems, onPlaceOrder, onNavigate }) {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="section-title">Checkout & Order Placement</h1>
          <p className="section-subtitle">Complete your shipping address to finalize order</p>
        </div>
      </div>

      <CheckoutForm 
        user={user} 
        cartItems={cartItems} 
        onPlaceOrder={onPlaceOrder} 
        onNavigate={onNavigate} 
      />

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
