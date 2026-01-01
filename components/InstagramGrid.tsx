const images = [
  "/images/ig-1.jpg",
  "/images/ig-2.jpg",
  "/images/ig-3.jpg",
  "/images/ig-4.jpg",
  "/images/ig-5.jpg",
  "/images/ig-6.jpg",
];

export default function InstagramGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Instagram <span className="text-zinc-500">#MayasCakeCafe</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Fresh bakes, custom cakes, and behind-the-scenes moments.
          </p>
        </div>

        {/* Replace with your real IG link later */}
        <a
          href="#"
          className="hidden text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline md:inline"
        >
          Follow →
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, idx) => (
          <div
            key={src}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200"
          >
            <img
              src={src}
              alt={`Instagram photo ${idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
                View
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
