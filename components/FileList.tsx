
import React from 'react';
import { StoredFile } from '../types';
import FileItem from './FileItem';

interface FileListProps {
  files: StoredFile[];
  onOpenFile: (id: number) => void;
  onPreviewMedia: (id: number) => void;
  onDownloadFile: (id: number) => void;
  onDeleteFile: (id: number) => void;
  isLoading: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, onOpenFile, onPreviewMedia, onDownloadFile, onDeleteFile, isLoading }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-700 p-4 border-b border-gray-200">
        Arquivos Salvos
      </h2>
      <div className="overflow-y-auto flex-grow">
        {isLoading && <p className="p-4 text-gray-500">Carregando arquivos...</p>}
        {!isLoading && files.length === 0 && (
          <p className="p-4 text-gray-500 italic">Nenhum arquivo salvo.</p>
        )}
        {!isLoading && files.map(file => (
          <FileItem
            key={file.id}
            file={file}
            onOpenFile={onOpenFile}
            onPreviewMedia={onPreviewMedia}
            onDownloadFile={onDownloadFile}
            onDeleteFile={onDeleteFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
