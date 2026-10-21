import { useState, useRef, useEffect } from 'react';
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
            <span className="label-medium text-foreground">{label}</span>
          </label>
        )}
        {helpText && (
          <p className="body-medium text-muted-foreground mb-2">{helpText}</p>
        )}
        
        <button
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center h-14 px-4 border-2 rounded-lg bg-background transition-colors border-border hover:border-foreground text-left"
        >
          <span className={`flex-1 body-large ${hours === 0 && minutes === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
            {formatTime(hours, minutes) || 'Velg tid'}
          </span>
          <Clock className="w-5 h-5 text-foreground ml-2" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="fixed z-[9999] bg-surface-container-low rounded-2xl shadow-2xl border border-border w-[360px]"
          style={{
            left: containerRef.current?.getBoundingClientRect().left || 0,
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="title-medium text-foreground">Velg tid</h3>
            </div>

            {/* Time inputs */}
            <div className="flex gap-4 mb-6">
              {/* Hours */}
              <div className="flex-1">
                <label className="block mb-2">
                  <span className="label-medium text-foreground">Timer</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={tempHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTempHours(Math.max(0, Math.min(23, val)));
                  }}
                  className="w-full h-14 px-4 rounded-lg border-2 border-border hover:border-foreground focus:border-primary bg-background text-foreground body-large focus:outline-none transition-colors text-center"
                />
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <label className="block mb-2">
                  <span className="label-medium text-foreground">Minutter</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={tempMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTempMinutes(Math.max(0, Math.min(59, val)));
                  }}
                  className="w-full h-14 px-4 rounded-lg border-2 border-border hover:border-foreground focus:border-primary bg-background text-foreground body-large focus:outline-none transition-colors text-center"
                />
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => { setTempHours(1); setTempMinutes(0); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                1t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(2); setTempMinutes(0); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                2t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(3); setTempMinutes(0); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                3t
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(0); setTempMinutes(30); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                30m
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(1); setTempMinutes(30); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                1t 30m
              </button>
              <button
                type="button"
                onClick={() => { setTempHours(2); setTempMinutes(30); }}
                className="h-10 px-3 rounded-lg border border-border hover:bg-muted transition-colors label-medium text-foreground"
              >
                2t 30m
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleCancel}
                className="text-primary hover:bg-muted px-4 py-2 rounded-lg transition-colors label-large"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleOK}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors label-large"
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
