
import React from 'react';

interface QuizOption {
  label: string;
  value: string;
}

interface QuizFieldProps {
  question: string;
  options: QuizOption[];
  selectedValue: string;
  correctValue: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const QuizField: React.FC<QuizFieldProps> = ({ question, options, selectedValue, correctValue, onChange, required }) => {
  const isAnswered = selectedValue !== '';
  const isCorrect = selectedValue === correctValue;

  return (
    <div className={`bg-[#0a0a0a] border rounded-2xl p-6 mb-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
      !isAnswered ? 'border-[#1f1f1f]' : isCorrect ? 'border-green-500/30' : 'border-red-500/30'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <h3 className="text-white text-base md:text-lg font-bold leading-tight tracking-tight">
          {question} {required && <span className="text-[#b000ff]">*</span>}
        </h3>
        {isAnswered && (
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
            isCorrect 
              ? 'text-green-400 border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
              : 'text-red-400 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,44,44,0.2)]'
          }`}>
            {isCorrect ? '✅ ВЕРНО' : '❌ ОШИБКА'}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isCorrectOption = option.value === correctValue;
          
          let borderColor = 'border-[#1f1f1f]';
          let bgColor = 'bg-transparent';
          
          if (isSelected) {
            borderColor = isCorrect ? 'border-green-500/50' : 'border-red-500/50';
            bgColor = isCorrect ? 'bg-green-500/5' : 'bg-red-500/5';
          }

          return (
            <label 
              key={option.value} 
              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${borderColor} ${bgColor} hover:border-[#333]`}
              onClick={() => onChange(option.value)}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={question}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => {}}
                  className={`peer appearance-none w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                    isSelected 
                      ? (isCorrect ? 'border-green-500' : 'border-red-500') 
                      : 'border-[#333]'
                  }`}
                />
                <div className={`absolute w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 ${
                  isCorrect ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                }`}></div>
              </div>
              <span className={`ml-3 text-sm transition-colors ${
                isSelected ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
