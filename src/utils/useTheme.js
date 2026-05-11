import useBudgetStore from '../store/useBudgetStore';
import { THEMES } from './themes';

/**
 * Returns the active theme color palette.
 * Use this hook inside components instead of importing static COLORS.
 *
 * @example
 *   const C = useTheme();
 *   <View style={{ backgroundColor: C.primary }} />
 */
const useTheme = () => {
  const themeId = useBudgetStore((state) => state.themeId);
  return THEMES[themeId] || THEMES.yellow;
};

export default useTheme;
