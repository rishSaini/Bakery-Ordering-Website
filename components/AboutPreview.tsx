import Link from "next/link";

function toDisplayUrl(url: string) {
    if (!url.includes("/image/upload/")) return url;
    if (url.includes("/image/upload/f_auto")) return url;
    return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export default function AboutPreview() {
    return (
        <section className="bg-gradient-to-b from-amber-50/60 via-white to-rose-50/60">
            <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
                {/* Image */}

                {/* narrower frame -> crops sides */}
                {/* Image */}
                <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-zinc-200 md:max-w-sm">
                    <div className="h-72 w-full md:h-80">
                        <img
                            src={toDisplayUrl(
                                "https://res.cloudinary.com/deuxtg2g2/image/upload/v1767474539/IMG_9147_ur1ele.heic"
                            )}
                            alt="Maya"
                            className="h-full w-full object-cover object-[50%_30%]"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>

                {/* Text */}
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Meet Maya</h2>
                    <p className="mt-3 text-rose-800/90">
                        Hi, I’m Maya! I started this cafe to bring a little more sweetness to everyday life.
                        Every cake is handcrafted with care—whether it’s a simple treat or a once-in-a-lifetime
                        celebration.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Link
                            href="/about"
                            className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
                        >
                            Read Our Story
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
                        >
                            Ask a Question
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
