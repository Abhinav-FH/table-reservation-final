import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgBase },
  container: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xxl, paddingBottom: 60 },

  section: { marginBottom: Spacing.xxxl },
  sectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },

  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontFamily: Fonts.display, fontSize: 20, color: Colors.textPrimary },
  dateChange: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.primary },

  guestRow: { flexDirection: 'row', gap: Spacing.sm },
  guestChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
  },
  guestChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  guestChipText: { fontFamily: Fonts.sansMedium, fontSize: 15, color: Colors.textSecondary },
  guestChipTextActive: { color: Colors.white },

  loader: { marginVertical: Spacing.xl },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  slotChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    minWidth: 76,
  },
  slotChipUnavailable: {
    backgroundColor: Colors.bgSubtle,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  slotChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotTime: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.textPrimary },
  slotTimeUnavailable: { color: Colors.textMuted },
  slotTimeSelected: { color: Colors.white },
  slotCount: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  slotCountSelected: { color: 'rgba(255,255,255,0.8)' },

  bookSection: { gap: Spacing.md },
  bookSummary: {
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  bookSummaryText: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.textSecondary },
});