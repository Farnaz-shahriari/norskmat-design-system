import { useState, useEffect, useRef } from 'react';

interface TimePickerWithIconProps {
  label: string;
  hours: number;
  minutes: number;
  onChange: (hours: number, minutes: number) => void;
  required?: boolean;
  helpText?: string;
}

// SVG path for the warning/error icon in "Trenger utfylling" chip
const warningIconPath = "M7.5 11.25C7.7125 11.25 7.89063 11.1781 8.03438 11.0344C8.17813 10.8906 8.25 10.7125 8.25 10.5C8.25 10.2875 8.17813 10.1094 8.03438 9.96563C7.89063 9.82188 7.7125 9.75 7.5 9.75C7.2875 9.75 7.10938 9.82188 6.96563 9.96563C6.82188 10.1094 6.75 10.2875 6.75 10.5C6.75 10.7125 6.82188 10.8906 6.96563 11.0344C7.10938 11.1781 7.2875 11.25 7.5 11.25ZM6.75 8.25H8.25V3.75H6.75V8.25ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4813 2.19375 12.8063C1.51875 12.1313 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1313 1.51875 12.8063 2.19375C13.4813 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4813 12.1313 12.8063 12.8063C12.1313 13.4813 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15Z";

export function TimePickerWithIcon({
  label,
  hours,
  minutes,
  onChange,
  required = false,
  helpText
}: TimePickerWithIconProps) {
  const hasValue = hours > 0 || minutes > 0;
  const [mode, setMode] = useState<'empty' | 'edit' | 'view'>(hasValue ? 'view' : 'empty');
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(hours);
  const [tempMinutes, setTempMinutes] = useState(minutes);
  const [pickerPosition, setPickerPosition] = useState<'below' | 'above'>('below');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);

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

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode('edit');
    setTempHours(hours);
    setTempMinutes(minutes);
    openPicker();
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode('edit');
    setTempHours(hours);
    setTempMinutes(minutes);
    openPicker();
  };

  const openPicker = () => {
    // Calculate if there's enough space below or above
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const pickerHeight = 450; // Approximate height of the time picker

      if (spaceBelow >= pickerHeight || spaceBelow > spaceAbove) {
        setPickerPosition('below');
      } else {
        setPickerPosition('above');
      }
    }
    setIsOpen(true);
  };

  const handleOK = () => {
    onChange(tempHours, tempMinutes);
    setIsOpen(false);
    setMode(tempHours > 0 || tempMinutes > 0 ? 'view' : 'empty');
  };

  const handleCancel = () => {
    setTempHours(hours);
    setTempMinutes(minutes);
    setIsOpen(false);
    setMode(hours > 0 || minutes > 0 ? 'view' : 'empty');
  };

  const formatTime = (h: number, m: number) => {
    if (h === 0 && m === 0) return '';
    const parts = [];
    if (h > 0) parts.push(`${h} timer`);
    if (m > 0) parts.push(`${m} minutter`);
    return parts.join(', ');
  };

  // Empty state
  if (mode === 'empty') {
    return (
      <div ref={containerRef} className="relative shrink-0 w-full">
        <div className="flex flex-col size-full">
          {/* Trenger utfylling chip - Show above on small screens */}
          {required && (
            <div className="max-[400px]:flex max-[400px]:justify-start max-[400px]:mb-2 hidden">
              <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
                <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                  <div className="relative shrink-0 w-[18px] h-[18px]">
                    <div className="absolute inset-[8.333%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                        <path d={warningIconPath} fill="var(--error)" />
                      </svg>
                    </div>
                  </div>
                  <span className="label-medium text-foreground whitespace-nowrap">
                    Trenger utfylling
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main input row */}
          <div className="box-border content-stretch flex gap-4 items-center p-2 relative w-full">
            {/* Leading Icon Button - Plus */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
              <div 
                onClick={handleAdd}
                className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
              >
                <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full">
                  <div className="relative shrink-0 size-6">
                    <div className="absolute inset-[20.833%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d="M8 2V14M2 8H14" stroke="var(--on-surface-variant)" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content - clickable to activate edit mode */}
            <button
              onClick={handleAdd}
              className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
            >
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
                <p className="body-large text-foreground leading-6 m-0">{label}</p>
              </div>
              {helpText !== undefined ? (
                helpText && <p className="body-medium text-muted-foreground leading-5 m-0">{helpText}</p>
              ) : (
                <p className="body-medium text-muted-foreground leading-5 m-0">{required ? 'Påkrevd' : 'Valgfri'}</p>
              )}
            </button>
            
            {/* Trenger utfylling chip - Show inline on larger screens */}
            {required && (
              <div className="max-[400px]:hidden">
                <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
                  <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                    <div className="relative shrink-0 w-[18px] h-[18px]">
                      <div className="absolute inset-[8.333%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                          <path d={warningIconPath} fill="var(--error)" />
                        </svg>
                      </div>
                    </div>
                    <span className="label-medium text-foreground whitespace-nowrap">
                      Trenger utfylling
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Picker Popover */}
        {isOpen && (
          <div 
            className="fixed z-[9999] bg-surface-container-low rounded-2xl shadow-2xl border border-border w-[360px]"
            style={{
              left: containerRef.current?.getBoundingClientRect().left || 0,
              [pickerPosition === 'below' ? 'top' : 'bottom']: 
                pickerPosition === 'below' 
                  ? (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
                  : window.innerHeight - (containerRef.current?.getBoundingClientRect().top || 0) + 8
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

  // Edit state (shows picker immediately)
  if (mode === 'edit') {
    return (
      <div ref={containerRef} className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex gap-4 items-start p-2 relative w-full">
            {/* Leading Icon - Clock Icon */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
              <div className="relative shrink-0 size-6">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="var(--on-surface-variant)" />
                </svg>
              </div>
            </div>
            {/* Content */}
            <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0">
              <div className="label-small text-muted-foreground w-full mb-1">
                <p className="m-0">{label}</p>
              </div>
              <button
                ref={inputRef}
                onClick={openPicker}
                className="w-full h-14 px-4 border-2 border-primary rounded-[var(--radius)] body-large text-foreground focus:outline-none focus:border-primary text-left bg-background"
              >
                {formatTime(tempHours, tempMinutes) || 'Velg tid'}
              </button>
            </div>
          </div>
        </div>

        {/* Time Picker Popover */}
        {isOpen && (
          <div 
            className="fixed z-[9999] bg-surface-container-low rounded-2xl shadow-2xl border border-border w-[360px]"
            style={{
              left: containerRef.current?.getBoundingClientRect().left || 0,
              [pickerPosition === 'below' ? 'top' : 'bottom']: 
                pickerPosition === 'below' 
                  ? (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
                  : window.innerHeight - (containerRef.current?.getBoundingClientRect().top || 0) + 8
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

  // View state
  return (
    <div ref={containerRef} className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-4 items-start p-2 relative w-full">
          {/* Leading Icon - Clock Icon */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
            <div className="relative shrink-0 size-6">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="var(--on-surface-variant)" />
              </svg>
            </div>
          </div>
          {/* Content - Clickable */}
          <button
            ref={inputRef}
            onClick={handleEdit}
            className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
          >
            <div className="label-small text-muted-foreground w-full">
              <p className="m-0">{label}</p>
            </div>
            {helpText && (
              <p className="body-medium text-muted-foreground mb-1 m-0">{helpText}</p>
            )}
            <div className="body-large text-foreground w-full">
              <p className="m-0">{formatTime(hours, minutes)}</p>
            </div>
          </button>
          {/* Edit icon button */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
            <div
              onClick={handleEdit}
              className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
            >
              <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full">
                <div className="relative shrink-0 size-6">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                    <path d="M10.5441 6.765L11.2341 7.455L4.43906 14.25H3.74906V13.56L10.5441 6.765ZM13.2441 2.25C13.0566 2.25 12.8616 2.325 12.7191 2.4675L11.3466 3.84L14.1591 6.6525L15.5316 5.28C15.8241 4.9875 15.8241 4.515 15.5316 4.2225L13.7766 2.4675C13.6266 2.3175 13.4391 2.25 13.2441 2.25ZM10.5441 4.6425L2.24906 12.9375V15.75H5.06156L13.3566 7.455L10.5441 4.6425Z" fill="var(--on-surface-variant)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Picker Popover */}
      {isOpen && (
        <div 
          className="fixed z-[9999] bg-surface-container-low rounded-2xl shadow-2xl border border-border w-[360px]"
          style={{
            left: containerRef.current?.getBoundingClientRect().left || 0,
            [pickerPosition === 'below' ? 'top' : 'bottom']: 
              pickerPosition === 'below' 
                ? (containerRef.current?.getBoundingClientRect().bottom || 0) + 8
                : window.innerHeight - (containerRef.current?.getBoundingClientRect().top || 0) + 8
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