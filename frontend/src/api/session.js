import { Preferences } from '@capacitor/preferences';

export const logout = async () => {
  await Preferences.remove({ key: 'token' });
  await Preferences.remove({ key: 'user' });
};

export const getStoredUser = async () => {
  const { value } = await Preferences.get({ key: 'user' });
  return value ? JSON.parse(value) : null;
};
