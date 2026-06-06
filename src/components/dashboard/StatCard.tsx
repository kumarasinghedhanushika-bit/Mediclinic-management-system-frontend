import type { LucideIcon } from "lucide-react";

type ColorKey = "blue" | "green" | "amber" | "rose" | "violet" | "teal" | "cyan" | "pink";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: ColorKey;
  sub?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  sub,
}: StatCardProps) {
  const colors: Record<
    ColorKey,
    { bg: string; icon: string; val: string }
  > = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      val: "text-blue-700",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      val: "text-green-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      val: "text-amber-700",
    },
    rose: {
      bg: "bg-rose-50",
      icon: "bg-rose-100 text-rose-600",
      val: "text-rose-700",
    },
    violet: {
      bg: "bg-violet-50",
      icon: "bg-violet-100 text-violet-600",
      val: "text-violet-700",
    },
    teal: {
      bg: "bg-teal-50",
      icon: "bg-teal-100 text-teal-600",
      val: "text-teal-700",
    },
    cyan: {
      bg: "bg-cyan-50",
      icon: "bg-cyan-100 text-cyan-600",
      val: "text-cyan-700",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "bg-pink-100 text-pink-600",
      val: "text-pink-700",
    },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} rounded-xl p-4 border border-white`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <div
          className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center`}
        >
          <Icon size={16} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.val}`}>{value ?? "—"}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
