import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  useEffect(() => {
    const syncUserRole = () => {
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', syncUserRole);

    const resetTokenExpiry = () => {
      const expiryTime = Date.now() + 1 * 60 * 60 * 1000;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    };

    window.addEventListener('mousemove', resetTokenExpiry);
    window.addEventListener('keydown', resetTokenExpiry);

    return () => {
      window.removeEventListener('storage', syncUserRole);
      window.removeEventListener('mousemove', resetTokenExpiry);
      window.removeEventListener('keydown', resetTokenExpiry);
    };
  }, []);

  return <UserContext.Provider value={{ userRole, setUserRole }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
