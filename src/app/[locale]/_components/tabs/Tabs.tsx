'use client'
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: () => React.JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`${className}`}>
      {/* Tab Headers */}
      <div className="flex justify-center items-end border-b border-[#F1F1F1]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 md:p-5 text-[12px] md:text-[16px] font-[600] leading-[24px] border-b-[3px] transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-[#009444] text-[#009444]'
                : 'border-[#fff] text-[#949494] hover:text-[#009444]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="py-8 w-full">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            {tab.content()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;