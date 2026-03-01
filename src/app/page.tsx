import { VotingArena } from "@/components/VotingArena";
import { LiveFeed } from "@/components/LiveFeed";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start max-w-[1400px] mx-auto">
      {/* Live feed — horizontal ticker on mobile, right sidebar on desktop */}
      <aside className="order-first lg:order-last w-full lg:w-96 lg:flex-shrink-0 lg:px-0 lg:py-6 lg:pr-6">
        <div className="lg:sticky lg:top-20">
          <LiveFeed
            limit={20}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
          />
        </div>
      </aside>

      {/* Main arena */}
      <div className="flex-1 min-w-0">
        <VotingArena />
      </div>
    </div>
  );
}
