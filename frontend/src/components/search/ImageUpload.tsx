import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onRemoveImage: () => void;
}

export default function ImageUpload({
  onImageSelect,
  selectedImage,
  onRemoveImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleRemove = () => {
    setPreview(null);
    onRemoveImage();
  };

  if (selectedImage && preview) {
    return (
      <div className="border-2 border-green-500 rounded-xl p-4 bg-white dark:bg-surface-800">
        <img
          src={preview}
          alt="Upload preview"
          className="w-full max-h-[400px] object-contain rounded-lg mb-4"
        />
        <div className="flex justify-center gap-3">
          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-white dark:bg-surface-800 cursor-pointer transition-all text-center",
        isDragActive
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-slate-200 dark:border-surface-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
      )}
    >
      <input {...getInputProps()} />
      <svg
        className="w-16 h-16 mb-4 text-slate-400 dark:text-surface-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
        Upload a photograph
      </h2>
      <p className="text-sm text-slate-400 dark:text-surface-500 mb-4">
        Drag & drop here or click to browse
      </p>
      <p className="text-xs text-slate-400 dark:text-surface-500">
        JPG / PNG / WEBP &bull; Max 10MB
      </p>
    </div>
  );
}
