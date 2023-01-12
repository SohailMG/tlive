import { Tab, Tabs } from "@blueprintjs/core";
import React, { useContext, useState } from "react";
import { _envs } from "../popup";
import { AppContext } from "../context/AppContext";
function ContentTabs({ tabs }) {
  const { selectedTab, updateSelectedTab } = useContext(AppContext);

  const handleChangeTab = (e) => {
    updateSelectedTab(e);
  };
  return (
    <Tabs
      renderActiveTabPanelOnly={true}
      id="MainTab"
      onChange={handleChangeTab}
      selectedTabId={selectedTab ?? "saved"}
    >
      {tabs.map((tab, i) => (
        <Tab
          disabled={tab.disabled ?? false}
          key={i}
          id={tab.id}
          title={tab.title}
          panel={tab.panel}
        />
      ))}
      <Tabs.Expander />
    </Tabs>
  );
}

export default ContentTabs;
