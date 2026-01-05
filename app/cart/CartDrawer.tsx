"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart/CartContext";

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function toDisplayUrl(url: string) {
  if (!url.includes("/image/upload/")) return url;
  if (url.includes("/image/upload/f_auto")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export default function CartDrawer() {
  const router = useRouter();

  const {
    items,
    count,
    subtotal,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    clear,
  } = useCart();

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  function goToCheckout() {
    // close drawer for nicer UX
    closeCart();

    // small delay so the close animation starts before route change
    window.setTimeout(() => {
      router.push("/checkout");
    }, 80);
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`fixed inset-0 z-[60] transition ${isOpen ? "bg-black/30 opacity-100" : "pointer-events-none bg-black/0 opacity-0"
          }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[61] flex h-full w-[380px] max-w-[92vw] flex-col bg-white shadow-2xl ring-1 ring-black/5 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-rose-100 px-5 py-4">
          <div>
            <div className="text-lg font-semibold text-rose-950">Your cart</div>
            <div className="text-sm text-rose-700/80">
              {count} item{count === 1 ? "" : "s"}
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50"
          >
            Close
          </button>
        </div>

        {/* Top note */}
        <div className="px-5 pt-4">
          <div className="rounded-2xl bg-gradient-to-r from-rose-100 via-white to-amber-100 p-4 ring-1 ring-rose-100">
            <div className="text-sm font-semibold text-rose-950">Heads up</div>
            <p className="mt-1 text-sm text-rose-800/90">
              <span className="font-semibold">Pickup only:</span> We’re currently not offering delivery.
              Custom orders are confirmed after we review details and send you a final quote.
            </p>
          </div>
        </div>


        <div className="flex-1 overflow-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-6 text-center">
              <div className="text-base font-semibold text-rose-950">Cart is empty</div>
              <div className="mt-1 text-sm text-rose-700/80">
                Add cakes from the menu to see them here.
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((x) => (
                <li
                  key={x.id}
                  className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-3"
                >
                  <div className="h-16 w-20 overflow-hidden rounded-xl bg-rose-50 ring-1 ring-rose-100">
                    <img src={toDisplayUrl(x.imageUrl)} alt={x.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-rose-950">
                          {x.name}
                        </div>
                        <div className="mt-0.5 text-xs text-rose-700/80">
                          {formatUSD(x.price)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(x.id)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() => decrement(x.id)}
                          className="h-8 w-8 rounded-lg text-sm font-bold text-rose-900 hover:bg-rose-50"
                          aria-label={`Decrease quantity for ${x.name}`}
                        >
                          −
                        </button>
                        <div className="w-6 text-center text-sm font-semibold text-rose-950">
                          {x.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => increment(x.id)}
                          className="h-8 w-8 rounded-lg text-sm font-bold text-rose-900 hover:bg-rose-50"
                          aria-label={`Increase quantity for ${x.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-rose-950">
                        {formatUSD(x.price * x.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-rose-100 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-rose-900">Subtotal</div>
            <div className="text-base font-bold text-rose-950">{formatUSD(subtotal)}</div>
          </div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              disabled={items.length === 0}
              className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goToCheckout}
            >
              Checkout
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={clear}
              className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear cart
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
