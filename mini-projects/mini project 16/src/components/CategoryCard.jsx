
const CATEGORY_ICONS = {
  Electronics: '⚡',
  Furniture: '🪑',
  Home: '🏡',
  Sports: '⚽',
  Clothing: '👕',
  Accessories: '👓'
};

export default function CategoryCard({ category, count, onSelectCategory, isSelected }) {
  const icon = CATEGORY_ICONS[category] || '📦';

  return (
    <div 
      className={`cat-card ${isSelected ? 'active' : ''}`}
      onClick={() => onSelectCategory(category)}
    >
      <span className="cat-icon">{icon}</span>
      <h4 className="cat-title">{category}</h4>
      <span className="cat-count">{count} Products</span>
    </div>
  );
}
