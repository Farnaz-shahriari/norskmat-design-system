/**
 * RadioButton Component
 * 
 * A Material 3 compliant radio button component that provides a consistent
 * visual design across the application.
 * 
 * @component
 * @example
 * ```tsx
 * <RadioButton
 *   checked={selectedValue === 'option1'}
 *   onClick={() => setSelectedValue('option1')}
 *   label="Option 1"
 * />
 * ```
 */

interface RadioButtonProps {
  /**
   * Whether the radio button is currently selected
   */
  checked: boolean;
  /**
   * Optional label text to display next to the radio button
   */
  label?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Optional disabled state
   */
  disabled?: boolean;
  /**
   * Optional className for the wrapper
   */
  className?: string;
}

export function RadioButton({ 
  checked, 
  label, 
  onClick, 
  disabled = false,
  className = ''
}: RadioButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Radio button circle - Material 3 specs: 20x20px container */}
      <div className="flex items-center justify-center shrink-0">
        <div 
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            checked 
              ? 'border-primary bg-primary' 
              : 'border-[var(--on-surface-variant)]'
          }`}
        >
          {/* Inner dot - Material 3 specs: 10x10px when selected */}
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground"></div>
          )}
        </div>
      </div>
      
      {/* Label */}
      {label && (
        <span className={`body-large ${className.includes('text-on-secondary-container') ? 'text-on-secondary-container' : 'text-foreground'}`}>
          {label}
        </span>
      )}
    </button>
  );
}