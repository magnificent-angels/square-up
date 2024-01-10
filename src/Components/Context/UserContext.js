import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([])
  const [owned, setOwned] = useState([])
  const [events, setEvents] = useState([])
  const [globalEvents, setGlobalEvents] = useState([]);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })
    const eventsCollection = collection(db, "events")
    getDocs(eventsCollection)
      .then((querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGlobalEvents(eventsData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      }
      );
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
        globalEvents,
        setGlobalEvents,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
