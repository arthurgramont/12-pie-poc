import { destinations } from '../data/mockPlaces';
import { MapPin, Sparkles, Plane } from 'lucide-react';

function WelcomePage({ onSelectDestination }) {
  return (
    <div className="page" style={{ paddingTop: 72 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>
          <Plane size={48} strokeWidth={1.5} style={{ color: '#7C3AED' }} />
        </div>
        <h1 className="logo" style={{ fontSize: 36, marginBottom: 4 }}>
          Voyagr
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
          Planifiez votre voyage de rêve en swipant
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <MapPin size={18} style={{ color: 'var(--accent-purple)' }} />
          <h2 style={{ fontSize: 18 }}>Où partez-vous ?</h2>
        </div>

        <div className="destination-grid">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className="destination-card"
              onClick={() => onSelectDestination(dest)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                loading="lazy"
              />
              <div className="destination-card-overlay">
                <h3>
                  {dest.emoji} {dest.name}
                </h3>
                <span className="country">{dest.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 'auto',
          paddingTop: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          <Sparkles size={14} />
          <span>Swipez, découvrez, partez</span>
          <Sparkles size={14} />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
