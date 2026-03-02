import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — bsmash",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
        <span className="text-gradient">Privacy</span> Policy
      </h1>

      <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          Last updated: March 3, 2026
        </p>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Information We Collect</h2>
          <p>
            Billionaire Smash (&quot;bsmash&quot;) collects minimal data. When you vote, we record your vote
            choice. If you choose to set a display name, that name is stored locally in your browser and
            sent with your votes. We do not collect email addresses, passwords, or other personal
            identifiers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">How We Use Information</h2>
          <p>
            Vote data is used to calculate Elo rankings displayed on the leaderboard. Display names appear
            in the live feed alongside votes. Aggregate visitor counts are tracked to understand site
            traffic.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Data Storage</h2>
          <p>
            All data is stored in a hosted database (Turso). We do not sell, share, or transfer
            your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Local Storage</h2>
          <p>
            We use your browser&apos;s localStorage to remember your display name and whether you have been
            counted as a visitor. No cookies are used for tracking purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Payment Information</h2>
          <p>
            Elo boost purchases are processed through PayPal. We do not store your payment details,
            credit card numbers, or PayPal credentials. We only store the PayPal order ID, payer ID,
            purchase amount, and optional display name associated with the boost. PayPal&apos;s own privacy
            policy governs how they handle your payment data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Third-Party Services</h2>
          <p>
            Billionaire photos are loaded from Forbes media servers. We use the Forbes 400 API as a data
            source for billionaire information. Payments are processed by PayPal. These third parties may
            collect standard web request data (IP address, user agent) when serving content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Data Retention</h2>
          <p>
            Vote data and rankings are retained indefinitely as part of the game&apos;s historical record.
            You may clear your local display name at any time by clearing your browser&apos;s localStorage.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Children&apos;s Privacy</h2>
          <p>
            bsmash is not directed at children under 13. We do not knowingly collect information from
            children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be reflected on this page
            with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Contact</h2>
          <p>
            Questions about this policy? Reach out at{" "}
            <a
              href="mailto:ad13dtu@gmail.com"
              className="text-[var(--accent)] hover:underline"
            >
              ad13dtu@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
