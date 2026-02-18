import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#8B6A42',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cardDark: {
    backgroundColor: Colors.bgDarkCard,
    borderColor: Colors.borderDark,
  },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  date: { fontFamily: Fonts.display, fontSize: 16, color: Colors.textPrimary },
  dateDark: { color: Colors.textDarkPrimary },
  time: { fontFamily: Fonts.sans, fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  timeDark: { color: Colors.textDarkSecondary },

  detailsRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontFamily: Fonts.sans, fontSize: 13, color: Colors.textSecondary },
  detailTextDark: { color: Colors.textDarkSecondary },

  special: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  specialDark: { color: Colors.textDarkMuted },

  cancelBtn: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  cancelText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.danger, textAlign: 'center' },
});