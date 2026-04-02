import React, { useState, useMemo, useRef, createRef } from 'react';
import TinderCard from 'react-tinder-card';
import { places } from '../data/mockPlaces';
import { ChevronLeft, Heart, X, Star, Hotel, UtensilsCrossed, Compass } from 'lucide-react';

const CATEGORY_ORDER = ['hotel', 'restaurant', 'activity'];
const CATEGORY_LABELS = {
  hotel: { label: '🏨 Hôtels', icon: Hotel },
  restaurant: { label: '🍽️ Restaurants', icon: UtensilsCrossed },
  activity: { label: '🎯 Activités', icon: Compass },
};

function SwipePage({ destination, onDone, onBack }) {
  const destPlaces = places[destination.id];

  // Flatten all places into a single array in order: hotels → restaurants → activities
  const allCards = useMemo(() => {
    const arr = [];
    CATEGORY_ORDER.forEach((cat) => {
      const key = cat === 'hotel' ? 'hotels' : cat === 'restaurant' ? 'restaurants' : 'activities';
      if (destPlaces[key]) {
        arr.push(...destPlaces[key]);
      }
    });
    return arr;
  }, [destPlaces]);

  const [currentIndex, setCurrentIndex] = useState(allCards.length - 1);
  const [liked, setLiked] = useState([]);
  const [lastDirection, setLastDirection] = useState(null);
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () =>
      Array(allCards.length)
        .fill(0)
        .map(() => createRef()),
    [allCards.length]
  );

  // Determine current category
  const currentCard = allCards[currentIndex] || null;
  const currentCategory = currentCard?.category || 'hotel';
  const totalCards = allCards.length;
  const swipedCount = totalCards - currentIndex - 1;

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swiped = (direction, card, index) => {
    setLastDirection(direction);
    if (direction === 'right') {
      setLiked((prev) => [...prev, card]);
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    // Card left the screen
  };

  const swipeManual = async (dir) => {
    if (currentIndex < 0) return;
    const ref = childRefs[currentIndex];
    if (ref && ref.current) {
      await ref.current.swipe(dir);
    }
  };

  // All cards swiped
  if (currentIndex < 0) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <h3 style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
            C&apos;est terminé !
          </h3>
          <p style={{ marginBottom: 24 }}>
            Vous avez liké <strong style={{ color: 'var(--accent-green)' }}>{liked.length}</strong> lieu{liked.length > 1 ? 'x' : ''}
          </p>
          <button className="btn btn-primary btn-full" onClick={() => onDone(liked)}>
            Voir mes résultats →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 12 }}>
      <button className="back-btn" onClick={onBack} style={{ top: 10 }}>
        <ChevronLeft size={20} />
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h2 style={{ fontSize: 18 }}>
          {destination.emoji} {destination.name}
        </h2>
      </div>

      {/* Category tabs */}
      <div className="category-tabs">
        {CATEGORY_ORDER.map((cat) => (
          <div
            key={cat}
            className={`category-tab ${currentCategory === cat ? 'active' : ''}`}
          >
            {CATEGORY_LABELS[cat].label}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12, padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>{swipedCount} / {totalCards}</span>
          <span>❤️ {liked.length} likés</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(swipedCount / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Swipe cards */}
      <div className="swipe-container">
        <div className="swipe-cards-stack">
          {allCards.map((card, index) => (
            <TinderCard
              ref={childRefs[index]}
              key={card.id}
              onSwipe={(dir) => swiped(dir, card, index)}
              onCardLeftScreen={() => outOfFrame(card.name, index)}
              preventSwipe={['up', 'down']}
              className="swipe-card-wrapper"
            >
              <div
                className="swipe-card"
                style={{
                  display: index === currentIndex || index === currentIndex - 1 ? 'block' : 'none',
                  transform: index === currentIndex - 1 ? 'scale(0.95) translateY(10px)' : 'none',
                  opacity: index === currentIndex ? 1 : 0.6,
                  zIndex: index,
                }}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="swipe-card-image"
                  loading="lazy"
                />
                <div className="swipe-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span className={`badge ${card.category === 'hotel' ? 'badge-blue' : card.category === 'restaurant' ? 'badge-gold' : 'badge-green'}`}>
                        {card.category === 'hotel' ? '🏨' : card.category === 'restaurant' ? '🍽️' : '🎯'}{' '}
                        {card.category === 'hotel' ? 'Hôtel' : card.category === 'restaurant' ? 'Restaurant' : 'Activité'}
                      </span>
                    </div>
                    <h3>{card.name}</h3>
                    <p>{card.description}</p>
                  </div>
                  <div className="swipe-card-meta">
                    <span className="swipe-card-price">
                      {card.price === 0 ? 'Gratuit' : `${card.price}€`}
                      {card.category === 'hotel' ? '/nuit' : card.category === 'restaurant' ? '/pers' : ''}
                    </span>
                    <span className="swipe-card-rating">
                      <Star size={14} fill="#F59E0B" />
                      {card.rating}
                    </span>
                  </div>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>

        {/* Action buttons */}
        <div className="swipe-actions">
          <button
            className="swipe-action-btn nope"
            onClick={() => swipeManual('left')}
            id="swipe-nope-btn"
          >
            <X size={28} />
          </button>
          <button
            className="swipe-action-btn like"
            onClick={() => swipeManual('right')}
            id="swipe-like-btn"
          >
            <Heart size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwipePage;
