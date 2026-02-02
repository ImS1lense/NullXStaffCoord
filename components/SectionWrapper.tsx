
import React from 'react';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children, icon }) => (
  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 mb-8 hover:border-[#333] transition-colors duration-300">
    <div className="flex items-center gap-3 mb-6 border-b border-[#1f1f1f] pb-4">
      {icon && <span className="text-[#b000ff]">{icon}</span>}
      <h2 className="text-xl font-bold uppercase tracking-widest">{title}</h2>
    </div>
    {children}
  </div>
);
