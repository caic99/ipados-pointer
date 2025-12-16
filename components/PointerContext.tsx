import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HoverState, PointerContextType } from '../types';

const defaultState: HoverState = {
  isHovered: false,
  type: 'default',
  rect: { width: 0, height: 0, top: 0, left: 0 },
  borderRadius: 0,
  isPressed: false,
};

const PointerContext = createContext<PointerContextType | undefined>(undefined);

export const PointerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hoverState, setHoverState] = useState<HoverState>(defaultState);

  return (
    <PointerContext.Provider value={{ hoverState, setHoverState }}>
      {children}
    </PointerContext.Provider>
  );
};

export const usePointer = () => {
  const context = useContext(PointerContext);
  if (!context) {
    throw new Error('usePointer must be used within a PointerProvider');
  }
  return context;
};