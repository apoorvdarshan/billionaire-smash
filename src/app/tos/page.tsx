import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — bsmash",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
        <span className="text-gradient">Terms</span> of Service
      </h1>

      <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          Last updated: March 2, 2026
        </p>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Acceptance of Terms</h2>
          <p>
            By accessing or using Billionaire Smash (&quot;bsmash&quot;), you agree to be bound by these
            Terms of Service. If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Service Description</h2>
          <p>
            bsmash is a free entertainment platform where users vote on billionaires in head-to-head
            matchups. Rankings are calculated using an Elo rating system based on community votes.
            The service is provided &quot;as is&quot; for entertainment purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">User Conduct</h2>
          <p>
            You agree not to abuse, exploit, or attempt to manipulate the voting system. Automated
            voting, bot usage, or any form of vote manipulation is prohibited. We reserve the right
            to remove votes or restrict access at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Display Names</h2>
          <p>
            If you choose to set a display name, it will be visible to other users in the live feed.
            Display names must not contain offensive, hateful, or inappropriate content. We reserve
            the right to remove or modify display names that violate this policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Intellectual Property</h2>
          <p>
            Billionaire data and photos are sourced from Forbes and remain the property of their
            respective owners. The bsmash platform, its design, and code are the property of the
            site operator.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Disclaimer of Warranties</h2>
          <p>
            bsmash is provided &quot;as is&quot; without warranties of any kind, express or implied. We do
            not guarantee the accuracy of billionaire data, rankings, or net worth figures. Rankings
            reflect community opinion and are not endorsements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Limitation of Liability</h2>
          <p>
            In no event shall bsmash or its operators be liable for any indirect, incidental, special,
            or consequential damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of bsmash after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Contact</h2>
          <p>
            Questions about these terms? Reach out at{" "}
            <a
              href="mailto:apoorvdarshan@gmail.com"
              className="text-[var(--accent)] hover:underline"
            >
              apoorvdarshan@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
