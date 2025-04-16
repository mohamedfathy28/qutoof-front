// contexts/DirectionContext.tsx
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Direction = 'ltr' | 'rtl';

interface DirectionContextType {
  direction: Direction;
  toggleDirection: () => void;
  setDirection: (direction: Direction) => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    // Get saved direction from localStorage on mount
    const savedDirection = localStorage.getItem('direction') as Direction;
    console.log(savedDirection);
    
    if (savedDirection) {
      setDirection(savedDirection);
      document.documentElement.dir = savedDirection;
    }
  }, []);

  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.dir = newDirection;
    localStorage.setItem('direction', newDirection);
    console.log(direction);
    
  };

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection, setDirection }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}