
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between mb-2 px-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Прогресс заполнения</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#b000ff] font-bold">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden border border-[#1f1f1f]">
        <div 
          className="h-full bg-gradient-to-r from-[#6200ea] to-[#b000ff] transition-all duration-500 ease-out shadow-[0_0_10px_#6200ea]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
