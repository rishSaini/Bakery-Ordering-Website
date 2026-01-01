import ProductCard, { Product } from "@/components/ProductCard";

const bestSellers: Product[] = [
  {
    id: "chocolate-silk",
    name: "Chocolate Silk",
    price: 45,
    imageUrl: "/images/cake-1.jpg",
    subtitle: "Deep cocoa, silky ganache.",
  },
  {
    id: "vanilla-bean",
    name: "Vanilla Bean",
    price: 40,
    imageUrl: "/images/cake-2.jpg",
    subtitle: "Classic, light, and elegant.",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    price: 48,
    imageUrl: "/images/cake-3.jpg",
    subtitle: "Velvety crumb, cream cheese.",
  },
];

export default function BestSellers() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Best Sellers</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Customer favorites—perfect for celebrations and gifts.
          </p>
        </div>
        <a
          href="/menu"
          className="hidden text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline md:inline"
        >
          See full menu →
        </a>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {bestSellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
