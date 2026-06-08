import { Favorite, AnimationConfig } from '../types/animation';
import { ensureConfigKeyframes, isLegacyProperties, createDefaultConfig } from './presets';

const FAVORITES_KEY = 'css-animation-favorites';

const isAnimationConfigLike = (config: unknown): config is AnimationConfig => {
  if (typeof config !== 'object' || config === null) return false;
  const obj = config;
  return 'keyframes' in obj && Array.isArray((obj as Record<string, unknown>).keyframes);
};

const migrateConfig = (config: unknown): AnimationConfig => {
  if (!isAnimationConfigLike(config)) return createDefaultConfig();
  const needsMigration = config.keyframes.some(
    (kf: unknown) => typeof kf === 'object' && kf !== null && 'properties' in (kf as Record<string, unknown>) && isLegacyProperties((kf as Record<string, unknown>).properties)
  );
  if (needsMigration) {
    return ensureConfigKeyframes(config);
  }
  return config;
};

const migrateFavorites = (favorites: unknown[]): Favorite[] =>
  favorites.map((f: unknown) => {
    if (typeof f !== 'object' || f === null) return null;
    const fav = f as Record<string, unknown>;
    return {
      ...fav,
      config: migrateConfig(fav.config),
    } as Favorite;
  }).filter((f): f is Favorite => f !== null);

export const getFavorites = (): Favorite[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
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
