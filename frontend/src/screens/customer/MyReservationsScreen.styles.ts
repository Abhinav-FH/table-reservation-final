import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  list: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 80,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  logoutBtn: {
    padding: Spacing.sm,
    marginTop: 4,
  },

  // ── Filters ─────────────────────────────────────────────────────────────────
  filterRow: {
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  resultsCount: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },

  // ── Booking card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#8B6A42',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },

  // Restaurant row at top of card
  cardRestaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  cardRestaurantIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(200, 118, 46, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRestaurantName: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  cardRestaurantAddress: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },

  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },

  // Details row
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardDetailText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  // Tables row
  cardTablesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  cardTablesLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardTablesValue: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: Colors.primary,
  },

  // Special requests
  cardRequestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  cardRequestText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Cancel button
  cancelBtn: {
    margin: Spacing.lg,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.danger,
  },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDesc: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});