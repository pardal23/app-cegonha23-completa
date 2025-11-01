
import React, { useState, useEffect } from 'react';
import { PreviewTarget } from '../types';
import { PlayIcon } from './icons';

interface MediaPreviewProps {
  previewTarget: PreviewTarget;
  onPlayYouTube: (url: string) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ previewTarget, onPlayYouTube }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    let currentUrl: string | null = null;
    if (previewTarget?.type === 'media') {
      const blob = new Blob([previewTarget.file.data], { type: previewTarget.file.type });
      currentUrl = URL.createObjectURL(blob);
      setMediaUrl(currentUrl);
    } else {
      setMediaUrl(null);
    }
    
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [previewTarget]);
  
  const handleYouTubeClick = () => {
    const url = prompt("Cole o link do vídeo do YouTube:");
    if (url) onPlayYouTube(url);
  };


  const renderPreview = () => {
    if (!previewTarget) {
      return <p className="text-gray-500 italic">Nenhuma mídia selecionada.</p>;
    }

    if (previewTarget.type === 'youtube') {
      return (
        <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${previewTarget.videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
        </div>
      );
    }

    if (previewTarget.type === 'media' && mediaUrl) {
      const { file } = previewTarget;
      if (file.type.startsWith('image/')) {
        return <img src={mediaUrl} alt={file.name} className="max-w-full max-h-full mx-auto rounded-lg shadow-sm" />;
      }
      if (file.type.startsWith('video/')) {
        return <video src={mediaUrl} controls className="max-w-full max-h-full mx-auto rounded-lg shadow-sm" />;
      }
    }

    return <p className="text-gray-500 italic">Tipo de mídia não suportado para pré-visualização.</p>;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
        <h3 className="text-xl font-bold text-gray-700">🎬 Pré-visualização</h3>
        <button onClick={handleYouTubeClick} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg flex items-center transition duration-200">
           <PlayIcon /> Tocar YouTube
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center bg-gray-100 rounded-md p-2 min-h-[200px]">
        {renderPreview()}
      </div>
    </div>
  );
};

export default MediaPreview;
