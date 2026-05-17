import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  className?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({ className }) => {
  const { addPhoto, setUi } = useStore();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Create mock photo objects
      const newPhotos = acceptedFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''),
        date: new Date().toISOString(),
        tags: []
      }));

      // Add to store
      newPhotos.forEach(photo => addPhoto(photo));
      setUploadedPhotos(newPhotos);
      setUploadProgress(100);
    } catch (error) {
      setUploadError('Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [addPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const closeModal = () => {
    setUi(state => {
      state.ui.uploadModalOpen = false;
    });
    setUploadProgress(null);
    setUploadError(null);
    setUploadedPhotos([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
        className
      )}
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-surface border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-display">Fotoğraf Yükle</h3>
          <button onClick={closeModal}><X size={20} className="text-white/40 hover:text-white" /></button>
        </div>

        {!uploadProgress && !uploadedPhotos.length && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all",
              isDragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10 hover:bg-white/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Upload className="text-blue-400" />
            </div>
            <div className="text-center">
              <p className="font-medium">Fotoğrafları buraya sürükleyin</p>
              <p className="text-xs text-white/30 mt-1">Veya tıklayarak dosya seçin</p>
            </div>
          </div>
        )}

        {uploadProgress !== null && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {uploadProgress < 100 ? (
                <Loader2 className="animate-spin text-blue-400" />
              ) : (
                <Check className="text-green-400" />
              )}
              <p className="text-sm">
                {uploadProgress < 100 ? `Yükleniyor... ${uploadProgress}%` : "Yükleme tamamlandı!"}
              </p>
            </div>
            {uploadProgress < 100 && (
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
            {uploadError}
          </div>
        )}

        {uploadedPhotos.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Yüklenen Fotoğraflar</h4>
            <div className="grid grid-cols-3 gap-2">
              {uploadedPhotos.map(photo => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
            onClick={closeModal}
          >
            {uploadedPhotos.length > 0 ? "Tamam" : "Vazgeç"}
          </button>
          {uploadedPhotos.length > 0 && (
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
              onClick={closeModal}
            >
              Galeriye Git
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
