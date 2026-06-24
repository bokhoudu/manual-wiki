"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "제품명, 브랜드, 모델명을 검색하세요"
}: SearchBarProps) {
  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-14 flex-1 rounded-lg border border-slate-300 bg-white px-5 text-base text-wiki-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
      />
      <button
        type="submit"
        className="min-h-14 rounded-lg bg-wiki-blue px-6 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        검색
      </button>
    </form>
  );
}
