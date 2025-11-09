'use client';

import { useState } from 'react';
import UploadStep from './components/UploadStep';
import CropStep from './components/CropStep';
import GenerateStep from './components/GenerateStep';

export default function Home() {
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setStep(2);
  };

  const handleImageCrop = (croppedImageDataUrl: string) => {
    setCroppedImage(croppedImageDataUrl);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setUploadedImage(null);
      setStep(1);
    } else if (step === 3) {
      setCroppedImage(null);
      setStep(2);
    }
  };

  const handleStartOver = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                photo_camera
              </span>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Passport Photo Generator
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="hidden sm:inline text-sm font-medium">Upload</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="hidden sm:inline text-sm font-medium">Crop</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="hidden sm:inline text-sm font-medium">Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 1 && <UploadStep onUpload={handleImageUpload} />}
        {step === 2 && uploadedImage && (
          <CropStep
            image={uploadedImage}
            onCrop={handleImageCrop}
            onBack={handleBack}
          />
        )}
        {step === 3 && croppedImage && (
          <GenerateStep
            croppedImage={croppedImage}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}
