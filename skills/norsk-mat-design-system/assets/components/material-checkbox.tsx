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
        <div 
          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
            checked 
              ? 'bg-primary border-primary' 
              : 'border-foreground'
          }`}
          onClick={(e) => {
            if (!disabled && onChange) {
              e.preventDefault();
              onChange(!checked);
            }
          }}
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
