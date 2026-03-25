import { Resend } from "resend";
import { logger } from "./logger";

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

export interface MovePreviewData {
  userName: string;
  userEmail: string;
  oldAddress: string;
  newAddress: string;
  moveDate: string;
  providers: Array<{ name: string; category: string }>;
}

function buildPreviewEmail(data: MovePreviewData): string {
  const providerRows = data.providers
    .map(
      (p) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#1a1a2e;">${p.name}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#6b7280;text-transform:capitalize;">${p.category}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;">
          <span style="background:#fef3c7;color:#92400e;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;">Would be notified</span>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MoveEasy – Test Move Preview</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#E07B39;font-size:22px;font-weight:800;letter-spacing:-0.5px;">MoveEasy</span>
                    <span style="color:#ffffff;font-size:22px;font-weight:300;margin-left:2px;"> · Test Preview</span>
                  </td>
                  <td align="right">
                    <span style="background:#E07B39;color:#ffffff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;">TEST MODE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notice banner -->
          <tr>
            <td style="background:#fef9f5;border-bottom:2px solid #E07B39;padding:14px 32px;">
              <p style="margin:0;font-size:13px;color:#92400e;">
                <strong>⚠ This is a test run.</strong> No notifications have been sent to any providers.
                This email shows exactly what would happen in a live move submission.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="margin:0 0 24px;font-size:18px;color:#1a1a2e;">Move notification preview</h2>

              <!-- User info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#9ca3af;font-weight:600;">Customer</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a1a2e;">${data.userName}</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">${data.userEmail}</p>
                  </td>
                </tr>
              </table>

              <!-- Addresses -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="48%" style="background:#f0fdf4;border-radius:8px;padding:16px 20px;vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#16a34a;font-weight:600;">Moving from</p>
                    <p style="margin:0;font-size:14px;color:#1a1a2e;line-height:1.5;">${data.oldAddress}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#eff6ff;border-radius:8px;padding:16px 20px;vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#2563eb;font-weight:600;">Moving to</p>
                    <p style="margin:0;font-size:14px;color:#1a1a2e;line-height:1.5;">${data.newAddress}</p>
                  </td>
                </tr>
              </table>

              <!-- Move date -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#faf5ff;border-radius:8px;padding:14px 20px;">
                    <p style="margin:0;font-size:13px;color:#7c3aed;">
                      <strong>Move date:</strong> ${data.moveDate}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Providers table -->
              <h3 style="margin:0 0 12px;font-size:15px;color:#1a1a2e;">Providers that would be notified</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;color:#6b7280;font-weight:600;">Provider</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;color:#6b7280;font-weight:600;">Category</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;color:#6b7280;font-weight:600;">Status</th>
                </tr>
                ${providerRows}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                This is an internal test preview generated by MoveEasy · Do not forward to providers
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendTestMovePreview(
  toEmail: string,
  data: MovePreviewData
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY not set – skipping test preview email");
    return;
  }

  const html = buildPreviewEmail(data);

  const { error } = await resend.emails.send({
    from: "MoveEasy <onboarding@resend.dev>",
    to: toEmail,
    subject: `[TEST PREVIEW] Move notification – ${data.userName} · ${data.moveDate}`,
    html,
  });

  if (error) {
    logger.error({ error }, "Failed to send test preview email");
  } else {
    logger.info({ to: toEmail, user: data.userEmail }, "Test preview email sent");
  }
}
