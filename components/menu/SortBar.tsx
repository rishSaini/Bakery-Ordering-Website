export type SortKey = "popularity" | "priceLow" | "priceHigh" | "name";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;

  showingFrom: number;
  showingTo: number;
  total: number;
};

export default function SortBar({
  search,
  setSearch,
  sortKey,
  setSortKey,
  showingFrom,
  showingTo,
  total,
}: Props) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-rose-100">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treats..."
              className="w-full rounded-2xl border border-rose-200 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-rose-800/90">Sort by:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="rounded-2xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-950 outline-none focus:ring-2 focus:ring-rose-200"
            >
              <option value="popularity">Popularity</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-rose-800/90">
          Showing <span className="font-semibold text-rose-950">{showingFrom}–{showingTo}</span> of{" "}
          <span className="font-semibold text-rose-950">{total}</span> items
        </div>
      </div>
    </div>
  );
}
