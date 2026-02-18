import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  container: { padding: Spacing.xxl, paddingBottom: 60 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  eyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 4,
  },
  restaurantName: { fontFamily: Fonts.display, fontSize: 22, color: Colors.textDarkPrimary },
  logoutBtn: { padding: Spacing.sm },

  legend: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.textDarkSecondary },

  loader: { marginTop: Spacing.huge },
  gridContainer: { marginBottom: Spacing.xl },

  tablePanel: {
    backgroundColor: Colors.bgDarkCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  tablePanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  tablePanelTitle: { fontFamily: Fonts.display, fontSize: 20, color: Colors.textDarkPrimary },
  tablePanelDetail: { fontFamily: Fonts.sans, fontSize: 14, color: Colors.textDarkSecondary, marginBottom: 4 },
  tablePanelActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  panelBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBtnDanger: { borderColor: Colors.danger },
  panelBtnText: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.primary },
  panelBtnTextDanger: { color: Colors.danger },
});