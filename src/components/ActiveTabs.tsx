import React from "react";

interface Tab {
  id: number;
  title: string;
}

interface ActiveTabsProps {
  tabs: Tab[];
}

const ActiveTabs: React.FC<ActiveTabsProps> = ({ tabs }) => {
  return (
    <div className="active-tabs">
      <h2 className="heading-2">Active Tabs</h2>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id} className="tab-item">
            {tab.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveTabs;
