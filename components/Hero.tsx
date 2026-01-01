import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative">
      <div
        className="relative min-h-[72vh] w-full"
        style={{
          backgroundImage: "url(/images/hero-cake.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center px-4 py-16">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white ring-1 ring-white/20">
            Handcrafted cakes • Custom designs • Local delivery
          </p>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Handcrafted Sweetness for Every Celebration
          </h1>

          <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
            Signature cakes, cupcakes, and custom orders made with love—perfect for birthdays,
            weddings, and everything in between.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow hover:bg-zinc-100"
            >
              Browse Menu
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-zinc-900/70 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-zinc-900/85"
            >
              Custom Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
