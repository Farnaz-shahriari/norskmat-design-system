import { useState, useId } from 'react';
import { Button } from './button';

interface TimePickerDropdownProps {
  hours: number;
  minutes: number;
  onConfirm: (hours: number, minutes: number) => void;
  onCancel: () => void;
}

export function TimePickerDropdown({ hours, minutes, onConfirm, onCancel }: TimePickerDropdownProps) {
  const fieldId = useId();
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);

  const handleConfirm = () => {
    onConfirm(selectedHours, selectedMinutes);
  };

  return (
    <div className="bg-surface-container-high text-on-surface rounded-[var(--radius-dialog)] p-lg flex flex-col gap-5 w-full max-w-(--container-md) border border-outline-variant">
      {/* Header */}
      <h3 className="label-small text-on-surface-variant">Velg tid</h3>

      {/* Timer and Minutter inputs */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor={`${fieldId}-hours-1`} className="label-small text-on-surface-variant">Timer</label>
          <input
            id={`${fieldId}-hours-1`}
            type="number"
            min="0"
            max="23"
            value={selectedHours}
            onChange={(e) => setSelectedHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
            className="h-14 px-4 rounded-[var(--radius-sm)] border border-outline hover:border-on-surface focus:ring-1 focus:ring-inset focus:ring-primary bg-transparent text-on-surface body-large text-center focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor={`${fieldId}-minutes-1`} className="label-small text-on-surface-variant">Minutter</label>
          <input
            id={`${fieldId}-minutes-1`}
            type="number"
            min="0"
            max="59"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            className="h-14 px-4 rounded-[var(--radius-sm)] border border-outline hover:border-on-surface focus:ring-1 focus:ring-inset focus:ring-primary bg-transparent text-on-surface body-large text-center focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="tertiary" onClick={onCancel} className="body-large">
          Avbryt
        </Button>
        <Button onClick={handleConfirm} className="body-large">
          OK
        </Button>
      </div>
    </div>
  );
}