import { Favorite, AnimationConfig, KeyframeProperty } from '../types/animation';
import { ensureConfigKeyframes } from './presets';

const FAVORITES_KEY = 'css-animation-favorites';

const isLegacyProperties = (props: unknown): props is Record<string, string> =>
  typeof props === 'object' && props !== null && !Array.isArray(props);

const migrateConfig = (config: AnimationConfig): AnimationConfig => {
  if (!config.keyframes || config.keyframes.length === 0) return config;

  const needsMigration = config.keyframes.some(
    (kf: any) => isLegacyProperties(kf.properties)
  );

  if (needsMigration) {
    return ensureConfigKeyframes(config);
  }

  return config;
};

const migrateFavorites = (favorites: any[]): Favorite[] =>
  favorites.map((f: any) => ({
    ...f,
    config: migrateConfig(f.config),
  }));

export const getFavorites = (): Favorite[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return migrateFavorites(parsed);
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
