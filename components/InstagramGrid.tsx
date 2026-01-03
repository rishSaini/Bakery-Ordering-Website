const IG_URL = "https://www.instagram.com/mayas_cake_cafe/";
const IG_HANDLE = "@mayas_cake_cafe";

function toDisplayUrl(url: string) {
    if (!url.includes("/image/upload/")) return url;
    if (url.includes("/image/upload/f_auto")) return url;
    return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

const images = [
  {
    src: toDisplayUrl("https://res.cloudinary.com/deuxtg2g2/image/upload/v1767394294/IMG_4349_zwjzjc.heic"),
    href: "https://www.instagram.com/p/DQXDH8BgIWn/?img_index=1",
    alt: "Instagram post 1",
  },
  {
    src: toDisplayUrl("https://res.cloudinary.com/deuxtg2g2/image/upload/v1767470319/IMG_7840_t6pr3q.heic"),
    href: "https://www.instagram.com/p/DSaXX8ZDbH3/",
    alt: "Instagram post 2",
  },
  {
    src: toDisplayUrl("https://res.cloudinary.com/deuxtg2g2/image/upload/v1767394358/IMG_7763_o4gduv.heic"),
    href: "https://www.instagram.com/p/C0fjNpZLWQY/?img_index=1",
    alt: "Instagram post 3",
  },
];

export default function InstagramGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Instagram{" "}
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 underline-offset-4 hover:underline"
            >
              {IG_HANDLE}
            </a>
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Fresh bakes, custom cakes, and behind-the-scenes moments.
          </p>
        </div>

        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline md:inline"
        >
          Follow →
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((img, idx) => (
          <a
            key={img.src}
            href={img.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${IG_HANDLE} post ${idx + 1}`}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-rose-50 ring-1 ring-rose-100"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
                View on Instagram
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
        >
          Follow {IG_HANDLE} →
        </a>
      </div>
    </section>
  );
}
