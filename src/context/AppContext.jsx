import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({
  cachedList: [],
  updateCache: () => {},
});

const cachedList = window.localStorage.getItem("saved_channels");
if (!cachedList) localStorage.setItem("saved_channels", JSON.stringify([]));

export function AppProvider({ children }) {
  const [cache, setCache] = useState(JSON.parse(cachedList));
  console.log("Context => ", cache);
  const updateCache = (updated) => {
    setCache(updated);
  };

  return (
    <AppContext.Provider value={{ cachedList: cache, updateCache }}>
      {children}
    </AppContext.Provider>
  );
}
