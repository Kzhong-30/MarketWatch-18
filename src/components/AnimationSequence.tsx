import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Play, List, Clock, MousePointer, Hand, Zap, RotateCcw, Square } from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';
import { TriggerType, AnimationSequenceItem as SequenceItemType } from '../types/animation';

const triggerOptions: Array<{ value: TriggerType; label: string; icon: any }> = [
  { value: 'immediate', label: '立即', icon: Zap },
  { value: 'delay', label: '延迟', icon: Clock },
  { value: 'click', label: '点击', icon: MousePointer },
  { value: 'hover', label: '悬浮', icon: Hand },
];

export const AnimationSequence = () => {
  const {
    sequence,
    addToSequence,
    removeFromSequence,
    updateSequenceItem,
    playSequence,
    resetSequence,
    currentPlayingIndex,
    isSequencePlaying,
    setConfig,
    restartAnimation,
  } = useAnimationStore();

  const hoverTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [previewClickId, setPreviewClickId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      Object.values(hoverTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const handlePlaySequence = () => {
    if (isSequencePlaying) {
      resetSequence();
    } else {
      resetSequence();
      setTimeout(() => playSequence(), 50);
    }
  };

  const handleTriggerPreview = (item: SequenceItemType) => {
    if (item.trigger === 'click') {
      setPreviewClickId(item.id);
      setConfig({ ...item.config });
      restartAnimation();
      setTimeout(() => setPreviewClickId(null), 300);
    }
  };

  const handleHoverStart = (item: SequenceItemType) => {
    if (item.trigger === 'hover') {
      setConfig({ ...item.config });
      restartAnimation();
    }
  };

  const handleAddToSequence = () => {
    addToSequence();
  };

  const getItemStatus = (item: SequenceItemType, index: number) => {
    if (currentPlayingIndex === index && item.isPlaying) return 'playing';
    if (item.isCompleted) return 'completed';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <List size={20} className="text-cyan-500" />
          动画序列
          <span className="text-sm font-normal text-gray-400">({sequence.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToSequence}
            className="p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            title="添加当前动画到序列"
          >
            <Plus size={18} />
          </button>
          {sequence.length > 0 && (
            <>
              <button
                onClick={resetSequence}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="重置序列"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handlePlaySequence}
                className={`p-2 rounded-lg transition-colors ${
                  isSequencePlaying
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
                title={isSequencePlaying ? '停止序列' : '播放序列'}
              >
                {isSequencePlaying ? <Square size={18} /> : <Play size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sequence.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <List size={48} className="mb-4 opacity-30" />
            <p className="text-sm">暂无动画序列</p>
            <p className="text-xs">点击"+"按钮添加当前动画到序列</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sequence.map((item, index) => {
              const TriggerIcon = triggerOptions.find((t) => t.value === item.trigger)?.icon || Zap;
              const status = getItemStatus(item, index);

              return (
                <div
                  key={item.id}
                  onClick={() => handleTriggerPreview(item)}
                  onMouseEnter={() => handleHoverStart(item)}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    status === 'playing'
                      ? 'bg-emerald-50 border-emerald-400'
                      : status === 'completed'
                      ? 'bg-gray-100 border-gray-300 opacity-60'
                      : previewClickId === item.id
                      ? 'bg-cyan-50 border-cyan-400 scale-98'
                      : 'bg-gray-50 border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center ${
                          status === 'playing'
                            ? 'bg-emerald-500 animate-pulse'
                            : status === 'completed'
                            ? 'bg-gray-400'
                            : 'bg-cyan-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700 text-sm">
                        {item.config.name}
                      </span>
                      {status === 'playing' && (
                        <span className="text-xs text-emerald-600 font-medium">播放中</span>
                      )}
                      {status === 'completed' && (
                        <span className="text-xs text-gray-500">已完成</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromSequence(item.id);
                      }}
                      className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600"
                      title="移除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">触发:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {triggerOptions.map((opt) => {
                        const OptIcon = opt.icon;
                        const isActive = item.trigger === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSequenceItem(item.id, { trigger: opt.value });
                            }}
                            className={`px-2 py-1 text-xs rounded flex items-center gap-1 transition-colors ${
                              isActive
                                ? 'bg-cyan-100 text-cyan-700'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <OptIcon size={12} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {item.trigger === 'delay' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">延迟时间:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={item.triggerDelay || 0}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateSequenceItem(item.id, { triggerDelay: parseFloat(e.target.value) });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 p-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-gray-500">秒</span>
                    </div>
                  )}

                  {(item.trigger === 'click' || item.trigger === 'hover') && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      💡 {item.trigger === 'click' ? '点击' : '悬浮'}此项可预览效果
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {sequence.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {isSequencePlaying
                ? `正在播放 ${currentPlayingIndex + 1}/${sequence.length}`
                : `共 ${sequence.length} 个动画`}
            </span>
            <span>点击播放按钮运行完整序列</span>
          </div>
        </div>
      )}
    </div>
  );
};
