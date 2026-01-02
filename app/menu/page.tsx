import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuClient, { Product } from "@/components/menu/MenuClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // refresh menu every 60s (set 0 for always-fresh in dev)

export default async function MenuPage() {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      priceCents: true,
      category: true,
      dietary: true,
      imageUrl: true,
      popularity: true,
      badge: true,
    },
  });

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number((p.priceCents / 100).toFixed(2)),
    category: p.category as any, // your UI expects specific strings; keep DB values consistent
    dietary: (p.dietary ?? []) as any, // must match your DietaryKey values to filter correctly
    imageUrl: p.imageUrl,
    popularity: p.popularity ?? 0,
    badge: p.badge ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
      <Navbar cartCount={0} />
      <main>
        <MenuClient initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
