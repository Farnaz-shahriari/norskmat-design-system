import { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ScrollingFABProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  /**
   * Scroll threshold in pixels before collapsing the FAB
   * @default 50
   */
  scrollThreshold?: number;
}

/**
 * Scrolling Floating Action Button
 * 
 * A FAB that:
 * - Shows extended (icon + label) when at top of scroll container
 * - Collapses to icon-only when user scrolls down
 * - Expands back to full when user scrolls back to top
 */
export function ScrollingFAB({ 
  icon: Icon, 
  label, 
  onClick,
  scrollThreshold = 50
}: ScrollingFABProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the scrollable container - look for the first parent with overflow-y-auto or overflow-auto
    const findScrollContainer = (element: HTMLElement | null): HTMLElement | null => {
      if (!element) return null;
      
      const style = window.getComputedStyle(element);
      const hasScroll = 
        style.overflowY === 'auto' || 
        style.overflowY === 'scroll' ||
        style.overflow === 'auto' ||
        style.overflow === 'scroll';
      
      if (hasScroll) {
        return element;
      }
      
      return findScrollContainer(element.parentElement);
    };

    // Start searching from document.body
    const container = findScrollContainer(document.body);
    scrollContainerRef.current = container;

    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setIsCollapsed(scrollTop > scrollThreshold);
    };

    container.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  return (
    <button
      onClick={onClick}
      className={`min-[1400px]:hidden fixed bottom-6 right-6 flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all rounded-full z-[60] ${
        isCollapsed ? 'w-14 h-14' : 'h-14 px-6'
      }`}
      aria-label={label}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span 
        className={`label-medium whitespace-nowrap transition-all overflow-hidden ${
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}
      >
        {label}
      </span>
    </button>
  );
}