import React, { useRef } from 'react';
import { usePointer } from './PointerContext';

interface TextCursorItemProps {
  children: React.ReactNode;
  className?: string;
}

export const TextCursorItem: React.FC<TextCursorItemProps> = ({ 
  children, 
  className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setHoverState } = usePointer();

  const handleMouseEnter = () => {
    if (ref.current) {
      // For text, we don't necessarily need the exact rect for snapping, 
      // but we pass it for context if needed.
      const rect = ref.current.getBoundingClientRect();
      setHoverState({
        isHovered: true,
        type: 'text',
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
