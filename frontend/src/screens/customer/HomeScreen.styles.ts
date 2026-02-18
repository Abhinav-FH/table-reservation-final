import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgBase },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxl },

  header: { paddingTop: Spacing.xxl, marginBottom: Spacing.xl },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xxxl },
  greeting: { fontFamily: Fonts.sans, fontSize: 14, color: Colors.textSecondary },
  userName: { fontFamily: Fonts.display, fontSize: 28, color: Colors.textPrimary, letterSpacing: -0.3 },
  logoutBtn: { padding: Spacing.sm },

  sectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },

  restaurantCard: { marginBottom: Spacing.md },
  restaurantTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  restaurantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantAvatarText: { fontFamily: Fonts.display, fontSize: 18, color: Colors.white },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontFamily: Fonts.sansBold, fontSize: 16, color: Colors.textPrimary },
  restaurantAddress: { fontFamily: Fonts.sans, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  restaurantStats: { flexDirection: 'row', gap: Spacing.sm },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgSubtle,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
  statText: { fontFamily: Fonts.sansMedium, fontSize: 11, color: Colors.primary },

  loader: { marginTop: Spacing.huge },
  emptyState: { alignItems: 'center', marginTop: Spacing.huge },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.lg },
  emptyText: { fontFamily: Fonts.sans, fontSize: 15, color: Colors.textSecondary },
});