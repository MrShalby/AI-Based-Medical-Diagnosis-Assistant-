import React from 'react';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import MainTabs from './components/MainTabs';
import Footer from './components/Footer';

function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <MainTabs />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  );
}

export default App;