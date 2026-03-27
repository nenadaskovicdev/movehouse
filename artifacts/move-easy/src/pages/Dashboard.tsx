import { AppLayout } from "@/components/layout/AppLayout";
import { ProviderCard } from "@/components/shared/ProviderCard";
import { RecommendedProviderCard } from "@/components/shared/RecommendedProviderCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, User, Loader2, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useListMoves, useGetMove } from "@workspace/api-client-react";
import { Link } from "wouter";
import { SupportChat } from "@/components/shared/SupportChat";

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: moves = [], isLoading: movesLoading } = useListMoves({
    request: { credentials: "include" },
  });

  const latestMove = moves[moves.length - 1];

  const { data: moveDetail, isLoading: detailLoading } = useGetMove(
    latestMove?.id ?? 0,
    {
      query: { enabled: !!latestMove },
      request: { credentials: "include" },
    }
  );

  const isLoading = movesLoading || (!!latestMove && detailLoading);

  const affiliateProviders = moveDetail?.providers.filter(p => !p.isAffiliate) ?? [];
  const nonSelectedAffiliate = moveDetail
    ? [
        { name: "Octopus Energy", type: "100% Renewable Gas & Electric", description: "Join the UK's most awarded energy supplier. No exit fees, fair pricing, and excellent customer service.", features: ["£50 credit when you switch", "100% renewable electricity", "Award-winning support"], logoText: "octopus", colorClass: "bg-[#180044]" },
        { name: "YouFibre", type: "Ultrafast Full Fibre Broadband", description: "Don't suffer buffering in your new home. Get symmetric gigabit speeds at incredible prices.", features: ["Speeds up to 8000 Mbps", "No mid-contract price rises", "Free installation"], logoText: "YouFibre", colorClass: "bg-[#E40046]" },
      ].filter(ap => !moveDetail.providers.some(mp => mp.providerName === ap.name))
    : [];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!latestMove) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">No move set up yet</h1>
            <p className="text-muted-foreground">Get started by setting up your move and we'll handle the rest.</p>
          </div>
          <Link href="/wizard">
            <Button size="lg" className="shadow-md shadow-primary/20">
              Set Up My Move
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const statusMap: Record<string, { label: string; variant: "submitted" | "completed" | "pending" | "action_required" | "failed" }> = {
    pending: { label: "Pending", variant: "pending" },
    submitted: { label: "Submitted", variant: "submitted" },
    completed: { label: "Completed", variant: "completed" },
    failed: { label: "Failed", variant: "failed" },
    action_required: { label: "Action Required", variant: "action_required" },
  };

  return (
    <AppLayout>
      <div className="bg-muted/30 min-h-screen pb-24">
        {/* Header Area */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.fullName ?? "there"}</h1>
                <p className="text-muted-foreground">
                  {latestMove.status === "active" ? "Your move is currently in progress." : `Move status: ${latestMove.status}`}
                </p>
              </div>
            </div>

            {/* Move Overview Card */}
            <Card className="bg-gradient-to-br from-primary to-orange-600 text-white border-none shadow-lg shadow-primary/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Moving From</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                      <p className="font-semibold text-lg">
                        {latestMove.oldAddressLine1}, {latestMove.oldCity}, {latestMove.oldPostcode}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center opacity-50">
                    <ArrowRight className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Moving To</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                      <p className="font-semibold text-lg">
                        {latestMove.newAddressLine1}, {latestMove.newCity}, {latestMove.newPostcode}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                    <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Move Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 opacity-80" />
                      <p className="font-bold text-xl">{formatDate(latestMove.moveDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column: Active Notifications */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Your Notifications</h2>
              </div>

              {moveDetail && moveDetail.providers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {moveDetail.providers.map(mp => (
                    <ProviderCard
                      key={mp.id}
                      name={mp.providerName}
                      type={mp.providerCategory as any}
                      status={mp.status as any}
                      lastUpdated={new Date(mp.updatedAt).toLocaleDateString("en-GB")}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No providers selected for this move.</p>
                  <Link href="/wizard">
                    <Button variant="outline" className="mt-4">Update Move</Button>
                  </Link>
                </Card>
              )}

              {/* Deals area */}
              {nonSelectedAffiliate.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-2">Exclusive Move Deals</h2>
                  <p className="text-muted-foreground mb-6">Save money at your new place with our partners.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {nonSelectedAffiliate.map(ap => (
                      <RecommendedProviderCard
                        key={ap.name}
                        name={ap.name}
                        type={ap.type}
                        description={ap.description}
                        features={ap.features}
                        logoText={ap.logoText}
                        colorClass={ap.colorClass}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Activity / Sidebar */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Activity Log</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {[
                      { title: "Account Created", time: user ? new Date(latestMove.createdAt).toLocaleDateString("en-GB") : "—", done: true },
                      { title: "Move Details Saved", time: new Date(latestMove.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), done: true },
                      { title: "Notifications Submitted", time: "In progress", done: false, active: true },
                      { title: "All complete", time: "Pending", done: false },
                    ].map((log, i) => (
                      <div key={i} className="relative flex items-center justify-between group">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 shadow-sm ${log.done ? "border-primary text-primary" : log.active ? "border-orange-500" : "border-muted-foreground"}`}>
                          {log.done && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="w-[calc(100%-2rem)] pl-4">
                          <div className={`p-3 rounded-lg border ${log.active ? "bg-orange-50 border-orange-200" : "bg-background border-border"}`}>
                            <p className="text-sm font-semibold text-foreground">{log.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Need help?</h3>
                  <p className="text-primary-foreground/80 text-sm mb-1">AI support available 24/7.</p>
                  <p className="text-primary-foreground/60 text-xs mb-4">Escalates to a human if needed.</p>
                  <Button
                    variant="secondary"
                    className="w-full text-primary hover:bg-white"
                    onClick={() => document.getElementById("open-chat-btn")?.click()}
                  >
                    Chat with us
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>

      <SupportChat ctx={{
        userName: user?.fullName ?? "there",
        fromAddress: `${latestMove.oldAddressLine1}, ${latestMove.oldCity}`,
        toAddress: `${latestMove.newAddressLine1}, ${latestMove.newCity}`,
        moveDate: formatDate(latestMove.moveDate),
        providerCount: moveDetail?.providers.length ?? 0,
        providerNames: moveDetail?.providers.map(p => p.providerName) ?? [],
      }} />
    </AppLayout>
  );
}
