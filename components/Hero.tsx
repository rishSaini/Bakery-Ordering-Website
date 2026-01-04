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
                <div className="absolute inset-0 bg-gradient-to-b from-rose-950/35 via-rose-900/20 to-amber-950/30" />

                <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center px-4 py-16">
                    <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium tracking-wide text-white ring-1 ring-white/25">
                        Handcrafted cakes • Custom designs • Eggless
                    </p>

                    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                        Handcrafted Sweetness in Salt Lake City
                    </h1>

                    <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
                        Signature cakes, cupcakes, and custom orders made with love—perfect for birthdays,
                        special occasions, and everything in between.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/menu"
                            className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-rose-600"
                        >
                            Browse Menu
                        </Link>

                        <Link
                            href="/custom-order"
                            className="rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25"
                        >
                            Custom Order
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
}
