import { useState, useEffect, useRef } from "react";

export const useVirtualScroll = ({
  rowHeight,
  containerHeight,
  totalCount,
}: {
  rowHeight: number;
  containerHeight: number;
  totalCount: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = rowHeight * totalCount;
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleCount + 5, totalCount); 

  useEffect(() => {
    const onScroll = (e: Event) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    const ref = containerRef.current;
    if (ref) ref.addEventListener("scroll", onScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", onScroll);
    };
  }, []);

  return {
    containerRef,
    totalHeight,
    startIndex,
    endIndex,
  };
};
