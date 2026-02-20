import { ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";

interface NFTFilterToolbarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  viewMode: "grid" | "compact";
  onViewModeChange: (mode: "grid" | "compact") => void;
}

const TIME_RANGES = ["Today", "Last 7 Days", "Last 30 Days", "All Time"];

export function NFTFilterToolbar({
  sortBy,
  onSortChange,
  timeRange,
  onTimeRangeChange,
  viewMode,
  onViewModeChange,
}: NFTFilterToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8">
      {/* Sort dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-medium">Sort By</span>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                     bg-[hsl(220_14%_12%)] ring-1 ring-white/10 text-foreground
                     hover:ring-white/20 transition-colors"
        >
          {sortBy}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Time range chips + view toggle */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors
              ${
                timeRange === range
                  ? "bg-[hsl(200_80%_50%)] text-white shadow-md"
                  : "bg-[hsl(220_14%_12%)] text-muted-foreground ring-1 ring-white/5 hover:ring-white/15"
              }`}
          >
            {range}
          </button>
        ))}

        {/* View toggle */}
        <div className="flex items-center ml-2 rounded-lg ring-1 ring-white/10 overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("compact")}
            className={`p-2 transition-colors ${viewMode === "compact" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
