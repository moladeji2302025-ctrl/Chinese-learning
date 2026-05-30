import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const XP_PER_LEVEL = 500;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, currentLevel: true, xp: true, currentStreak: true },
  });

  if (!user) redirect("/login");

  const levelXp = user.xp % XP_PER_LEVEL;
  const maxXp = XP_PER_LEVEL;

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        userLevel={user.currentLevel}
        xp={levelXp}
        maxXp={maxXp}
        streak={user.currentStreak}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header userName={user.name} streak={user.currentStreak} />
        <main className="flex-1 overflow-y-auto p-6 bg-surface-0">{children}</main>
      </div>
    </div>
  );
}
