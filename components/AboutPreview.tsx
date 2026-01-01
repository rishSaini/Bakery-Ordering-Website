import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-zinc-200">
          <img
            src="/images/maya.jpg"
            alt="Maya"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Meet Maya</h2>
          <p className="mt-3 text-zinc-700">
            Hi, I’m Maya! I started this cafe to bring a little more sweetness to everyday life.
            Every cake is handcrafted with care—whether it’s a simple treat or a once-in-a-lifetime
            celebration.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/about"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Read Our Story
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
