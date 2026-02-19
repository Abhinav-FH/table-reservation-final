import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: Spacing.xxl,
    paddingBottom: 80,
  },

  // ── Header ───────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  eyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 4,
  },
  restaurantName: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: Colors.textDarkPrimary,
    letterSpacing: -0.2,
  },
  restaurantMeta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkMuted,
    marginTop: 2,
  },
  logoutBtn: {
    padding: Spacing.sm,
  },

  // ── Instruction banner ────────────────────────────────────────────────────────
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(200, 118, 46, 0.08)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(200, 118, 46, 0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  instructionText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkSecondary,
    flex: 1,
    lineHeight: 18,
  },

  // ── Legend ───────────────────────────────────────────────────────────────────
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  legendLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkSecondary,
  },

  // ── Capacity key ─────────────────────────────────────────────────────────────
  capacityKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.bgDarkSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  capacityKeyLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.textDarkMuted,
    textTransform: 'uppercase',
  },
  capacityKeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  capacityKeyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capacityKeyNum: {
    fontFamily: Fonts.sansBold,
    fontSize: 10,
    color: Colors.white,
  },
  capacityKeyText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textDarkSecondary,
  },

  // ── Grid ─────────────────────────────────────────────────────────────────────
  loader: {
    marginTop: 60,
  },
  grid: {
    gap: 4,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 4,
  },

  // Empty cell — tappable
  emptyCell: {
    borderWidth: 1,
    borderColor: 'rgba(155, 135, 110, 0.2)',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Table shape ───────────────────────────────────────────────────────────────
  tableShapeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableSurface: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  capacityBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capacityText: {
    fontFamily: Fonts.sansBold,
    fontSize: 9,
    color: Colors.white,
  },
  tableLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  selectedRing: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 10,
    borderWidth: 2,
  },

  // ── Selected table panel ──────────────────────────────────────────────────────
  panel: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.bgDarkCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  panelColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  panelTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.textDarkPrimary,
  },
  panelClose: {
    padding: Spacing.xs,
  },
  panelDetails: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  panelDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  panelDetailLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textDarkMuted,
    marginBottom: 4,
  },
  panelDetailValue: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.textDarkPrimary,
    textTransform: 'capitalize',
  },
  panelDetailDivider: {
    width: 1,
    backgroundColor: Colors.borderDark,
    marginVertical: 4,
  },
  panelActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    paddingTop: 0,
  },
  panelBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(200, 118, 46, 0.08)',
  },
  panelBtnDanger: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(185, 28, 28, 0.08)',
  },
  panelBtnText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.primary,
  },
  panelBtnTextDanger: {
    color: Colors.danger,
  },

  // ── Add Table Modal ───────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalKAV: {
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgDarkCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDark,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  modalEyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.textDarkPrimary,
  },
  modalCloseBtn: {
    padding: Spacing.sm,
    marginTop: -4,
  },
  modalCounter: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkMuted,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  modalField: {
    paddingHorizontal: Spacing.xxl,
  },
  modalCapLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  modalCapRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  modalFooter: {
    paddingHorizontal: Spacing.xxl,
  },

  // Capacity option cards in modal
  capOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgDarkSubtle,
    gap: 4,
  },
  capOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(200, 118, 46, 0.10)',
  },
  capDiagram: {
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  capDiagramActive: {},
  capChairRowTop: {
    flexDirection: 'row',
    gap: 3,
  },
  capChairRowBottom: {
    flexDirection: 'row',
    gap: 3,
  },
  capChair: {
    width: 8,
    height: 6,
    borderRadius: 2,
    opacity: 0.8,
  },
  capTable: {
    width: 28,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.textDarkMuted,
    backgroundColor: 'transparent',
  },
  capTableActive: {
    borderColor: Colors.primary,
  },
  capNum: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.textDarkSecondary,
    lineHeight: 24,
  },
  capNumActive: {
    color: Colors.primary,
  },
  capSeats: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textDarkMuted,
  },
  capSeatsActive: {
    color: Colors.primaryLight,
  },

  // ── Restaurant Setup ──────────────────────────────────────────────────────────
  setupHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  setupContainer: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: 60,
  },
  setupIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(200, 118, 46, 0.12)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  setupEyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  setupTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Colors.textDarkPrimary,
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  setupDesc: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textDarkSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  setupForm: {
    marginBottom: Spacing.xxl,
  },
  gridSectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  gridSectionHint: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textDarkMuted,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  gridDimensionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  gridXText: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.textDarkSecondary,
    marginTop: 28,
  },
  gridPreviewWrapper: {
    marginTop: Spacing.md,
    backgroundColor: Colors.bgDarkSubtle,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  gridPreviewTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: Colors.textDarkMuted,
    marginBottom: Spacing.sm,
  },
  gridPreview: {
    gap: 3,
  },
  gridPreviewRow: {
    flexDirection: 'row',
    gap: 3,
  },
  gridPreviewCell: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgDarkCard,
  },
});