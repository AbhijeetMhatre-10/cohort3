
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Home', 'Sports', 'Clothing', 'Accessories'];

export default function FilterPanel({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-tabs">
      {CATEGORIES.map((cat) => {
        const val = cat === 'All' ? '' : cat;
        const isActive = selectedCategory === val;
        return (
          <button 
            key={cat}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(val)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
