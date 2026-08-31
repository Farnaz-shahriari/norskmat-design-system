import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';

type InlineEditableListItemProps = {
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  chipText?: string;
  chipVariant?: 'info' | 'warning' | 'error';
  onSave?: (value: string) => void;
  className?: string;
};

export function InlineEditableListItem({
  label,
  value: initialValue = '',
  placeholder = 'Skriv her...',
  required = false,
  chipText,
  chipVariant = 'warning',
  onSave,
  className = '',
}: InlineEditableListItemProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal value with prop when it changes (when question changes)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Auto-resize textarea to fit content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [isEditing]);

  // Adjust height when tempValue changes
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [tempValue, isEditing]);

  const handleEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setValue(tempValue);
    setIsEditing(false);
    if (onSave) {
      onSave(tempValue);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Allow Enter key for new lines in textarea
  };

  const getChipStyles = () => {
    switch (chipVariant) {
      case 'error':
        return 'bg-error-container text-error-container-foreground border-[var(--error)]';
      case 'warning':
        return 'bg-[var(--vesentlig-container)] text-[var(--vesentlig-container-foreground)] border-[var(--vesentlig)]';
      case 'info':
      default:
        return 'bg-accent text-accent-foreground border-[var(--secondary)]';
    }
  };

  // Edit mode
  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="flex-1 relative">
          <label className="label-small text-muted-foreground block mb-1">
            {label}
            {required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-3 body-large text-foreground bg-background border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none overflow-hidden"
              style={{ minHeight: '48px' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-7">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
            aria-label="Avbryt"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
            aria-label="Lagre"
          >
            <Check className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    );
  }

  // View mode (has value)
  if (value) {
    return (
      <div
        className={`flex items-start gap-3 cursor-pointer group ${className}`}
        onClick={handleEdit}
      >
        <button
          type="button"
          className="p-2 mt-4 hover:bg-muted rounded-[var(--radius)] transition-colors"
          aria-label="Rediger"
        >
          <Edit2 className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 py-2">
          <p className="label-small text-muted-foreground mb-1">{label}</p>
          <p className="body-large text-foreground whitespace-pre-wrap">{value}</p>
        </div>
      </div>
    );
  }

  // Empty mode (no value)
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer group ${className}`}
      onClick={handleEdit}
    >
      <button
        type="button"
        className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
        aria-label="Legg til"
      >
        <Plus className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <p className="label-small text-muted-foreground mb-1">{label}</p>
        <p className="body-medium text-muted-foreground">
          {required ? 'Påkrevd' : 'Valgfritt'}
        </p>
      </div>
      {chipText && (
        <div
          className={`px-3 py-1.5 rounded-[var(--radius-button)] border label-small flex items-center gap-2 ${getChipStyles()}`}
          style={{ pointerEvents: 'none' }}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
              fill="currentColor"
            />
          </svg>
          <span>{chipText}</span>
        </div>
      )}
    </div>
  );
}
