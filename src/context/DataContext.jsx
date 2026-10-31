
import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "company", "settings");

    // Real-time Firestore Listener
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCompanySettings(docSnap.data());
          setError(null);
        } else {
          setCompanySettings(null);
          setError(new Error("Company settings document not found."));
        }

        setLoading(false);
      },
      (err) => {
        console.error("Error fetching company settings:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup Listener
    return () => unsubscribe();
  }, []);

  const value = {
    companySettings,
    loading,
    error,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
