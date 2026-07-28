
export default function CompanyFeatures() {
  const features = [
    {
      icon: '🚀',
      title: 'Fast Delivery',
      desc: 'Free express shipping on all orders over $50 with live tracking updates.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      desc: 'Encryption ensuring 100% safe transaction process.'
    },
    {
      icon: '💎',
      title: 'Best Prices',
      desc: 'Direct manufacturer guarantee with price match protection.'
    },
    {
      icon: '🎧',
      title: '24/7 Support',
      desc: 'Dedicated customer care available around the clock to assist you.'
    }
  ];

  return (
    <div className="features-grid">
      {features.map((feat, index) => (
        <div className="company-feat-card" key={index}>
          <div className="company-feat-icon">{feat.icon}</div>
          <h4>{feat.title}</h4>
          <p>{feat.desc}</p>
        </div>
      ))}
    </div>
  );
}
