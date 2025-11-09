'use client';

import { useRef, useState } from 'react';

interface UploadStepProps {
  onUpload: (imageDataUrl: string) => void;
}

export default function UploadStep({ onUpload }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Upload Your Photo
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload a profile photo to create passport-sized prints
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-indigo-600 dark:text-indigo-400">
            cloud_upload
          </span>

          <div>
            <button
              onClick={handleButtonClick}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Choose Photo
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              or drag and drop your image here
            </p>
          </div>

          <p className="text-sm text-gray-400 dark:text-gray-500">
            Supported formats: JPG, PNG, GIF, WEBP
          </p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">
            info
          </span>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use a photo with good lighting and clear facial features</li>
              <li>Ensure the background is plain and neutral</li>
              <li>Photo should show your face clearly from the front</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
