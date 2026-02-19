import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const SLOT_HEIGHT = 56;
const DRUM_VISIBLE = 5;
export const DRUM_HEIGHT = SLOT_HEIGHT * DRUM_VISIBLE;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  container: {
    padding: Spacing.xxl,
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
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkMuted,
    marginBottom: Spacing.md,
  },
  sectionAccent: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0,
    textTransform: 'none',
    color: Colors.textDarkPrimary,
  },
  sectionHintInline: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    letterSpacing: 0,
    textTransform: 'none',
    color: Colors.textDarkMuted,
  },

  // ── Phone lookup ─────────────────────────────────────────────────────────────
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  lookupBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(200, 118, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(46, 125, 82, 0.10)',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.tableAvailable,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tableAvailable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarText: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.white,
  },
  customerName: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    color: Colors.textDarkPrimary,
  },
  customerEmail: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkSecondary,
    marginTop: 2,
  },

  // ── Date ─────────────────────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgDarkSubtle,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.textDarkPrimary,
    flex: 1,
  },
  dateChange: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  // ── Guests ────────────────────────────────────────────────────────────────────
  guestRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  guestChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgDarkSubtle,
  },
  guestChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guestText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.textDarkSecondary,
  },
  guestTextActive: {
    color: Colors.white,
  },

  // ── Time drum ─────────────────────────────────────────────────────────────────
  drumWrapper: {
    height: DRUM_HEIGHT,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.bgDarkSubtle,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    position: 'relative',
  },
  drum: {
    flex: 1,
  },
  drumContent: {
    paddingVertical: SLOT_HEIGHT * 2,
  },
  drumHighlight: {
    position: 'absolute',
    top: SLOT_HEIGHT * 2,
    left: 0,
    right: 0,
    height: SLOT_HEIGHT,
    backgroundColor: 'rgba(200, 118, 46, 0.10)',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: Colors.primary,
    zIndex: 1,
  },
  drumFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SLOT_HEIGHT * 2,
    backgroundColor: 'rgba(38, 29, 22, 0.80)',
    zIndex: 2,
  },
  drumFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SLOT_HEIGHT * 2,
    backgroundColor: 'rgba(38, 29, 22, 0.80)',
    zIndex: 2,
  },
  slotItem: {
    height: SLOT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  slotItemSelected: {},
  slotText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.textDarkSecondary,
    flex: 1,
  },
  slotTextSelected: {
    color: Colors.primary,
    fontSize: 22,
  },
  slotDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // ── Floor plan grid ───────────────────────────────────────────────────────────
  floorLegend: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textDarkSecondary,
  },
  miniGrid: {
    gap: 4,
  },
  miniGridRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniTable: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  miniTableLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  miniTableCap: {
    fontFamily: Fonts.sans,
    fontSize: 8,
    opacity: 0.8,
  },
  miniEmpty: {
    borderWidth: 1,
    borderColor: 'rgba(155, 135, 110, 0.15)',
    borderStyle: 'dashed',
    borderRadius: 6,
  },

  // ── Summary card ─────────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: Colors.bgDarkSubtle,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.textDarkPrimary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  summaryLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textDarkMuted,
  },
  summaryValue: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.textDarkPrimary,
  },
});