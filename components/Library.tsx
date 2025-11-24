import React, { useState, useEffect, useRef } from 'react';
import { GameType, LibraryFile, Vocabulary } from '../types';
import { libraryService } from '../services/libraryService';
import { ArrowLeft, Upload, Trash2, FileText, Image as ImageIcon, Loader, Plus, Save, FileType, BookOpen } from 'lucide-react';

interface LibraryProps {
  onBack: () => void;
}

export const Library: React.FC<LibraryProps> = ({ onBack }) => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Edit mode for adding new vocab from extraction
  const [editingVocab, setEditingVocab] = useState<Partial<Vocabulary> | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setFiles(libraryService.getFiles());
    setVocabList(libraryService.getUserVocabulary());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    for (const file of fileList) {
      const newFileObj = await libraryService.addFile(file);
      setFiles(prev => [...prev, newFileObj]);
      
      // Auto process
      setProcessingId(newFileObj.id);
      const text = await libraryService.processFile(newFileObj, file);
      setProcessingId(null);
      setFiles(libraryService.getFiles()); // Refresh status

      // Show extracted suggestions if it's the first file processed in this batch
      if (text) {
        setExtractedText(text);
        const suggestions = libraryService.extractSuggestions(text);
        if (suggestions.length > 0) {
           setEditingVocab(suggestions[0]); // Start editing first suggestion
        }
      }
    }
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("確定要刪除此文件嗎？")) {
      libraryService.deleteFile(id);
      refreshData();
    }
  };

  const handleDeleteVocab = (id: string) => {
    libraryService.removeUserVocabulary(id);
    refreshData();
  };

  const saveVocab = () => {
    if (editingVocab && editingVocab.char && editingVocab.pinyin) {
      libraryService.addUserVocabulary(editingVocab as Vocabulary);
      refreshData();
      setEditingVocab(null);
    } else {
      alert("請填寫漢字和拼音");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <ArrowLeft size={24} color="#666" />
        </button>
        <div className="flex items-center gap-2 bg-indigo-100 px-6 py-2 rounded-full border border-indigo-300">
           <BookOpen size={24} className="text-indigo-600" />
           <span className="text-2xl font-bold text-indigo-700">字詞資料庫</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full flex-1">
        
        {/* LEFT: File Upload Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Drop Zone */}
          <div 
            className={`
              border-4 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden
              ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-105' : 'border-gray-300 bg-white hover:border-indigo-300'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input type="file" id="fileInput" className="hidden" multiple accept="image/*,.txt,.pdf,.doc,.docx" onChange={handleFileInput} />
            <div className="bg-indigo-100 p-6 rounded-full mb-4">
              <Upload size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">上傳工作紙或文件</h3>
            <p className="text-gray-500">拖放 PDF, Word, TXT 或 圖片 (OCR) 到這裡</p>
            <p className="text-xs text-gray-400 mt-2">系統會自動識別文字並提取詞彙</p>
          </div>

          {/* Extracted Text Preview (Last processed) */}
          {extractedText && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
               <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <FileType size={18} /> 最近識別內容
               </h3>
               <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 max-h-40 overflow-y-auto">
                 {extractedText}
               </div>
            </div>
          )}

          {/* Files List */}
          <div className="bg-white rounded-3xl shadow-lg p-6 min-h-[300px]">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
               <FileText size={24} /> 你的文件 ({files.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map(file => (
                <div key={file.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow relative group">
                   {file.type === 'image' ? (
                     file.previewUrl ? <img src={file.previewUrl} className="w-16 h-16 object-cover rounded bg-gray-100" /> : <ImageIcon size={40} className="text-gray-400" />
                   ) : (
                     <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <FileText size={30} className="text-gray-500" />
                     </div>
                   )}
                   
                   <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-700 truncate">{file.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">{file.type}</span>
                         {file.status === 'processing' && <span className="text-xs text-indigo-500 flex items-center gap-1"><Loader size={10} className="animate-spin" /> 處理中...</span>}
                         {file.status === 'ready' && <span className="text-xs text-green-500">已完成</span>}
                         {file.status === 'error' && <span className="text-xs text-red-500">識別失敗</span>}
                      </div>
                   </div>

                   <button 
                     onClick={(e) => handleDeleteFile(file.id, e)}
                     className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400">
                   暫無文件
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Vocabulary Editor */}
        <div className="flex flex-col gap-6">
          {/* Editor Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-t-8 border-indigo-400">
             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Plus size={24} className="text-indigo-500" /> 
               {editingVocab ? '編輯/確認詞彙' : '新增詞彙'}
             </h3>

             <div className="flex flex-col gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">漢字</label>
                   <input 
                     type="text" 
                     value={editingVocab?.char || ''} 
                     onChange={e => setEditingVocab(prev => ({ ...prev, char: e.target.value }))}
                     className="w-full text-2xl font-bold p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 outline-none"
                     placeholder="例如: 你好"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">拼音 (帶聲調)</label>
                   <input 
                     type="text" 
                     value={editingVocab?.pinyin || ''} 
                     onChange={e => setEditingVocab(prev => ({ ...prev, pinyin: e.target.value }))}
                     className="w-full text-xl p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 outline-none"
                     placeholder="例如: nǐ hǎo"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1">聲調 (主聲調 1-5)</label>
                   <div className="flex gap-2">
                      {[1,2,3,4,5].map(t => (
                        <button
                          key={t}
                          onClick={() => setEditingVocab(prev => ({ ...prev, tone: t }))}
                          className={`
                            w-10 h-10 rounded-full font-bold transition-all
                            ${editingVocab?.tone === t ? 'bg-indigo-500 text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                          `}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">英文意思 (可選)</label>
                    <input 
                      type="text" 
                      value={editingVocab?.meaning || ''} 
                      onChange={e => setEditingVocab(prev => ({ ...prev, meaning: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 outline-none"
                      placeholder="Meaning"
                    />
                </div>

                <button 
                  onClick={saveVocab}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-2"
                >
                  <Save size={20} /> 保存到詞庫
                </button>
                {editingVocab && (
                   <button onClick={() => setEditingVocab(null)} className="text-gray-400 text-sm hover:underline text-center">取消</button>
                )}
             </div>
          </div>

          {/* Current List */}
          <div className="bg-white rounded-3xl shadow-lg p-6 flex-1 max-h-[500px] overflow-y-auto">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-700">我的詞庫 ({vocabList.length})</h3>
             </div>
             
             <div className="space-y-2">
                {vocabList.map(v => (
                  <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 group">
                     <div>
                        <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {v.char} 
                          <span className="text-sm font-normal text-gray-500 bg-white px-2 rounded border border-gray-200">{v.pinyin}</span>
                        </div>
                        <div className="text-xs text-gray-400">{v.meaning}</div>
                     </div>
                     <button onClick={() => handleDeleteVocab(v.id)} className="text-gray-300 hover:text-red-500">
                        <Trash2 size={16} />
                     </button>
                  </div>
                ))}
                {vocabList.length === 0 && (
                   <p className="text-gray-400 text-center text-sm py-4">還沒有添加詞彙。上傳文件來開始吧！</p>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};