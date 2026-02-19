import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const SLOT_ITEM_HEIGHT = 64;
const DRUM_VISIBLE_ITEMS = 5;
export const DRUM_HEIGHT = SLOT_ITEM_HEIGHT * DRUM_VISIBLE_ITEMS;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  container: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    paddingBottom: 60,
  },

  // ── Sections ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  sectionLabelAccent: {
    color: Colors.textPrimary,
    letterSpacing: 0,
    textTransform: 'none',
    fontFamily: Fonts.sansBold,
    fontSize: 11,
  },
  sectionLabelHint: {
    color: Colors.textMuted,
    letterSpacing: 0,
    textTransform: 'none',
    fontFamily: Fonts.sans,
    fontSize: 11,
  },

  // ── Date ─────────────────────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateText: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  dateYear: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  changePill: {
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changeText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  // ── Guests ────────────────────────────────────────────────────────────────────
  guestRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  guestChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
  },
  guestChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guestChipText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  guestChipTextActive: {
    color: Colors.white,
  },

  // ── Time drum ────────────────────────────────────────────────────────────────
  loader: {
    marginVertical: Spacing.xl,
  },

  noSlotsBox: {
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noSlotsText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  drumWrapper: {
    height: DRUM_HEIGHT,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#8B6A42',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },

  drum: {
    flex: 1,
  },

  drumContent: {
    // Pad top and bottom so first/last item can center
    paddingVertical: SLOT_ITEM_HEIGHT * 2,
  },

  // The amber highlight strip behind the center (selected) slot
  drumHighlight: {
    position: 'absolute',
    top: SLOT_ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: SLOT_ITEM_HEIGHT,
    backgroundColor: 'rgba(200, 118, 46, 0.08)',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: Colors.primary,
    zIndex: 1,
  },

  // Gradient-like fade at top and bottom edges
  drumFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SLOT_ITEM_HEIGHT * 2,
    backgroundColor: 'rgba(254, 252, 248, 0.82)',
    zIndex: 2,
  },
  drumFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SLOT_ITEM_HEIGHT * 2,
    backgroundColor: 'rgba(254, 252, 248, 0.82)',
    zIndex: 2,
  },

  // Individual slot rows inside the drum
  slotItem: {
    height: SLOT_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  slotItemSelected: {
    // The highlight strip handles the background; just increase z-index text
  },
  slotItemUnavailable: {
    opacity: 0.38,
  },

  slotTime: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.textSecondary,
    width: 72,
  },
  slotTimeSelected: {
    color: Colors.primary,
    fontSize: 24,
  },
  slotTimeUnavailable: {
    color: Colors.textMuted,
    fontSize: 18,
  },

  slotMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },
  slotMetaSelected: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sansMedium,
  },
  slotMetaUnavailable: {
    color: Colors.textMuted,
  },

  slotSelectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // ── Book summary ─────────────────────────────────────────────────────────────
  bookSection: {
    gap: Spacing.md,
  },
  bookSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  bookSummaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  bookSummaryLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  bookSummaryValue: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  bookSummarySep: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});