"use client";

import { useMemo, useState } from "react";
import MenuHero from "@/components/menu/MenuHero";
import FiltersSidebar, { DietaryKey, PriceKey } from "@/components/menu/FiltersSidebar";
import SortBar, { SortKey } from "@/components/menu/SortBar";
import Pagination from "@/components/menu/Pagination";

export type Category =
  | "Custom Cakes"
  | "Cupcakes"
  | "Brownies"
  | "Seasonal";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  dietary: DietaryKey[];
  imageUrl: string;
  popularity: number; // 0-100
  badge?: string;
};

type Props = {
  initialProducts: Product[];
};

const PAGE_SIZE = 12;

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function MenuClient({ initialProducts }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("Custom Cakes");
  const [dietary, setDietary] = useState<Set<DietaryKey>>(new Set());
  const [priceKey, setPriceKey] = useState<PriceKey>("0-50");
  const [sortKey, setSortKey] = useState<SortKey>("popularity");
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    const s = search.trim().toLowerCase();

    let result = initialProducts.filter((p) => {
      const matchesSearch =
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s);

      const matchesCategory = category === "All" ? true : p.category === category;

      const matchesDietary =
        dietary.size === 0 ? true : [...dietary].every((d) => p.dietary.includes(d));

      const matchesPrice =
        priceKey === "0-50"
          ? p.price >= 0 && p.price <= 50
          : p.price > 50 && p.price <= 100;

      return matchesSearch && matchesCategory && matchesDietary && matchesPrice;
    });

    result.sort((a, b) => {
      if (sortKey === "popularity") return b.popularity - a.popularity;
      if (sortKey === "priceLow") return a.price - b.price;
      if (sortKey === "priceHigh") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [initialProducts, search, category, dietary, priceKey, sortKey]);

  const total = filteredSorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page, pageCount]);

  const showingFrom = total === 0 ? 0 : (Math.min(page, pageCount) - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(total, Math.min(page, pageCount) * PAGE_SIZE);

  // Reset to page 1 whenever filters change
  // (simple approach: whenever any filter changes, user will stay in-range)
  // You can also do this with useEffect; this version avoids extra effects:
  function setAndReset<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  return (
    <>
      <MenuHero />

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* LEFT: Filters */}
          <div className="md:sticky md:top-24 md:self-start">
            <FiltersSidebar
              category={category}
              setCategory={(v) => setAndReset(setCategory, v)}
              dietary={dietary}
              setDietary={(v) => setAndReset(setDietary, v)}
              priceKey={priceKey}
              setPriceKey={(v) => setAndReset(setPriceKey, v)}
            />
          </div>

          {/* RIGHT: Toolbar + Grid */}
          <div>
            <SortBar
              search={search}
              setSearch={(v) => setAndReset(setSearch, v)}
              sortKey={sortKey}
              setSortKey={(v) => setAndReset(setSortKey, v)}
              showingFrom={showingFrom}
              showingTo={showingTo}
              total={total}
            />

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((p) => (
                <div
                  key={p.id}
                  className="group overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-rose-100"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-rose-50">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {p.badge ? (
                      <div className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                        {p.badge}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-rose-950">{p.name}</div>
                        <div className="mt-1 text-sm text-rose-700/80">{p.category}</div>
                      </div>
                      <div className="text-sm font-semibold text-rose-950">{formatUSD(p.price)}</div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        disabled
                        title="Cart coming soon"
                        className="cursor-not-allowed rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-400"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10">
              <Pagination page={page} setPage={setPage} pageCount={pageCount} />
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-3xl bg-gradient-to-r from-rose-100 via-white to-amber-100 p-8 ring-1 ring-rose-100">
              <h3 className="text-lg font-semibold text-rose-950">
                Don’t see what you’re looking for?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-rose-800/90">
                We specialize in custom designs for weddings, birthdays, and events. Tell us your theme
                and we’ll create something unforgettable.
              </p>
              <button
                type="button"
                className="mt-5 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Get a Custom Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
