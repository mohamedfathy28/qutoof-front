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

interface IUserProfit {
  id: number;
  profit: string;
  sectorsProfit: {
    id: number;
    date_from: string;
    date_to: string;
    profit: string;
    note: string;
    sector_name: string;
  };
}

interface WalletContext {
  TransactionsFromContext: ITransaction[];
  setTransactionsFromContext: (data: ITransaction[]) => void;
  userProfitFromContext: IUserProfit[];
  setUserProfitFromContext: (data: IUserProfit[]) => void;
}

// Create the context with a default value
const WalletContext = createContext<WalletContext | undefined>(undefined);

// Create a provider component
export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [TransactionsFromContext, setTransactionsFromContext] = useState<ITransaction[]>([]);
  const [userProfitFromContext, setUserProfitFromContext] = useState<IUserProfit[]>([]);

  return (
    <WalletContext.Provider value={{ TransactionsFromContext, setTransactionsFromContext, userProfitFromContext, setUserProfitFromContext }}>
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