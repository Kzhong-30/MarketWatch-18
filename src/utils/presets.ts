import { AnimationConfig, Keyframe, Template, KeyframeProperty } from '../types/animation';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createProperties = (props: Record<string, string>): KeyframeProperty[] =>
  Object.entries(props).map(([name, value]) => ({
    id: generateId(),
    name,
    value,
  }));

const createKeyframe = (offset: number, props: Record<string, string>): Keyframe => ({
  id: generateId(),
  offset,
  properties: createProperties(props),
});

export const isLegacyProperties = (props: unknown): props is Record<string, string> =>
  typeof props === 'object' && props !== null && !Array.isArray(props);

export const isKeyframePropertyArray = (props: unknown): props is KeyframeProperty[] =>
  Array.isArray(props) && props.every((p: unknown) => {
    if (typeof p !== 'object' || p === null) return false;
    const obj = p;
    return 'id' in obj && typeof (obj as {id: unknown}).id === 'string'
      && 'name' in obj && typeof (obj as {name: unknown}).name === 'string'
      && 'value' in obj && typeof (obj as {value: unknown}).value === 'string';
  });

export const normalizeProperties = (raw: unknown): KeyframeProperty[] => {
  if (isKeyframePropertyArray(raw)) {
    return raw.map((p) => ({ ...p, id: p.id || generateId() }));
  }
  if (isLegacyProperties(raw)) {
    return Object.entries(raw)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([name, value]) => ({
        id: generateId(),
        name,
        value,
      }));
  }
  return [];
};

const normalizeKeyframe = (raw: unknown): Keyframe => {
  if (typeof raw !== 'object' || raw === null) {
    return { id: generateId(), offset: 0, properties: [] };
  }
  const obj = raw as Record<string, unknown>;
  return {
    id: typeof obj.id === 'string' ? obj.id : generateId(),
    offset: typeof obj.offset === 'number' ? obj.offset : 0,
    properties: normalizeProperties(obj.properties),
  };
};

export function ensureKeyframeIds(keyframes: Keyframe[]): Keyframe[];
export function ensureKeyframeIds(keyframes: unknown[]): Keyframe[];
export function ensureKeyframeIds(keyframes: unknown[]): Keyframe[] {
  return keyframes.map(normalizeKeyframe);
}

export const ensureConfigKeyframes = (config: AnimationConfig): AnimationConfig => ({
  ...config,
  keyframes: ensureKeyframeIds(config.keyframes),
});

export const createDefaultConfig = (): AnimationConfig => ({
  id: generateId(),
  name: 'fadeIn',
  type: 'fadeIn',
  duration: 1,
  delay: 0,
  easing: 'ease',
  iterationCount: 1,
  direction: 'normal',
  fillMode: 'both',
  keyframes: presetKeyframes.fadeIn,
});

