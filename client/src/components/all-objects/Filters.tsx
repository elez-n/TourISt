import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FiltersProps {
  title: string;
  typesList: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const Filters = ({ title, typesList, selected, onChange }: FiltersProps) => {
  const [open, setOpen] = useState(true);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearSection = () => {
    onChange([]);
  };

  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center group"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 group-hover:text-[#5C5C99] transition">
            {title}
          </span>

          {selected.length > 0 && (
            <span className="bg-[#5C5C99] text-white text-xs px-2 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scroll">
          {typesList.map((type) => {
            const isChecked = selected.includes(type);

            return (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleValue(type)}
                    className="peer sr-only"
                  />

                  <div
                    className={`
                      w-5 h-5 rounded-md border-2 flex items-center justify-center
                      transition-all duration-200
                      ${
                        isChecked
                          ? "bg-[#5C5C99] border-[#5C5C99]"
                          : "border-gray-300 group-hover:border-[#5C5C99]"
                      }
                    `}
                  >
                    {isChecked && (
                      <div className="w-2.5 h-2.5 bg-white rounded-sm animate-scaleIn" />
                    )}
                  </div>
                </div>

                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                  {type}
                </span>
              </label>
            );
          })}
        </div>

        {selected.length > 0 && (
          <button
            onClick={clearSection}
            className="flex items-center gap-1 text-xs text-red-500 mt-2 hover:underline"
          >
            <X size={14} />
            Očisti sekciju
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;