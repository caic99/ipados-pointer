import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { usePointer } from './PointerContext';
import { Plus } from 'lucide-react';

const SPRING_OPTIONS = {
  stiffness: 400,
  damping: 28,
  mass: 0.5,
};

const TEXT_SPRING_OPTIONS = {
  stiffness: 800,
  damping: 35,
  mass: 0.2,
};

export const Cursor: React.FC = () => {
  const { hoverState } = usePointer();
  const { isHovered, type, rect, borderRadius, variant, magneticStrength, isPressed } = hoverState;

  // Magnetic/Spring target position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Raw mouse position for gradient tracking
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth cursor position
  const cursorX = useSpring(mouseX, type === 'text' ? TEXT_SPRING_OPTIONS : SPRING_OPTIONS);
  const cursorY = useSpring(mouseY, type === 'text' ? TEXT_SPRING_OPTIONS : SPRING_OPTIONS);

  // Dimensions
  const width = useSpring(16, SPRING_OPTIONS);
  const height = useSpring(16, SPRING_OPTIONS);

  useEffect(() => {
    // Extract update logic so we can call it both on mouse move AND when state changes (like click)
    const updateCursor = (clientX: number, clientY: number) => {
      if (isHovered && type === 'button') {
        // MAGNETIC SNAP (BUTTONS - LIFT & HIGHLIGHT)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const offsetX = clientX - centerX;
        const offsetY = clientY - centerY;
        
        // Magnetic pull
        const strength = magneticStrength || 10;
        const factor = strength === 0 ? 0 : 1 / strength;

        mouseX.set(centerX + offsetX * factor);
        mouseY.set(centerY + offsetY * factor);

        // Apply scale factor
        // If pressed: 0.95 (matches MagneticItem pressed state)
        // If lift: 1.1 (matches MagneticItem lift state)
        // Default: 1.0
        let scale = 1;
        if (isPressed) {
          scale = 0.95; 
        } else if (variant === 'lift') {
          scale = 1.1;
        }

        width.set(rect.width * scale);
        height.set(rect.height * scale);
      } else if (isHovered && type === 'text') {
        // I-BEAM (TEXT)
        mouseX.set(clientX);
        mouseY.set(clientY);
        
        width.set(3);
        height.set(24);
      } else if (isHovered && type === 'crosshair') {
        // CROSSHAIR
        mouseX.set(clientX);
        mouseY.set(clientY);
        
        width.set(32);
        height.set(32);
      } else {
        // DEFAULT DOT
        mouseX.set(clientX);
        mouseY.set(clientY);
        
        width.set(16);
        height.set(16);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Always update raw mouse position
      rawMouseX.set(clientX);
      rawMouseY.set(clientY);
      updateCursor(clientX, clientY);
    };

    // Trigger immediate update in case state changed without mouse movement (e.g. click)
    updateCursor(rawMouseX.get(), rawMouseY.get());

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, type, rect, mouseX, mouseY, width, height, magneticStrength, rawMouseX, rawMouseY, variant, isPressed]);

  // Adjust positioning to be centered on the coordinate
  const translateX = useTransform(cursorX, (x) => x - width.get() / 2);
  const translateY = useTransform(cursorY, (y) => y - height.get() / 2);

  // --- Dynamic Gradient Highlight Logic ---
  // Use rawMouseX/Y to track the actual mouse pointer relative to the cursor's current position
  const relativeX = useTransform([rawMouseX, cursorX, width], ([m, c, w]: any[]) => m - (c - w / 2));
  const relativeY = useTransform([rawMouseY, cursorY, height], ([m, c, h]: any[]) => m - (c - h / 2));
  
  // Dynamic radius for the spotlight
  // Simplified calculation based on user suggestion: 80% of the largest dimension
  const highlightRadius = useTransform([width, height], ([w, h]: any[]) => Math.max(w, h) * 0.8);
  
  // 1. Dynamic highlight (Spotlight) - Rendered FIRST (Top layer)
  const dynamicHighlight = useMotionTemplate`radial-gradient(${highlightRadius}px circle at ${relativeX}px ${relativeY}px, rgba(255, 255, 255, 0.25), transparent 100%)`;
  
  // Determine base background color for smooth transitions
  const getBaseColor = () => {
    switch (type) {
      case 'button':
        return "rgba(255, 255, 255, 0.1)"; // Static part of button
      case 'text':
        return "rgba(96, 165, 250, 1)";    // Text blue
      case 'crosshair':
        return "rgba(255, 255, 255, 0)";   // Transparent
      case 'default':
      default:
        return "rgba(255, 255, 255, 0.5)"; // Default dot
    }
  };

  return (
    <motion.div
      className="fixed pointer-events-none z-50 flex items-center justify-center overflow-hidden"
      style={{
        x: translateX,
        y: translateY,
        width,
        height,
        borderRadius: type === 'text' ? 1.5 : (isHovered && borderRadius ? borderRadius : 20),
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundColor: getBaseColor(),
      }}
      transition={{ 
        duration: 0.15,
        // Specific transition for shape properties to match the spring feel
        borderRadius: { type: "spring", stiffness: 300, damping: 30 },
        backgroundColor: { duration: 0.3, ease: "easeInOut" } // Smoother color transition
      }}
    >
      {/* Spotlight Layer for Button (fades in/out) */}
      <motion.div 
        className="absolute inset-0"
        style={{
            background: dynamicHighlight, 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: type === 'button' ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {type === 'crosshair' && (
          <motion.div
            key="crosshair"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="text-white" size={24} strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};