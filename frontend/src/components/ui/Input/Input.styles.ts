import { StyleSheet } from 'react-native';
import { Colors } from '../../../styles/colors';
import { Fonts } from '../../../styles/typography';
import { Radius, Spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  labelDark: { color: Colors.textDarkSecondary },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  inputRowDark: {
    backgroundColor: Colors.bgDarkSubtle,
    borderColor: Colors.borderDark,
  },
  inputRowError: { borderColor: Colors.danger },

  input: {
    flex: 1,
    height: 50,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  inputDark: { color: Colors.textDarkPrimary },

  eyeBtn: { padding: Spacing.sm },

  hint: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  hintError: { color: Colors.danger },
});