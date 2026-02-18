import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgBase },
  safeAreaDark: { backgroundColor: Colors.bgDark },
  container: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xxxl },

  backBtn: { marginBottom: Spacing.xxxl },
  backText: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.textSecondary },
  backTextDark: { color: Colors.textDarkSecondary },

  eyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  eyebrowDark: { color: Colors.primary },
  title: {
    fontFamily: Fonts.display,
    fontSize: 34,
    color: Colors.textPrimary,
    marginBottom: Spacing.xxxl,
    letterSpacing: -0.5,
  },
  titleDark: { color: Colors.textDarkPrimary },

  form: { marginBottom: Spacing.xxl },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  registerHint: { fontFamily: Fonts.sans, fontSize: 14, color: Colors.textSecondary },
  registerHintDark: { color: Colors.textDarkSecondary },
  registerLink: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.primary },
});