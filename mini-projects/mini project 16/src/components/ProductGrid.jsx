import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAddToCart, onSelectProduct }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>No products match your criteria.</p>
        <p style={{ fontSize: '0.9rem' }}>Try clearing filters or searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct} 
        />
      ))}
    </div>
  );
}
