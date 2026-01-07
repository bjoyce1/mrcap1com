import { motion } from "framer-motion";

const categories = [
  { id: "tshirts", label: "T-Shirts", icon: "👕" },
  { id: "hoodies", label: "Hoodies", icon: "🧥" },
  { id: "caps", label: "Caps", icon: "🧢" },
  { id: "bags", label: "Bags", icon: "👜" },
  { id: "drinkware", label: "Drinkware", icon: "☕" },
];

interface MerchCategoryTabsProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const MerchCategoryTabs = ({ 
  activeCategory = "all",
  onCategoryChange 
}: MerchCategoryTabsProps) => {
  return (
    <div className="py-6 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange?.("all")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            <span>🏷️</span>
            <span>All</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
