import { AnimationConfig } from '../types/animation';

export const generateKeyframesCSS = (config: AnimationConfig): string => {
  const keyframeName = config.name || config.type || 'animation';
  const keyframes = config.keyframes
    .map((kf) => {
      const percentage = Math.round(kf.offset * 100);
      const properties = kf.properties
        .map((prop) => `    ${prop.name}: ${prop.value};`)
        .join('\n');
      return `  ${percentage}% {\n${properties}\n  }`;
    })
    .join('\n');

  return `@keyframes ${keyframeName} {\n${keyframes}\n}`;
};

export const generateAnimationCSS = (config: AnimationConfig): string => {
  const keyframeName = config.name || config.type || 'animation';
  const iterationCount = typeof config.iterationCount === 'number' 
    ? config.iterationCount 
    : config.iterationCount;

  return `.animated-element {
  animation-name: ${keyframeName};
  animation-duration: ${config.duration}s;
  animation-delay: ${config.delay}s;
  animation-timing-function: ${config.easing};
  animation-iteration-count: ${iterationCount};
  animation-direction: ${config.direction};
  animation-fill-mode: ${config.fillMode};
}`;
};

export const generateFullCSS = (config: AnimationConfig): string => {
  return `${generateKeyframesCSS(config)}\n\n${generateAnimationCSS(config)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const exportCSSFile = (config: AnimationConfig): void => {
  const cssContent = generateFullCSS(config);
  const blob = new Blob([cssContent], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${config.name || 'animation'}.css`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
