import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePointer } from './PointerContext';
import { InteractionVariant } from '../types';

interface MagneticItemProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  onClick?: () => void;
  variant?: InteractionVariant;
  hitAreaPadding?: number;
}

export const MagneticItem: React.FC<MagneticItemProps> = ({ 
  children, 
  className = "", 
  borderRadius = 12,
  onClick,
  variant = 'lift', // Default to 'lift' as it's the most common "magnetic" behavior
  hitAreaPadding = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setHoverState } = usePointer();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Configuration based on variant
  const config = {
    lift: { scale: 1.1, parallaxStrength: 6, cursorType: 'button' as const },
    highlight: { scale: 1.0, parallaxStrength: 8, cursorType: 'button' as const },
    hover: { scale: 1.02, parallaxStrength: 0, cursorType: 'default' as const }, // Scale slightly, no parallax
  };
  
  const currentConfig = variant ? config[variant] : config.lift;

  const handleMouseEnter = () => {
    setIsHoveredLocal(true);
    if (ref.current) {
      // Important: We calculate the rect of the INNER visual element, not the padded wrapper.
      // This ensures the cursor snaps to the visible button size.
      const rect = ref.current.getBoundingClientRect();
      
      const shouldSnap = variant !== 'hover';

      setHoverState({
        isHovered: true,
        type: shouldSnap ? 'button' : 'default',
        rect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        },
        borderRadius,
        variant,
        magneticStrength: currentConfig.parallaxStrength,
        isPressed: false
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHoveredLocal(false);
    setIsPressed(false);
    setHoverState({
      isHovered: false,
      type: 'default',
      rect: { width: 0, height: 0, top: 0, left: 0 },
      borderRadius: 0,
      variant: null,
      magneticStrength: 0,
      isPressed: false
    });
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    // Calculate distance relative to the center of the visual element
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = clientX - centerX;
    const y = clientY - centerY;
    
    const strength = currentConfig.parallaxStrength;
    
    // If strength is 0, disable movement
    if (strength === 0) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition({ x: x / strength, y: y / strength });
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    setHoverState(prev => ({ ...prev, isPressed: true }));
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
    setHoverState(prev => ({ ...prev, isPressed: false }));
  };

  return (
    <div 
      className={`relative group shrink-0`} // 'group' on wrapper allows group-hover styles on children to trigger in the padded zone
      style={{ 
        padding: hitAreaPadding, 
        margin: -hitAreaPadding, // Negative margin compensates for padding to preserve layout flow
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        className={`relative z-10 flex items-center justify-center cursor-none ${className}`}
        animate={{ 
          x: position.x, 
          y: position.y,
          scale: isPressed ? 0.95 : (isHoveredLocal ? currentConfig.scale : 1) 
        }}
        // Synced spring physics with Cursor.tsx (stiffness: 400, damping: 28, mass: 0.5)
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
        style={{ borderRadius }}
      >
        {children}
      </motion.div>
    </div>
  );
};