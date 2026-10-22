import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../src/components/label";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group";
import { withPlatform } from "../.storybook/with-platform";

type Option = { value: string; label: string; disabled?: boolean };

const SEVERITY: Option[] = [
  { value: "kritisk", label: "Kritisk" },
  { value: "vesentlig", label: "Vesentlig" },
  { value: "mindre-alvorlig", label: "Mindre alvorlig" },
];

const ANSWER: Option[] = [
  { value: "ja", label: "Ja" },
  { value: "nei", label: "Nei" },
  { value: "ikke-relevant", label: "Ikke relevant" },
];

// The group gets its name from a visible heading through aria-labelledby,
// every RadioGroupItem from its own Label through htmlFor and id. useId,
// because every story renders once per platform side by side.
function LabelledRadioGroup({
  label,
  options,
  error,
  ...props
}: { label: string; options: Option[]; error?: string } & ComponentProps<typeof RadioGroup>) {
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-sm">
      <span id={labelId} className="label-large text-foreground">
        {label}
        {props.required && (
          <span aria-hidden="true" className="text-error">
            {" "}
            *
          </span>
        )}
      </span>
      <RadioGroup aria-labelledby={labelId} aria-describedby={error ? errorId : undefined} {...props}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-sm">
            <RadioGroupItem
              id={`${id}-${option.value}`}
              value={option.value}
              disabled={option.disabled}
              aria-invalid={error ? true : undefined}
            />
            <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p id={errorId} className="body-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const meta = {
  title: "Components/RadioGroup",
  decorators: [withPlatform],
  component: LabelledRadioGroup,
  args: { label: "Alvorlighetsgrad", options: SEVERITY, defaultValue: "vesentlig" },
  argTypes: { options: { control: false } },
} satisfies Meta<typeof LabelledRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// orientation only changes arrow key navigation and aria-orientation. The
// root is a grid column by default, so a horizontal row also needs
// className="flex flex-wrap".
export const Horizontal: Story = {
  args: {
    label: "Oppbevares plantevernmidler i et låst rom?",
    options: ANSWER,
    defaultValue: "ja",
    orientation: "horizontal",
    className: "flex flex-wrap",
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      <LabelledRadioGroup label="Hvor alvorlig er avviket?" options={SEVERITY} />
      <LabelledRadioGroup
        label="Er åkersprøyta funksjonstestet de siste tre årene?"
        options={[ANSWER[0], ANSWER[1], { ...ANSWER[2], disabled: true }]}
        defaultValue="ja"
      />
      <LabelledRadioGroup
        label="Er gjødsellageret tett?"
        options={ANSWER}
        defaultValue="nei"
        disabled
      />
    </div>
  ),
};

export const Invalid: Story = {
  name: "Required, nothing chosen",
  args: {
    label: "Alvorlighetsgrad",
    options: SEVERITY,
    defaultValue: undefined,
    required: true,
    error: "Velg alvorlighetsgrad for avviket.",
  },
};
