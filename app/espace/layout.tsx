import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Membres | natura'bio by yas",
  description: "Chat IA, forum et protocoles personnalisés",
};

export default function EspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {children}
    </div>
  );
}
