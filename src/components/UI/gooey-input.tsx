import React, { useState } from "react";
import { Search } from "lucide-react";

export const GooeyInput = ({
  placeholder = "Search...",
  value = "",
  onChange,
  className = "",
  icon: Icon = Search,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative transition-transform duration-200 ${isFocused ? 'scale-105' : 'scale-100'} ${className}`}
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 pl-12 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          {...props}
        />

        <div
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
            isFocused ? 'scale-110 text-blue-500' : 'scale-100 text-gray-500'
          }`}
        >
          <Icon size={18} />
        </div>

        {isFocused && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
};