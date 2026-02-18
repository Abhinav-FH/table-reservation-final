import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';

const CHAIR_SIZE = 5;
const CHAIR_OFFSET = 2;

export const getTableColor = (status: string, isActive: boolean): string => {
  if (!isActive) return Colors.tableDisabled;
  if (status === 'available') return Colors.tableAvailable;
  if (status === 'booked') return Colors.tableBooked;
  return Colors.tableDisabled;
};

export const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  emptyCell: {
    borderWidth: 1,
    borderColor: 'rgba(155,135,110,0.2)',
    borderStyle: 'dashed',
    borderRadius: 8,
    margin: 2,
  },
  tableIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tableCircle: {
    borderWidth: 2,
    position: 'absolute',
  },
  tableLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  selectedRing: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  // Chair dot positions
  chairDot: {
    width: CHAIR_SIZE,
    height: CHAIR_SIZE,
    borderRadius: CHAIR_SIZE / 2,
    backgroundColor: 'currentColor', // set via parent color
    position: 'absolute',
    opacity: 0.8,
  },
  chairDot_top:    { top: CHAIR_OFFSET, left: '50%', marginLeft: -(CHAIR_SIZE / 2) },
  chairDot_bottom: { bottom: CHAIR_OFFSET, left: '50%', marginLeft: -(CHAIR_SIZE / 2) },
  chairDot_left:   { left: CHAIR_OFFSET, top: '50%', marginTop: -(CHAIR_SIZE / 2) },
  chairDot_right:  { right: CHAIR_OFFSET, top: '50%', marginTop: -(CHAIR_SIZE / 2) },
  chairDot_tl:     { top: CHAIR_OFFSET + 4, left: CHAIR_OFFSET + 4 },
  chairDot_tr:     { top: CHAIR_OFFSET + 4, right: CHAIR_OFFSET + 4 },
  chairDot_bl:     { bottom: CHAIR_OFFSET + 4, left: CHAIR_OFFSET + 4 },
  chairDot_br:     { bottom: CHAIR_OFFSET + 4, right: CHAIR_OFFSET + 4 },
});