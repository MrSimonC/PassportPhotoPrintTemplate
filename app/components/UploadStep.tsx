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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Free Passport Photo Print Template
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          Transform one photo into a ready-to-print 6" × 4" sheet with six passport-sized photos.
          Perfect for passport applications, ID cards, or any document that needs standard photo prints.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-semibold">100% Free</span>
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">privacy_tip</span>
            <span className="font-semibold">Completely Private</span>
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">delete_forever</span>
            <span className="font-semibold">Nothing Saved</span>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          How It Works
        </h3>
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div className="order-2 md:order-1">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="/how-it-works-1-upload.jpg"
                alt="Upload your photo - example showing file upload interface"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Upload Your Photo</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Start by uploading any portrait photo from your device. Works with all common image formats.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Crop to Passport Size</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Use our easy cropping tool to frame your photo to standard passport photo dimensions.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="/how-it-works-2-crop.jpg"
                alt="Crop your photo - example showing cropping interface with passport photo dimensions"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="/how-it-works-3-output.jpg"
                alt="Download and print - example showing 6 passport photos arranged in a 3x2 grid on 6x4 inch sheet"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Download & Print</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Get your print-ready 6" × 4" image with six copies of your photo.
                  Print at home or take to your local photo printing shop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Get Started
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your photo to begin creating your print-ready template
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

      {/* Privacy & Free Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Your Privacy Matters
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">
                lock
              </span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">100% Private</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              All processing happens in your browser. Your photos never leave your device.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
                block
              </span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">No Logging</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We don&apos;t track, log, or store any of your photos or personal information.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">
                savings
              </span>
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">Completely Free</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No hidden fees, no subscriptions, no watermarks. Free forever.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          Created with care by{' '}
          <span className="font-semibold text-gray-800 dark:text-white">Simon</span>{' '}
          in the UK
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/simon-crouch/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/mrsimonc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
