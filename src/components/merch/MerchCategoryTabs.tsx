import { motion } from "framer-motion";

const categories = [
  { id: "tshirts", label: "T-Shirts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "caps", label: "Caps" },
  { id: "bags", label: "Bags" },
  { id: "drinkware", label: "Drinkware" },
];

interface MerchCategoryTabsProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const MerchCategoryTabs = ({
  activeCategory = "all",
  onCategoryChange,
}: MerchCategoryTabsProps) => {
  const allCategories = [{ id: "all", label: "All" }, ...categories];

  return (
    <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={`snap-start relative px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
              activeCategory === category.id
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 bg-red-600 rounded-full -z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
