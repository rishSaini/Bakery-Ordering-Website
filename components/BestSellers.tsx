import ProductCard, { Product } from "@/components/ProductCard";

function toDisplayUrl(url: string) {
    if (!url.includes("/image/upload/")) return url;
    if (url.includes("/image/upload/f_auto")) return url;
    return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

const bestSellers: Product[] = [
  {
    id: "rasmalai-cake",
    name: "Rasmalai Cake",
    price: 50,
    imageUrl: toDisplayUrl("https://res.cloudinary.com/deuxtg2g2/image/upload/v1767470338/IMG_7414_uyho1d.heic"),
    subtitle: "Light, milky sweetness with a nostalgic indian sweet taste",
  },
  {
    id: "strawberry-chocolate",
    name: "Strawberry Chocolate",
    price: 40,
    imageUrl: toDisplayUrl("https://res.cloudinary.com/deuxtg2g2/image/upload/v1767471667/IMG_3012_n4kilb.heic"),
    subtitle: "Fresh strawberry layers with rich chocolate ganache.",
  },
  {
    id: "vanilla-cupcakes",
    name: "Vanilla Cupcakes (6-pack)",
    price: 18,
    imageUrl: "https://res.cloudinary.com/deuxtg2g2/image/upload/v1767394428/cdcffbef-1b94-4205-b2f1-406b2ba05691_lgzvfl.jpg",
    subtitle: "Fluffy vanilla cupcakes topped with silky vanilla buttercream.",
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

      <div className="mt-8 grid items-start gap-5 md:grid-cols-3">
        {bestSellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
