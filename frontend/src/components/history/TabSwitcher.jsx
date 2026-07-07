import React from 'react';

const TabSwitcher = ({ activeTab, setActiveTab, activeCount, completedCount }) => {
  return (
    <div className="flex items-center gap-2 border-b border-line mb-6 pb-3 font-mono text-xs select-none">
      <button
        type="button"
        onClick={() => setActiveTab("active")}
        className={`px-4 py-2 font-medium rounded-lg transition-all duration-150 ${activeTab === "active"
            ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
            : "text-muted hover:text-main bg-card/20 border border-line"
          }`}
      >
        Ongoing Sessions ({activeCount})
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("completed")}
        className={`px-4 py-2 font-medium rounded-lg transition-all duration-150 ${activeTab === "completed"
            ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
            : "text-muted hover:text-main bg-card/20 border border-line"
          }`}
      >
        Completed Sessions ({completedCount})
      </button>
    </div>
  );
};

export default TabSwitcher;
