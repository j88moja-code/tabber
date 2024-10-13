import { useState } from "react";
import Logo from "./assets/tabber.svg";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import default Tippy styles

function App() {
  interface Tab {
    id: number;
    title: string;
    url?: string;
    favIconUrl?: string;
    memoryUsage?: number;
    isFavorite?: boolean;
    openedAt?: Date;
  }

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  const getAllTabs = async () => {
    try {
      const allTabs = await chrome.tabs.query({});
      const activeTab = allTabs.find((tab) => tab.active); // Find the active tab
      setActiveTabId(activeTab?.id || null); // Store the active tab's ID

      const formattedTabs = allTabs.map((tab) => ({
        id: tab.id || 0,
        title: tab.title || "No Title",
        url: tab.url || "N/A",
        favIconUrl: tab.favIconUrl || "https://via.placeholder.com/16", // Default icon if favicon is unavailable
        memoryUsage: undefined,
        isFavorite: false,
        openedAt: new Date(),
      }));
      setTabs(formattedTabs);
    } catch (error) {
      console.error("Error fetching tabs:", error);
    }
  };

  const goToTab = (tabId: number) => {
    chrome.tabs.update(tabId, { active: true });
  };

  const toggleFavorite = (tabId: number) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId ? { ...tab, isFavorite: !tab.isFavorite } : tab
      )
    );
  };

  const closeTab = (tabId: number) => {
    const tabToClose = tabs.find((tab) => tab.id === tabId);
    if (tabToClose?.isFavorite) {
      alert("You cannot close a favorite or high-priority tab!");
      return;
    }
    chrome.tabs.remove(tabId, () => {
      setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
    });
  };

  const closeAllTabs = () => {
    const nonFavoriteTabs = tabs.filter(
      (tab) => tab.id !== activeTabId && !tab.isFavorite // Exclude active and favorite tabs
    );
    nonFavoriteTabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
    setTabs(
      (prevTabs) =>
        prevTabs.filter((tab) => tab.id === activeTabId || tab.isFavorite) // Keep active and favorite tabs
    );
  };

  return (
    <div className="app">
      <div className="active-tabs">
        <img src={Logo} alt="Tabber Logo" className="logo-img" />
        <ul className="tab-list">
          {tabs.map((tab) => (
            <Tippy
              key={tab.id}
              content={
                <div className="tooltip-content">
                  <p>
                    <strong>URL:</strong> {tab.url}
                  </p>
                </div>
              }
              placement="top"
              animation="fade"
              zIndex={9999}
            >
              <li className={`tab-item ${tab.isFavorite ? "favorite" : ""}`}>
                <img
                  src={tab.favIconUrl}
                  alt="Favicon"
                  className="tab-favicon"
                />
                <span className="tab-title" onClick={() => goToTab(tab.id)}>
                  {tab.title}
                </span>
                <button
                  className="favorite-button"
                  onClick={() => toggleFavorite(tab.id)}
                >
                  {tab.isFavorite ? "★" : "☆"}
                </button>
                <button
                  className="close-button"
                  onClick={() => closeTab(tab.id)}
                  disabled={tab.isFavorite}
                >
                  ✖
                </button>
              </li>
            </Tippy>
          ))}
        </ul>
      </div>
      <button className="fetch-tabs-button" onClick={getAllTabs}>
        Get All Tabs
      </button>
      <button className="close-all-tabs-button" onClick={closeAllTabs}>
        Close All Non-Favorite Tabs
      </button>
    </div>
  );
}

export default App;
