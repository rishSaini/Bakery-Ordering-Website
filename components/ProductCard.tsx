"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/CartContext";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  subtitle?: string;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
        {/* Bigger fixed image area */}
        <button
          type="button"
          onClick={openModal}
          className="relative block w-full overflow-hidden bg-zinc-100"
          aria-label={`Open image for ${product.name}`}
        >
          <div className="h-72 w-full overflow-hidden sm:h-80">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Bottom-right overlay text */}
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            Click to view the full image
          </div>
        </button>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-rose-950">{product.name}</div>
              {product.subtitle ? (
                <div className="mt-1 line-clamp-2 text-sm text-zinc-600">{product.subtitle}</div>
              ) : null}
            </div>
            <div className="shrink-0 text-base font-semibold text-rose-950">
              {formatUSD(product.price)}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Link
              href={`/menu?focus=${encodeURIComponent(product.id)}`}
              className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
            >
              View
            </Link>

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
            >
              {justAdded ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal: size to image (shrink-wrap), still constrained to viewport */}
      {isOpen ? (
        <div className="fixed inset-0 z-[80]">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close image preview"
            onClick={closeModal}
            className="absolute inset-0 bg-black/50"
          />

          {/* Center container */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {/* Shrink-wrap dialog */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${product.name} image preview`}
              className="inline-block overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
            >
              <div className="flex items-center justify-between border-b border-rose-100 px-4 py-3">
                <div className="text-sm font-semibold text-rose-950">{product.name}</div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
                >
                  Close
                </button>
              </div>

              {/* Image defines the box; constrained so it never overflows viewport */}
              <div className="bg-zinc-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="block h-auto max-h-[78vh] w-auto max-w-[92vw] object-contain"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