export const presetKeyframes: Record<string, Keyframe[]> = {
  fadeIn: [
    createKeyframe(0, { opacity: '0' }),
    createKeyframe(1, { opacity: '1' }),
  ],
  fadeOut: [
    createKeyframe(0, { opacity: '1' }),
    createKeyframe(1, { opacity: '0' }),
  ],
  slideInLeft: [
    createKeyframe(0, { transform: 'translateX(-100%)', opacity: '0' }),
    createKeyframe(1, { transform: 'translateX(0)', opacity: '1' }),
  ],
  slideInRight: [
    createKeyframe(0, { transform: 'translateX(100%)', opacity: '0' }),
    createKeyframe(1, { transform: 'translateX(0)', opacity: '1' }),
  ],
  slideInUp: [
    createKeyframe(0, { transform: 'translateY(100%)', opacity: '0' }),
    createKeyframe(1, { transform: 'translateY(0)', opacity: '1' }),
  ],
  slideInDown: [
    createKeyframe(0, { transform: 'translateY(-100%)', opacity: '0' }),
    createKeyframe(1, { transform: 'translateY(0)', opacity: '1' }),
  ],
  scaleIn: [
    createKeyframe(0, { transform: 'scale(0)', opacity: '0' }),
    createKeyframe(1, { transform: 'scale(1)', opacity: '1' }),
  ],
  scaleOut: [
    createKeyframe(0, { transform: 'scale(1)', opacity: '1' }),
    createKeyframe(1, { transform: 'scale(0)', opacity: '0' }),
  ],
  rotate: [
    createKeyframe(0, { transform: 'rotate(0deg)' }),
    createKeyframe(1, { transform: 'rotate(360deg)' }),
  ],
  bounce: [
    createKeyframe(0, { transform: 'translateY(0)' }),
    createKeyframe(0.2, { transform: 'translateY(0)' }),
    createKeyframe(0.4, { transform: 'translateY(-30px)' }),
    createKeyframe(0.5, { transform: 'translateY(-30px)' }),
    createKeyframe(0.6, { transform: 'translateY(-15px)' }),
    createKeyframe(0.8, { transform: 'translateY(0)' }),
    createKeyframe(1, { transform: 'translateY(0)' }),
  ],
  shake: [
    createKeyframe(0, { transform: 'translateX(0)' }),
    createKeyframe(0.1, { transform: 'translateX(-10px)' }),
    createKeyframe(0.2, { transform: 'translateX(10px)' }),
    createKeyframe(0.3, { transform: 'translateX(-10px)' }),
    createKeyframe(0.4, { transform: 'translateX(10px)' }),
    createKeyframe(0.5, { transform: 'translateX(-10px)' }),
    createKeyframe(0.6, { transform: 'translateX(10px)' }),
    createKeyframe(0.7, { transform: 'translateX(-10px)' }),
    createKeyframe(0.8, { transform: 'translateX(10px)' }),
    createKeyframe(0.9, { transform: 'translateX(-5px)' }),
    createKeyframe(1, { transform: 'translateX(0)' }),
  ],
  pulse: [
    createKeyframe(0, { transform: 'scale(1)' }),
    createKeyframe(0.5, { transform: 'scale(1.1)' }),
    createKeyframe(1, { transform: 'scale(1)' }),
  ],
  flip: [
    createKeyframe(0, { transform: 'perspective(400px) rotateY(0)', 'backface-visibility': 'visible' }),
    createKeyframe(1, { transform: 'perspective(400px) rotateY(180deg)', 'backface-visibility': 'visible' }),
  ],
  custom: [
    createKeyframe(0, { opacity: '0', transform: 'scale(0.8)' }),
    createKeyframe(1, { opacity: '1', transform: 'scale(1)' }),
  ],
};

export const animationPresets: Array<{ type: string; name: string; icon: string }> = [
  { type: 'fadeIn', name: '淡入', icon: 'eye' },
  { type: 'fadeOut', name: '淡出', icon: 'eye-off' },
  { type: 'slideInLeft', name: '左滑入', icon: 'arrow-left' },
  { type: 'slideInRight', name: '右滑入', icon: 'arrow-right' },
  { type: 'slideInUp', name: '上滑入', icon: 'arrow-up' },
  { type: 'slideInDown', name: '下滑入', icon: 'arrow-down' },
  { type: 'scaleIn', name: '缩放入', icon: 'maximize' },
  { type: 'scaleOut', name: '缩放出', icon: 'minimize' },
  { type: 'rotate', name: '旋转', icon: 'rotate-cw' },
  { type: 'bounce', name: '弹跳', icon: 'move-vertical' },
  { type: 'shake', name: '摇晃', icon: 'vibrate' },
  { type: 'pulse', name: '脉冲', icon: 'activity' },
  { type: 'flip', name: '翻转', icon: 'refresh-cw' },
  { type: 'custom', name: '自定义', icon: 'edit' },
];

