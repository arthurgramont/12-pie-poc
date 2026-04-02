import { useState } from 'react';
import { Download, RotateCcw, Star, MapPin, Clock, ChevronLeft, Lock, Unlock, ExternalLink } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ItineraryPDF from '../components/ItineraryPDF';

function ItineraryPage({ itinerary, destination, formData, likedPlaces, onRestart }) {
  const [showPdfLink, setShowPdfLink] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!itinerary) return null;

  // Budget calculations
  const budgetWithVoyagr = itinerary.totalBudget;
  const budgetWithoutVoyagr = Math.round(budgetWithVoyagr * 1.3); // 30% more expensive without our tool
  const savings = budgetWithoutVoyagr - budgetWithVoyagr;
  const unlockPrice = Math.round(savings * 0.1); // 10% of savings

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'hotel': return '🏨';
      case 'restaurant': return '🍽️';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  const getCategoryColor = (type) => {
    switch (type) {
      case 'hotel': return 'var(--accent-blue)';
      case 'restaurant': return 'var(--accent-gold)';
      case 'activity': return 'var(--accent-green)';
      default: return 'var(--accent-purple)';
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>
          Votre itinéraire
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {destination.emoji} {destination.name} — {itinerary.tripDays} jours — {formData.travelers} voyageur{formData.travelers > 1 ? 's' : ''}
        </p>
      </div>

      {/* Budget summary */}
      <div className="budget-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>💰 Estimation budget</h3>
        <div className="budget-row">
          <span className="label">Voyageurs</span>
          <span className="value">{formData.travelers}</span>
        </div>
        <div className="budget-row">
          <span className="label">Durée</span>
          <span className="value">{itinerary.tripDays} jours</span>
        </div>
        <div className="budget-row">
          <span className="label">Sans Voyagr</span>
          <span className="value" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', opacity: 0.7 }}>~{budgetWithoutVoyagr}€</span>
        </div>
        <div className="budget-row total">
          <span className="label">Avec Voyagr ✨</span>
          <span className="value" style={{ color: 'var(--accent-green)' }}>~{budgetWithVoyagr}€</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>
          🎉 Vous économisez ~{savings}€ !
        </div>

        {/* Payment CTA */}
        {!isPaid && (
          <button
            className="btn btn-full"
            onClick={() => setIsPaid(true)}
            id="pay-unlock-btn"
            style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#000',
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 20px',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            <Lock size={18} />
            Débloquer pour {unlockPrice}€ seulement
          </button>
        )}

        {isPaid && (
          <>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'center',
                color: 'var(--accent-green)',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <Unlock size={16} />
              Itinéraire débloqué !
            </div>

            {/* PDF buttons — shown at top when paid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!showPdfLink ? (
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => setShowPdfLink(true)}
                  id="prepare-pdf-btn"
                >
                  <Download size={18} />
                  Préparer le PDF
                </button>
              ) : (
                <PDFDownloadLink
                  document={
                    <ItineraryPDF
                      itinerary={itinerary}
                      destination={destination}
                      formData={formData}
                    />
                  }
                  fileName={`itineraire-${destination.id}-${itinerary.tripDays}jours.pdf`}
                  className="btn btn-gold btn-full"
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading }) =>
                    loading ? (
                      <>
                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        Télécharger le PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
            </div>
          </>
        )}
      </div>

      {/* Day-by-day itinerary */}
      {/* Show all days if paid, only first day if not */}
      {(isPaid ? itinerary.days : itinerary.days.slice(0, 1)).map((day) => (
        <div key={day.dayNumber} className="itinerary-day">
          <div className="itinerary-day-header">
            <div className="itinerary-day-number">{day.dayNumber}</div>
            <div>
              <div className="itinerary-day-title">Jour {day.dayNumber}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {day.date}
              </div>
            </div>
          </div>

          <div className="itinerary-timeline">
            {day.items.map((item, idx) => (
              <div key={idx} className="itinerary-item">
                <div
                  className="itinerary-item-time"
                  style={{ color: getCategoryColor(item.type) }}
                >
                  <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {item.time} — {item.note}
                </div>
                <h4>
                  {getCategoryIcon(item.type)} {item.place.name}
                </h4>
                <p>{item.place.description}</p>
                <div className="itinerary-item-footer">
                  <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14 }}>
                    {item.place.price === 0 ? 'Gratuit' : `${item.place.price}€`}
                    {item.type === 'hotel' ? '/nuit' : item.type === 'restaurant' ? '/pers' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, color: 'var(--accent-gold)' }}>
                    <Star size={12} fill="#F59E0B" /> {item.place.rating}
                  </span>
                </div>
                {/* Link — only shown when paid */}
                {isPaid && item.place.link && (
                  <a
                    href={item.place.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      fontSize: 12,
                      color: getCategoryColor(item.type),
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${getCategoryColor(item.type)}33`,
                      width: 'fit-content',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ExternalLink size={12} />
                    {item.type === 'hotel' ? 'Réserver' : item.type === 'restaurant' ? 'Voir le restaurant' : 'Plus d\'infos'}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Blurred locked section when not paid */}
      {!isPaid && itinerary.days.length > 1 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          {/* Blurred preview of day 2 */}
          <div
            style={{
              filter: 'blur(6px)',
              opacity: 0.4,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div className="itinerary-day">
              <div className="itinerary-day-header">
                <div className="itinerary-day-number">{itinerary.days[1].dayNumber}</div>
                <div>
                  <div className="itinerary-day-title">Jour {itinerary.days[1].dayNumber}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {itinerary.days[1].date}
                  </div>
                </div>
              </div>
              <div className="itinerary-timeline">
                {itinerary.days[1].items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="itinerary-item">
                    <h4>{getCategoryIcon(item.type)} {item.place.name}</h4>
                    <p>{item.place.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overlay with gradient + CTA */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 15, 35, 0.95) 40%)',
              borderRadius: 12,
              padding: 24,
              textAlign: 'center',
            }}
          >
            <Lock size={32} style={{ color: 'var(--accent-gold)', marginBottom: 12 }} />
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>
              {itinerary.days.length - 1} jour{itinerary.days.length - 1 > 1 ? 's' : ''} restant{itinerary.days.length - 1 > 1 ? 's' : ''} verrouillé{itinerary.days.length - 1 > 1 ? 's' : ''}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Débloquez l'itinéraire complet avec tous les détails
            </p>
            <button
              className="btn btn-full"
              onClick={() => setIsPaid(true)}
              id="pay-unlock-overlay-btn"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000',
                fontWeight: 700,
                fontSize: 15,
                padding: '14px 24px',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                maxWidth: 320,
              }}
            >
              <Lock size={18} />
              Débloquer — {unlockPrice}€
            </button>
          </div>
        </div>
      )}


      {/* Restart button */}
      <div style={{ paddingBottom: 20 }}>
        <button
          className="btn btn-secondary btn-full"
          onClick={onRestart}
          id="restart-btn"
        >
          <RotateCcw size={18} />
          Nouvelle recherche
        </button>
      </div>
    </div>
  );
}

export default ItineraryPage;
