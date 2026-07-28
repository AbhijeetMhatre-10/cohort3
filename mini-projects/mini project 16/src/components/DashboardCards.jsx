
export default function DashboardCards({ totalCartItems, totalCartValue, topRatedCount, totalCategories }) {
  return (
    <div className="dashboard-grid">
      <div className="dash-card">
        <div className="dash-icon-box dash-icon-cart">🛒</div>
        <div className="dash-info">
          <h4>Items in Cart</h4>
          <p>{totalCartItems}</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-icon-box dash-icon-value">💰</div>
        <div className="dash-info">
          <h4>Total Cart Value</h4>
          <p>${totalCartValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-icon-box dash-icon-rated">⭐</div>
        <div className="dash-info">
          <h4>Top Rated Items</h4>
          <p>{topRatedCount}</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-icon-box dash-icon-cat">🏷️</div>
        <div className="dash-info">
          <h4>Total Categories</h4>
          <p>{totalCategories}</p>
        </div>
      </div>
    </div>
  );
}
