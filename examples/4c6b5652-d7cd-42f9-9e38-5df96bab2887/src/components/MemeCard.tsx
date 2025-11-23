import React from 'react';
import { Trash2, Edit, Tags } from 'lucide-react';
import type { Meme } from '../types';

interface MemeCardProps {
  meme: Meme;
  onDelete: (id: string) => void;
  onEdit: (meme: Meme) => void;
}

export function MemeCard({ meme, onDelete, onEdit }: MemeCardProps) {
  return (
    <div className="animate-fade-in hover-scale bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square group">
        <img
          src={meme.url}
          alt={meme.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{meme.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {meme.tags.map((tag) => (
            <span
              key={tag}
              className="tag px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onEdit(meme)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <Edit size={16} />
            编辑
          </button>
          <button
            onClick={() => onDelete(meme.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 size={16} />
            删除
          </button>
        </div>
      </div>
    </div>
  );
}