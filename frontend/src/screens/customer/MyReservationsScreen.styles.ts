import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgBase },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxl },

  header: { paddingTop: Spacing.xxl, marginBottom: Spacing.xl },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.textPrimary, marginBottom: Spacing.lg },

  filterRow: { marginBottom: Spacing.xl },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
    backgroundColor: Colors.bgSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },

  emptyState: { alignItems: 'center', marginTop: Spacing.huge },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.lg },
  emptyTitle: { fontFamily: Fonts.display, fontSize: 20, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyDesc: { fontFamily: Fonts.sans, fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});