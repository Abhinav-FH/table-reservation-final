import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: 60 },

  header: { paddingTop: Spacing.xxl, marginBottom: Spacing.xl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.textDarkPrimary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterRow: { marginBottom: Spacing.md },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
    backgroundColor: Colors.bgDarkSubtle,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.textDarkSecondary },
  filterTextActive: { color: Colors.white },

  emptyState: { alignItems: 'center', marginTop: Spacing.huge },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.lg },
  emptyText: { fontFamily: Fonts.sans, fontSize: 15, color: Colors.textDarkSecondary },
});