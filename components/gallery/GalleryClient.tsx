"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function toDisplayUrl(url: string) {
  // Force Cloudinary to deliver a browser-friendly format + good compression
  if (!url.includes("/image/upload/")) return url;

  // If it already has transforms, don't double-inject
  if (url.includes("/image/upload/f_auto")) return url;

  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
};

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((i) => (i.category ?? "").trim()))
    ).filter((c) => c.length > 0);

    unique.sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [items]);

  const filtered = useMemo(() => {
    if (active === "All") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-rose-100 bg-gradient-to-b from-rose-50 via-white to-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-rose-950 md:text-4xl">
            Our Cake Portfolio
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-rose-800/90 md:text-base">
            A glimpse into Maya&apos;s sweetest creations.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={
                  isActive
                    ? "rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white"
                    : "rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs font-semibold text-rose-900 hover:bg-rose-50"
                }
              >
                {c.toUpperCase()}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/70 p-8 text-sm text-rose-800 ring-1 ring-rose-100">
            No images found for <span className="font-semibold">{active}</span>.
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-rose-100"
              >
                {/* Full image (no crop). Scales down to fit column width. */}
                <img
                  src={toDisplayUrl(item.imageUrl)}
                  alt={item.title || "Gallery image"}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-rose-100 via-white to-amber-100 p-8 ring-1 ring-rose-100">
          <h3 className="text-lg font-semibold text-rose-950">Love what you see?</h3>
          <p className="mt-2 max-w-2xl text-sm text-rose-800/90">
            We can recreate a favorite or design something totally custom for your event.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Order Now!
          </Link>
        </div>
      </section>
    </>
  );
}
