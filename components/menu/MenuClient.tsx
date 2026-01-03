"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/cart/CartContext";
import MenuHero from "@/components/menu/MenuHero";
import FiltersSidebar, { PriceKey } from "@/components/menu/FiltersSidebar";
import SortBar, { SortKey } from "@/components/menu/SortBar";
import Pagination from "@/components/menu/Pagination";

export type Category = "Cakes" | "Cupcakes" | "Custom Made";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
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

function toDisplayUrl(url: string) {
  // Cloudinary: deliver a browser-friendly format (WebP/AVIF/JPG) + good compression
  if (!url.includes("/image/upload/")) return url;
  if (url.includes("/image/upload/f_auto")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export default function MenuClient({ initialProducts }: Props) {
  const { addItem } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [priceKey, setPriceKey] = useState<PriceKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("popularity");
  const [page, setPage] = useState(1);

  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Image preview modal
  const [preview, setPreview] = useState<Product | null>(null);
  const isPreviewOpen = preview !== null;

  function openPreview(p: Product) {
    setPreview(p);
  }
  function closePreview() {
    setPreview(null);
  }

  // Close preview on ESC
  useEffect(() => {
    if (!isPreviewOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPreviewOpen]);

  // Prevent background scroll while preview is open
  useEffect(() => {
    if (!isPreviewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isPreviewOpen]);

  const filteredSorted = useMemo(() => {
    const s = search.trim().toLowerCase();

    let result = initialProducts.filter((p) => {
      const matchesSearch =
        !s || p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s);

      const matchesCategory = category === "All" ? true : p.category === category;

      const matchesPrice =
        priceKey === "all"
          ? true
          : priceKey === "0-50"
            ? p.price >= 0 && p.price <= 50
            : p.price > 50 && p.price <= 100; // "50-100"

      return matchesSearch && matchesCategory && matchesPrice;
    });

    result.sort((a, b) => {
      if (sortKey === "popularity") return b.popularity - a.popularity;
      if (sortKey === "priceLow") return a.price - b.price;
      if (sortKey === "priceHigh") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [initialProducts, search, category, priceKey, sortKey]);

  const total = filteredSorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page, pageCount]);

  const showingFrom = total === 0 ? 0 : (Math.min(page, pageCount) - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(total, Math.min(page, pageCount) * PAGE_SIZE);

  function setAndReset<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  function handleAdd(p: Product) {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
    });

    setJustAddedId(p.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === p.id ? null : curr));
    }, 900);
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

            {/* items-start prevents stretching when cards have different content height */}
            <div className="mt-5 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((p) => (
                <div
                  key={p.id}
                  className="group self-start overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-rose-100"
                >
                  {/* Fixed-size image area + click-to-preview */}
                  <button
                    type="button"
                    onClick={() => openPreview(p)}
                    aria-label={`Open image for ${p.name}`}
                    className="relative block w-full overflow-hidden bg-rose-50"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={toDisplayUrl(p.imageUrl)}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {p.badge ? (
                      <div className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                        {p.badge}
                      </div>
                    ) : null}

                    <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      Click to view the full image
                    </div>
                  </button>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-rose-950">{p.name}</div>
                        <div className="mt-1 text-sm text-rose-700/80">{p.category}</div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-rose-950">
                        {formatUSD(p.price)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openPreview(p)}
                        className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50"
                      >
                        {justAddedId === p.id ? "Added ✓" : "Add +"}
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
              <h3 className="text-lg font-semibold text-rose-950">Don’t see what you’re looking for?</h3>
              <p className="mt-2 max-w-2xl text-sm text-rose-800/90">
                We specialize in custom designs for weddings, birthdays, and events. Tell us your theme and we’ll
                create something unforgettable.
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

      {/* Preview modal (no black padding, sized to image) */}
      {preview ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Close image preview"
            onClick={closePreview}
            className="absolute inset-0 bg-black/50"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${preview.name} image preview`}
              className="inline-block overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between border-b border-rose-100 px-4 py-3">
                <div className="text-sm font-semibold text-rose-950">{preview.name}</div>
                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
                >
                  Close
                </button>
              </div>

              {/* no black padding */}
              <img
                src={toDisplayUrl(preview.imageUrl)}
                alt={preview.name}
                className="block h-auto max-h-[78vh] w-auto max-w-[92vw] object-contain"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
