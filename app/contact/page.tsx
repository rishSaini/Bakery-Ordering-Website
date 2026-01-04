import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PHONE_DISPLAY = "+1 (385) 775-4252";
const PHONE_E164 = "+13857754252";
const WHATSAPP_NUMBER = "13857754252"; // no +, country code included
const EMAIL = "maya.s.saini@gmail.com";
const IG_HANDLE = "@mayas_cake_cafe";
const IG_URL = "https://www.instagram.com/mayas_cake_cafe/";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="border-b border-rose-100">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        <p className="mb-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-medium tracking-wide text-rose-900 ring-1 ring-rose-200">
                            Contact
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                            Let&apos;s plan something sweet
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm text-rose-800/90 md:text-base">
                            For orders, questions, or custom cake ideas—reach out anytime. Call, text, WhatsApp, email,
                            or DM on Instagram.
                        </p>
                    </div>
                </section>

                {/* Contact Cards */}
                <section className="mx-auto max-w-6xl px-4 py-14">
                    <div className="grid gap-5 md:grid-cols-3">
                        {/* Phone / Text / WhatsApp */}
                        <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white shadow-sm">
                                    📞
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold">Call, Text, or WhatsApp</h2>
                                    <p className="mt-1 text-sm text-rose-800/85">Fastest way to reach us.</p>

                                    {/* Pink overlay (not a button) */}
                                    <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
                                        <div className="text-sm font-semibold text-rose-950">{PHONE_DISPLAY}</div>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
                                            <a
                                                href={`tel:${PHONE_E164}`}
                                                className="text-rose-700 hover:text-rose-900 hover:underline underline-offset-4"
                                            >
                                                Call
                                            </a>
                                            <span className="text-rose-300">•</span>
                                            <a
                                                href={`sms:${PHONE_E164}`}
                                                className="text-rose-700 hover:text-rose-900 hover:underline underline-offset-4"
                                            >
                                                Text
                                            </a>
                                            <span className="text-rose-300">•</span>
                                            <a
                                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-rose-700 hover:text-rose-900 hover:underline underline-offset-4"
                                            >
                                                WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Email */}
                        <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white shadow-sm">
                                    ✉️
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold">Email</h2>
                                    <p className="mt-1 text-sm text-rose-800/85">
                                        Great for details, inspiration photos, and custom requests.
                                    </p>

                                    <a
                                        href={`mailto:${EMAIL}`}
                                        className="mt-4 inline-flex w-full items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-950 ring-1 ring-rose-100 hover:bg-rose-100"
                                    >
                                        <span className="truncate">{EMAIL}</span>
                                        <span className="text-rose-700/70">Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Instagram */}
                        <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white shadow-sm">
                                    📷
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold">Instagram</h2>
                                    <p className="mt-1 text-sm text-rose-800/85">
                                        Follow for fresh bakes + DM for quick questions.
                                    </p>

                                    <a
                                        href={IG_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex w-full items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-950 ring-1 ring-rose-100 hover:bg-rose-100"
                                    >
                                        <span className="truncate">{IG_HANDLE}</span>
                                        <span className="text-rose-700/70">Open</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Small note */}
                    <div className="mt-6 rounded-3xl bg-amber-50/70 p-5 text-sm text-rose-900 ring-1 ring-amber-200">
                        <span className="font-semibold">Tip:</span> For custom cakes, include the date you need it,
                        serving size, theme/colors, and any inspiration photos.
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
