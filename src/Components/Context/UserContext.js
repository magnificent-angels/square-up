import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _redirectEventId: undefined,
    apiKey: "AIzaSyDek8dKipBmCgWkCmUO-O2MeFwM1TbsQ8k",
    appName: "[DEFAULT]",
    createdAt: "1704382426136",
    displayName: undefined,
    email: "jonnywb@gmail.com",
    emailVerified: false,
    isAnonymous: false,
    lastLoginAt: "1704466208420",
    phoneNumber: undefined,
    photoURL: undefined,
    providerData: [[Object]],
    stsTokenManager: {
      accessToken:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxNjg5NDE1ZWMyM2EzMzdlMmJiYWE1ZTNlNjhiNjZkYzk5MzY4ODQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3F1YXJldXAtZjNjMGIiLCJhdWQiOiJzcXVhcmV1cC1mM2MwYiIsImF1dGhfdGltZSI6MTcwNDQ2NjIwOCwidXNlcl9pZCI6IkRyOHh5YXp3Tm9VcFBtYktDVEtodjVpOGhheTEiLCJzdWIiOiJEcjh4eWF6d05vVXBQbWJLQ1RLaHY1aThoYXkxIiwiaWF0IjoxNzA0NDY2MjA4LCJleHAiOjE3MDQ0Njk4MDgsImVtYWlsIjoiam9ubnl3YkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiam9ubnl3YkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.CSw2iDde3j2khpLoiAZMdxzGjctpyo74plSQov4rRs8ELwKr3Z_pCH9SHCZpWqcI2vUMym9yqZ9gjywWwrYLkV69wlCq1IReLj9Pw0lwYxbwIIcW6IuOJq0zZiqYWRX0oXqcB1b9Pc6Ohtqdi0FkO_pGp8kdkcadU0QBgg2kyJBFSCYkONeBc5O6GUD3AJaHBXl2XeYe-CMuUNhvj6i0Dh9rk7Xfcd7vuZctPkvFHOPs_j9OTm8vQzKFpxaFcAhELLoW7_Q3m6WuGFOE13A9J0YnijsYPML-MjjD0xeps_uqxQHej9nfnhJEKOy8N36qYp8y3fb_A8GurCRUObYdgw",
      expirationTime: 1704469808720,
      refreshToken:
        "AMf-vByz_gWFCwNryh1YHfqhKcW-kdT1PM_h51Yp-QyiYjKS-v3Hd48SlOeB-1FWONblytRZtvKaQ0ZkYJEcg6qMRzfrF7Wn3t_witnIjwopBdtX8Rj6SGNSw_lGO6iiKpZNmqBZJ-y1mLyygy6EBdrZMayOABdUozRDig-vapFxvE7Fmtu9ZtTMAlfZggzIubMjIpOFyNiHQFXsQidxKpF35zSHUErS-w",
    },
    tenantId: undefined,
    uid: "Dr8xyazwNoUpPmbKCTKhv5i8hay1",
  });
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
