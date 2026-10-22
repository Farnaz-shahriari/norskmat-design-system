import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInputField } from "../src/components/text-input-field";
import { withPlatform } from "../.storybook/with-platform";

type Props = ComponentProps<typeof TextInputField>;

// TextInputField is an inline click-to-edit row, controlled through value
// and onChange(value: string). At rest it shows a plus (empty) or a pencil
// (filled) and the label. A click or Enter on the row swaps in an input, or
// a textarea with multiline, which saves on Enter or blur and cancels on
// Escape. The editing state needs that click, so the stories show the
// resting state only. This holds the value, seeded from the value arg.
function StatefulTextInputField({
  value: initial,
  ...props
}: Omit<Props, "onChange"> & { onChange?: Props["onChange"] }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="w-full max-w-[480px]">
      <TextInputField {...props} value={value} onChange={setValue} />
    </div>
  );
}

const meta = {
  title: "Components/Forms/TextInputField",
  decorators: [withPlatform],
  component: TextInputField,
  args: {
    label: "Tiltak",
    value: "Låsbart skap for plantevernmidler er bestilt og monteres før fristen.",
    placeholder: "Beskriv hva du gjør for å lukke avviket",
    multiline: false,
    showTrengerUtfylling: false,
    onChange: () => {},
  },
  argTypes: { onChange: { control: false } },
  // Keyed on the value arg so editing it in Controls reseeds the field.
  render: (args) => <StatefulTextInputField key={args.value} {...args} />,
} satisfies Meta<typeof TextInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Filled, the label sits small above the value and the leading icon is a
// pencil.
export const Playground: Story = {};

// Empty, only the label shows, as the row's text, with a plus icon.
export const Empty: Story = {
  args: { label: "Merknad", value: "", placeholder: "Skriv en merknad til revisor" },
};

// showTrengerUtfylling flags a field the farmer still has to fill in. The
// "Trenger utfylling" chip only shows while the value is empty, it goes away
// as soon as the field is filled, even with the prop still on.
export const NeedsInput: Story = {
  name: "Trenger utfylling",
  render: () => (
    <div className="flex flex-col gap-sm">
      <StatefulTextInputField
        label="Tiltak"
        value=""
        placeholder="Beskriv hva du gjør for å lukke avviket"
        showTrengerUtfylling
      />
      <StatefulTextInputField
        label="Ansvarlig"
        value="Kari Nordmann"
        placeholder="Hvem følger opp avviket?"
        showTrengerUtfylling
      />
    </div>
  ),
};

// multiline edits in a growing textarea, the resting value keeps its line
// breaks.
export const Multiline: Story = {
  args: {
    label: "Beskrivelse av avviket",
    multiline: true,
    value:
      "Gjødsellageret har en sprekk i nordre vegg.\nSig mot bekken ble observert etter kraftig regn 3. september.",
    placeholder: "Hva er feil, og hvor på gården gjelder det?",
  },
};
