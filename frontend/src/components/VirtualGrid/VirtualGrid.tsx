import {
  Children,
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import './VirtualGrid.css';

interface VirtualGridProps {
  onEndOfList?: () => void;
  columns?: number;
  overscan?: number;
  gap?: number;
}

function VirtualGrid({
  onEndOfList,
  columns = 3,
  overscan = 3,
  gap = 20,
  children,
}: PropsWithChildren<VirtualGridProps>) {
  const items = Children.toArray(children) as ReactElement[];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fakeRenderGrid = useRef<HTMLDivElement | null>(null);

  const [rowHeight, setRowHeight] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // First fake render to measure row height
  useLayoutEffect(() => {
    if (!fakeRenderGrid.current || rowHeight > 0) {
      return;
    }

    const firstItem = fakeRenderGrid.current.querySelector('.grid__item');
    if (firstItem) {
      const rect = firstItem.getBoundingClientRect();
      setRowHeight(rect.height + gap);
    }
  }, [items.length, rowHeight, gap]);

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    const handleResize = () => {
      setContainerHeight(window.innerHeight);
    };

    handleResize();
    setScrollTop(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getVisibleRange = useCallback(() => {
    if (rowHeight === 0 || containerHeight === 0) {
      return { startRow: 0, endRow: Math.ceil(items.length / columns) };
    }

    const offsetFromTop = scrollTop - (containerRef.current?.offsetTop || 0);
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const startRow = Math.max(0, Math.floor(offsetFromTop / rowHeight) - overscan);
    const endRow = Math.min(Math.ceil(items.length / columns), startRow + visibleRows + overscan * 2);

    return { startRow, endRow };
  }, [rowHeight, scrollTop, containerHeight, items.length, columns, overscan]);

  const { startRow, endRow } = getVisibleRange();
  const startIndex = startRow * columns;
  const endIndex = endRow * columns;
  const visibleItems = items.slice(startIndex, endIndex);

  const totalRows = Math.ceil(items.length / columns);
  const topPadding = startRow * rowHeight;
  const bottomPadding = Math.max(0, (totalRows - endRow) * rowHeight);

  // onEndOfList observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!onEndOfList || !node) {
        return;
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry || !entry.isIntersecting) {
          return;
        }

        const isEndReached = endIndex >= items.length - columns;
        if (isEndReached) {
          onEndOfList();
        }
      }, { threshold: 0 });

      observer.observe(node);
      observerRef.current = observer;
    },
    [onEndOfList, items.length, endIndex, columns]
  );

  // First fake render
  if (rowHeight === 0) {
    return (
      <div ref={fakeRenderGrid} className="grid">
        {items.slice(0, Math.min(columns, items.length)).map((child, index) => (
          <div key={child.key ?? index} className="grid__item">
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {topPadding > 0 && <div style={{ height: topPadding }} />}

      <div className="grid" style={{ gap: gap, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {visibleItems.map((child, virtualIndex) => {
          const actualIndex = startIndex + virtualIndex;
          const isLast = actualIndex === items.length - 1;

          return (
            <div
              key={child.key ?? actualIndex}
              ref={isLast ? lastItemRef : null}
              className="grid__item"
              data-index={actualIndex}
            >
              {child}
            </div>
          );
        })}
      </div>

      {bottomPadding > 0 && <div style={{ height: bottomPadding }} />}
    </div>
  );
}

export default VirtualGrid;
