type Feature = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

function IconFresh() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12Z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}
function IconCustom() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function IconEggless() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      {/* egg outline */}
      <path d="M12 3c3 0 6 4.1 6 9a6 6 0 0 1-12 0c0-4.9 3-9 6-9Z" />
      {/* no-egg slash */}
      <path d="M4 20L20 4" />
    </svg>
  );
}

const features: Feature[] = [
  { title: "Baked Daily", subtitle: "Fresh ingredients, every morning.", icon: <IconFresh /> },
  { title: "Design Your Own", subtitle: "Custom cakes for any theme.", icon: <IconCustom /> },
  {
    title: "100% Eggless",
    subtitle: "All cakes are eggless by default—perfect for vegetarians and egg-free preferences.",
    icon: <IconEggless />,
  },
];


export default function FeatureRow() {
  return (
    <section className="border-y border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-500 p-2 text-white">{f.icon}</div>
              <div>
                <div className="text-base font-semibold">{f.title}</div>
                <div className="text-sm text-rose-700/80">{f.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
