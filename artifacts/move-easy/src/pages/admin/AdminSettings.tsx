import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Mail, FlaskConical, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAdminGetSettings, useAdminUpdateSettings } from "@workspace/api-client-react";

export default function AdminSettings() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { data: settings, isLoading } = useAdminGetSettings(
    { request: { credentials: "include" } },
    {
      onSuccess: (data: any) => {
        setEmail(data.testPreviewEmail ?? "");
      },
    } as any
  );

  const { mutate: updateSettings, isPending } = useAdminUpdateSettings({
    mutation: {
      onSuccess: () => {
        setSaved(true);
        setError("");
        setTimeout(() => setSaved(false), 3000);
      },
      onError: () => {
        setError("Failed to save. Check the email address format.");
      },
    },
    request: { credentials: "include" },
  });

  const handleSave = () => {
    setSaved(false);
    setError("");
    updateSettings({ data: { testPreviewEmail: email } });
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Platform configuration</p>
        </div>

        {/* Test mode config */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FlaskConical className="w-4 h-4 text-amber-500" />
              Test Mode
            </CardTitle>
            <CardDescription>
              When a user is marked as a test account, submitting a move will not notify any providers.
              Instead, a preview email showing exactly what providers would receive is sent to the address below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex gap-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium mb-1">How to set up a test account</p>
                <ol className="list-decimal list-inside space-y-1 text-amber-700">
                  <li>Set the test preview email address below</li>
                  <li>Add the <strong>RESEND_API_KEY</strong> secret in your environment settings</li>
                  <li>Go to Move Cases, open a case, and toggle the user to "Test Account"</li>
                  <li>When that account submits a move, a preview email is sent to the address below</li>
                </ol>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testEmail" className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Preview email destination
              </Label>
              <p className="text-xs text-muted-foreground">
                The email address that will receive all test move previews.
              </p>
              {isLoading ? (
                <div className="h-10 bg-muted animate-pulse rounded-md" />
              ) : (
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="assim@moveeasy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
            {saved && (
              <p className="text-sm text-green-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
              </p>
            )}

            <Button onClick={handleSave} disabled={isPending || isLoading}>
              {isPending ? "Saving…" : "Save settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for other settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-4 h-4 text-primary" />
              More settings coming soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Email templates, provider submission configuration, and branding will appear here in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
