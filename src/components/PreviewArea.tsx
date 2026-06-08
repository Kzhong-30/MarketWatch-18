import { Play, Pause, RotateCcw, Box } from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';
import { generateKeyframesCSS } from '../utils/cssGenerator';

export const PreviewArea = () => {
  const { config, isPlaying, animationKey, togglePlay, restartAnimation } = useAnimationStore();
  const keyframesCSS = generateKeyframesCSS(config);

  const animationStyle: React.CSSProperties = {
    animationName: config.name || config.type,
    animationDuration: `${config.duration}s`,
    animationDelay: `${config.delay}s`,
    animationTimingFunction: config.easing,
    animationIterationCount: isPlaying ? config.iterationCount : 0,
    animationDirection: config.direction,
    animationFillMode: config.fillMode,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Box size={20} className="text-emerald-500" />
          预览区域
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={restartAnimation}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="重新播放"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-xl">
        <style>{keyframesCSS}</style>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-4 opacity-20 absolute inset-0 p-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300 rounded" />
            ))}
          </div>

          <div
            key={animationKey}
            style={animationStyle}
            className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center"
          >
            <div className="text-white text-2xl font-bold">CSS</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-xs">
            <div className="grid grid-cols-3 gap-2 text-gray-600">
              <div>
                <span className="text-gray-400">时长:</span> {config.duration}s
              </div>
              <div>
                <span className="text-gray-400">延迟:</span> {config.delay}s
              </div>
              <div>
                <span className="text-gray-400">循环:</span>{' '}
                {config.iterationCount === 'infinite' ? '∞' : config.iterationCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
