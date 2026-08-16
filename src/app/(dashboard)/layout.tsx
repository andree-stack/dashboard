import { auth } from "@/auth";
import { TopNav } from "@/components/top-nav";
import { FilterProvider } from "@/components/filter-context";
import { FilterBar } from "@/components/filter-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <FilterProvider>
      <div className="min-h-screen bg-background">
        <TopNav userName={session?.user?.name ?? session?.user?.email ?? ""} />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <FilterBar />
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </FilterProvider>
  );
}
