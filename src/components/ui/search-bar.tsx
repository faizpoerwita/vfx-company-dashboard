import { cn } from "@/utils/cn";
import { IconSearch } from "@tabler/icons-react";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({ 
  onSearch, 
  className,
  placeholder = "Search projects..." 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(
      "relative group",
      className
    )}>
      <motion.div
        animate={{
          height: isFocused ? "100%" : "0%",
          opacity: isFocused ? 1 : 0,
        }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500"
      />
      <div className="relative flex items-center rounded-xl border border-neutral-800 bg-black px-4 py-2 transition-colors">
        <IconSearch className="h-5 w-5 text-neutral-400" />
        <input
          type="text"
          className="ml-3 flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-400 outline-none"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};
