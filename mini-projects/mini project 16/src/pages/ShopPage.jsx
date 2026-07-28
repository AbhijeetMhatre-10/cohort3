import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

export default function ShopPage({ 
  products, 
  onAddToCart, 
  onNavigate, 
  selectedCategory, 
  onSelectCategory,
  onSelectProduct
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(10);

  // Filter products by category and search query
  let filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Pagination (Show visibleCount products)
  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="section-title">Explore All Products</h1>
          <p className="section-subtitle">
            Showing {displayedProducts.length} of {filtered.length} products
          </p>
        </div>
      </div>

      {/* Shop Search & Filter Controls */}
      <div className="shop-controls">
        <div className="controls-row">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        <FilterPanel 
          selectedCategory={selectedCategory} 
          onSelectCategory={(cat) => {
            onSelectCategory(cat);
            setVisibleCount(10); // Reset visible count on category filter change
          }} 
        />
      </div>

      {/* Products Grid */}
      <ProductGrid products={displayedProducts} onAddToCart={onAddToCart} onSelectProduct={onSelectProduct} />

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-box">
          <button className="btn-secondary" onClick={handleLoadMore} style={{ minWidth: '200px' }}>
            Load More Products ({filtered.length - visibleCount} remaining) ↓
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
