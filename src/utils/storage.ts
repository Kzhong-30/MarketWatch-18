import { Favorite, AnimationConfig } from '../types/animation';

const FAVORITES_KEY = 'css-animation-favorites';

export const getFavorites = (): Favorite[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFavorite = (config: AnimationConfig, name: string): Favorite => {
  const favorites = getFavorites();
  const favorite: Favorite = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    config: { ...config, id: Math.random().toString(36).substr(2, 9) },
    createdAt: Date.now(),
  };
  favorites.unshift(favorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorite;
};

export const deleteFavorite = (id: string): void => {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

export const isFavorite = (configId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.config.id === configId);
};
