
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast-item">
        <span>✨</span>
        <span>{toast.message}</span>
        <button 
          onClick={onClose}
          style={{ marginLeft: '1rem', color: 'inherit', opacity: 0.8, fontSize: '0.9rem' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
