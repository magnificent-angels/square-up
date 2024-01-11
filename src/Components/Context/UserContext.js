import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [owned, setOwned] = useState([]);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        wishlist,
        setWishlist,
        owned,
        setOwned,
        events,
        setEvents,
        location,
        setLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
