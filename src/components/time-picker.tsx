import { useState, useRef, useEffect, useId } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  label?: string;
  hours: number;
  minutes: number;
  onChange: (hours: number, minutes: number) => void;
  helpText?: string;
  className?: string;
}

export function TimePicker({ 
  label = 'Tid', 
  hours,
  minutes,
  onChange,
  helpText,
  className = ''
}: TimePickerProps) {
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(hours);
  const [tempMinutes, setTempMinutes] = useState(minutes);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setTempHours(hours);
    setTempMinutes(minutes);
    setIsOpen(true);
  };

  const handleOK = () => {
    onChange(tempHours, tempMinutes);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempHours(hours);
    setTempMinutes(minutes);
    setIsOpen(false);
  };

  const formatTime = (h: number, m: number) => {
    if (h === 0 && m === 0) return '';
    return `${h} timer, ${m} minutter`;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input field */}
      <div className="relative">
        {label && (
          <label className="block mb-1.5">
            <span className="label-medium text-on-surface">{label}</span>
          </label>
        )}
        {helpText && (
          <p className="body-medium text-on-surface-variant mb-2">{helpText}</p>
        )}
        
        <button
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center h-14 px-4 border rounded-[var(--radius-sm)] bg-transparent transition-colors border-outline hover:border-on-surface text-left"
        >
          <span className={`flex-1 body-large ${hours === 0 && minutes === 0 ? 'text-on-surface-variant' : 'text-on-surface'}`}>
            {formatTime(hours, minutes) || 'Velg tid'}
          </span>
          <Clock className="w-5 h-5 text-on-surface ml-2" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="fixed z-[9999] bg-surface-container-high text-on-surface rounded-[var(--radius-fab)] border border-outline-variant w-[360px]"
          style={{
            left: containerRef.current?.getBoundingClientRect().left || 0,
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="title-medium text-on-surface">Velg tid</h3>
            </div>

            {/* Time inputs */}
            <div className="flex gap-4 mb-6">
              {/* Hours */}
              <div className="flex-1">
                <label htmlFor={`${fieldId}-hours-1`} className="block mb-2">
                  <span className="label-medium text-on-surface">Timer</span>
                </label>
                <input
                  id={`${fieldId}-hours-1`}
                  type="number"
                  min="0"
                  max="23"
                  value={tempHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTempHours(Math.max(0, Math.min(23, val)));
                  }}
                  className="w-full h-14 px-4 rounded-[var(--radius-sm)] border border-outline hover:border-on-surface focus:ring-1 focus:ring-inset focus:ring-primary focus:border-primary bg-transparent text-on-surface body-large focus:outline-none transition-colors text-center"
                />
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <label htmlFor={`${fieldId}-minutes-1`} className="block mb-2">
                  <span className="label-medium text-on-surface">Minutter</span>
                </label>
                <input
                  id={`${fieldId}-minutes-1`}
                  type="number"
                  min="0"
                  max="59"
                  value={tempMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTempMinutes(Math.max(0, Math.min(59, val)));
                  }}
                  className="w-full h-14 px-4 rounded-[var(--radius-sm)] border border-outline hover:border-on-surface focus:ring-1 focus:ring-inset focus:ring-primary focus:border-primary bg-transparent text-on-surface body-large focus:outline-none transition-colors text-center"
                />
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => { setTempHours(1); setTempMinutes(0); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                1t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(2); setTempMinutes(0); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                2t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(3); setTempMinutes(0); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                3t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(0); setTempMinutes(30); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                30m
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(1); setTempMinutes(30); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                1t 30m
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(2); setTempMinutes(30); }}
                className="state-layer h-8 px-md rounded-[var(--radius-chip)] border border-outline transition-colors label-large text-on-surface"
              >
                2t 30m
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={handleCancel}
                className="text-primary state-layer px-4 py-2 rounded-[var(--radius-chip)] transition-colors label-large"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleOK}
                className="state-layer bg-primary text-primary-foreground px-6 py-2 rounded-[var(--radius-chip)] transition-colors label-large"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
