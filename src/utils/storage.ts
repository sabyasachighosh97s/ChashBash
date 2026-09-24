import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = {
  USER_DATA: 'user_data',
};

export const setItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('Error saving data:', error);
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log('Error getting data:', error);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing data:', error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Error clearing storage:', error);
  }
};