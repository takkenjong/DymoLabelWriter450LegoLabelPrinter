
import React, { useState, useEffect } from 'react';
import { dymoService, DebugLog } from './services/dymoService';
import { getSmartLabelSuggestions } from './services/geminiService';
import { Printer, LabelTemplate, DymoServiceStatus, GeminiSuggestion, LabelData } from './types';
import { TEMPLATES } from './constants';
import { PrinterSelector } from './components/PrinterSelector';

const App: React.FC = () => {
  const [status, setStatus] = useState<DymoServiceStatus>(DymoServiceStatus.UNINITIALIZED);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  
  const [editableTemplates, setEditableTemplates] = useState<LabelTemplate[]>(TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  
  const selectedTemplate = editableTemplates.find(t => t.id === selectedTemplateId) || editableTemplates[0];

  const [labelData, setLabelData] = useState<LabelData>({
    id: '3005',
    name: 'Brick 1 x 1',
    description: 'Lego Part',
    urlBA: 'https://brickarchitect.com/parts/3005',
    urlBL: 'https://www.bricklink.com/v2/catalog/catalogitem.page?P=3005',
    imgSrc: 'https://brickarchitect.com/files/parts-veryhighcontrast/3005.png',
    text: '3005\nBrick 1 x 1'
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeminiSuggestion[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setLogs([...dymoService.logs]);
    const unsubscribe = dymoService.subscribeToLogs((log) => {
      setLogs(prev => [log, ...prev].slice(0, 50));
    });
    return unsubscribe;
  }, []);

  const initService = async () => {
    try {
      setStatus(DymoServiceStatus.CHECKING);
      const res = await dymoService.checkService();
      setStatus(res);
      if (res === DymoServiceStatus.READY) {
        await refreshPrinters();
      }
    } catch (err) {
      console.error("Service Init Failed:", err);
      setStatus(DymoServiceStatus.ERROR);
    }
  };

  useEffect(() => {
    initService();
  }, []);

  const refreshPrinters = async () => {
    try {
      const list = await dymoService.getPrinters();
      setPrinters(list);
      if (list.length > 0) {
        const found = list.find(p => p.name === selectedPrinter);
        if (!selectedPrinter || !found) {
          setSelectedPrinter(list[0].name);
        }
      }
    } catch (err) {
      console.error("Refresh Printers Failed:", err);
    }
  };

  useEffect(() => {
    const updatePreview = async () => {
      if ((!labelData.id?.trim() && !labelData.description?.trim()) || status !== DymoServiceStatus.READY) {
        setPreviewUrl('');
        return;
      }
      try {
        const url = await dymoService.renderLabel(selectedTemplate, labelData, selectedPrinter);
        setPreviewUrl(url || '');
      } catch (e) {
        console.error("Preview Update Error:", e);
      }
    };
    const timer = setTimeout(updatePreview, 800);
    return () => clearTimeout(timer);
  }, [labelData, selectedTemplate, status, selectedPrinter]);

  const loadSamplePart = () => {
    setSelectedTemplateId('lego-part-adv');
    setLabelData({
      id: '3005',
      name: 'Brick 1 x 1',
      description: 'Lego Part',
      urlBA: 'https://brickarchitect.com/parts/3005',
      urlBL: 'https://www.bricklink.com/v2/catalog/catalogitem.page?P=3005',
      imgSrc: 'https://brickarchitect.com/files/parts-veryhighcontrast/3005.png',
      text: '3005\nBrick 1 x 1'
    });
  };

  const loadSampleCategory = () => {
    setSelectedTemplateId('lego-category-adv');
    setLabelData({
      id: 'Basic',
      name: 'Bricks, Plates, and Tiles',
      description: 'Classic LEGO Bricks, Plates, and Tiles can be stacked vertically by attaching the round studs with a small amount of pressure.',
      urlBA: 'https://brickarchitect.com/parts/category-1',
      urlBL: '',
      imgSrc: '',
      text: 'Basic\nBricks, Plates, and Tiles'
    });
  };

  const loadSampleBrickLink = () => {
    setSelectedTemplateId('bricklink-part-adv');
    setLabelData({
      id: '3001',
      name: 'Brick 2 x 4',
      description: 'Lego Part',
      urlBA: 'https://brickarchitect.com/parts/3001',
      urlBL: 'https://www.bricklink.com/v2/catalog/catalogitem.page?P=3001',
      imgSrc: 'https://brickarchitect.com/files/parts-veryhighcontrast/3001.png',
      text: '3001\nBrick 2 x 4'
    });
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setSuggestions([]);
    try {
      const results = await getSmartLabelSuggestions(aiPrompt);
      if (results && Array.isArray(results)) {
        setSuggestions(results);
      }
    } catch (err) {
      console.error("AI Assist Failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!selectedPrinter) return alert("Select a printer.");
    setIsPrinting(true);
    try {
      const success = await dymoService.printLabel(selectedPrinter, selectedTemplate, labelData);
      if (success) alert("Label printed!");
      else alert("Print failed. Check logs.");
    } catch (err) {
      console.error("Print Handler Error:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleXmlChange = (newXml: string) => {
    setEditableTemplates(prev => prev.map(t => 
      t.id === selectedTemplateId ? { ...t, xml: newXml } : t
    ));
  };

  const handleResetXml = () => {
    const original = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (original) {
      handleXmlChange(original.xml);
    }
  };

  return (
    <div className="w-[900px] mx-auto p-4 animate-fade-in bg-slate-50 min-h-screen pb-12">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-xl shadow-sm">DYMO</span>
            Studio
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">Lego Edition • Professional Labeling</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold uppercase transition-colors"
          >
            {showLogs ? 'Hide Logs' : 'Debug'}
          </button>
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 shadow-sm border ${
            status === DymoServiceStatus.READY ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === DymoServiceStatus.READY ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {status === DymoServiceStatus.READY ? 'Ready' : 'Offline'}
          </div>
        </div>
      </header>

      {showLogs && (
        <div className="mb-4 bg-slate-900 text-slate-400 p-3 rounded-lg font-mono text-[9px] h-40 overflow-y-auto shadow-inner border border-white/10">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-slate-600">[{log.timestamp}]</span>{' '}
              <span className={`${log.level === 'error' ? 'text-red-400' : 'text-emerald-400'} font-bold`}>{log.level}</span>: {log.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-4">
          <PrinterSelector 
            printers={printers}
            selectedPrinter={selectedPrinter}
            onSelect={setSelectedPrinter}
            onRefresh={refreshPrinters}
            isLoading={status === DymoServiceStatus.CHECKING}
          />

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase mb-3 flex items-center justify-between">
              Templates
              <span className="text-[8px] bg-slate-100 px-1 rounded">S0722540 compatible</span>
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {editableTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplateId === t.id ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-[11px] text-slate-900">{t.name}</div>
                  <div className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Load Sample Data</div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={loadSamplePart} className="text-[10px] bg-slate-100 hover:bg-slate-200 p-2 rounded font-bold text-slate-600 transition-colors">Part 3005</button>
                <button onClick={loadSampleCategory} className="text-[10px] bg-slate-100 hover:bg-slate-200 p-2 rounded font-bold text-slate-600 transition-colors">Category 1</button>
                <button onClick={loadSampleBrickLink} className="text-[10px] bg-slate-100 hover:bg-slate-200 p-2 rounded font-bold text-slate-600 transition-colors">BrickLink</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-[10px] text-blue-400 uppercase mb-2 flex items-center gap-2">
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Gemini AI Assist
            </h3>
            <textarea
              placeholder="Describe what you want to label..."
              className="w-full h-16 p-2 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none placeholder:text-slate-600"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              onClick={handleAiAssist}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="w-full mt-2 py-2 bg-emerald-600 text-white font-bold rounded-lg text-[11px] hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isAiLoading ? 'AI Thinking...' : 'Analyze & Format'}
            </button>
          </div>
        </div>

        <div className="col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Label Main Text / ID</label>
                <input
                  type="text"
                  value={labelData.id}
                  placeholder="3005..."
                  onChange={(e) => setLabelData({ ...labelData, id: e.target.value, text: `${e.target.value}\n${labelData.name}` })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Part/Category Name</label>
                <input
                  type="text"
                  value={labelData.name}
                  placeholder="Brick 1 x 1..."
                  onChange={(e) => setLabelData({ ...labelData, name: e.target.value, text: `${labelData.id}\n${e.target.value}` })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Description / Details</label>
                <textarea
                  value={labelData.description}
                  placeholder="Full description used on category labels..."
                  onChange={(e) => setLabelData({ ...labelData, description: e.target.value })}
                  className="w-full h-20 p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Image URL (Parts only)</label>
                <input 
                  type="text" 
                  value={labelData.imgSrc} 
                  onChange={(e) => setLabelData({ ...labelData, imgSrc: e.target.value })} 
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">BrickArchitect URL</label>
                <input 
                  type="text" 
                  value={labelData.urlBA} 
                  onChange={(e) => setLabelData({ ...labelData, urlBA: e.target.value })} 
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  placeholder="https://brickarchitect.com/..."
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md border border-slate-100 transform transition-transform hover:scale-105 duration-300">
                {previewUrl ? (
                  <img src={previewUrl} alt="Live Preview" className="max-w-[320px] h-auto rounded" />
                ) : (
                  <div className="h-24 w-48 flex items-center justify-center text-[11px] italic text-slate-300 border border-slate-100 rounded bg-white">
                    Live Preview Processing...
                  </div>
                )}
              </div>
              
              <div className="w-full flex gap-3">
                <button
                  onClick={handlePrint}
                  disabled={isPrinting || !selectedPrinter || (status !== DymoServiceStatus.READY)}
                  className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-40 text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isPrinting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Printing...
                    </span>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print Label Now
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowEditor(!showEditor)}
                className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 hover:text-slate-600 transition-colors"
              >
                <svg className={`w-3 h-3 transition-transform ${showEditor ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                Advanced Template XML Editor
              </button>
              
              {showEditor && (
                <div className="mt-3 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400 font-mono italic">Edit raw DYMO XML for "{selectedTemplate.name}"</span>
                    <button 
                      onClick={handleResetXml}
                      className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Reset to Default
                    </button>
                  </div>
                  <textarea
                    value={selectedTemplate.xml}
                    onChange={(e) => handleXmlChange(e.target.value)}
                    spellCheck={false}
                    className="w-full h-80 p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
