
import React from 'react';

interface InputBaseProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
}

export const InputOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required, type = "text", min, max }) => (
  <input
    type={type}
    value={value}
    onChange={onChange as any}
    placeholder={placeholder}
    min={min}
    max={max}
    className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#b000ff] glow-purple transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    required={required}
  />
);

export const TextAreaOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required }) => (
  <textarea
    value={value}
    onChange={onChange as any}
    placeholder={placeholder}
    rows={4}
    className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#b000ff] glow-purple transition-all duration-300 resize-none"
    required={required}
  />
);
