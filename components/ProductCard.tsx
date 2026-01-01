import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  price: number; // in USD
  imageUrl: string; // local /public path for v1
  subtitle?: string;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {/* Use <img> to avoid next/image remote config while you iterate */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{product.name}</div>
            {product.subtitle ? (
              <div className="mt-1 text-sm text-zinc-600">{product.subtitle}</div>
            ) : null}
          </div>
          <div className="text-sm font-semibold">{formatUSD(product.price)}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/menu?focus=${encodeURIComponent(product.id)}`}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            View
          </Link>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-500"
            title="Cart coming soon"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
