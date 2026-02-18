import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useRefreshTokenMutation } from '../store/api/authApi';
import { updateTokens, logout } from '../store/slices/authSlice';

const REFRESH_INTERVAL = 13 * 60 * 1000; // 13 minutes (before 15m expiry)

export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, refreshToken } = useAppSelector((s) => s.auth);
  const [refresh] = useRefreshTokenMutation();

  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return;

    const interval = setInterval(async () => {
      try {
        const result = await refresh({ refreshToken }).unwrap();
        dispatch(updateTokens(result.data));
      } catch {
        dispatch(logout());
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken]);
};