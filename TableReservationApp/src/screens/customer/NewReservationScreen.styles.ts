import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createFormStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: Spacing.xs,
      marginRight: Spacing.sm,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: colors.text,
    },
    content: {
      padding: Spacing.md,
      paddingBottom: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      marginBottom: Spacing.md,
      marginTop: Spacing.sm,
    },
    slotsSection: {
      marginTop: Spacing.lg,
    },
    slotsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    slotChip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 8,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    slotChipActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primary,
    },
    slotChipDisabled: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      opacity: 0.5,
    },
    slotText: {
      fontSize: FontSize.sm,
      color: colors.text,
      fontWeight: FontWeight.medium,
    },
    slotTextActive: {
      color: Colors.white,
    },
    slotTextDisabled: {
      color: colors.textMuted,
    },
    noSlots: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: Spacing.lg,
    },
    textarea: {
      height: 80,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    submitBtn: {
      marginTop: Spacing.lg,
    },
  });
}
