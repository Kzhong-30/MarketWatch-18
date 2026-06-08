import { useState, useEffect } from 'react';
import { Code, Copy, Download, Check, Heart } from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';
import { generateFullCSS, copyToClipboard, exportCSSFile } from '../utils/cssGenerator';

export const CodeOutput = () => {
  const { config, saveToFavorites, favorites } = useAnimationStore();
  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState(config.name);
  const [isSaved, setIsSaved] = useState(false);

  const cssCode = generateFullCSS(config);

  useEffect(() => {
    setIsSaved(favorites.some((f) => f.config.type === config.type && f.name === config.name));
  }, [config, favorites]);

  const handleCopy = async () => {
    const success = await copyToClipboard(cssCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    exportCSSFile(config);
  };

  const handleSaveFavorite = () => {
    saveToFavorites(favoriteName || config.name);
    setShowSaveModal(false);
    setIsSaved(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col relative">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Code size={20} className="text-purple-500" />
          代码输出
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
            }`}
            title="收藏"
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors ${
              copied
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
            }`}
            title="复制代码"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            title="导出CSS文件"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 bg-gray-900 text-sm">
          <code className="text-green-400 font-mono whitespace-pre">{cssCode}</code>
        </pre>
      </div>

      {showSaveModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">保存到收藏夹</h3>
            <input
              type="text"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              placeholder="输入动画名称"
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveFavorite}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
