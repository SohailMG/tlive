import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({
  selectedTab: "saved",
  updateSelectedTab: () => {},
  selectedUuid: "",
  updateSelectedUuid: () => {},
  removeBatch: [],
  updateRemoveBatch: () => {},
});

export function AppProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("saved");
  const [selectedUuid, setSelectedUuid] = useState("");
  const [removeBatch, setRemoveBatch] = useState([]);

  const updateSelectedTab = (updated) => {
    setSelectedTab(updated);
  };
  const updateSelectedUuid = (updated) => {
    setSelectedUuid(updated);
  };
  const updateRemoveBatch = (payload) => {
    const { action, value } = payload;

    if (action === "discard") {
      setRemoveBatch(
        removeBatch.filter((item) => item.channelId !== value.channelId)
      );
    } else if (action === "remove") {
      setRemoveBatch((prev) => [...prev, value]);
    } else if (action === "clear") {
      setRemoveBatch([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedTab,
        updateSelectedTab,
        selectedUuid,
        updateRemoveBatch,
        removeBatch,
        updateSelectedUuid,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
