export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-indigo-600 dark:text-indigo-400">
            waving_hand
          </span>
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white">
            Hello World!
          </h1>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Welcome to the Passport Photo Print Template app built with Next.js, Tailwind CSS, and Material Symbols
        </p>

        <div className="flex gap-6 mt-4">
          <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
              check_circle
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Next.js</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">
              palette
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Tailwind CSS</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <span className="material-symbols-outlined text-4xl text-purple-600 dark:text-purple-400">
              category
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Material Symbols</span>
          </div>
        </div>
      </main>
    </div>
  );
}
