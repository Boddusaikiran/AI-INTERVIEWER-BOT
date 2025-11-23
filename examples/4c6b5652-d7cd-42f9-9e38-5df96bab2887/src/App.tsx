import React, { useState } from 'react';
import { ImagePlus, Search } from 'lucide-react';
import { MemeCard } from './components/MemeCard';
import { MemeForm } from './components/MemeForm';
import type { Meme, MemeFormData } from './types';
import { defaultMemes } from './defaultMemes';

function App() {
  const [memes, setMemes] = useState<Meme[]>(defaultMemes);
  const [showForm, setShowForm] = useState(false);
  const [editingMeme, setEditingMeme] = useState<Meme | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (data: MemeFormData) => {
    if (editingMeme) {
      setMemes(memes.map((meme) =>
        meme.id === editingMeme.id
          ? { ...meme, ...data }
          : meme
      ));
      setEditingMeme(null);
    } else {
      const newMeme: Meme = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      setMemes([newMeme, ...memes]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个表情包吗？')) {
      setMemes(memes.filter((meme) => meme.id !== id));
    }
  };

  const handleEdit = (meme: Meme) => {
    setEditingMeme(meme);
    setShowForm(true);
  };

  const filteredMemes = memes.filter((meme) =>
    meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meme.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            表情包管理器
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ImagePlus size={20} />
            添加表情包
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="搜索表情包（标题或标签）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 modal-overlay z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full modal-content">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingMeme ? '编辑表情包' : '添加新表情包'}
              </h2>
              <MemeForm
                onSubmit={handleSubmit}
                initialData={editingMeme || undefined}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMeme(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMemes.map((meme, index) => (
            <div key={meme.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <MemeCard
                meme={meme}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>

        {filteredMemes.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? '没有找到匹配的表情包'
                : '还没有添加任何表情包，开始添加第一个吧！'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;