export const templates: Template[] = [
  {
    id: 't1',
    name: '页面加载淡入',
    category: 'load',
    description: '页面元素加载时的淡入效果',
    config: {
      id: 't1-c',
      name: '页面加载淡入',
      type: 'fadeIn',
      duration: 0.8,
      delay: 0,
      easing: 'ease-out',
      iterationCount: 1,
      direction: 'normal',
      fillMode: 'both',
      keyframes: presetKeyframes.fadeIn,
    },
  },
  {
    id: 't2',
    name: '按钮悬浮放大',
    category: 'hover',
    description: '鼠标悬浮时按钮轻微放大',
    config: {
      id: 't2-c',
      name: '按钮悬浮放大',
      type: 'scaleIn',
      duration: 0.3,
      delay: 0,
      easing: 'ease-out',
      iterationCount: 1,
      direction: 'normal',
      fillMode: 'forwards',
      keyframes: [
        createKeyframe(0, { transform: 'scale(1)' }),
        createKeyframe(1, { transform: 'scale(1.05)' }),
      ],
    },
  },
  {
    id: 't3',
    name: '点击波纹效果',
    category: 'click',
    description: '点击时向外扩散的波纹',
    config: {
      id: 't3-c',
      name: '点击波纹效果',
      type: 'pulse',
      duration: 0.6,
      delay: 0,
      easing: 'ease-out',
      iterationCount: 1,
      direction: 'normal',
      fillMode: 'forwards',
      keyframes: [
        createKeyframe(0, { transform: 'scale(0)', opacity: '1' }),
        createKeyframe(1, { transform: 'scale(2)', opacity: '0' }),
      ],
    },
  },
  {
    id: 't4',
    name: '滚动进入滑入',
    category: 'scroll',
    description: '滚动到视口时从下方滑入',
    config: {
      id: 't4-c',
      name: '滚动进入滑入',
      type: 'slideInUp',
      duration: 0.6,
      delay: 0,
      easing: 'ease-out',
      iterationCount: 1,
      direction: 'normal',
      fillMode: 'both',
      keyframes: presetKeyframes.slideInUp,
    },
  },
  {
    id: 't5',
    name: '加载旋转动画',
    category: 'load',
    description: '加载状态的无限旋转',
    config: {
      id: 't5-c',
      name: '加载旋转动画',
      type: 'rotate',
      duration: 1,
      delay: 0,
      easing: 'linear',
      iterationCount: 'infinite',
      direction: 'normal',
      fillMode: 'none',
      keyframes: presetKeyframes.rotate,
    },
  },
  {
    id: 't6',
    name: '悬浮高亮脉冲',
    category: 'hover',
    description: '悬浮时的脉冲高亮效果',
    config: {
      id: 't6-c',
      name: '悬浮高亮脉冲',
      type: 'pulse',
      duration: 1.5,
      delay: 0,
      easing: 'ease-in-out',
      iterationCount: 'infinite',
      direction: 'normal',
      fillMode: 'none',
      keyframes: presetKeyframes.pulse,
    },
  },
];

export const easingOptions = [
  { value: 'linear', label: '线性 (linear)' },
  { value: 'ease', label: '缓动 (ease)' },
  { value: 'ease-in', label: '缓入 (ease-in)' },
  { value: 'ease-out', label: '缓出 (ease-out)' },
  { value: 'ease-in-out', label: '缓入缓出 (ease-in-out)' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: '弹性回弹' },
  { value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', label: '平滑回弹' },
];

export const directionOptions = [
  { value: 'normal', label: '正常 (normal)' },
  { value: 'reverse', label: '反向 (reverse)' },
  { value: 'alternate', label: '交替 (alternate)' },
  { value: 'alternate-reverse', label: '反向交替 (alternate-reverse)' },
];

export const fillModeOptions = [
  { value: 'none', label: '无 (none)' },
  { value: 'forwards', label: '保持结束 (forwards)' },
  { value: 'backwards', label: '保持开始 (backwards)' },
  { value: 'both', label: '两者 (both)' },
];
