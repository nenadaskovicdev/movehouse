import { AppLayout } from "@/components/layout/AppLayout";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}

export default function Terms() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-3">Legal</p>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: 27 March 2026</p>
        </div>

        <div className="prose-sm">
          <Section title="1. About MoveEasy">
            <p>
              MoveEasy is a free online service operated by Junctionn Ltd ("we", "us", "our"), registered in England and Wales. Our service helps you notify UK councils, utility providers, and other organisations of your change of address when moving home.
            </p>
            <p>
              By creating an account or using MoveEasy, you agree to these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </Section>

          <Section title="2. The Service">
            <p>MoveEasy allows you to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enter your old and new address details and move date.</li>
              <li>Select which councils and utility providers you wish to notify.</li>
              <li>Authorise MoveEasy to act as your agent in sending change-of-address notifications on your behalf.</li>
              <li>Track the status of your notifications from your dashboard.</li>
            </ul>
            <p>MoveEasy is free to use. We may earn a referral commission if you choose to switch to one of our partner providers through our recommendations. There is never any obligation to do so.</p>
          </Section>

          <Section title="3. Your Account">
            <p>To use MoveEasy, you must:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be at least 18 years old.</li>
              <li>Provide accurate and truthful information.</li>
              <li>Keep your account credentials secure and not share them with others.</li>
              <li>Notify us promptly if you suspect unauthorised use of your account.</li>
            </ul>
            <p>You are responsible for all activity that occurs under your account.</p>
          </Section>

          <Section title="4. Accuracy of Information">
            <p>You confirm that all information you provide — including your name, addresses, and move date — is accurate and up to date. MoveEasy acts solely as an agent forwarding the information you provide. We are not responsible for failed notifications caused by incorrect information you have supplied.</p>
            <p>If you discover an error in your submitted details, contact our support team as soon as possible at <a href="mailto:support@moveeasy.com" className="text-primary hover:underline">support@moveeasy.com</a>.</p>
          </Section>

          <Section title="5. Limitations of Service">
            <p>MoveEasy facilitates notifications but does not guarantee that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Providers will process your notification within any particular timeframe.</li>
              <li>All providers listed will accept electronic change-of-address requests.</li>
              <li>Notifications will result in immediate account updates with third-party organisations.</li>
            </ul>
            <p>Provider processing times are outside our control. We recommend notifying providers at least 2–4 weeks before your move date.</p>
          </Section>

          <Section title="6. Partner Recommendations">
            <p>MoveEasy may recommend partner energy, broadband, or other providers as part of the service. These recommendations are clearly marked. We may receive a commission if you switch. Recommendations are made in good faith but should not be taken as independent financial advice. You should compare deals and assess suitability yourself.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content, design, code, and branding on MoveEasy — including the name, logo, and interface — belong to Junctionn Ltd and may not be copied, reproduced, or used without express written permission.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the maximum extent permitted by law, MoveEasy and Junctionn Ltd shall not be liable for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Any direct or indirect loss arising from a provider's failure to process a notification.</li>
              <li>Loss of data, revenue, or profits arising from use of the service.</li>
              <li>Any third-party content or services accessed via MoveEasy.</li>
            </ul>
            <p>Our total liability to you shall not exceed £100 in any 12-month period. Nothing in these Terms limits liability for death or personal injury caused by negligence, or for fraud.</p>
          </Section>

          <Section title="9. Termination">
            <p>You may delete your account at any time by contacting <a href="mailto:support@moveeasy.com" className="text-primary hover:underline">support@moveeasy.com</a>. We may suspend or terminate your account if you breach these Terms or if we have reason to believe your use is fraudulent or harmful.</p>
          </Section>

          <Section title="10. Changes to These Terms">
            <p>We may update these Terms from time to time. We will notify you of material changes by email at least 14 days before they take effect. Continued use of MoveEasy after that date constitutes acceptance.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </Section>

          <Section title="12. Contact">
            <p>Questions about these Terms? Contact us at <a href="mailto:legal@moveeasy.com" className="text-primary hover:underline">legal@moveeasy.com</a>.</p>
          </Section>
        </div>
      </div>
    </AppLayout>
  );
}
