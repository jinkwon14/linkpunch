import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <div className="relative min-h-screen pb-[5.5rem]">{children}</div>;
}
