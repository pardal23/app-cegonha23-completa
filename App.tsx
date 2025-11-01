
import React, { useState, useEffect, useCallback } from 'react';
import { StoredFile, PreviewTarget } from './types';
import * as db from './services/db';
import Header from './components/Header';
import FileList from './components/FileList';
import MediaPreview from './components/MediaPreview';
import TextEditor from './components/TextEditor';

declare const JSZip: any;

const App: React.FC = () => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorContent, setEditorContent] = useState('');
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget>(null);

  const refreshFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const allFiles = await db.getFiles();
      setFiles(allFiles);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      alert("Erro ao carregar arquivos do banco de dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    db.initDB().then(() => {
      refreshFiles();
    }).catch(error => {
      console.error("DB Initialization failed:", error);
      alert("Não foi possível iniciar o banco de dados local.");
      setIsLoading(false);
    });
  }, [refreshFiles]);

  const handleImport = async (fileList: FileList) => {
    if (!fileList.length) return;
    setIsLoading(true);
    try {
      for (const file of Array.from(fileList)) {
        await db.addFile(file);
      }
      alert(`${fileList.length} arquivo(s) importado(s) com sucesso!`);
      await refreshFiles();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Falha na importação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    if (files.length === 0) {
      alert("Nenhum arquivo para exportar.");
      return;
    }
    setIsLoading(true);
    try {
      const zip = new JSZip();
      for (const file of files) {
        zip.file(file.name, file.data);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup_base.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Falha ao exportar arquivos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Tem certeza que deseja apagar TODOS os arquivos? Esta ação é irreversível.")) {
      setIsLoading(true);
      try {
        await db.clearFiles();
        await refreshFiles();
        setEditorContent('');
        setPreviewTarget(null);
        alert("Todos os arquivos foram apagados.");
      } catch (error) {
        console.error("Clear all failed:", error);
        alert("Falha ao limpar a base de dados.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenFile = async (id: number) => {
    const file = await db.getFile(id);
    if (file) {
      setEditorContent(file.textContent || "[Arquivo binário - não pode ser exibido como texto]");
    }
  };

  const handlePreviewMedia = async (id: number) => {
    const file = await db.getFile(id);
    if (file) {
      setPreviewTarget({ type: 'media', file });
    }
  };
  
  const handlePlayYouTube = (url: string) => {
    const idMatch = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/);
    if (idMatch && idMatch[1]) {
      setPreviewTarget({ type: 'youtube', videoId: idMatch[1] });
    } else {
      alert("URL do YouTube inválida!");
    }
  };

  const handleDownloadFile = async (id: number) => {
    const file = await db.getFile(id);
    if (file) {
      const blob = new Blob([file.data], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (window.confirm("Excluir este arquivo?")) {
      try {
        await db.deleteFile(id);
        await refreshFiles();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Falha ao excluir o arquivo.");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          onImport={handleImport}
          onExportAll={handleExportAll}
          onClearAll={handleClearAll}
          isLoading={isLoading}
        />
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="h-[400px]">
                <FileList
                  files={files}
                  onOpenFile={handleOpenFile}
                  onPreviewMedia={handlePreviewMedia}
                  onDownloadFile={handleDownloadFile}
                  onDeleteFile={handleDeleteFile}
                  isLoading={isLoading}
                />
              </div>
              <div className="h-[400px]">
                 <TextEditor content={editorContent} setContent={setEditorContent} />
              </div>
          </div>
          <div className="lg:col-span-1 h-[824px]">
             <MediaPreview previewTarget={previewTarget} onPlayYouTube={handlePlayYouTube} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
