// src/components/SearchBar.tsx
import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onSearch, placeholder }: SearchBarProps) => {
  return (
    <div className="w-full flex justify-center ">
      <div className="relative w-full md:w-1/2">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder ?? "Pretraži objekte..."}
          className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
