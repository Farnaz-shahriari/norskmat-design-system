import { useState, useRef, useEffect, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  recommendedDate?: Date | null; // The anbefalt tidsfrist - always shown with outline
  maxDate?: Date | null; // Maximum allowed date - dates after this are disabled
  highlightedDates?: Date[]; // Dates to highlight with primary outline (e.g., dates with revisions)
}

const NORWEGIAN_MONTHS = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const NORWEGIAN_DAYS_SHORT = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];

export function DatePicker({ 
  label = 'Dato', 
  value, 
  onChange, 
  placeholder = 'DD/MM/ÅÅÅÅ',
  className = '',
  required = false,
  recommendedDate = null,
  maxDate = null,
  highlightedDates = []
}: DatePickerProps) {
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date for display in input
  useEffect(() => {
    if (value) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      setInputValue(`${day}/${month}/${year}`);
    } else {
      setInputValue('');
    }
  }, [value]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 450; // Approximate height of calendar dropdown

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthPicker(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse DD/MM/YYYY format
    const match = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        onChange(date);
        setViewDate(date);
      }
    }
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate);
    setIsOpen(false);
    setShowMonthPicker(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate.getFullYear(), monthIndex, viewDate.getDate());
    setViewDate(newDate);
    setShowMonthPicker(false);
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(viewDate.getFullYear() + increment, viewDate.getMonth(), 1);
    setViewDate(newDate);
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + increment, 1);
    setViewDate(newDate);
  };

  const handleClear = () => {
    onChange(null);
    setInputValue('');
  };

  const handleOK = () => {
    setIsOpen(false);
    setShowMonthPicker(false);
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    // Previous month days (empty cells)
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      viewDate.getMonth() === value.getMonth() &&
      viewDate.getFullYear() === value.getFullYear()
    );
  };

  const isRecommended = (day: number) => {
    if (!recommendedDate) return false;
    return (
      day === recommendedDate.getDate() &&
      viewDate.getMonth() === recommendedDate.getMonth() &&
      viewDate.getFullYear() === recommendedDate.getFullYear()
    );
  };

  // Check if current value is the recommended date
  const isValueRecommended = () => {
    if (!value || !recommendedDate) return false;
    return (
      value.getDate() === recommendedDate.getDate() &&
      value.getMonth() === recommendedDate.getMonth() &&
      value.getFullYear() === recommendedDate.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!maxDate) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date > maxDate;
  };

  const isHighlighted = (day: number) => {
    if (!highlightedDates) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return highlightedDates.some(highlightedDate => 
      highlightedDate.getFullYear() === date.getFullYear() &&
      highlightedDate.getMonth() === date.getMonth() &&
      highlightedDate.getDate() === date.getDate()
    );
  };

  const days = generateCalendar();

  return (
    <div ref={containerRef} className={`relative max-w-[400px] ${className}`}>
      {/* Input field */}
      <div className="relative">
        <label htmlFor={fieldId} className="block mb-1.5">
          <span className="label-medium text-on-surface">
            {label}{required && ' *'}
          </span>
        </label>
        
        <div 
          className={`relative flex items-center h-14 px-4 border rounded-[var(--radius-sm)] bg-transparent transition-colors ${
            isOpen 
              ? 'border-primary ring-1 ring-inset ring-primary' 
              : 'border-outline hover:border-on-surface'
          }`}
        >
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              id={fieldId}
              placeholder={placeholder}
              className="flex-1 body-large text-on-surface bg-transparent border-none outline-none placeholder:text-on-surface-variant"
            />
            {isValueRecommended() && (
              <span className="label-small text-on-surface-variant whitespace-nowrap">
                Anbefalt lukke frist
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Lukk kalender" : "Velg dato"}
            aria-expanded={isOpen}
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full state-layer text-on-surface-variant transition-colors"
          >
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Dropdown calendar */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`fixed z-[9999] bg-surface-container-high text-on-surface rounded-[var(--radius-fab)] border border-outline-variant w-[360px] ${
            dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            left: containerRef.current?.getBoundingClientRect().left || 0,
            top: dropdownPosition === 'bottom' 
              ? (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
              : 'auto',
            bottom: dropdownPosition === 'top'
              ? window.innerHeight - (containerRef.current?.getBoundingClientRect().top || 0) + 8
              : 'auto'
          }}
        >
          {showMonthPicker ? (
            // Month picker view
            <div className="flex flex-col">
              {/* Header with year navigation */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-2 state-layer rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-on-surface" />
                </button>
                <span className="title-medium text-on-surface">
                  {viewDate.getFullYear()}
                </span>
                <button
                  onClick={() => handleYearChange(1)}
                  className="p-2 state-layer rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-on-surface" />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-2 p-4 max-h-[320px] overflow-y-auto">
                {NORWEGIAN_MONTHS.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`flex items-center justify-center h-12 rounded-[var(--radius-chip)] transition-colors ${
                      index === viewDate.getMonth()
                        ? 'bg-primary text-primary-foreground'
                        : 'state-layer text-on-surface'
                    }`}
                  >
                    <span className="body-medium">{month}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Calendar view
            <>
              {/* Month/Year selector */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-outline-variant">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 state-layer rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-on-surface" />
                </button>
                
                <button
                  onClick={() => setShowMonthPicker(true)}
                  className="flex items-center gap-2 px-3 py-2 state-layer rounded-[var(--radius-chip)] transition-colors"
                >
                  <span className="body-medium text-on-surface">
                    {NORWEGIAN_MONTHS[viewDate.getMonth()]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-on-surface" />
                </button>

                <span className="body-medium text-on-surface-variant">
                  {viewDate.getFullYear()}
                </span>

                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 state-layer rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-on-surface" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {NORWEGIAN_DAYS_SHORT.map((day, index) => (
                    <div key={`day-header-${index}`} className="flex items-center justify-center h-10">
                      <span className="label-medium text-on-surface-variant">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="h-10" />;
                    }

                    const today = isToday(day);
                    const selected = isSelected(day);
                    const recommended = isRecommended(day);
                    const disabled = isDisabled(day);
                    const highlighted = isHighlighted(day);

                    return (
                      <button
                        key={`day-${index}-${day}`}
                        onClick={() => !disabled && handleDayClick(day)}
                        disabled={disabled}
                        className={`flex items-center justify-center h-10 rounded-full transition-colors ${
                          selected
                            ? 'bg-primary text-primary-foreground'
                            : today
                            ? 'border-2 border-primary text-on-surface state-layer'
                            : recommended
                            ? 'border-2 border-primary text-on-surface state-layer'
                            : disabled
                            ? 'text-on-surface/38 cursor-not-allowed'
                            : highlighted
                            ? 'border-2 border-primary text-on-surface state-layer'
                            : 'text-on-surface state-layer'
                        }`}
                      >
                        <span className="body-medium">{day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant">
                <button
                  onClick={handleClear}
                  className="text-primary state-layer px-4 py-2 rounded-[var(--radius-chip)] transition-colors label-large"
                >
                  Tøm
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-primary state-layer px-4 py-2 rounded-[var(--radius-chip)] transition-colors label-large"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleOK}
                    className="state-layer bg-primary text-primary-foreground px-6 py-2 rounded-[var(--radius-chip)] transition-colors label-large"
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}