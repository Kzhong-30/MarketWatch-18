export interface KeyframeProperty {
  id: string;
  name: string;
  value: string;
}

export interface Keyframe {
  id: string;
  offset: number;
  properties: KeyframeProperty[];
}

export type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut' 
  | 'slideInLeft' 
  | 'slideInRight' 
  | 'slideInUp' 
  | 'slideInDown'
  | 'scaleIn' 
  | 'scaleOut'
  | 'rotate' 
  | 'bounce' 
  | 'shake'
  | 'pulse'
  | 'flip'
  | 'custom';

export type EasingType = 
  | 'linear' 
  | 'ease' 
  | 'ease-in' 
  | 'ease-out' 
  | 'ease-in-out'
  | 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  | 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

export type DirectionType = 
  | 'normal' 
  | 'reverse' 
  | 'alternate' 
  | 'alternate-reverse';

export type FillModeType = 
  | 'none' 
  | 'forwards' 
  | 'backwards' 
  | 'both';

export type TriggerType =
  | 'immediate'
  | 'delay'
  | 'click'
  | 'hover';

export interface AnimationConfig {
  id: string;
  name: string;
  type: AnimationType;
  duration: number;
  delay: number;
  easing: EasingType;
  iterationCount: number | 'infinite';
  direction: DirectionType;
  fillMode: FillModeType;
  keyframes: Keyframe[];
}

export interface AnimationSequenceItem {
  id: string;
  config: AnimationConfig;
  trigger: TriggerType;
  triggerDelay?: number;
  isPlaying?: boolean;
  isCompleted?: boolean;
}

export interface Favorite {
  id: string;
  name: string;
  config: AnimationConfig;
  createdAt: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'load' | 'hover' | 'click' | 'scroll';
  config: AnimationConfig;
  description: string;
}
