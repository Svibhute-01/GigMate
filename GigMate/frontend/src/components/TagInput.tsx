import { useState, type KeyboardEvent } from "react";

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helper?: string;
};

export default function TagInput({ label, values, onChange, placeholder, helper }: Props) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    for (const p of parts) {
      if (!next.includes(p)) next.push(p);
    }
    onChange(next);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function remove(i: number) {
    const next = values.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <label className="block">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="mt-1 flex flex-wrap items-center gap-2 px-2 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] focus-within:border-[#18c29c]">
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#0f3d34] text-[#cfeee5] text-xs"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-gray-400 hover:text-white"
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft && commit(draft)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] bg-transparent text-white text-sm outline-none py-0.5"
        />
      </div>
      {helper && <span className="mt-1 block text-[11px] text-gray-500">{helper}</span>}
    </label>
  );
}
