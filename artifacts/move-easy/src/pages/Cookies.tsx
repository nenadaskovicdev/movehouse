import { AppLayout } from "@/components/layout/AppLayout";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}

function CookieTable({ rows }: { rows: { name: string; purpose: string; type: string; expires: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border mt-4">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {["Cookie Name", "Purpose", "Type", "Expires"].map(h => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white">
              <td className="px-4 py-3 font-mono text-xs text-foreground">{row.name}</td>
              <td className="px-4 py-3">{row.purpose}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">{row.expires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-3">Legal</p>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: 27 March 2026</p>
        </div>

        <div className="prose-sm">
          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They allow the website to remember your preferences and actions over time, so you don't have to re-enter information every time you visit.
            </p>
            <p>MoveEasy uses cookies to keep the service working properly, remember your login session, and understand how people use our service so we can improve it.</p>
          </Section>

          <Section title="2. Cookies We Use">
            <h3 className="font-semibold text-foreground mt-4 mb-2">Essential Cookies</h3>
            <p>These cookies are strictly necessary for the MoveEasy service to function. Without them, you would not be able to log in or use the service. They cannot be switched off.</p>
            <CookieTable rows={[
              { name: "connect.sid", purpose: "Keeps you logged in to your MoveEasy account across page loads.", type: "Essential", expires: "Session" },
              { name: "csrf_token", purpose: "Protects against cross-site request forgery attacks.", type: "Essential", expires: "Session" },
            ]} />

            <h3 className="font-semibold text-foreground mt-6 mb-2">Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with MoveEasy — which pages are most popular, where users drop off, and how we can improve the experience. All data is anonymised and aggregated.</p>
            <CookieTable rows={[
              { name: "_ga", purpose: "Google Analytics — distinguishes unique users for traffic analysis.", type: "Analytics", expires: "2 years" },
              { name: "_ga_*", purpose: "Google Analytics — stores session state.", type: "Analytics", expires: "2 years" },
              { name: "_gid", purpose: "Google Analytics — identifies user sessions.", type: "Analytics", expires: "24 hours" },
            ]} />

            <h3 className="font-semibold text-foreground mt-6 mb-2">Preference Cookies</h3>
            <p>These remember your settings and preferences to give you a personalised experience.</p>
            <CookieTable rows={[
              { name: "cookie_consent", purpose: "Remembers whether you have accepted or declined optional cookies.", type: "Preference", expires: "1 year" },
            ]} />
          </Section>

          <Section title="3. Third-Party Cookies">
            <p>Some cookies on MoveEasy are set by third-party services we use:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Google Analytics</strong> — used for anonymised website traffic analysis. Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.</li>
              <li><strong className="text-foreground">Resend</strong> — our email delivery provider. Does not set browser cookies.</li>
            </ul>
            <p>We do not use cookies for targeted advertising or share cookie data with advertising networks.</p>
          </Section>

          <Section title="4. Managing Cookies">
            <p>You can control and delete cookies through your browser settings. Here's how for the most common browsers:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
            </ul>
            <p className="mt-3">Please note: disabling essential cookies will prevent you from logging in to MoveEasy and using core features of the service.</p>
          </Section>

          <Section title="5. Your Consent">
            <p>When you first visit MoveEasy, you will be asked to accept or decline non-essential cookies (analytics and preferences). Essential cookies are set automatically as they are required for the service to operate.</p>
            <p>You can withdraw your consent at any time by clearing cookies in your browser or contacting us at <a href="mailto:privacy@moveeasy.com" className="text-primary hover:underline">privacy@moveeasy.com</a>.</p>
          </Section>

          <Section title="6. Changes to This Policy">
            <p>We may update this Cookie Policy as we add new features or services. Significant changes will be communicated via a notice on our website or by email.</p>
          </Section>

          <Section title="7. Contact">
            <p>Questions about our use of cookies? Email <a href="mailto:privacy@moveeasy.com" className="text-primary hover:underline">privacy@moveeasy.com</a>.</p>
          </Section>
        </div>
      </div>
    </AppLayout>
  );
}
