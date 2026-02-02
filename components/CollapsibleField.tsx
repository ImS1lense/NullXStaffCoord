
import React, { useState } from 'react';

interface CollapsibleFieldProps {
  label: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
  required?: boolean;
  isFilled?: boolean;
}

export const CollapsibleField: React.FC<CollapsibleFieldProps> = ({ 
  label, 
  children, 
  isOpenDefault = false, 
  required = false,
  isFilled = false 
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className={`mb-4 border border-[#1f1f1f] rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#b000ff]/50 bg-[#0f0f0f]' : 'hover:border-[#333]'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left group transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className={`text-sm font-medium uppercase tracking-widest transition-colors ${isOpen ? 'text-[#b000ff]' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {label} {required && <span className="text-[#6200ea]">*</span>}
          </span>
          {isFilled && !isOpen && (
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          )}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#b000ff]' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-[#1f1f1f] pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};
