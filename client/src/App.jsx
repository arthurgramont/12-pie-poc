import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import ImportPage from './pages/ImportPage';
import SwipePage from './pages/SwipePage';
import ResultsPage from './pages/ResultsPage';
import FormPage from './pages/FormPage';
import ItineraryPage from './pages/ItineraryPage';

const STEPS = ['welcome', 'import', 'swipe', 'results', 'form', 'itinerary'];

function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [destination, setDestination] = useState(null);
  const [importedVideos, setImportedVideos] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [formData, setFormData] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  const goTo = (step) => setCurrentStep(step);
  const stepIndex = STEPS.indexOf(currentStep);

  const handleSelectDestination = (dest) => {
    setDestination(dest);
    goTo('import');
  };

  const handleImportDone = (videos) => {
    setImportedVideos(videos);
    goTo('swipe');
  };

  const handleSwipeDone = (liked) => {
    setLikedPlaces(liked);
    goTo('results');
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    // Generate itinerary from liked places + form data
    const generated = generateItinerary(likedPlaces, data, destination);
    setItinerary(generated);
    goTo('itinerary');
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setDestination(null);
    setImportedVideos([]);
    setLikedPlaces([]);
    setFormData(null);
    setItinerary(null);
  };

  const renderPage = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomePage onSelectDestination={handleSelectDestination} />;
      case 'import':
        return (
          <ImportPage
            destination={destination}
            onDone={handleImportDone}
            onBack={() => goTo('welcome')}
          />
        );
      case 'swipe':
        return (
          <SwipePage
            destination={destination}
            onDone={handleSwipeDone}
            onBack={() => goTo('import')}
          />
        );
      case 'results':
        return (
          <ResultsPage
            likedPlaces={likedPlaces}
            destination={destination}
            onContinue={() => goTo('form')}
            onBack={() => goTo('swipe')}
          />
        );
      case 'form':
        return (
          <FormPage
            destination={destination}
            onSubmit={handleFormSubmit}
            onBack={() => goTo('results')}
          />
        );
      case 'itinerary':
        return (
          <ItineraryPage
            itinerary={itinerary}
            destination={destination}
            formData={formData}
            likedPlaces={likedPlaces}
            onRestart={handleRestart}
          />
        );
      default:
        return <WelcomePage onSelectDestination={handleSelectDestination} />;
    }
  };

  return (
    <div className="desktop-wrapper">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-content">
          {currentStep !== 'welcome' && (
            <div className="step-indicator" style={{ paddingTop: 36 }}>
              {STEPS.slice(1).map((step, i) => (
                <div
                  key={step}
                  className={`step-dot ${
                    STEPS.indexOf(step) === stepIndex
                      ? 'active'
                      : STEPS.indexOf(step) < stepIndex
                      ? 'completed'
                      : ''
                  }`}
                />
              ))}
            </div>
          )}
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

// ---------- Itinerary Generation Algorithm ----------
function generateItinerary(likedPlaces, formData, destination) {
  const days = formData.tripDays || 3;
  const hotels = likedPlaces.filter((p) => p.category === 'hotel');
  const restaurants = likedPlaces.filter((p) => p.category === 'restaurant');
  const activities = likedPlaces.filter((p) => p.category === 'activity');

  const itineraryDays = [];

  for (let d = 0; d < days; d++) {
    const day = {
      dayNumber: d + 1,
      date: getDateForDay(formData.startDate, d),
      items: [],
    };

    // Morning activity
    if (activities.length > 0) {
      const act = activities[d % activities.length];
      day.items.push({
        time: '09:00',
        type: 'activity',
        place: act,
        note: 'Activité matinale',
      });
    }

    // Lunch
    if (restaurants.length > 0) {
      const rest = restaurants[(d * 2) % restaurants.length];
      day.items.push({
        time: '12:30',
        type: 'restaurant',
        place: rest,
        note: 'Déjeuner',
      });
    }

    // Afternoon activity
    if (activities.length > 1) {
      const act2 = activities[(d + 1) % activities.length];
      day.items.push({
        time: '14:30',
        type: 'activity',
        place: act2,
        note: 'Exploration',
      });
    }

    // Dinner
    if (restaurants.length > 1) {
      const rest2 = restaurants[(d * 2 + 1) % restaurants.length];
      day.items.push({
        time: '19:30',
        type: 'restaurant',
        place: rest2,
        note: 'Dîner',
      });
    }

    // Hotel
    if (hotels.length > 0) {
      const hotel = hotels[d % hotels.length];
      day.items.push({
        time: '22:00',
        type: 'hotel',
        place: hotel,
        note: 'Hébergement',
      });
    }

    itineraryDays.push(day);
  }

  // Calculate total budget
  let totalBudget = 0;
  itineraryDays.forEach((day) => {
    day.items.forEach((item) => {
      totalBudget += item.place.price * (formData.travelers || 1);
    });
  });

  return {
    destination,
    days: itineraryDays,
    totalBudget,
    travelers: formData.travelers,
    tripDays: days,
  };
}

function getDateForDay(startDate, dayOffset) {
  if (!startDate) return `Jour ${dayOffset + 1}`;
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayOffset);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default App;
