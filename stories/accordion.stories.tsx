import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../src/components/accordion";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Accordion",
  decorators: [withPlatform],
  component: Accordion,
  // Story args are bypassed, each render spells out its own Accordion. The
  // type still wants the required `type` prop, so meta passes it.
  args: { type: "single", collapsible: true },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// type="single" opens one item at a time. collapsible lets the open one
// close again, without it one item always stays open.
export const Single: Story = {
  name: "Single, collapsible (FAQ)",
  render: () => (
    <Accordion type="single" collapsible defaultValue="egenkontroll">
      <AccordionItem value="egenkontroll">
        <AccordionTrigger>Hva er egenkontroll i KSL?</AccordionTrigger>
        <AccordionContent>
          Egenkontroll er den årlige gjennomgangen av gården mot KSL-standarden. Du svarer på
          sjekklistene og registrerer avvik der et krav ikke er oppfylt.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="frist">
        <AccordionTrigger>Hvor lang tid har jeg til å lukke et avvik?</AccordionTrigger>
        <AccordionContent>
          Du setter en frist når du registrerer avviket. Lukk de kritiske avvikene først, og
          last opp dokumentasjon på at tiltaket er gjennomført.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="revisjon">
        <AccordionTrigger>Hva skjer ved revisjon?</AccordionTrigger>
        <AccordionContent>
          En revisor går gjennom egenkontrollen din på gården. Nye avvik fra revisjonen får en
          frist som revisor setter.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// type="multiple" lets several items stay open, defaultValue is then an array.
export const Multiple: Story = {
  name: "Multiple open (sjekkliste)",
  render: () => (
    <Accordion type="multiple" defaultValue={["plantevern", "gjodsling"]}>
      <AccordionItem value="generelt">
        <AccordionTrigger>Generelle krav til gården</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-lg flex flex-col gap-xs">
            <li>Kart over gården er oppdatert</li>
            <li>Avtaler med leiekjørere er skriftlige</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="plantevern">
        <AccordionTrigger>Plantevern</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-lg flex flex-col gap-xs">
            <li>Journal for plantevernmidler er ført</li>
            <li>Sprøyten er funksjonstestet</li>
            <li>Plantevernmidler er låst inne</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="gjodsling">
        <AccordionTrigger>Gjødsling</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-lg flex flex-col gap-xs">
            <li>Gjødslingsplan for 2026 foreligger</li>
            <li>Lagerkapasitet for husdyrgjødsel er tilstrekkelig</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// A disabled item cannot be opened, its trigger is dimmed.
export const WithDisabledItem: Story = {
  name: "With a disabled item",
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="plantevern">
        <AccordionTrigger>Plantevern</AccordionTrigger>
        <AccordionContent>Tre sjekkpunkter, alle besvart.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="dyrevelferd" disabled>
        <AccordionTrigger>Dyrevelferd, gjelder ikke for gården</AccordionTrigger>
        <AccordionContent>Gården har ikke husdyr.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="hms">
        <AccordionTrigger>HMS</AccordionTrigger>
        <AccordionContent>Fem sjekkpunkter, to gjenstår.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
