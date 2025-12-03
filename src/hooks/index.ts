import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../stores/store';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export custom hooks
export { usePostData } from './usePostData';
export { useFavorites } from './useFavorites';
export { useNewsData } from './useNewsData';
export { useContacts } from './useContacts';
export { useResponsive, useTouchDevice, useMobileBrowser, useSafeArea, useViewport } from './useResponsive';
export { useTheme } from './useTheme';
