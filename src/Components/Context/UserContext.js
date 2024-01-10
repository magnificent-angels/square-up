import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([])
  const [owned, setOwned] = useState([])
  const [events, setEvents] = useState([])
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
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
