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
      className={`flex items-center gap-4 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
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
          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
            checked
              ? 'bg-primary border-primary'
              : 'border-foreground'
          }`}
        >
          {checked && (
            <Check className="w-4 h-4 text-white" strokeWidth={2} />
          )}
        </div>
      </div>
      {label && (
        <span className="body-medium text-foreground select-none">{label}</span>
      )}
    </label>
  );
}
