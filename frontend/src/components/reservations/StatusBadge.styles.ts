import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';
import { Radius, Spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: Fonts.sansMedium, fontSize: 12 },

  badgeCONFIRMED: { backgroundColor: Colors.statusConfirmedBg },
  dotCONFIRMED: { backgroundColor: Colors.statusConfirmed },
  textCONFIRMED: { color: Colors.statusConfirmed },

  badgePENDING: { backgroundColor: Colors.statusPendingBg },
  dotPENDING: { backgroundColor: Colors.statusPending },
  textPENDING: { color: Colors.statusPending },

  badgeCANCELLED: { backgroundColor: Colors.statusCancelledBg },
  dotCANCELLED: { backgroundColor: Colors.statusCancelled },
  textCANCELLED: { color: Colors.statusCancelled },

  badgeCOMPLETED: { backgroundColor: Colors.statusCompletedBg },
  dotCOMPLETED: { backgroundColor: Colors.statusCompleted },
  textCOMPLETED: { color: Colors.statusCompleted },
});