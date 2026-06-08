import { useState } from 'react';
import {
  Settings,
  Clock,
  Timer,
  Repeat,
  ArrowRightLeft,
  Square,
  Plus,
  Minus,
  Edit3,
} from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';
import {
  animationPresets,
  easingOptions,
  directionOptions,
  fillModeOptions,
} from '../utils/presets';
import * as Icons from 'lucide-react';

const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent size={16} /> : <Settings size={16} />;
};

export const ConfigPanel = () => {
  const {
    config,
    setConfig,
    setAnimationType,
    updateKeyframe,
    updateKeyframeProperty,
    addKeyframe,
    addKeyframeProperty,
    removeKeyframe,
    removeKeyframeProperty,
  } = useAnimationStore();
  const [activeTab, setActiveTab] = useState<'presets' | 'timing' | 'keyframes'>('presets');

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          动画配置
        </h2>
      </div>

      <div className="flex border-b border-gray-100">
        {[
          { key: 'presets', label: '预设', icon: Square },
          { key: 'timing', label: '时序', icon: Clock },
          { key: 'keyframes', label: '关键帧', icon: Edit3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 gap-2">
            {animationPresets.map((preset) => (
              <button
                key={preset.type}
                onClick={() => setAnimationType(preset.type)}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  config.type === preset.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-600'
                }`}
              >
                {getIcon(preset.icon)}
                <span className="text-xs font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="text-blue-500" />
                持续时间: {config.duration}s
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={config.duration}
                onChange={(e) => setConfig({ duration: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Timer size={16} className="text-blue-500" />
                延迟: {config.delay}s
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={config.delay}
                onChange={(e) => setConfig({ delay: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">缓动函数</label>
              <select
                value={config.easing}
                onChange={(e) => setConfig({ easing: e.target.value as any })}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {easingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Repeat size={16} className="text-blue-500" />
                循环次数
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={config.iterationCount === 'infinite' ? '' : config.iterationCount}
                  onChange={(e) => setConfig({ iterationCount: parseInt(e.target.value) || 1 })}
                  disabled={config.iterationCount === 'infinite'}
                  className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="次数"
                />
                <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.iterationCount === 'infinite'}
                    onChange={(e) => setConfig({ iterationCount: e.target.checked ? 'infinite' : 1 })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">无限</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">播放方向</label>
              <select
                value={config.direction}
                onChange={(e) => setConfig({ direction: e.target.value as any })}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {directionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ArrowRightLeft size={16} className="text-blue-500" />
                填充模式
              </label>
              <select
                value={config.fillMode}
                onChange={(e) => setConfig({ fillMode: e.target.value as any })}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fillModeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'keyframes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">关键帧列表</span>
              <button
                onClick={() => addKeyframe(0.5)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} />
                添加关键帧
              </button>
            </div>

            <div className="space-y-3">
              {config.keyframes.map((kf, index) => (
                <div
                  key={kf.id || `kf-${index}`}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {Math.round(kf.offset * 100)}%
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={kf.offset}
                        onChange={(e) =>
                          updateKeyframe(index, parseFloat(e.target.value), kf.properties)
                        }
                        className="w-24 h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    {config.keyframes.length > 2 && (
                      <button
                        onClick={() => removeKeyframe(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Minus size={14} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {kf.properties.map((prop) => (
                      <div key={prop.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={prop.name}
                          onChange={(e) => {
                            const newName = e.target.value.trim();
                            if (newName) {
                              updateKeyframeProperty(index, prop.id, { name: newName });
                            }
                          }}
                          className="flex-1 p-2 text-xs border border-gray-200 rounded bg-white"
                          placeholder="属性名"
                        />
                        <input
                          type="text"
                          value={prop.value}
                          onChange={(e) =>
                            updateKeyframeProperty(index, prop.id, { value: e.target.value })
                          }
                          className="flex-1 p-2 text-xs border border-gray-200 rounded bg-white"
                          placeholder="属性值"
                        />
                        <button
                          onClick={() => removeKeyframeProperty(index, prop.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="删除属性"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addKeyframeProperty(index)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      + 添加属性
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
