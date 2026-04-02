import { useState } from 'react';
import { Download, RotateCcw, Star, MapPin, Clock, ChevronLeft } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ItineraryPDF from '../components/ItineraryPDF';

function ItineraryPage({ itinerary, destination, formData, likedPlaces, onRestart }) {
  const [showPdfLink, setShowPdfLink] = useState(false);

  if (!itinerary) return null;

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

      {/* Day-by-day itinerary */}
      {itinerary.days.map((day) => (
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
              </div>
            ))}
          </div>
        </div>
      ))}

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
        <div className="budget-row total">
          <span className="label">Budget estimé total</span>
          <span className="value">~{itinerary.totalBudget}€</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
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
