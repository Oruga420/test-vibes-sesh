import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import ImageEditor from './components/ImageEditor';
import ImageAnalyzer from './components/ImageAnalyzer';
import ImageCreator from './components/ImageCreator';
import { MessageSquare, Image, ScanSearch, Sparkles } from 'lucide-react';
import CursorGlow from './components/common/CursorGlow';

type View = 'chat' | 'edit' | 'analyze' | 'create';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('chat');

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <Chatbot />;
      case 'edit':
        return <ImageEditor />;
      case 'analyze':
        return <ImageAnalyzer />;
      case 'create':
        return <ImageCreator />;
      default:
        return <Chatbot />;
    }
  };

  const NavButton = ({ view, label, icon: Icon }: { view: View; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex-1 sm:flex-initial sm:w-40 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-cyan-500 ${
        activeView === view
          ? 'bg-slate-800 text-white border-b-2 border-cyan-500'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <CursorGlow />
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <header className="text-center my-6">
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Gemini Creative Suite
            </h1>
            <p className="mt-2 text-slate-400">Your AI-powered assistant for chat, image editing, and analysis.</p>
          </header>

          <main className="flex-grow flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <nav className="flex flex-col sm:flex-row border-b border-slate-700">
              <NavButton view="chat" label="Chat" icon={MessageSquare} />
              <NavButton view="create" label="Image Creator" icon={Sparkles} />
              <NavButton view="edit" label="Image Editor" icon={Image} />
              <NavButton view="analyze" label="Image Analyzer" icon={ScanSearch} />
            </nav>
            <div className="flex-grow p-6 overflow-y-auto">
              {renderView()}
            </div>
          </main>
          
          <footer className="text-center py-4 text-slate-500 text-sm">
              Powered by Google Gemini
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;