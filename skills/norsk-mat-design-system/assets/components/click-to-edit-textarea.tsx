import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { cn } from "./utils";

interface ClickToEditTextareaProps {
  label: string;
  subtitle?: string;
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  saveLabel?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function ClickToEditTextarea({
  label,
  subtitle,
  value,
  onChange,
  onSave,
  saveLabel,
  placeholder = "Klikk for å legge til forklaring...",
  required = false,
  rows = 3,
  className,
}: ClickToEditTextareaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue.trim());
    setIsEditing(false);
    if (onSave) onSave();
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") handleCancel();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      handleSave();
    }
  };

  const showTrengerUtfylling = required && !value;

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="label-small text-muted-foreground">{label}</span>
          {subtitle && (
            <span className="label-small text-muted-foreground mt-0.5">{subtitle}</span>
          )}
        </div>
        {showTrengerUtfylling && (
          <span className="label-small text-error shrink-0">Trenger utfylling</span>
        )}
      </div>

      {!value && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-3 py-2 border border-dashed border-border rounded-[var(--radius)] bg-background hover:bg-muted transition-colors text-left"
        >
          <span className="body-medium text-muted-foreground">{placeholder}</span>
        </button>
      )}

      {value && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background hover:bg-muted transition-colors text-left"
        >
          <span className="body-medium text-foreground whitespace-pre-wrap">{value}</span>
        </button>
      )}

      {isEditing && (
        <div onBlur={handleBlur} className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={rows}
            placeholder="Skriv inn her..."
            className="w-full px-3 py-2 border-2 border-primary rounded-[var(--radius)] bg-background body-medium text-foreground focus:outline-none resize-none"
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
            >
              {saveLabel ?? "Lagre"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
            >
              Avbryt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}