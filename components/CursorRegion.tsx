import React, { useRef } from 'react';
import { usePointer } from './PointerContext';
import { CursorType } from '../types';

interface CursorRegionProps {
  children: React.ReactNode;
  className?: string;
  type: CursorType;
}

export const CursorRegion: React.FC<CursorRegionProps> = ({ 
  children, 
  className = "",
  type
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setHoverState } = usePointer();

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHoverState({
        isHovered: true,
        type,
        rect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        },
        borderRadius: 0,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverState({
      isHovered: false,
      type: 'default',
      rect: { width: 0, height: 0, top: 0, left: 0 },
      borderRadius: 0,
    });
  };

  return (
    <div
      ref={ref}
      className={`cursor-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};