type Props = {
  page: number;
  setPage: (p: number) => void;
  pageCount: number;
};

export default function Pagination({ page, setPage, pageCount }: Props) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          className={
            p === page
              ? "rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
              : "rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-50"
          }
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setPage(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
