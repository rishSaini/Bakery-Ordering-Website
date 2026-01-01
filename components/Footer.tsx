"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // v1: no backend hookup yet
    alert("Thanks! Newsletter signup is coming soon.");
    setEmail("");
  }

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold">Maya&apos;s Cake Cafe</div>
          <p className="mt-2 text-sm text-zinc-600">
            Handcrafted cakes and sweet treats for every celebration.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold">Location</div>
          <p className="mt-2 text-sm text-zinc-600">
            {/* Replace with real info */}
            Your City, State
            <br />
            Pickup & Delivery
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold">Hours</div>
          <p className="mt-2 text-sm text-zinc-600">
            Mon–Fri: 9am–6pm
            <br />
            Sat: 10am–4pm
            <br />
            Sun: Closed
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold">Newsletter</div>
          <p className="mt-2 text-sm text-zinc-600">Get seasonal specials and new drops.</p>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Join
            </button>
          </form>

          <div className="mt-4 flex gap-4 text-sm">
            <Link href="/contact" className="text-zinc-700 hover:text-zinc-950">
              Contact
            </Link>
            <a href="#" className="text-zinc-700 hover:text-zinc-950">
              Instagram
            </a>
            <a href="#" className="text-zinc-700 hover:text-zinc-950">
              TikTok
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
