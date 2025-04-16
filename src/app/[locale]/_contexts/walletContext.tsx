"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the context data
interface ITransaction {
    id: number,
    amount: number,
    status: string,
    created_at: string,
    updated_at: string
}

interface WalletContext {
  TransactionsFromContext: ITransaction[];
  setTransactionsFromContext: (data: ITransaction[]) => void;
}

// Create the context with a default value
const WalletContext = createContext<WalletContext | undefined>(undefined);

// Create a provider component
export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [TransactionsFromContext, setTransactionsFromContext] = useState<ITransaction[]>([]);

  return (
    <WalletContext.Provider value={{ TransactionsFromContext, setTransactionsFromContext }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the context
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};