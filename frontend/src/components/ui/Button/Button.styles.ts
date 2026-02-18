import { StyleSheet } from 'react-native';
import { Colors } from '../../../styles/colors';
import { Fonts } from '../../../styles/typography';
import { Radius, Spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },

  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.transparent, borderWidth: 1.5, borderColor: Colors.primary },
  ghost: { backgroundColor: Colors.transparent },
  danger: { backgroundColor: Colors.danger },

  label: { fontFamily: Fonts.sansBold, fontSize: 15, letterSpacing: 0.3 },
  primaryLabel: { color: Colors.white },
  secondaryLabel: { color: Colors.primary },
  ghostLabel: { color: Colors.primary },
  dangerLabel: { color: Colors.white },
});