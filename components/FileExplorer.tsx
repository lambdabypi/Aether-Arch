
import React, { useState } from 'react';
import { FileContent } from '../types';
import { FileCode, FileJson, FileText, ChevronRight, Search } from 'lucide-react';

interface FileExplorerProps {
  files: FileContent[];
  onFileSelect?: (file: FileContent) => void;
  selectedFile?: FileContent | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, selectedFile: externallySelected }) => {
  const [internalSelectedFile, setInternalSelectedFile] = useState<FileContent | null>(files[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedFile = externallySelected !== undefined ? externallySelected : internalSelectedFile;
  const setSelectedFile = (file: FileContent) => {
    if (onFileSelect) onFileSelect(file);
    setInternalSelectedFile(file);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex overflow-hidden bg-gray-950/20">
      <div className="w-72 border-r border-white/5 bg-gray-950/40 backdrop-blur-md flex flex-col">
        <div className="p-5 border-b border-white/5">
           <div className="relative group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Find in codebase..." 
                className="w-full bg-gray-900/50 border border-gray-800/80 rounded-xl py-2.5 pl-10 pr-4 text-[11px] focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-700"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Project Files</p>
          {filteredFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(file)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-1 group ${
                selectedFile?.name === file.name 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'hover:bg-gray-900/50 text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${selectedFile?.name === file.name ? 'bg-emerald-500/20' : 'bg-gray-900 group-hover:bg-gray-800'}`}>
                <FileIcon type={file.name.split('.').pop() || ''} className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold truncate tracking-tight">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="h-10 border-b border-white/5 flex items-center px-6 bg-gray-900/10">
               <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mr-2">Context</span>
               <ChevronRight className="w-3 h-3 text-gray-800 mr-2" />
               <span className="font-mono text-[10px] text-emerald-500 font-bold tracking-tight">{selectedFile.name}</span>
            </div>
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto">
                <pre className="font-mono text-xs leading-relaxed text-gray-400/80 whitespace-pre-wrap">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-700 space-y-4">
             <div className="p-6 bg-gray-900/20 rounded-full border border-white/5">
                <FileCode className="w-12 h-12 opacity-20" />
             </div>
             <p className="text-sm italic font-medium">Select a system node to begin inspection</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FileIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  if (['json', 'yaml', 'yml'].includes(type)) return <FileJson className={className} />;
  if (['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs'].includes(type)) return <FileCode className={className} />;
  return <FileText className={className} />;
};

export default FileExplorer;
