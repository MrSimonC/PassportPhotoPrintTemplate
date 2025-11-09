'use client';

import { useState, useEffect } from 'react';

interface GenerateStepProps {
  croppedImage: string;
  onBack: () => void;
  onStartOver: () => void;
}

export default function GenerateStep({ croppedImage, onBack, onStartOver }: GenerateStepProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePrintLayout();
  }, []);

  const generatePrintLayout = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          croppedImage: croppedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate print layout');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating print layout:', error);
      setError('Failed to generate print layout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `passport-photos-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Your UK Passport Photo Print
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          6 UK passport photos (35×45mm) on a 6×4 inch print with white borders
        </p>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="material-symbols-outlined text-6xl text-indigo-600 dark:text-indigo-400 animate-spin mb-4">
            progress_activity
          </span>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generating your print layout...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 flex-shrink-0">
              error
            </span>
            <div>
              <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State with Preview */}
      {generatedImage && !isGenerating && (
        <>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <img
              src={generatedImage}
              alt="Generated passport photo print"
              className="w-full h-auto rounded shadow-lg"
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 flex-shrink-0">
                check_circle
              </span>
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-semibold mb-1">Ready to print!</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Image size: 6×4 inches (1800×1200 pixels at 300 DPI)</li>
                  <li>Contains 6 UK passport photos (35×45mm each) arranged in a 3×2 grid</li>
                  <li>Each photo has white borders to guide cutting</li>
                  <li>Print on photo paper for best results</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">
                print
              </span>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Printing tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use glossy or matte photo paper for best quality</li>
                  <li>Select 6×4 inch size in your printer settings</li>
                  <li>Ensure borderless printing is enabled</li>
                  <li>Cut along the white borders to separate each 35×45mm photo</li>
                  <li>White borders help guide precise cutting</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>
          Back
        </button>

        {generatedImage && (
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">
              download
            </span>
            Download Print
          </button>
        )}

        <button
          onClick={onStartOver}
          disabled={isGenerating}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            refresh
          </span>
          Start Over
        </button>
      </div>

      {/* Retry Button on Error */}
      {error && (
        <button
          onClick={generatePrintLayout}
          className="w-full mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            refresh
          </span>
          Try Again
        </button>
      )}
    </div>
  );
}
