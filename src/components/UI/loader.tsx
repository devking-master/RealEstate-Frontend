import React from "react";

export const Loader = ({
  size = "default",
  className = ""
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.default} border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
};

export const LoadingSpinner = ({
  size = "default",
  text = "Loading...",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader size={size} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};