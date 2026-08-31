import { useState, useEffect, useRef } from 'react';
import svgPaths from '../../imports/svg-8axi0x1eud';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  showTrengerUtfylling?: boolean;
}

export function TextInputField({ 
  label, 
  value, 
  onChange, 
  placeholder = '',
  multiline = false,
  showTrengerUtfylling = false
}: TextInputFieldProps) {
  const [mode, setMode] = useState<'edit'>(value ? 'edit' : 'edit'); // Always start in edit mode for simplicity
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false); // Track if user is actively editing
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleIconClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    onChange(trimmedValue);
    setIsEditing(false);
    setEditValue(trimmedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, multiline]);

  useEffect(() => {
    if (isEditing && multiline) {
      adjustTextareaHeight();
    }
  }, [editValue, isEditing, multiline]);

  // Actively editing state
  if (isEditing) {
    return (
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex gap-4 items-start p-2 relative w-full">
            {/* Leading Icon Button - Check/Save */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
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
                  className="w-full px-3 py-2 border-2 border-primary rounded-[var(--radius)] body-large text-foreground focus:outline-none focus:border-primary"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state (not actively editing)
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col size-full">
        {/* Trenger utfylling chip - Show above on small screens */}
        {showTrengerUtfylling && !value && (
          <div className="max-[400px]:flex max-[400px]:justify-start max-[400px]:mb-2 hidden">
            <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
              <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                <div className="relative shrink-0 w-[18px] h-[18px]">
                  <div className="absolute inset-[8.333%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                      <path d="M7.5 0C3.36 0 0 3.36 0 7.5S3.36 15 7.5 15 15 11.64 15 7.5 11.64 0 7.5 0Zm.75 11.25h-1.5v-1.5h1.5v1.5Zm0-3h-1.5v-4.5h1.5v4.5Z" fill="var(--error)" />
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
          {/* Leading Icon Button - Plus (empty) or Edit (has value) */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-12">
            <div 
              onClick={handleIconClick}
              className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
            >
              <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                <div className="relative shrink-0 size-6" data-name="Icon">
                  {value ? (
                    // Edit icon when there's a value
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <path d={svgPaths.p25003780} fill="var(--on-surface-variant)" />
                    </svg>
                  ) : (
                    // Plus icon when empty
                    <div className="absolute inset-[20.833%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d="M8 2V14M2 8H14" stroke="var(--on-surface-variant)" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content - clickable to activate edit mode */}
          <button
            onClick={handleIconClick}
            className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
          >
            {value ? (
              // Show label + value when there's content
              <>
                <div className="label-small text-muted-foreground w-full">
                  <p className="m-0">{label}</p>
                </div>
                <div className="body-large text-foreground w-full">
                  <p className="m-0 whitespace-pre-wrap">{value}</p>
                </div>
              </>
            ) : (
              // Show just label when empty
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
                <p className="body-large text-foreground leading-6 m-0">{label}</p>
              </div>
            )}
          </button>
          
          {/* Trenger utfylling chip - Show inline on larger screens */}
          {showTrengerUtfylling && !value && (
            <div className="max-[400px]:hidden">
              <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
                <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                  <div className="relative shrink-0 w-[18px] h-[18px]">
                    <div className="absolute inset-[8.333%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                        <path d="M7.5 0C3.36 0 0 3.36 0 7.5S3.36 15 7.5 15 15 11.64 15 7.5 11.64 0 7.5 0Zm.75 11.25h-1.5v-1.5h1.5v1.5Zm0-3h-1.5v-4.5h1.5v4.5Z" fill="var(--error)" />
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