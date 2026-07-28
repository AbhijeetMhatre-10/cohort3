import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';

export default function DetailedCard({
  product,
  products = [],
  onAddToCart,
  onSelectProduct,
  onBack
}) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 whenever product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  // Edge case: if no product is selected or product is invalid
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Products
        </button>
      </div>
    );
  }

  // Stock calculations & edge cases
  const stock = typeof product.stock === 'number' ? product.stock : 10;
  const isOutOfStock = stock <= 0;

  // Quantity change handlers with edge case bounds
  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > stock) {
      setQuantity(stock);
    } else {
      setQuantity(val);
    }
  };

  const handleAdd = () => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  // Filter recommended products:
  // Same category first, excluding current product, fallback to other products
  const sameCategoryProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const fallbackProducts = products.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );

  const recommendedProducts = [...sameCategoryProducts, ...fallbackProducts].slice(0, 4);

  const fallbackImg = 'https://imgs.search.brave.com/0QkFfmRcEzh3e994MKeo3VGW5DXQM7fmLT0mBa--qoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzUv/ODg2LzMzNi9zbWFs/bC9lcnJvci00MDQt/cGFnZS1ub3QtZm91/bmQtd2l0aC1yb2Nr/ZXQtdmVjdG9yLmpw/Zw';

  return (
    <div className="detailed-card-container">
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn-secondary" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> Back to Products
        </button>
      </div>

      {/* Main Detail Section (Image on left, details on right) */}
      <div className="detailed-card-main">
        {/* Image on Left */}
        <div className="detailed-card-left">
          <div className="detailed-img-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="detailed-img"
              onError={(e) => { e.target.src = fallbackImg; }}
            />
            {product.isNew && <span className="badge-new">NEW</span>}
            {product.isTopRated && <span className="badge-top">TOP</span>}
          </div>
        </div>

        {/* Heading & Details on Right */}
        <div className="detailed-card-right">
          <div className="detailed-header">
            <div className="detailed-meta-row">
              <span className="product-brand">{product.brand}</span>
              <span className="product-category-tag">{product.category}</span>
            </div>
            <h1 className="detailed-title">{product.title}</h1>

            <div className="detailed-rating-row">
              <span className="product-rating">★ {product.rating}</span>
              <span
                className="stock-badge"
                style={{
                  backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isOutOfStock ? 'var(--danger-color)' : 'var(--success-color)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: '700'
                }}
              >
                {isOutOfStock ? '✕ Out of Stock' : `✓ In Stock (${stock} available)`}
              </span>
            </div>
          </div>

          <div className="detailed-price">
            ${product.price?.toFixed(2)}
          </div>

          <p className="detailed-description">
            {product.description}
          </p>

          {/* Add to Cart with Quantity Plus/Minus buttons */}
          <div className="detailed-actions">
            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="btn-qty"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isOutOfStock}
                  title="Decrease Quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  min={1}
                  max={stock}
                  disabled={isOutOfStock}
                />
                <button
                  type="button"
                  className="btn-qty"
                  onClick={handleIncrease}
                  disabled={quantity >= stock || isOutOfStock}
                  title="Increase Quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn-add-cart detailed-add-btn"
              onClick={handleAdd}
              disabled={isOutOfStock}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              <span>🛒</span> {isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products Section Below */}
      {recommendedProducts.length > 0 && (
        <div className="recommended-section" style={{ marginTop: '3.5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Recommended Products</h2>
              <p className="section-subtitle">Related products you might also like</p>
            </div>
          </div>

          <ProductGrid
            products={recommendedProducts}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
          />
        </div>
      )}
    </div>
  );
}