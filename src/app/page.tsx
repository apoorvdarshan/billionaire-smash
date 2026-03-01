import { VotingArena } from "@/components/VotingArena";
import { LiveFeed } from "@/components/LiveFeed";

export default function Home() {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start max-w-[1400px] mx-auto">
      {/* Main arena */}
      <div className="flex-1 min-w-0">
        <VotingArena />
      </div>

      {/* Sidebar feed — right side on desktop, below on mobile */}
      <aside className="w-full xl:w-80 xl:flex-shrink-0 px-4 pb-8 xl:py-10 xl:pr-6 xl:pl-0">
        <div className="xl:sticky xl:top-24">
          <LiveFeed
            limit={20}
            className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
          />
        </div>
      </aside>
    </div>
  );
}
