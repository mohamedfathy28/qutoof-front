"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the type for the context data
interface IConfigrations {
  wallet_number_1: string,
  wallet_number_2: string,
  wallet_number_3: string,
  address: string,
  phone: string,
  email: string,
  lat: string,
  long: string,
  facebook: string,
  instagram: string,
  linkedin: string,
  twitter: string
  map: string
  home_videos: string
}

interface ConfigrationsContext {
  Configrations?: IConfigrations;
  setConfigrations?: (data: IConfigrations) => void;
}

// Create the context with a default value
const ConfigrationsContext = createContext<ConfigrationsContext | undefined>(undefined);

// Create a provider component
export const ConfigrationsContextProvider = ({ children }: { children: ReactNode }) => {
  const [Configrations, setConfigrations] = useState<IConfigrations>();

  useEffect(() => {
    const fetchData = async () => {
      const direction = typeof window !== "undefined" && localStorage.getItem("direction");
      const myHeaders = new Headers();
      myHeaders.append("Accept-Language", direction === 'ltr' ? "en" : "ar");
      try {
        const response = await fetch('https://quttouf.com/api/user/main-config', {
          headers: myHeaders
        });
        const result = await response.json();
        if (result?.data && Array.isArray(result.data)) {
          const configObject = result.data.reduce(
            (acc: Partial<IConfigrations>, item: Partial<IConfigrations>) => ({ ...acc, ...item }),
            {}
          ) as IConfigrations;
          setConfigrations(configObject);
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ConfigrationsContext.Provider value={{ Configrations, setConfigrations }}>
      {children}
    </ConfigrationsContext.Provider>
  );
};

// Custom hook to use the context
export const useConfigrationsContext = () => {
  const context = useContext(ConfigrationsContext);
  if (!context) {
    throw new Error('useConfigrationsContext must be used within a ConfigrationsContextProvider');
  }
  return context;
};

