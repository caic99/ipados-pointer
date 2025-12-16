import { Dispatch, SetStateAction } from 'react';

export type CursorType = 'default' | 'button' | 'text' | 'crosshair';

export type InteractionVariant = 'lift' | 'highlight' | 'hover' | null;

export interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface HoverState {
  isHovered: boolean;
  type: CursorType;
  rect: Rect;
  borderRadius?: number;
  variant?: InteractionVariant;
  magneticStrength?: number;
  isPressed?: boolean;
}

export interface PointerContextType {
  hoverState: HoverState;
  setHoverState: Dispatch<SetStateAction<HoverState>>;
}