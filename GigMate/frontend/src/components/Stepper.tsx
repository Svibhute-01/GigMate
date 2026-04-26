type Props = {
  steps: string[];
  current: number;
};

export default function Stepper({ steps, current }: Props) {
  const total = steps.length;
  const progress = total <= 1 ? 100 : (current / (total - 1)) * 100;

  return (
    <div className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const isDone = i < current;
          const isActive = i === current;
          return (
            <li key={label} className="flex-1 flex items-center gap-3 min-w-0">
              <div
                className={[
                  "shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
                  isActive
                    ? "bg-[#18c29c] text-black border-[#18c29c]"
                    : isDone
                    ? "bg-[#0f3d34] text-[#18c29c] border-[#18c29c]"
                    : "bg-[#062a23] text-gray-400 border-[#0f3d34]",
                ].join(" ")}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={[
                  "text-sm truncate hidden sm:inline",
                  isActive ? "text-white" : isDone ? "text-gray-300" : "text-gray-500",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 h-1.5 w-full rounded-full bg-[#0f3d34] overflow-hidden">
        <div
          className="h-full bg-[#18c29c] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Step {current + 1} of {total} — {steps[current]}
      </p>
    </div>
  );
}
