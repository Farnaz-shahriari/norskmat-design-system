import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "../src/components/date-picker";
import { withPlatform } from "../.storybook/with-platform";

type Props = ComponentProps<typeof DatePicker>;

// The Controls date picker hands back a timestamp, not a Date.
function toDate(v: Date | number | null | undefined) {
  return v == null ? null : new Date(v);
}

// DatePicker is controlled, value and onChange(Date | null). This holds the
// value, seeded from the value arg. The label is built in and tied to the
// input with the component's own useId.
//
// The calendar opens on focus or on the calendar button, there is no open
// or defaultOpen prop, so these stories show the closed field only. The
// panel does not portal, it renders in place with position: fixed, so it
// would take its column's theme if opened.
function StatefulDatePicker({
  value: initial,
  recommendedDate,
  maxDate,
  ...props
}: Omit<Props, "onChange"> & { onChange?: Props["onChange"] }) {
  const [value, setValue] = useState(toDate(initial));
  return (
    <DatePicker
      {...props}
      value={value}
      onChange={setValue}
      recommendedDate={toDate(recommendedDate)}
      maxDate={toDate(maxDate)}
    />
  );
}

// Fixed dates, never new Date(), so every render is the same.
const RECOMMENDED = new Date(2026, 10, 20);
const LATEST = new Date(2027, 0, 19);

const meta = {
  title: "Components/DatePicker",
  decorators: [withPlatform],
  component: DatePicker,
  args: {
    label: "Frist for tiltak",
    value: null,
    required: false,
    onChange: () => {},
  },
  argTypes: {
    value: { control: "date" },
    recommendedDate: { control: "date" },
    maxDate: { control: "date" },
    highlightedDates: { control: false },
    onChange: { control: false },
  },
  // Keyed on the value arg so editing it in Controls reseeds the field.
  render: (args) => (
    <StatefulDatePicker key={String(toDate(args.value)?.getTime())} {...args} />
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty, the placeholder shows the format, DD/MM/ÅÅÅÅ. Typing a full date in
// that format also sets the value.
export const Playground: Story = {};

export const Filled: Story = {
  args: { value: new Date(2026, 11, 1) },
};

// recommendedDate is the anbefalt tidsfrist, outlined in the calendar. When
// the chosen date is that date, the field says so next to the value.
// maxDate disables every later day in the calendar.
export const RecommendedDeadline: Story = {
  name: "On the recommended deadline",
  args: {
    label: "Frist for lukking av avvik",
    value: RECOMMENDED,
    recommendedDate: RECOMMENDED,
    maxDate: LATEST,
  },
};

// required adds an asterisk to the label. It is visual only, the input
// itself is not marked required.
export const Required: Story = {
  args: { label: "Frist for tiltak", required: true },
};
