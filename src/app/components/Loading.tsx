import React from "react";

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default LoadingScreen;
