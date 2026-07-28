
export default function ProductCard({ product, onAddToCart, onSelectProduct }) {
  return (
    <div 
      className="product-card"
      onClick={() => onSelectProduct && onSelectProduct(product)}
      style={{ cursor: onSelectProduct ? 'pointer' : 'default' }}
    >
      <div className="product-img-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://imgs.search.brave.com/0QkFfmRcEzh3e994MKeo3VGW5DXQM7fmLT0mBa--qoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzUv/ODg2LzMzNi9zbWFs/bC9lcnJvci00MDQt/cGFnZS1ub3QtZm91/bmQtd2l0aC1yb2Nr/ZXQtdmVjdG9yLmpw/Zw';
          }}
        />
        {product.isNew && <span className="badge-new">NEW</span>}
        {product.isTopRated && <span className="badge-top">TOP</span>}
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">{product.brand}</span>
          <span className="product-rating">★ {product.rating}</span>
        </div>

        <h3 className="product-title" title={product.title}>{product.title}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-bottom">
          <div className="product-price">${product.price?.toFixed(2)}</div>
          <button
            className="btn-add-cart"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(product);
            }}
          >
            <span>🛒</span> Add
          </button>
        </div>
      </div>
    </div>
  );
}
