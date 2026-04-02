import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 },
  ],
});

const colors = {
  primary: '#7C3AED',
  secondary: '#2563EB',
  gold: '#F59E0B',
  green: '#10B981',
  dark: '#0F0F23',
  darkCard: '#1A1A3E',
  text: '#FFFFFF',
  textSecondary: '#A0A0C0',
  border: '#2A2A4A',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.dark,
    padding: 40,
    fontFamily: 'Inter',
    color: colors.text,
  },
  // Cover page
  coverPage: {
    backgroundColor: colors.dark,
    padding: 40,
    fontFamily: 'Inter',
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  coverMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  coverMetaItem: {
    backgroundColor: colors.darkCard,
    padding: '12 20',
    borderRadius: 10,
    alignItems: 'center',
  },
  coverMetaLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 16,
    fontWeight: 700,
  },
  // Logo
  logo: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 12,
  },
  // Day header
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#FFF',
    textAlign: 'center',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  dayDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Item
  item: {
    backgroundColor: colors.darkCard,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderLeft: `3px solid ${colors.primary}`,
  },
  itemTime: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 600,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 3,
  },
  itemDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.gold,
  },
  itemRating: {
    fontSize: 11,
    color: colors.gold,
  },
  // Budget
  budgetSection: {
    backgroundColor: colors.darkCard,
    borderRadius: 10,
    padding: 20,
    marginTop: 24,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: `1px solid ${colors.border}`,
  },
  budgetLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  budgetValue: {
    fontSize: 12,
    fontWeight: 600,
  },
  budgetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
  },
  budgetTotalLabel: {
    fontSize: 14,
    fontWeight: 700,
  },
  budgetTotalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.gold,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
});

// Helper to strip emoji characters that Inter font cannot render
const stripEmoji = (str) => {
  if (!str) return str;
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').trim();
};

function ItineraryPDF({ itinerary, destination, formData }) {
  const getCategoryLabel = (type) => {
    switch (type) {
      case 'hotel': return '[Hotel]';
      case 'restaurant': return '[Restaurant]';
      case 'activity': return '[Activite]';
      default: return '[Lieu]';
    }
  };

  const getItemBorderColor = (type) => {
    switch (type) {
      case 'hotel': return colors.secondary;
      case 'restaurant': return colors.gold;
      case 'activity': return colors.green;
      default: return colors.primary;
    }
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.logo}>Voyagr</Text>
        <Text style={styles.coverTitle}>
          {stripEmoji(destination.name)}
        </Text>
        <Text style={styles.coverSubtitle}>{stripEmoji(destination.description)}</Text>

        <View style={styles.coverMeta}>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>DURÉE</Text>
            <Text style={styles.coverMetaValue}>{itinerary.tripDays} jours</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>VOYAGEURS</Text>
            <Text style={styles.coverMetaValue}>{formData.travelers}</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaLabel}>BUDGET EST.</Text>
            <Text style={[styles.coverMetaValue, { color: colors.gold }]}>
              ~{itinerary.totalBudget}€
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Généré par Voyagr</Text>
          <Text style={styles.footerText}>
            {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>

      {/* Itinerary Pages */}
      {itinerary.days.map((day) => (
        <Page key={day.dayNumber} size="A4" style={styles.page}>
          <View style={styles.dayHeader}>
            <View style={styles.dayNumber}>
              <Text style={styles.dayNumberText}>{day.dayNumber}</Text>
            </View>
            <View>
              <Text style={styles.dayTitle}>Jour {day.dayNumber}</Text>
              <Text style={styles.dayDate}>{day.date}</Text>
            </View>
          </View>

          {day.items.map((item, idx) => (
            <View
              key={idx}
              style={[styles.item, { borderLeftColor: getItemBorderColor(item.type) }]}
            >
              <Text style={[styles.itemTime, { color: getItemBorderColor(item.type) }]}>
                {item.time} - {stripEmoji(item.note)}
              </Text>
              <Text style={styles.itemName}>
                {getCategoryLabel(item.type)} {stripEmoji(item.place.name)}
              </Text>
              <Text style={styles.itemDesc}>{stripEmoji(item.place.description)}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>
                  {item.place.price === 0 ? 'Gratuit' : `${item.place.price}€`}
                  {item.type === 'hotel'
                    ? '/nuit'
                    : item.type === 'restaurant'
                    ? '/pers'
                    : ''}
                </Text>
                <Text style={styles.itemRating}>{item.place.rating} / 5</Text>
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Voyagr - {stripEmoji(destination.name)}</Text>
            <Text style={styles.footerText}>
              Page {day.dayNumber + 1}
            </Text>
          </View>
        </Page>
      ))}

      {/* Budget Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.budgetSection}>
          <Text style={styles.budgetTitle}>Estimation budget total</Text>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Destination</Text>
            <Text style={styles.budgetValue}>
              {stripEmoji(destination.name)}
            </Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Voyageurs</Text>
            <Text style={styles.budgetValue}>{formData.travelers}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Durée</Text>
            <Text style={styles.budgetValue}>{itinerary.tripDays} jours</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Rythme</Text>
            <Text style={styles.budgetValue}>{formData.rhythm || 'Modéré'}</Text>
          </View>

          <View style={styles.budgetTotal}>
            <Text style={styles.budgetTotalLabel}>Budget estimé</Text>
            <Text style={styles.budgetTotalValue}>~{itinerary.totalBudget}€</Text>
          </View>
        </View>

        <View style={[styles.divider, { marginTop: 30 }]} />

        <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
          Ce document a été généré automatiquement par Voyagr.{'\n'}
          Les prix sont indicatifs et peuvent varier.{'\n'}
          Bon voyage !
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Voyagr - Planificateur de voyage intelligent</Text>
          <Text style={styles.footerText}>{new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default ItineraryPDF;
