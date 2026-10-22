import { Check } from 'lucide-react';

interface MaterialCheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function MaterialCheckbox({ 
  checked, 
  onChange, 
  label, 
  className = '',
  disabled = false 
}: MaterialCheckboxProps) {
  return (
    <label 
      className={`flex items-center gap-4 cursor-pointer ${disabled ? 'opacity-(--disabled-content) cursor-not-allowed' : ''} ${className}`}
    >
      <div className="p-1">
        {/* The native input carries focus, keyboard toggling and the checkbox
            role, the box below is only its visual, so it is hidden from
            screen readers and draws the focus ring through peer-. */}
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          readOnly={!onChange}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div
          aria-hidden="true"
          className={`size-[18px] rounded-[var(--radius-sm)] border-2 flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
            checked
              ? 'bg-primary border-primary'
              : 'border-outline'
          }`}
        >
          {checked && (
            <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && (
        <span className="body-medium text-on-surface select-none">{label}</span>
      )}
    </label>
  );
}
