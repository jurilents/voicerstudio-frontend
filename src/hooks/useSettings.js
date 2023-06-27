import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../store/settingsReducer';
import { useCallback } from 'react';

export function useSettings() {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const patchSettings = useCallback((patch) => {
    dispatch(setSettings(patch));
  }, [dispatch]);

  return { settings, patchSettings };
}
