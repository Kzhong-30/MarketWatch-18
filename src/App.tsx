import { useState } from 'react';
import { Sparkles, Palette, Layers, List } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewArea } from './components/PreviewArea';
import { CodeOutput } from './components/CodeOutput';
import { Favorites } from './components/Favorites';
import { TemplateLibrary } from './components/TemplateLibrary';
import { AnimationSequence } from './components/AnimationSequence';

export default function App() {
  const [activeBottomTab, setActiveBottomTab] = useState<'sequence' | 'templates' | 'favorites'>('templates');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">CSS 动画生成器</h1>
                <p className="text-xs text-gray-500">可视化创建精美动画</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Palette size={16} />
                <span>实时预览 · 一键导出</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
          <div className="lg:col-span-3 h-full">
            <ConfigPanel />
          </div>

          <div className="lg:col-span-5 h-full flex flex-col gap-6">
            <div className="flex-1">
              <PreviewArea />
            </div>

            <div className="h-56 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveBottomTab('sequence')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    activeBottomTab === 'sequence'
                      ? 'text-cyan-600 border-b-2 border-cyan-500 bg-cyan-50/50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List size={16} />
                  动画序列
                </button>
                <button
                  onClick={() => setActiveBottomTab('templates')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    activeBottomTab === 'templates'
                      ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layers size={16} />
                  模板库
                </button>
                <button
                  onClick={() => setActiveBottomTab('favorites')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    activeBottomTab === 'favorites'
                      ? 'text-red-600 border-b-2 border-red-500 bg-red-50/50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={activeBottomTab === 'favorites' ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  收藏夹
                </button>
              </div>
              <div className="h-[calc(100%-49px)] overflow-hidden">
                {activeBottomTab === 'sequence' && <AnimationSequence />}
                {activeBottomTab === 'templates' && <TemplateLibrary />}
                {activeBottomTab === 'favorites' && <Favorites />}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-full relative">
            <CodeOutput />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>CSS Animation Generator © 2024</span>
          <div className="flex items-center gap-4">
            <span>提示: 调整参数即可实时预览动画效果</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
