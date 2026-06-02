import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [userLevel, setUserLevel] = useState('beginner');
  const [score, setScore] = useState(0);

  return (
    <AppContext.Provider value={{ userLevel, setUserLevel, score, setScore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
