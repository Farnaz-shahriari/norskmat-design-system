import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /**
   * Maximum height of the bottom sheet as a percentage (0-100)
   * Default: 85 (85% of viewport height)
   */
  maxHeight?: number;
  /**
   * Optional footer content (typically action buttons)
   */
  footer?: ReactNode;
}

/**
 * BottomSheet Component
 * 
 * A mobile-optimized bottom sheet component that slides up from the bottom
 * of the screen. Uses design system colors and spacing.
 * 
 * Only visible on mobile/tablet (<1400px). On desktop (≥1400px), content
 * should be displayed in a side panel instead.
 * 
 * @example
 * ```tsx
 * <BottomSheet
 *   isOpen={showDetails}
 *   onClose={() => setShowDetails(false)}
 *   title="Avviksdetaljer"
 *   maxHeight={90}
 * >
 *   <div className="p-6">Content here</div>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  maxHeight = 85,
  footer
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when bottom sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when bottom sheet is closed
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) {
    return null;
  }

  return (
    <>
      {/* Backdrop - Only visible on mobile/tablet */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 min-[1400px]:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet - Only visible on mobile/tablet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-[var(--radius-xl)] shadow-lg z-50 min-[1400px]:hidden transition-all duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: `${maxHeight}vh`
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
            <h2 className="title-large text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
              aria-label="Lukk"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
        )}

        {/* Content - Scrollable area between header and footer */}
        <div 
          className="overflow-y-auto" 
          style={{ 
            maxHeight: footer 
              ? `calc(${maxHeight}vh - ${title ? '220px' : '160px'})` 
              : title 
                ? `calc(${maxHeight}vh - 100px)` 
                : `calc(${maxHeight}vh - 40px)` 
          }}
        >
          {children}
        </div>

        {/* Footer - Fixed at bottom */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-background">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}