import { Favorite, AnimationConfig } from '../types/animation';
import { ensureConfigKeyframes, isLegacyProperties } from './presets';

const FAVORITES_KEY = 'css-animation-favorites';

const migrateConfig = (config: unknown): AnimationConfig => {
  if (!config || typeof config !== 'object') return config as AnimationConfig;
  const cfg = config as AnimationConfig;
  if (!cfg.keyframes || !Array.isArray(cfg.keyframes) || cfg.keyframes.length === 0) return cfg;

  const needsMigration = cfg.keyframes.some(
    (kf: unknown) => typeof kf === 'object' && kf !== null && isLegacyProperties((kf as Record<string, unknown>).properties)
  );

  if (needsMigration) {
    return ensureConfigKeyframes(cfg);
  }

  return cfg;
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
