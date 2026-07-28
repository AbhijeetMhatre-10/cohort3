import Hero from '../components/Hero';
import DashboardCards from '../components/DashboardCards';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import CompanyFeatures from '../components/CompanyFeatures';
import Footer from '../components/Footer';

export default function HomePage({
  user,
  products,
  cartItems,
  onAddToCart,
  onNavigate,
  onSelectCategoryFilter,
  onSelectProduct
}) {
  const categoriesList = ['Electronics', 'Furniture', 'Home', 'Sports', 'Clothing', 'Accessories'];

  // Top Rated Products (show 4)
  const topRatedProducts = products
    .filter(p => p.isTopRated || p.rating >= 4.7)
    .slice(0, 4);

  // New Arrivals (show 4)
  const newArrivals = products
    .filter(p => p.isNew)
    .slice(0, 4);

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const topRatedCount = products.filter(p => p.isTopRated).length;

  const handleCategoryClick = (cat) => {
    onSelectCategoryFilter(cat);
    onNavigate('shop');
  };

  return (
    <div>
      {/* Hero Banner */}
      <Hero userName={user?.fullName} onNavigate={onNavigate} />

      {/* Dashboard Summary Cards */}
      <DashboardCards
        totalCartItems={totalCartItems}
        totalCartValue={totalCartValue}
        topRatedCount={topRatedCount}
        totalCategories={categoriesList.length}
      />

      {/* Shop By Category */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop By Category</h2>
            <p className="section-subtitle">Browse through our wide selection of departments</p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => onNavigate('shop')}
          >
            Explore All →
          </button>
        </div>

        <div className="category-grid">
          {categoriesList.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <CategoryCard
                key={cat}
                category={cat}
                count={count}
                onSelectCategory={() => handleCategoryClick(cat)}
                isSelected={false}
              />
            );
          })}
        </div>
      </section>

      {/* Top Rated Products (4 items) */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">⭐ Top Rated Products</h2>
            <p className="section-subtitle">Customer favorite top-rated items with stellar reviews</p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => onNavigate('shop')}
          >
            View More
          </button>
        </div>
        <ProductGrid products={topRatedProducts} onAddToCart={onAddToCart} onSelectProduct={onSelectProduct} />
      </section>

      {/* New Arrivals (4 items) */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 New Arrivals</h2>
            <p className="section-subtitle">Fresh new items just added to our inventory</p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => onNavigate('shop')}
          >
            View More
          </button>
        </div>
        <ProductGrid products={newArrivals} onAddToCart={onAddToCart} onSelectProduct={onSelectProduct} />
      </section>

      {/* Company Value Features */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className="section-title">Why Shop With Us?</h2>
            <p className="section-subtitle">Guaranteed satisfaction with every purchase</p>
          </div>
        </div>
        <CompanyFeatures />
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
