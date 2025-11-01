
import React, { useRef } from 'react';
import { ExportIcon, TrashIcon, UploadIcon } from './icons';

interface HeaderProps {
  onImport: (files: FileList) => void;
  onExportAll: () => void;
  onClearAll: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onImport, onExportAll, onClearAll, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImport(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          📦 Mini Base de Dados Local
        </h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          <button
            onClick={triggerFileInput}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 disabled:bg-blue-300"
            disabled={isLoading}
          >
            <UploadIcon />
            Importar
          </button>
          <button
            onClick={onExportAll}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 disabled:bg-green-300"
            disabled={isLoading}
          >
            <ExportIcon />
            Exportar (.zip)
          </button>
          <button
            onClick={onClearAll}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 disabled:bg-red-300"
            disabled={isLoading}
          >
            <TrashIcon />
            Limpar Tudo
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
