import { useState, useRef, useId } from 'react';

interface OutlinedTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Error state, the outline, label and supporting text turn error. */
  error?: boolean;
  /** Helper or error text under the field. */
  supportingText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Material 3 outlined text field. 56px, 4px corners, a 1px outline that
 * turns 2px primary on focus, the label resting in the field and floating
 * onto the outline. The outline is a fieldset whose legend cuts the notch the
 * floating label sits in, so the field works on any surface, there is no
 * background patch behind the label.
 */
export function OutlinedTextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  required,
  disabled,
  error,
  supportingText,
  onKeyDown,
  autoFocus,
  className = '',
}: OutlinedTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const helpId = useId();

  const isFloating = isFocused || value.length > 0;

  const outline = disabled
    ? 'border border-on-surface/12'
    : error
      ? isFocused ? 'border-2 border-error' : 'border border-error'
      : isFocused ? 'border-2 border-primary' : 'border border-outline group-hover:border-on-surface';

  const labelColour = disabled
    ? 'text-on-surface/38'
    : error ? 'text-error' : isFocused ? 'text-primary' : 'text-on-surface-variant';

  return (
    <div className={`relative ${className}`}>
      {/* Clicking the padding focuses the input, a mouse convenience only,
          keyboard users tab straight to the input, hence presentation. */}
      <div
        role="presentation"
        className={`group relative flex items-center h-14 gap-2 ${icon ? 'px-3' : 'px-md'} ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* The outline. Its legend is the label's width when the label
            floats, which cuts the notch, and zero wide when it rests. */}
        <fieldset
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 m-0 px-3 rounded-[var(--radius-sm)] transition-colors ${outline}`}
        >
          <legend
            className={`invisible h-0 overflow-hidden whitespace-nowrap body-small transition-[max-width] duration-150
              ${isFloating ? 'max-w-full px-1' : 'max-w-[0.01px] px-0'}
            `}
          >
            {label}{required && ' *'}
          </legend>
        </fieldset>

        {/* Floating label, on the outline when floating */}
        <label
          htmlFor={inputId}
          className={`absolute pointer-events-none px-1 transition-all duration-150 leading-none
            ${isFloating
              ? 'top-0 -translate-y-1/2 body-small'
              : 'top-1/2 -translate-y-1/2 body-large'
            }
            ${labelColour}
            ${icon && !isFloating ? 'left-10' : 'left-3'}
          `}
        >
          {label}{required && <span className={disabled ? '' : 'text-error'}> *</span>}
        </label>

        {icon && (
          <span className={`relative shrink-0 flex items-center ${disabled ? 'text-on-surface/38' : 'text-on-surface-variant'}`}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          // Opt in and off by default. Meant for the first field of a dialog,
          // where moving focus into the dialog is the expected pattern.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={supportingText ? helpId : undefined}
          placeholder={isFloating ? (placeholder ?? '') : ''}
          className="relative flex-1 min-w-0 bg-transparent outline-none border-none body-large text-on-surface placeholder:text-on-surface-variant disabled:cursor-not-allowed disabled:text-on-surface/38"
        />
      </div>
      {supportingText && (
        <p id={helpId} className={`mt-xs px-md body-small ${error ? 'text-error' : 'text-on-surface-variant'}`}>
          {supportingText}
        </p>
      )}
    </div>
  );
}
