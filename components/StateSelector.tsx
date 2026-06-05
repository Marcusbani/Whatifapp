'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

interface StateSelectorProps {
  value: string;
  onChange: (state: string) => void;
  placeholder?: string;
}

export default function StateSelector({ value, onChange, placeholder = 'Select State' }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="wf-input flex items-center justify-between text-left"
      >
        <span className={value ? 'text-wf-ivory' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-wf-gray-light border border-wf-gray rounded-xl shadow-xl">
            <div
              className="px-4 py-2.5 text-gray-400 hover:bg-wf-gray cursor-pointer text-sm"
              onClick={() => { onChange(''); setIsOpen(false); }}
            >
              {placeholder}
            </div>
            {US_STATES.map((state) => (
              <div
                key={state}
                className={`px-4 py-2.5 cursor-pointer text-sm hover:bg-wf-gray transition-colors ${
                  value === state ? 'text-wf-gold bg-wf-gray' : 'text-wf-ivory'
                }`}
                onClick={() => { onChange(state); setIsOpen(false); }}
              >
                {state}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
