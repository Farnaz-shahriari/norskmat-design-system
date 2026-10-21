import { useState, type ComponentType, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabCompact, TabGroup, TabLarge } from "../src/components/tabs";

type TabLike = ComponentType<{ active?: boolean; onClick?: () => void; disabled?: boolean; children: ReactNode }>;

function TabsExample({ as: T = Tab, withDisabled = false }: { as?: TabLike; withDisabled?: boolean }) {
  const [active, setActive] = useState("avvik");
  const tabs = [
    { id: "avvik", label: "Avvik" },
    { id: "sjekklister", label: "Sjekklister" },
    { id: "vedlegg", label: "Vedlegg" },
  ];
  return (
    <TabGroup className="border-b border-[var(--outline-variant)]">
      {tabs.map((t) => (
        <T key={t.id} active={active === t.id} onClick={() => setActive(t.id)}>
          {t.label}
        </T>
      ))}
      {withDisabled && (
        <T disabled onClick={() => {}}>
          Arkiv
        </T>
      )}
    </TabGroup>
  );
}

const meta = {
  title: "Components/Tabs",
  component: TabsExample,
} satisfies Meta<typeof TabsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = { name: "Tab, 48px" };
export const Compact: Story = { name: "TabCompact, 40px", args: { as: TabCompact } };
export const Large: Story = { name: "TabLarge, 56px", args: { as: TabLarge } };
export const WithDisabled: Story = { name: "With a disabled tab", args: { withDisabled: true } };
