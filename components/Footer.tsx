"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="text-lg font-semibold">Maya&apos;s Cake Cafe</div>
          <p className="mt-2 text-sm text-zinc-600">
            Handcrafted cakes and sweet treats for every celebration.
          </p>
        </div>

        {/* Location */}
        <div>
          <div className="text-sm font-semibold">Location</div>
          <p className="mt-2 text-sm text-zinc-600">
            1344 E 4065 S
            <br />
            Millcreek UT, 84124
          </p>
        </div>

        {/* Links */}
        <div>
          <div className="text-sm font-semibold">Links</div>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link href="/contact" className="text-zinc-700 hover:text-zinc-950">
              Contact
            </Link>
            <a
              href="https://www.instagram.com/mayas_cake_cafe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-zinc-950"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Maya&apos;s Cake Cafe. All rights reserved.</p>
          <p>
            Built with ❤️ •{" "}
            <a className="hover:underline" href="#">
              Privacy
            </a>{" "}
            •{" "}
            <a className="hover:underline" href="#">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
