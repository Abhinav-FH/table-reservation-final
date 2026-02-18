import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgBase },
  container: { flex: 1, paddingHorizontal: Spacing.xxl, justifyContent: 'center' },

  heroSection: { marginBottom: Spacing.xxxl + Spacing.xl },
  eyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.5,
    color: Colors.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: 38,
    lineHeight: 46,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  subline: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  cardsSection: { gap: Spacing.md },

  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    gap: Spacing.lg,
  },
  customerCard: {
    backgroundColor: Colors.primary,
  },
  adminCard: {
    backgroundColor: Colors.bgDark,
  },

  roleIcon: { fontSize: 28 },
  roleTextGroup: { flex: 1 },
  roleTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 17,
    color: Colors.white,
    marginBottom: 3,
  },
  roleTitleDark: { color: Colors.textDarkPrimary },
  roleDesc: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  roleDescDark: { color: Colors.textDarkSecondary },
  roleArrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 20,
    color: Colors.white,
    opacity: 0.7,
  },
  roleArrowDark: { color: Colors.primary },
});