import React from "react";

export const HoverBorderGradient = ({
  children,
  className = "",
  containerClassName = "",
  as: Component = "button",
  ...props
}) => {
  return (
    <div
      className={`relative p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform duration-200 ${containerClassName}`}
    >
      <Component
        className={`relative w-full h-full bg-white dark:bg-gray-900 rounded-[6px] px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${className}`}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
};