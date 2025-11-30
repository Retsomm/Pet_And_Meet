import React from "react";

const AnimalSkeleton: React.FC = () => {
  const items = Array.from({ length: 6 }).map((_, i) => i);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((i) => (
        <div key={i} className="animate-pulse p-4 border rounded-lg">
          <div className="bg-base-200 h-48 w-full mb-4 rounded"></div>
          <div className="h-4 bg-base-200 w-3/4 mb-2 rounded"></div>
          <div className="h-3 bg-base-200 w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default AnimalSkeleton;
