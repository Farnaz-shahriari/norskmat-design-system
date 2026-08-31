import { useState, useEffect, useRef } from 'react';

interface TextInputWithIconProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  helpText?: string;
}

// SVG path for the warning/error icon in "Trenger utfylling" chip
const warningIconPath = "M7.5 11.25C7.7125 11.25 7.89063 11.1781 8.03438 11.0344C8.17813 10.8906 8.25 10.7125 8.25 10.5C8.25 10.2875 8.17813 10.1094 8.03438 9.96563C7.89063 9.82188 7.7125 9.75 7.5 9.75C7.2875 9.75 7.10938 9.82188 6.96563 9.96563C6.82188 10.1094 6.75 10.2875 6.75 10.5C6.75 10.7125 6.82188 10.8906 6.96563 11.0344C7.10938 11.1781 7.2875 11.25 7.5 11.25ZM6.75 8.25H8.25V3.75H6.75V8.25ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4813 2.19375 12.8063C1.51875 12.1313 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1313 1.51875 12.8063 2.19375C13.4813 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4813 12.1313 12.8063 12.8063C12.1313 13.4813 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15Z";

export function TextInputWithIcon({
  label,
  value,
  onChange,
  icon,
  required = false,
  placeholder = '',
  multiline = true,
  helpText
}: TextInputWithIconProps) {
  const [mode, setMode] = useState<'empty' | 'edit' | 'view'>(value ? 'view' : 'empty');
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode('edit');
    setEditValue(value);
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode('edit');
    setEditValue(value);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      onChange(trimmedValue);
      setMode('view');
    } else {
      onChange('');
      setMode('empty');
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditValue(value);
      setMode(value ? 'view' : 'empty');
    }
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  useEffect(() => {
    if (mode === 'edit') {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      } else if (!multiline && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [mode, multiline]);

  useEffect(() => {
    if (mode === 'edit' && multiline) {
      adjustTextareaHeight();
    }
  }, [editValue, mode, multiline]);

  // Empty state
  if (mode === 'empty') {
    return (
      <div className="relative shrink-0 w-full">
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
            {/* Leading Icon Button - Plus or Custom Icon */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
              {icon ? (
                <div className="relative shrink-0 size-6">
                  {icon}
                </div>
              ) : (
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
              )}
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
      </div>
    );
  }

  // Edit state
  if (mode === 'edit') {
    return (
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex gap-4 items-start p-2 relative w-full">
            {/* Leading Icon Button - Check/Save or Custom Icon */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
              {icon ? (
                <div className="relative shrink-0 size-6">
                  {icon}
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
                >
                  <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full">
                    <div className="relative shrink-0 size-6">
                      <div className="absolute inset-[16.667%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0">
              <div className="label-small text-muted-foreground w-full mb-1">
                <p className="m-0">{label}</p>
              </div>
              {multiline ? (
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  rows={1}
                  className="w-full px-3 py-2 border-2 border-primary rounded-[var(--radius)] body-large text-foreground focus:outline-none focus:border-primary resize-none overflow-hidden"
                  style={{ minHeight: '72px' }}
                />
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className="w-full h-14 px-3 py-2 border-2 border-primary rounded-[var(--radius)] body-large text-foreground focus:outline-none focus:border-primary"
                />
              )}
              {helpText && (
                <p className="body-small text-muted-foreground mt-1">{helpText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View state
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-4 items-start p-2 relative w-full">
          {/* Leading Icon Button - Edit or Custom Icon */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
            {icon ? (
              <div className="relative shrink-0 size-6">
                {icon}
              </div>
            ) : (
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
            )}
          </div>
          {/* Content - Clickable */}
          <button
            onClick={handleEdit}
            className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
          >
            <div className="label-small text-muted-foreground w-full">
              <p className="m-0">{label}</p>
            </div>
            <div className="body-large text-foreground w-full">
              <p className="m-0 whitespace-pre-wrap">{value}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}