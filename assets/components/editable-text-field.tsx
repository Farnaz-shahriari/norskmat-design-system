import { useState, useRef, useEffect } from 'react';
import svgPaths from '../../imports/svg-8axi0x1eud';
import svgPathsChip from '../../imports/svg-0mgb3e9dd3';
import { StatusChip } from '../StatusChip';

interface EditableTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showTrengerUtfylling?: boolean;
  showStatusChipWhenEmpty?: boolean;
  multiline?: boolean;
  required?: boolean;
}

export function EditableTextField({
  label,
  value,
  onChange,
  placeholder,
  showTrengerUtfylling = false,
  showStatusChipWhenEmpty = false,
  multiline = true,
  required = false
}: EditableTextFieldProps) {
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
    // Allow Enter for new lines in textarea
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
          {showTrengerUtfylling && (
            <div className="max-[400px]:flex max-[400px]:justify-start max-[400px]:mb-2 hidden">
              <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
                <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                  <div className="relative shrink-0 w-[18px] h-[18px]">
                    <div className="absolute inset-[8.333%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                        <path d={svgPathsChip.p1c3b4f80} fill="var(--error)" />
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
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Icon button">
              <div 
                onClick={handleAdd}
                className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
                data-name="Content"
              >
                <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                  <div className="relative shrink-0 size-6" data-name="Icon">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <path d="M8 2V14M2 8H14" stroke="var(--on-surface-variant)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content - clickable to activate edit mode */}
            <button
              onClick={handleAdd}
              className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
              data-name="Content"
            >
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
                <p className="body-large text-foreground leading-6 m-0">{label}</p>
              </div>
            </button>
            
            {/* Trenger utfylling chip - Show inline on larger screens */}
            {showTrengerUtfylling && (
              <div className="max-[400px]:hidden">
                <div className="bg-[var(--primary-container)] box-border flex items-center justify-center overflow-clip relative rounded-[var(--radius)] shadow-[var(--elevation-sm)] shrink-0">
                  <div className="box-border flex gap-2 h-8 items-center justify-center pl-2 pr-4 py-1.5">
                    <div className="relative shrink-0 w-[18px] h-[18px]">
                      <div className="absolute inset-[8.333%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                          <path d={svgPathsChip.p1c3b4f80} fill="var(--error)" />
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
            
            {/* StatusChip - Show inline when enabled */}
            {showStatusChipWhenEmpty && (
              <StatusChip isComplete={false} />
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
            {/* Leading Icon Button - Check/Save */}
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Icon button">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSave();
                }}
                className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
                data-name="Content"
              >
                <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                  <div className="relative shrink-0 size-6" data-name="Icon">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p63ecae80} fill="var(--on-surface-variant)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Textarea/Input - Content */}
            <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0">
              {multiline ? (
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={placeholder || `Skriv ${label.toLowerCase()}...`}
                  className="w-full resize-none overflow-hidden body-large text-foreground bg-transparent border-none outline-none p-0"
                  rows={1}
                />
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={placeholder || `Skriv ${label.toLowerCase()}...`}
                  className="w-full body-large text-foreground bg-transparent border-none outline-none p-0"
                />
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
          {/* Leading Icon Button - Edit */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Icon button">
            <div
              onClick={handleEdit}
              className="content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-[var(--radius-button)] shrink-0 w-10 hover:bg-[var(--primary-container)] transition-colors"
              data-name="Content"
            >
              <div className="content-stretch flex h-10 items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                <div className="relative shrink-0 size-6" data-name="Icon">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p25003780} fill="var(--on-surface-variant)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Content - Clickable */}
          <button
            onClick={handleEdit}
            className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 text-left cursor-pointer"
            data-name="Content"
          >
            <div className="label-small text-muted-foreground w-full">
              <p className="m-0">{label}</p>
            </div>
            <div className="body-large text-foreground w-full">
              <p className="m-0">{value}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}