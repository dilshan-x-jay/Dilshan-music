
import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface MarqueeTextProps {
  children: ReactNode;
  className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ children, className }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (container && text) {
            const checkOverflow = () => setIsOverflowing(text.scrollWidth > container.clientWidth);
            checkOverflow();
            
            const resizeObserver = new ResizeObserver(checkOverflow);
            resizeObserver.observe(container);

            return () => resizeObserver.disconnect();
        }
    }, [children]);

    return (
        <div ref={containerRef} className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}>
            <span ref={textRef} className={isOverflowing ? 'inline-block animate-marquee' : 'inline-block'}>
              {children}
            </span>
            {isOverflowing && (
              <span className="inline-block animate-marquee pl-8" aria-hidden="true">
                {children}
              </span>
            )}
        </div>
    );
};

export default MarqueeText;
