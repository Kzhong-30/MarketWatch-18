import { useState } from 'react';
import { LayoutTemplate, Play, Loader2, MousePointerClick, Hand, Scroll } from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';
import { templates } from '../utils/presets';

const generateId = () => Math.random().toString(36).substr(2, 9);

const categoryIcons: Record<string, any> = {
  load: Loader2,
  hover: Hand,
  click: MousePointerClick,
  scroll: Scroll,
};

const categoryLabels: Record<string, string> = {
  load: '加载触发',
  hover: '悬浮触发',
  click: '点击触发',
  scroll: '滚动触发',
};

export const TemplateLibrary = () => {
  const { setConfig, restartAnimation } = useAnimationStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTemplates = activeCategory
    ? templates.filter((t) => t.category === activeCategory)
    : templates;

  const loadTemplate = (template: typeof templates[0]) => {
    const configWithIds = {
      ...template.config,
      id: generateId(),
      keyframes: template.config.keyframes.map((kf) => ({
        ...kf,
        id: kf.id || generateId(),
        properties: kf.properties.map((p) => ({
          ...p,
          id: p.id || generateId(),
        })),
      })),
    };
    setConfig(configWithIds);
    restartAnimation();
  };

  const categories = ['load', 'hover', 'click', 'scroll'];

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LayoutTemplate size={20} className="text-amber-500" />
          模板库
        </h2>
      </div>

      <div className="flex border-b border-gray-100 px-4 overflow-x-auto">
        <button
          onClick={() => setActiveCategory(null)}
          className={`py-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeCategory === null
              ? 'text-amber-600 border-amber-500'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1 ${
                activeCategory === cat
                  ? 'text-amber-600 border-amber-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon size={12} />
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template)}
              className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:border-amber-400 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-gray-700 text-sm">{template.name}</span>
                <Play size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-500 mb-2">{template.description}</p>
              <div className="flex items-center gap-2">
                <span className="bg-amber-200 text-amber-700 text-xs px-2 py-0.5 rounded">
                  {categoryLabels[template.category]}
                </span>
                <span className="text-xs text-gray-400">{template.config.duration}s</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
