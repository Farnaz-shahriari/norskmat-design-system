import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../src/components/label";
import { Textarea } from "../src/components/textarea";
import { withPlatform } from "../.storybook/with-platform";

// Textarea has no label of its own. Pair it with Label, tied by id, and tie
// an error message to it with aria-describedby. useId, because every story
// renders once per platform side by side and fixed ids would collide.
function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & ComponentProps<typeof Textarea>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-xs w-full max-w-[480px]">
      <Label htmlFor={id}>
        {label}
        {props.required && (
          <span aria-hidden="true" className="text-error">
            *
          </span>
        )}
      </Label>
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="body-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const meta = {
  title: "Components/Textarea",
  decorators: [withPlatform],
  component: Field,
  args: {
    label: "Beskrivelse av avviket",
    placeholder: "Hva er feil, og hvor på gården gjelder det?",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// field-sizing: content, the textarea grows with its text instead of
// scrolling. There is no resize handle.
export const Filled: Story = {
  name: "Filled, grows with the text",
  args: {
    defaultValue:
      "Journal for plantevernmidler er ikke ført for sprøytingen av byggåkeren i juni. " +
      "Kvitteringen for innkjøpet finnes, men dato, dose og areal mangler.",
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Field label="Merknad" placeholder="Valgfri merknad til revisor" />
      <Field label="Tiltak" placeholder="Beskriv hva du gjør for å lukke avviket" required />
      <Field
        label="Beskrivelse av avviket"
        required
        error="Beskriv avviket før du lagrer."
      />
      <Field
        label="Merknad fra revisor"
        defaultValue="Avviket ble lukket ved oppfølgingsbesøket 14. oktober."
        disabled
      />
    </div>
  ),
};
