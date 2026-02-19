import { useAppSelector } from './useAppDispatch';
import { getThemeColors } from '../theme/themeUtils';
import { Colors } from '../constants/colors';

export function useTheme() {
  const mode = useAppSelector((state) => state.theme.mode);
  const colors = getThemeColors(mode);
  return { mode, colors, primaryColor: Colors.primary };
}
