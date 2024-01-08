import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (user) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
