import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InputField from './components/InputField';
import DataTable from './components/DataTable';

function App() {
  const [activeComponent, setActiveComponent] = useState<'input' | 'table'>('input');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const components = [
    { id: 'input', name: 'Component 1: Input Field', description: 'Advanced form input with validation' },
    { id: 'table', name: 'Component 2: Data Table', description: 'Professional data table with advanced features' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">RC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  React Components
                </h1>
                <p className="text-slate-500 text-sm">Professional UI Component Library</p>
              </div>
            </div>

            {/* Component Selector */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="font-medium text-slate-700">
                  {components.find(c => c.id === activeComponent)?.name}
                </span>
                {isMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-10 animate-fade-in-up">
                  {components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => {
                        setActiveComponent(component.id as 'input' | 'table');
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                        activeComponent === component.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="font-medium text-slate-800">{component.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{component.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/60 mb-4">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              activeComponent === 'input' ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium text-slate-600">
              {activeComponent === 'input' ? 'Input Component Active' : 'Table Component Active'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {components.find(c => c.id === activeComponent)?.name}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {components.find(c => c.id === activeComponent)?.description}
          </p>
        </div>

        {/* Component Display */}
        <div className="transition-all duration-500 ease-in-out">
          {activeComponent === 'input' && (
            <div className="animate-fade-in-up">
              <InputField />
            </div>
          )}
          {activeComponent === 'table' && (
            <div className="animate-fade-in-up">
              <DataTable />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Professional UI Components for Modern Applications
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;