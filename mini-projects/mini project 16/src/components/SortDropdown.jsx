
export default function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="sort-box">
      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</label>
      <select 
        className="select-custom" 
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="featured">Featured / Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="name">Product Name (A-Z)</option>
      </select>
    </div>
  );
}
