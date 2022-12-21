import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({
  selectedTab: "saved",
  updateSelectedTab: () => {},
  selectedUuid: "",
  updateSelectedUuid: () => {},
});

export function AppProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("saved");
  const [selectedUuid, setSelectedUuid] = useState("");

  const updateSelectedTab = (updated) => {
    setSelectedTab(updated);
  };
  const updateSelectedUuid = (updated) => {
    setSelectedUuid(updated);
  };

  return (
    <AppContext.Provider
      value={{
        selectedTab,
        updateSelectedTab,
        selectedUuid,
        updateSelectedUuid,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
