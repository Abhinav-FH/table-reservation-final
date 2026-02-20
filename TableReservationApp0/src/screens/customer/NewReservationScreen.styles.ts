import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createFormStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { padding: Spacing.xs, marginRight: Spacing.sm },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: colors.text },
    content: { padding: Spacing.md, paddingBottom: 80 },
    sectionTitle: {
      fontSize: FontSize.md, fontWeight: FontWeight.semibold,
      color: colors.text, marginBottom: Spacing.sm, marginTop: Spacing.md,
    },
    slotsSection: { marginTop: Spacing.lg },
    slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

    // Base chip: white/dark card background, neutral border — NOT red
    slotChip: {
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.card,   // white in light, dark card in dark mode
      alignItems: 'center',
      minWidth: 88,
    },
    // Selected: primary color (red) — ONLY when user taps it
    slotChipActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primary,
    },
    // Unavailable: muted grey, semi-transparent — NOT red
    slotChipDisabled: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      opacity: 0.5,
    },
    slotText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: colors.text,          // dark text on light card
    },
    slotTextActive: { color: Colors.white },
    slotTextDisabled: { color: colors.textMuted },
    slotFullLabel: {
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 2,
    },

    noSlotsBox: {
      alignItems: 'center', paddingVertical: Spacing.xl,
      backgroundColor: colors.surface, borderRadius: BorderRadius.lg,
      borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
    },
    noSlots: {
      fontSize: FontSize.sm, color: colors.textSecondary,
      textAlign: 'center', marginTop: 10,
    },
    noSlotsHint: { fontSize: FontSize.xs, color: colors.textMuted, marginTop: 4 },

    selectedBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.successLight,
      borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md,
    },
    selectedBannerText: {
      fontSize: FontSize.sm, color: Colors.success,
      fontWeight: FontWeight.semibold, flex: 1,
    },
    textarea: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
    submitBtn: { marginTop: Spacing.lg },
  });
}