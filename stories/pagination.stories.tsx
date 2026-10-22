import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../src/components/pagination";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Pagination",
  decorators: [withPlatform],
  component: Pagination,
  // The component's own default name is the English "pagination". Name the
  // list it pages through, a page can hold more than one navigation.
  args: { "aria-label": "Sider i avvikslisten" },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// isActive marks the current page, the outlined one, and sets
// aria-current="page". Every PaginationLink needs an href, an <a> without
// one is not focusable.
//
// PaginationContent does not wrap on its own and the 56px targets do not fit
// a phone-width column, so these stories let it wrap with flex-wrap.
export const Default: Story = {
  name: "Page 2 of 12",
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious href="#side-1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-12">12</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#side-3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// PaginationPrevious has no disabled state, on the first page leave it out
// rather than link to nothing. Few pages need no ellipsis.
export const FirstPage: Story = {
  name: "First of three pages",
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationLink href="#side-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#side-2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// Deep in a long list, an ellipsis on both sides of the current page.
export const MiddlePage: Story = {
  name: "Page 6 of 12, ellipsis on both sides",
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious href="#side-5" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-5">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-6" isActive>
            6
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-7">7</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-12">12</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#side-7" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// size takes Button's sizes. Page links default to "icon", 56px, "icon-xs"
// is 40px. Previous and Next default to "default", 56px tall, "sm" is 40px.
export const Compact: Story = {
  name: "Compact, 40px",
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious href="#side-1" size="sm" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-1" size="icon-xs">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-2" size="icon-xs" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#side-3" size="icon-xs">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#side-3" size="sm" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
