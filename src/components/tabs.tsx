import React from 'react';

/**
 * Tab Component System, Material 3 tabs
 *
 * Tab and TabCompact are M3 secondary tabs, a 2px primary indicator across
 * the whole tab. TabLarge is an M3 primary tab, a primary label over a 3px
 * indicator the width of the label. Hover, focus and press show as a state
 * layer in the label colour.
 *
 * TabGroup is the tablist. Tabs carry role="tab" and aria-selected, the
 * active tab is the one in the Tab order, and the arrow keys, Home and End
 * move focus between tabs. Enter or Space activates the focused tab, it is a
 * button.
 *
 * Usage:
 *
 * <TabGroup>
 *   <Tab
 *     active={activeTab === 'tab1'}
 *     onClick={() => setActiveTab('tab1')}
 *   >
 *     Tab 1
 *   </Tab>
 *   <Tab
 *     active={activeTab === 'tab2'}
 *     onClick={() => setActiveTab('tab2')}
 *   >
 *     Tab 2
 *   </Tab>
 * </TabGroup>
 */

interface TabProps {
  /** Whether this tab is currently active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Tab label/content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

const TAB_BASE = `
  state-layer relative flex items-center justify-center
  whitespace-nowrap transition-colors cursor-pointer
  outline-hidden
  focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring
  disabled:cursor-not-allowed disabled:text-on-surface/38
`;

// Arrow keys, Home and End move focus to the next enabled tab in the same
// tablist. On the tab rather than the tablist, focus lives on the tabs.
function moveFocus(e: React.KeyboardEvent<HTMLButtonElement>) {
  const list = e.currentTarget.closest('[role="tablist"]');
  const tabs = [...(list?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])];
  const i = tabs.indexOf(e.currentTarget);
  if (i < 0) return;
  const next =
    e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] :
    e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] :
    e.key === 'Home' ? tabs[0] :
    e.key === 'End' ? tabs[tabs.length - 1] :
    null;
  if (!next) return;
  e.preventDefault();
  next.focus();
}

function tabAria(active: boolean) {
  return { role: 'tab' as const, 'aria-selected': active, tabIndex: active ? 0 : -1, onKeyDown: moveFocus };
}

/**
 * Secondary tab, 48px, title-small. Active label on-surface, inactive
 * on-surface-variant, 2px primary indicator across the tab.
 */
export function Tab({
  active = false,
  onClick,
  children,
  className = '',
  disabled = false
}: TabProps) {
  return (
    <button
      type="button"
      {...tabAria(active)}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${TAB_BASE}
        h-12 px-md title-small
        ${active ? 'text-on-surface' : 'text-on-surface-variant'}
        ${className}
      `}
    >
      <span className="relative">{children}</span>
      {active && (
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
      )}
    </button>
  );
}

interface TabGroupProps {
  /** Tab buttons as children */
  children: React.ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether tabs should scroll horizontally on overflow */
  scrollable?: boolean;
}

/**
 * TabGroup, the tablist. A 1px outline-variant divider under the row, as M3
 * draws it.
 */
export function TabGroup({
  children,
  className = '',
  scrollable = true
}: TabGroupProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // Keep one tab reachable with Tab even when none is marked active.
  React.useLayoutEffect(() => {
    const tabs = ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)');
    if (tabs && tabs.length && ![...tabs].some((t) => t.tabIndex === 0)) tabs[0].tabIndex = 0;
  });

  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={`
        flex items-center gap-0 border-b border-outline-variant
        ${scrollable ? 'overflow-x-auto scrollbar-hide' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Compact secondary tab for smaller spaces, 40px, label-small.
 */
export function TabCompact({
  active = false,
  onClick,
  children,
  className = '',
  disabled = false
}: TabProps) {
  return (
    <button
      type="button"
      {...tabAria(active)}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${TAB_BASE}
        h-10 px-3 label-small
        ${active ? 'text-on-surface' : 'text-on-surface-variant'}
        ${className}
      `}
    >
      <span className="relative">{children}</span>
      {active && (
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
      )}
    </button>
  );
}

/**
 * Primary tab for prominent navigation, 56px, title-small. Active label in
 * primary over a 3px indicator the width of the label, inactive
 * on-surface-variant.
 */
export function TabLarge({
  active = false,
  onClick,
  children,
  className = '',
  disabled = false
}: TabProps) {
  return (
    <button
      type="button"
      {...tabAria(active)}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${TAB_BASE}
        h-14 px-lg title-small
        ${active ? 'text-primary' : 'text-on-surface-variant'}
        ${className}
      `}
    >
      <span className="relative flex h-full items-center">
        {children}
        {active && (
          <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-[3px] bg-primary" />
        )}
      </span>
    </button>
  );
}
