
import React from 'react';
import { StoredFile } from '../types';
import { DocumentTextIcon, DownloadIcon, EyeIcon, XCircleIcon } from './icons';

interface FileItemProps {
  file: StoredFile;
  onOpenFile: (id: number) => void;
  onPreviewMedia: (id: number) => void;
  onDownloadFile: (id: number) => void;
  onDeleteFile: (id: number) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onOpenFile, onPreviewMedia, onDownloadFile, onDeleteFile }) => {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex-grow mb-2 sm:mb-0">
        <p className="font-semibold text-gray-800 break-all">{file.name}</p>
        <p className="text-sm text-gray-500">
          {formatSize(file.size)} - {file.type || 'Tipo desconhecido'}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-wrap gap-2">
        {file.textContent && (
            <button onClick={() => onOpenFile(file.id)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-md flex items-center transition">
            <DocumentTextIcon /> Abrir
            </button>
        )}
        {(file.type.startsWith('image/') || file.type.startsWith('video/')) && (
            <button onClick={() => onPreviewMedia(file.id)} className="text-sm bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-semibold py-1 px-2 rounded-md flex items-center transition">
            <EyeIcon /> Ver
            </button>
        )}
        <button onClick={() => onDownloadFile(file.id)} className="text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-1 px-2 rounded-md flex items-center transition">
          <DownloadIcon /> Baixar
        </button>
        <button onClick={() => onDeleteFile(file.id)} className="text-sm bg-red-200 hover:bg-red-300 text-red-800 font-semibold py-1 px-2 rounded-md flex items-center transition">
          <XCircleIcon /> Excluir
        </button>
      </div>
    </div>
  );
};

export default FileItem;
