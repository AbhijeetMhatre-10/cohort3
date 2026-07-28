import Footer from '../components/Footer';

export default function AboutPage({ onNavigate }) {
  const teamMembers = [
    {
      name: 'Sarah Jenkins',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
    },
    {
      name: 'David Vance',
      role: 'Head of Product Design',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Frontend Architect',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
    },
    {
      name: 'Marcus Chen',
      role: 'Operations & Logistics Manager',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
    }
  ];

  return (
    <div>
      {/* Company Intro */}
      <section className="about-hero">
        <span className="hero-welcome" style={{ color: 'var(--accent-color)', background: 'var(--accent-light)' }}>
          ABOUT APEXSTORE
        </span>
        <h2>Redefining Online E-Commerce for Modern Lifestyles</h2>
        <p>
          Founded in 2024, ApexStore was built on a single promise: to make high-quality, curated consumer products accessible, affordable, and seamlessly deliverable anywhere in the world.
        </p>
      </section>

      {/* Mission, Vision, Why Choose Us */}
      <section className="about-grid">
        <div className="about-card">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            To empower everyday consumers with exceptional products, transparent pricing, and instant customer satisfaction through continuous innovation.
          </p>
        </div>

        <div className="about-card">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👁️</div>
          <h3>Our Vision</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            To become the global gold standard for consumer e-commerce by combining sustainable product sourcing with lightning-fast delivery networks.
          </p>
        </div>

        <div className="about-card">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
          <h3>Why Choose Us</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            We guarantee 100% authentic items, 30-day hassle-free returns, secure end-to-end encrypted checkout, and dedicated 24/7 human support.
          </p>
        </div>
      </section>

      {/* Company Statistics */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className="section-title">ApexStore by the Numbers</h2>
            <p className="section-subtitle">Milestones achieved with the support of our incredible global community</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">500K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3,500+</div>
            <div className="stat-label">Curated Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">99.8%</div>
            <div className="stat-label">On-Time Delivery</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4.9 ★</div>
            <div className="stat-label">Average Review Rating</div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Meet Our Leadership Team</h2>
            <p className="section-subtitle">Passionate innovators driving the future of retail tech</p>
          </div>
        </div>

        <div className="team-grid">
          {teamMembers.map((m, idx) => (
            <div key={idx} className="team-card">
              <img 
                src={m.image} 
                alt={m.name} 
                className="team-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';
                }} 
              />
              <h4>{m.name}</h4>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
