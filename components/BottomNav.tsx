 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "主页", icon: "⌘" },
  { href: "/today", label: "今日建议", icon: "日" },
  { href: "/profile", label: "画像健康", icon: "身" },
  { href: "/social", label: "轻社交", icon: "缘" }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex w-full max-w-md items-center justify-between rounded-full border border-white/70 bg-white/80 px-3 py-2 text-xs shadow-card backdrop-blur">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center rounded-full px-2 py-1 transition ${
                active ? "bg-jade-soft text-ink" : "text-ink-soft hover:bg-slate-100"
              }`}
            >
              <span className="text-[11px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


