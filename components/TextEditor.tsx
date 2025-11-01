
import React from 'react';
import { DownloadIcon, LoadIcon, SaveIcon } from './icons';

const STORAGE_KEY = 'texto_local_react_app';

interface TextEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, setContent }) => {
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, content);
    alert('Texto salvo no localStorage!');
  };

  const handleLoad = () => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      setContent(savedContent);
    } else {
      alert('Nenhum texto salvo para carregar.');
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'texto.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
        <h3 className="text-xl font-bold text-gray-700">📝 Editor de Texto</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg flex items-center transition duration-200 text-sm">
            <SaveIcon /> Salvar Local
          </button>
          <button onClick={handleLoad} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg flex items-center transition duration-200 text-sm">
            <LoadIcon /> Carregar
          </button>
          <button onClick={handleExport} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center transition duration-200 text-sm">
            <DownloadIcon /> Exportar .txt
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite ou carregue texto aqui..."
        className="w-full flex-grow p-3 border border-gray-300 rounded-md resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
};

export default TextEditor;
