import { useState } from 'react';
import { ChevronLeft, ArrowRight, Users, Calendar, Wallet, Heart, Activity } from 'lucide-react';

const INTERESTS = [
  { id: 'culture', label: '🏛️ Culture', emoji: '🏛️' },
  { id: 'gastronomie', label: '🍷 Gastronomie', emoji: '🍷' },
  { id: 'nature', label: '🌿 Nature', emoji: '🌿' },
  { id: 'aventure', label: '🧗 Aventure', emoji: '🧗' },
  { id: 'detente', label: '🧘 Détente', emoji: '🧘' },
  { id: 'shopping', label: '🛍️ Shopping', emoji: '🛍️' },
  { id: 'nightlife', label: '🎶 Vie nocturne', emoji: '🎶' },
  { id: 'sport', label: '⚽ Sport', emoji: '⚽' },
];

const RHYTHMS = ['Relaxé 🐢', 'Modéré ⚖️', 'Intense 🚀'];

function FormPage({ destination, onSubmit, onBack }) {
  const [formStep, setFormStep] = useState(0);
  const [form, setForm] = useState({
    travelers: 2,
    ages: '',
    startDate: '',
    tripDays: 3,
    budget: 'moyen',
    allergies: '',
    medical: '',
    interests: [],
    rhythm: 'Modéré ⚖️',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (id) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const steps = [
    // Step 0: Travelers
    <>
      <div className="page-header">
        <Users size={32} style={{ color: 'var(--accent-purple)', marginBottom: 8 }} />
        <h2 style={{ fontSize: 20 }}>Qui voyage ?</h2>
        <p className="subtitle">Parlez-nous de votre groupe</p>
      </div>

      <div className="form-group">
        <label className="form-label">Nombre de voyageurs</label>
        <div className="counter-input">
          <button
            className="counter-btn"
            onClick={() => update('travelers', Math.max(1, form.travelers - 1))}
          >
            −
          </button>
          <span className="counter-value">{form.travelers}</span>
          <button
            className="counter-btn"
            onClick={() => update('travelers', Math.min(20, form.travelers + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Âges des voyageurs</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: 28, 30, 5"
          value={form.ages}
          onChange={(e) => update('ages', e.target.value)}
          id="ages-input"
        />
      </div>
    </>,

    // Step 1: Dates & Budget
    <>
      <div className="page-header">
        <Calendar size={32} style={{ color: 'var(--accent-purple)', marginBottom: 8 }} />
        <h2 style={{ fontSize: 20 }}>Quand et combien ?</h2>
        <p className="subtitle">Définissez votre planning et budget</p>
      </div>

      <div className="form-group">
        <label className="form-label">Date de départ</label>
        <input
          type="date"
          className="form-input"
          value={form.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          id="start-date-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Durée du voyage (jours)</label>
        <div className="counter-input">
          <button
            className="counter-btn"
            onClick={() => update('tripDays', Math.max(1, form.tripDays - 1))}
          >
            −
          </button>
          <span className="counter-value">{form.tripDays}</span>
          <button
            className="counter-btn"
            onClick={() => update('tripDays', Math.min(30, form.tripDays + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Budget par personne</label>
        <div className="chip-group">
          {[
            { id: 'petit', label: '💰 Petit' },
            { id: 'moyen', label: '💰💰 Moyen' },
            { id: 'grand', label: '💰💰💰 Grand' },
            { id: 'luxe', label: '✨ Luxe' },
          ].map((opt) => (
            <div
              key={opt.id}
              className={`chip ${form.budget === opt.id ? 'active' : ''}`}
              onClick={() => update('budget', opt.id)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </>,

    // Step 2: Health & Interests
    <>
      <div className="page-header">
        <Heart size={32} style={{ color: 'var(--accent-purple)', marginBottom: 8 }} />
        <h2 style={{ fontSize: 20 }}>Vos préférences</h2>
        <p className="subtitle">Pour personnaliser au maximum</p>
      </div>

      <div className="form-group">
        <label className="form-label">Restrictions alimentaires / allergies</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: végétarien, sans gluten..."
          value={form.allergies}
          onChange={(e) => update('allergies', e.target.value)}
          id="allergies-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Conditions médicales à prendre en compte</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: mobilité réduite, asthme..."
          value={form.medical}
          onChange={(e) => update('medical', e.target.value)}
          id="medical-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Centres d&apos;intérêt</label>
        <div className="chip-group">
          {INTERESTS.map((interest) => (
            <div
              key={interest.id}
              className={`chip ${form.interests.includes(interest.id) ? 'active' : ''}`}
              onClick={() => toggleInterest(interest.id)}
            >
              {interest.label}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Rythme souhaité</label>
        <div className="chip-group">
          {RHYTHMS.map((r) => (
            <div
              key={r}
              className={`chip ${form.rhythm === r ? 'active' : ''}`}
              onClick={() => update('rhythm', r)}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    </>,
  ];

  return (
    <div className="page">
      <button className="back-btn" onClick={formStep > 0 ? () => setFormStep(formStep - 1) : onBack}>
        <ChevronLeft size={20} />
      </button>

      {/* Sub-steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16, paddingTop: 8 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === formStep ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: i === formStep ? 'var(--gradient-main)' : i < formStep ? 'var(--accent-green)' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {steps[formStep]}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        {formStep < steps.length - 1 ? (
          <button
            className="btn btn-primary btn-full"
            onClick={() => setFormStep(formStep + 1)}
            id="form-next-btn"
          >
            Suivant
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            className="btn btn-gold btn-full"
            onClick={handleSubmit}
            id="generate-itinerary-btn"
          >
            ✨ Générer mon itinéraire
          </button>
        )}
      </div>
    </div>
  );
}

export default FormPage;
