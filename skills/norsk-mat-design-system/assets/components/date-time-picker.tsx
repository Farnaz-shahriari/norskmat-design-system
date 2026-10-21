import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatNorwegianDate } from '../../utils/dateFormat';
import { TimePickerDropdown } from './time-picker-dropdown';

interface DateTimePickerProps {
  label: string;
  dateValue: Date | null;
  timeHours: number;
  timeMinutes: number;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (hours: number, minutes: number) => void;
  required?: boolean;
  placeholder?: string;
  highlightedDates?: Date[];
}

export function DateTimePicker({
  label,
  dateValue,
  timeHours,
  timeMinutes,
  onDateChange,
  onTimeChange,
  required = false,
  placeholder = 'Velg dato og tid',
  highlightedDates = [],
}: DateTimePickerProps) {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [timePickerPosition, setTimePickerPosition] = useState({ top: 0, right: 0 });
  const timePickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Format time as "HH:MM"
  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Get display text
  const getDisplayText = () => {
    if (dateValue) {
      const dateStr = formatNorwegianDate(dateValue);
      const timeStr = formatTime(timeHours, timeMinutes);
      return `${dateStr} • ${timeStr}`;
    }
    return '';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle time confirm
  const handleTimeConfirm = (hours: number, minutes: number) => {
    onTimeChange(hours, minutes);
    setIsTimePickerOpen(false);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsDatePickerOpen(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = dateValue ? dateValue.getMonth() : today.getMonth();
    const currentYear = dateValue ? dateValue.getFullYear() : today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];

  const calendarDays = generateCalendarDays();
  const currentMonth = dateValue ? dateValue.getMonth() : new Date().getMonth();
  const currentYear = dateValue ? dateValue.getFullYear() : new Date().getFullYear();

  const isHighlighted = (date: Date) => {
    return highlightedDates.some(highlightedDate => 
      highlightedDate.getDate() === date.getDate() &&
      highlightedDate.getMonth() === date.getMonth() &&
      highlightedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="label-medium text-foreground">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <div className="relative">
        {/* Combined input field */}
        <div className="flex gap-2">
          {/* Date part */}
          <div className="flex-1 relative" ref={datePickerRef}>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full h-14 px-4 pr-12 rounded-lg border-2 border-border hover:border-foreground bg-background text-foreground body-large text-left focus:outline-none focus:border-primary transition-colors"
            >
              {dateValue ? formatNorwegianDate(dateValue) : placeholder}
            </button>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Date picker dropdown */}
            {isDatePickerOpen && (
              <div className="absolute top-full mt-2 left-0 z-[9999] bg-background rounded-2xl shadow-2xl border-2 border-border p-4 w-80">
                {/* Month/Year header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentYear, currentMonth - 1, 1);
                      onDateChange(newDate);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    ←
                  </button>
                  <span className="label-large text-foreground">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button
                    onClick={() => {
                      const newDate = new Date(currentYear, currentMonth + 1, 1);
                      onDateChange(newDate);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    →
                  </button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day, i) => (
                    <div key={i} className="text-center label-small text-muted-foreground h-8 flex items-center justify-center">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === currentMonth;
                    const isSelected = dateValue && 
                      day.getDate() === dateValue.getDate() &&
                      day.getMonth() === dateValue.getMonth() &&
                      day.getFullYear() === dateValue.getFullYear();
                    const isToday = 
                      day.getDate() === new Date().getDate() &&
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear();
                    const highlighted = isHighlighted(day);

                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(day)}
                        className={`h-8 rounded-lg label-medium transition-colors relative ${
                          !isCurrentMonth
                            ? 'text-muted-foreground opacity-50'
                            : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : isToday
                            ? 'border border-primary text-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {day.getDate()}
                        {highlighted && !isSelected && (
                          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Time part */}
          <div className="w-32 relative" ref={timePickerRef}>
            <button
              onClick={() => {
                if (!isTimePickerOpen && timePickerRef.current) {
                  const rect = timePickerRef.current.getBoundingClientRect();
                  setTimePickerPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                  });
                }
                setIsTimePickerOpen(!isTimePickerOpen);
              }}
              className="w-full h-14 px-4 pr-12 rounded-lg border-2 border-border hover:border-foreground bg-background text-foreground body-large text-left focus:outline-none focus:border-primary transition-colors"
            >
              {formatTime(timeHours, timeMinutes)}
            </button>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Time picker dropdown */}
            {isTimePickerOpen && (
              <div className="fixed z-[9999]" style={{
                top: `${timePickerPosition.top}px`,
                right: `${timePickerPosition.right}px`
              }}>
                <TimePickerDropdown
                  hours={timeHours}
                  minutes={timeMinutes}
                  onConfirm={handleTimeConfirm}
                  onCancel={() => setIsTimePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}