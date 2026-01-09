
import React from 'react';
import { Printer } from '../types';

interface PrinterSelectorProps {
  printers: Printer[];
  selectedPrinter: string;
  onSelect: (name: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrinterSelector: React.FC<PrinterSelectorProps> = ({ 
  printers, 
  selectedPrinter, 
  onSelect, 
  onRefresh,
  isLoading
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700">Printer Connection</h3>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Scanning...' : 'Refresh List'}
        </button>
      </div>
      
      {printers.length === 0 ? (
        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
          No DYMO printers detected. Make sure the DYMO Connect software is running.
        </div>
      ) : (
        <select
          value={selectedPrinter}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        >
          <option value="">Select a printer...</option>
          {printers.map((p) => (
            <option key={p.name} value={p.name}>
              {p.modelName} ({p.name})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
