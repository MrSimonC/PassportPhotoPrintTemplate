'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface CropStepProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onBack: () => void;
}

export default function CropStep({ image, onCrop, onBack }: CropStepProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const imageElement = new Image();
      imageElement.src = image;

      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });

      // Set canvas size to the cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped image
      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert to a JPEG blob to keep the payload size manageable for the API route
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          'image/jpeg',
          0.92
        );
      });

      // Convert the blob to a data URL for the rest of the flow
      const croppedImageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read cropped image data'));
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read cropped image blob'));
        };
        reader.readAsDataURL(blob);
      });

      onCrop(croppedImageDataUrl);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Crop Your Photo
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Adjust the crop area to frame your passport photo
        </p>
      </div>

      {/* Cropper Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={35 / 45}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Zoom Control */}
      <div className="mt-6 px-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              zoom_in
            </span>
            Zoom
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">
            info
          </span>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">UK passport photo guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Photo size: 35×45mm (portrait orientation)</li>
              <li>Face should be centered and clearly visible</li>
              <li>Include head and top of shoulders</li>
              <li>Maintain neutral expression with eyes open</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>
          Back
        </button>
        <button
          onClick={createCroppedImage}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">
                check
              </span>
              Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
}
