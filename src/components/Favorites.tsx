import { useEffect } from 'react';
import { Heart, Trash2, Play, FolderOpen } from 'lucide-react';
import { useAnimationStore } from '../store/useAnimationStore';

export const Favorites = () => {
  const { favorites, loadFavorites, removeFavorite, loadFavorite } = useAnimationStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FolderOpen size={20} className="text-red-500" />
          我的收藏
          <span className="text-sm font-normal text-gray-400">({favorites.length})</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {favorites.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Heart size={48} className="mb-4 opacity-30" />
            <p className="text-sm">暂无收藏的动画</p>
            <p className="text-xs">点击代码区域的爱心按钮保存动画</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm">{favorite.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => loadFavorite(favorite)}
                      className="p-1.5 rounded hover:bg-blue-100 text-blue-500"
                      title="加载动画"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-500"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-200 px-2 py-0.5 rounded">
                    {favorite.config.type}
                  </span>
                  <span>{favorite.config.duration}s</span>
                  <span>
                    {new Date(favorite.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
