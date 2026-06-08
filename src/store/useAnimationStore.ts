import { create } from 'zustand';
import { AnimationConfig, AnimationSequenceItem, Favorite, Keyframe } from '../types/animation';
import { createDefaultConfig, presetKeyframes, ensureKeyframeIds, ensureConfigKeyframes } from '../utils/presets';
import { getFavorites, saveFavorite, deleteFavorite } from '../utils/storage';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface AnimationState {
  config: AnimationConfig;
  isPlaying: boolean;
  animationKey: number;
  sequence: AnimationSequenceItem[];
  sequencePlaybackConfig: AnimationConfig | null;
  favorites: Favorite[];
  setConfig: (config: Partial<AnimationConfig>) => void;
  setAnimationType: (type: string) => void;
  togglePlay: () => void;
  restartAnimation: () => void;
  addToSequence: () => void;
  removeFromSequence: (id: string) => void;
  updateSequenceItem: (id: string, updates: Partial<AnimationSequenceItem>) => void;
  playSequence: () => void;
  resetSequence: () => void;
  currentPlayingIndex: number;
  isSequencePlaying: boolean;
  loadFavorites: () => void;
  saveToFavorites: (name: string) => void;
  removeFavorite: (id: string) => void;
  loadFavorite: (favorite: Favorite) => void;
  updateKeyframe: (index: number, offset: number, properties: Keyframe['properties']) => void;
  updateKeyframeProperty: (keyframeIndex: number, propertyId: string, updates: Partial<{ name: string; value: string }>) => void;
  addKeyframe: (offset: number) => void;
  addKeyframeProperty: (keyframeIndex: number) => void;
  removeKeyframeProperty: (keyframeIndex: number, propertyId: string) => void;
  removeKeyframe: (index: number) => void;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  config: createDefaultConfig(),
  isPlaying: true,
  animationKey: 0,
  sequence: [],
  sequencePlaybackConfig: null,
  currentPlayingIndex: -1,
  isSequencePlaying: false,
  favorites: [],

  setConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates },
  })),

  setAnimationType: (type) => set((state) => ({
    config: {
      ...state.config,
      type: type as AnimationConfig['type'],
      name: type,
      keyframes: ensureKeyframeIds(presetKeyframes[type] || presetKeyframes.custom),
    },
  })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  restartAnimation: () => set((state) => ({
    animationKey: state.animationKey + 1,
    isPlaying: true,
  })),

  addToSequence: () => set((state) => ({
    sequence: [
      ...state.sequence,
      {
        id: generateId(),
        config: { ...state.config, id: generateId() },
        trigger: 'immediate' as const,
        isPlaying: false,
        isCompleted: false,
      },
    ],
  })),

  removeFromSequence: (id) => set((state) => ({
    sequence: state.sequence.filter((item) => item.id !== id),
  })),

  updateSequenceItem: (id, updates) => set((state) => ({
    sequence: state.sequence.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),

  resetSequence: () => set((state) => ({
    sequence: state.sequence.map((item) => ({
      ...item,
      isPlaying: false,
      isCompleted: false,
    })),
    currentPlayingIndex: -1,
    isSequencePlaying: false,
    sequencePlaybackConfig: null,
  })),

  playSequence: () => {
    const state = get();
    if (state.sequence.length === 0) return;

    const snapshot = state.sequence.map((item) => ({ ...item, config: { ...item.config } }));

    set({ isSequencePlaying: true, currentPlayingIndex: 0 });

    const playNext = (index: number, seq: AnimationSequenceItem[]) => {
      if (index >= seq.length) {
        set({ isSequencePlaying: false, currentPlayingIndex: -1, sequencePlaybackConfig: null });
        return;
      }

      const item = seq[index];
      const playItem = () => {
        set((s) => ({
          currentPlayingIndex: index,
          sequencePlaybackConfig: { ...item.config },
          animationKey: s.animationKey + 1,
          isPlaying: true,
          sequence: s.sequence.map((it) =>
            it.id === item.id ? { ...it, isPlaying: true, isCompleted: false } : it
          ),
        }));

        const duration = item.config.duration * 1000 + item.config.delay * 1000;
        setTimeout(() => {
          set((s) => ({
            sequence: s.sequence.map((it) =>
              it.id === item.id ? { ...it, isPlaying: false, isCompleted: true } : it
            ),
          }));
          playNext(index + 1, seq);
        }, duration);
      };

      if (item.trigger === 'delay' && item.triggerDelay) {
        setTimeout(playItem, item.triggerDelay * 1000);
      } else {
        playItem();
      }
    };

    playNext(0, snapshot);
  },

  loadFavorites: () => set({ favorites: getFavorites() }),

  saveToFavorites: (name) => {
    const favorite = saveFavorite(get().config, name);
    set((state) => ({ favorites: [favorite, ...state.favorites] }));
  },

  removeFavorite: (id) => {
    deleteFavorite(id);
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== id),
    }));
  },

  loadFavorite: (favorite) => set({
    config: ensureConfigKeyframes(favorite.config),
  }),

  updateKeyframe: (index, offset, properties) => set((state) => {
    const keyframes = [...state.config.keyframes];
    keyframes[index] = {
      id: keyframes[index].id || generateId(),
      offset,
      properties,
    };
    keyframes.sort((a, b) => a.offset - b.offset);
    return { config: { ...state.config, keyframes } };
  }),

  addKeyframe: (offset) => set((state) => {
    const keyframes = [
      ...state.config.keyframes,
      {
        id: generateId(),
        offset,
        properties: [
          { id: generateId(), name: 'opacity', value: '1' },
        ],
      },
    ];
    keyframes.sort((a, b) => a.offset - b.offset);
    return { config: { ...state.config, keyframes } };
  }),

  updateKeyframeProperty: (keyframeIndex, propertyId, updates) => set((state) => {
    const keyframes = [...state.config.keyframes];
    const kf = { ...keyframes[keyframeIndex] };
    kf.properties = kf.properties.map((p) =>
      p.id === propertyId ? { ...p, ...updates } : p
    );
    keyframes[keyframeIndex] = kf;
    return { config: { ...state.config, keyframes } };
  }),

  addKeyframeProperty: (keyframeIndex) => set((state) => {
    const keyframes = [...state.config.keyframes];
    const kf = { ...keyframes[keyframeIndex] };
    kf.properties = [
      ...kf.properties,
      { id: generateId(), name: `property_${kf.properties.length + 1}`, value: 'value' },
    ];
    keyframes[keyframeIndex] = kf;
    return { config: { ...state.config, keyframes } };
  }),

  removeKeyframeProperty: (keyframeIndex, propertyId) => set((state) => {
    const keyframes = [...state.config.keyframes];
    const kf = { ...keyframes[keyframeIndex] };
    kf.properties = kf.properties.filter((p) => p.id !== propertyId);
    keyframes[keyframeIndex] = kf;
    return { config: { ...state.config, keyframes } };
  }),

  removeKeyframe: (index) => set((state) => {
    const keyframes = state.config.keyframes.filter((_, i) => i !== index);
    return { config: { ...state.config, keyframes } };
  }),
}));
