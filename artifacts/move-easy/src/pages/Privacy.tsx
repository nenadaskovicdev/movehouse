import { AppLayout } from "@/components/layout/AppLayout";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}

export default function Privacy() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-3">Legal</p>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: 27 March 2026</p>
        </div>

        <div className="prose-sm">
          <Section title="1. Who We Are">
            <p>
              MoveEasy ("we", "us", "our") is a UK-based service that helps individuals notify councils and utility providers when moving home. We are operated by Junctionn Ltd, registered in England and Wales.
            </p>
            <p>
              If you have any questions about how we handle your data, contact us at: <a href="mailto:privacy@moveeasy.com" className="text-primary hover:underline">privacy@moveeasy.com</a>
            </p>
          </Section>

          <Section title="2. What Data We Collect">
            <p>We collect the following information when you use MoveEasy:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Account information:</strong> your full name and email address when you register.</li>
              <li><strong className="text-foreground">Address information:</strong> your current address, new address, and move date.</li>
              <li><strong className="text-foreground">Provider preferences:</strong> the councils, energy, water, and broadband providers you select to be notified.</li>
              <li><strong className="text-foreground">Electronic signature:</strong> your typed name provided as consent for us to act on your behalf.</li>
              <li><strong className="text-foreground">Usage data:</strong> browser type, IP address, and pages visited, collected automatically for service improvement.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Notify the councils and utility providers you have selected of your change of address.</li>
              <li>Create and manage your MoveEasy account and dashboard.</li>
              <li>Send you confirmation emails and updates about your move progress.</li>
              <li>Improve our service through anonymised usage analytics.</li>
              <li>Comply with legal obligations under UK law.</li>
            </ul>
            <p>We do <strong className="text-foreground">not</strong> sell your personal data to third parties, use it for unsolicited marketing without consent, or share it with providers you have not explicitly selected.</p>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <p>Under UK GDPR, we process your data on the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Contract performance:</strong> processing your move notifications as part of the service you have requested.</li>
              <li><strong className="text-foreground">Legitimate interests:</strong> improving our service and preventing fraud.</li>
              <li><strong className="text-foreground">Consent:</strong> where you have explicitly agreed, such as receiving marketing communications.</li>
            </ul>
          </Section>

          <Section title="5. Sharing Your Data">
            <p>We share your personal data only with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Providers you select:</strong> we share your name, old address, new address, and move date with each provider you have chosen to notify. This is the core function of the service.</li>
              <li><strong className="text-foreground">Service providers:</strong> third parties that help us operate (e.g. email delivery, cloud hosting), bound by data processing agreements.</li>
              <li><strong className="text-foreground">Legal requirements:</strong> if required by law, court order, or to protect our legal rights.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your personal data for as long as your account is active. If you request account deletion, we will delete your data within 30 days, except where we are legally required to retain certain records.</p>
            <p>Move notification records are retained for 12 months after your move date for audit purposes, then permanently deleted.</p>
          </Section>

          <Section title="7. Your Rights Under UK GDPR">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Access</strong> the personal data we hold about you.</li>
              <li><strong className="text-foreground">Rectify</strong> any inaccurate data.</li>
              <li><strong className="text-foreground">Erase</strong> your data ("right to be forgotten"), subject to legal obligations.</li>
              <li><strong className="text-foreground">Restrict</strong> or <strong className="text-foreground">object</strong> to how we process your data.</li>
              <li><strong className="text-foreground">Data portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong className="text-foreground">Withdraw consent</strong> at any time where processing is based on consent.</li>
            </ul>
            <p>To exercise any of these rights, email <a href="mailto:privacy@moveeasy.com" className="text-primary hover:underline">privacy@moveeasy.com</a>. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Information Commissioner's Office (ICO)</a>.</p>
          </Section>

          <Section title="8. Cookies">
            <p>We use cookies to keep you logged in and to understand how our service is used. See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for full details.</p>
          </Section>

          <Section title="9. Security">
            <p>We use industry-standard encryption (TLS) to protect data in transit and at rest. Access to personal data is restricted to authorised staff only. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes by email. Continued use of MoveEasy after changes constitutes acceptance of the updated policy.</p>
          </Section>
        </div>
      </div>
    </AppLayout>
  );
}
