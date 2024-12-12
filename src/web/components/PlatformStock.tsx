import React, { useState, useEffect, useRef } from "react";

export const PlatformStock: React.FC<PlatformStockProps> = ({ stocks }) => {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = 2;

  const visibleStocks = showAll ? stocks : stocks.slice(0, displayLimit);
  const remainingCount = stocks.length - displayLimit;

  return (
    <div className="flex items-center space-x-1">
      {visibleStocks.map((stock, index: number) => (
        <span
          key={stock.platform}
          className="px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap"
        >
          {stock.platform}: {stock.count}
        </span>
      ))}
      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
        >
          +{remainingCount}
        </button>
      )}
    </div>
  );
};
