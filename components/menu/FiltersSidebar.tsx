import type { Category } from "@/components/menu/MenuClient";

export type DietaryKey = "Eggless" | "Gluten-Free" | "Nut-Free";
export type PriceKey = "0-50" | "50-100";

type Props = {
  category: Category | "All";
  setCategory: (v: Category | "All") => void;

  dietary: Set<DietaryKey>;
  setDietary: (v: Set<DietaryKey>) => void;

  priceKey: PriceKey;
  setPriceKey: (v: PriceKey) => void;
};

const categories: Array<Category | "All"> = ["All", "Custom Cakes", "Cupcakes", "Brownies", "Seasonal"];
const dietaries: DietaryKey[] = ["Eggless", "Gluten-Free", "Nut-Free"];

export default function FiltersSidebar({
  category,
  setCategory,
  dietary,
  setDietary,
  priceKey,
  setPriceKey,
}: Props) {
  function toggleDietary(key: DietaryKey) {
    const next = new Set(dietary);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setDietary(next);
  }

  return (
    <aside className="rounded-3xl bg-white/70 p-5 ring-1 ring-rose-100">
      <div className="text-sm font-semibold text-rose-950">Filters</div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          Category
        </div>
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => setCategory(c)}
                className="h-4 w-4 accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-rose-100 pt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          Dietary
        </div>
        <div className="mt-3 space-y-2">
          {dietaries.map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
              <input
                type="checkbox"
                checked={dietary.has(d)}
                onChange={() => toggleDietary(d)}
                className="h-4 w-4 accent-rose-500"
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-rose-100 pt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          Price Range
        </div>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
            <input
              type="radio"
              name="price"
              checked={priceKey === "0-50"}
              onChange={() => setPriceKey("0-50")}
              className="h-4 w-4 accent-rose-500"
            />
            $0 – $50
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
            <input
              type="radio"
              name="price"
              checked={priceKey === "50-100"}
              onChange={() => setPriceKey("50-100")}
              className="h-4 w-4 accent-rose-500"
            />
            $50 – $100
          </label>
        </div>
      </div>
    </aside>
  );
}
