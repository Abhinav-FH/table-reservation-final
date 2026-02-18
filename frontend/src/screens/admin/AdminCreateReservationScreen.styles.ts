import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  container: { padding: Spacing.xxl, paddingBottom: 60 },

  section: { marginBottom: Spacing.xxl },
  sectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },

  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontFamily: Fonts.display, fontSize: 18, color: Colors.textDarkPrimary },
  changeText: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.primary },

  timeRow: { flexDirection: 'row', gap: Spacing.sm },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgDarkSubtle,
  },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeChipText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.textDarkSecondary },
  timeChipTextActive: { color: Colors.white },
});