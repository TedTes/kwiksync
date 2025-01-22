import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="text-center">
        <LoadingSpinner size="large" color="blue" />
        <p className="mt-4 text-gray-600 font-medium">Loading KwikSync...</p>
      </div>
    </div>
  );
};