
export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-box">
      <span className="search-icon-pos">🔍</span>
      <input 
        type="text" 
        className="search-input"
        placeholder="Search products by name, brand, description..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
