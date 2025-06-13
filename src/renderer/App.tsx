import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recorder } from './components/recorder/Recorder';
import { Editor } from './components/editor/Editor';
import { TitleBar } from './components/ui/TitleBar';
import { Sidebar } from './components/ui/Sidebar';

type AppView = 'recorder' | 'editor';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('recorder');

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    duration: 0.3
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Custom Title Bar */}
      <TitleBar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'recorder' && (
              <motion.div
                key="recorder"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="h-full"
              >
                <Recorder onSwitchToEditor={() => setCurrentView('editor')} />
              </motion.div>
            )}
            
            {currentView === 'editor' && (
              <motion.div
                key="editor"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="h-full"
              >
                <Editor onSwitchToRecorder={() => setCurrentView('recorder')} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
