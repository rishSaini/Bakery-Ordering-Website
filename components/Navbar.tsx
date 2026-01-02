import Link from "next/link";
import Image from "next/image";


type NavbarProps = {
    cartCount?: number;
};

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop/Menu", href: "/menu" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar({ cartCount = 0 }: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/70 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* LEFT: Logo / brand block */}
                <Link href="/" className="flex h-full items-center">
                    <div className="h-25 overflow-hidden">
                        <Image
                            src="https://res.cloudinary.com/deuxtg2g2/image/upload/v1767377671/ChatGPT_Image_Jan_2_2026_11_14_03_AM_vwpktc.png"
                            alt="Maya's Cake Cafe"
                            width={220}
                            height={60}
                            priority
                            className="block h-30 w-auto object-contain -translate-y-1"
                        />
                    </div>
                </Link>

                {/* RIGHT: Links + cart block (kept together) */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-6">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-sm text-rose-700 hover:text-rose-950"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/60 px-3 py-1.5 text-sm hover:bg-rose-50"
                        aria-label={`Cart with ${cartCount} items`}
                    >
                        <span aria-hidden>🛒</span>
                        <span className="font-medium">Cart</span>
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                            {cartCount}
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile nav */}
            <div className="border-t border-zinc-200 md:hidden">
                <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}