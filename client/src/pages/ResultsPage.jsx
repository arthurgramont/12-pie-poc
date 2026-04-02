import { ChevronLeft, Heart, Lock, Star } from 'lucide-react';

function ResultsPage({ likedPlaces, destination, onContinue, onBack }) {
  const hotels = likedPlaces.filter((p) => p.category === 'hotel');
  const restaurants = likedPlaces.filter((p) => p.category === 'restaurant');
  const activities = likedPlaces.filter((p) => p.category === 'activity');

  const sections = [
    { title: '🏨 Hôtels', items: hotels },
    { title: '🍽️ Restaurants', items: restaurants },
    { title: '🎯 Activités', items: activities },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={20} />
      </button>

      <div className="page-header" style={{ paddingTop: 12 }}>
        <h1 style={{ fontSize: 24 }}>
          <Heart
            size={24}
            fill="#10B981"
            color="#10B981"
            style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}
          />
          Vos coups de cœur
        </h1>
        <p className="subtitle">
          {likedPlaces.length} lieu{likedPlaces.length > 1 ? 'x' : ''} sélectionné{likedPlaces.length > 1 ? 's' : ''} à{' '}
          {destination.name}
        </p>
      </div>

      {likedPlaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">😢</div>
          <h3>Aucun lieu liké</h3>
          <p>
            Retournez en arrière pour swiper et aimer des lieux !
          </p>
        </div>
      ) : (
        <>
          {sections.map((section) => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>{section.title}</h3>
              <div className="results-grid">
                {section.items.map((item) => (
                  <div key={item.id} className="result-item">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="result-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <span className="result-item-price">
                          {item.price === 0 ? 'Gratuit' : `${item.price}€`}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, color: 'var(--accent-gold)' }}>
                          <Star size={12} fill="#F59E0B" /> {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA to unlock itinerary */}
          <div
            className="glass-card"
            style={{
              textAlign: 'center',
              marginTop: 8,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(124, 58, 237, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <Lock size={28} style={{ color: 'var(--accent-gold)', marginBottom: 8 }} />
            <h3 style={{ fontSize: 17, marginBottom: 4 }}>
              Débloquez votre itinéraire
            </h3>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Obtenez un planning jour par jour personnalisé avec les meilleures offres
            </p>
            <button
              className="btn btn-gold btn-full"
              onClick={onContinue}
              id="unlock-itinerary-btn"
            >
              <Lock size={16} />
              Créer mon itinéraire — 9,99€
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultsPage;
