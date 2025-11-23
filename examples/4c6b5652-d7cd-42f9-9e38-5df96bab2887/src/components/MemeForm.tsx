import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { MemeFormData } from '../types';

interface MemeFormProps {
  onSubmit: (data: MemeFormData) => void;
  initialData?: MemeFormData;
  onCancel: () => void;
}

export function MemeForm({ onSubmit, initialData, onCancel }: MemeFormProps) {
  const [formData, setFormData] = useState<MemeFormData>(
    initialData || {
      title: '',
      url: '',
      tags: [],
    }
  );
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">图片链接</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">标签</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="block flex-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="添加标签"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="tag inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-blue-900 transition-colors duration-200"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          保存
        </button>
      </div>
    </form>
  );
}