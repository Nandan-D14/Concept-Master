import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Concept Master</h1>
        <p className="text-center text-gray-600 mb-6">Learn Smart. Crack Easy.</p>
        <div className="flex flex-col gap-4">
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login with OTP</button>
          <div className="bg-blue-50 rounded p-4 text-center">
            <span className="font-semibold text-blue-700">Demo:</span> 1 week free access
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Preview</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><span className="text-blue-500">📊</span> Learning Progress</li>
            <li className="flex items-center gap-2"><span className="text-purple-500">📆</span> Upcoming Tests</li>
            <li className="flex items-center gap-2"><span className="text-yellow-500">📌</span> Bookmarked Chapters</li>
            <li className="flex items-center gap-2"><span className="text-green-500">🧠</span> Recent AI Explanations</li>
            <li className="flex items-center gap-2"><span className="text-pink-500">🧪</span> Weekly Challenge</li>
          </ul>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 text-xs">&copy; {new Date().getFullYear()} Concept Master</footer>
    </div>
  );
}

export default App;
