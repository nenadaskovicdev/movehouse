import { AppLayout } from "@/components/layout/AppLayout";
import { ProviderCard } from "@/components/shared/ProviderCard";
import { RecommendedProviderCard } from "@/components/shared/RecommendedProviderCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const handleAction = (provider: string) => {
    toast({
      title: `Action opened for ${provider}`,
      description: "In a real app, this would open a modal to upload documents.",
    });
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
                <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
                <p className="text-muted-foreground">Your move is currently in progress.</p>
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
                      <p className="font-semibold text-lg">123 High Street, London, SW1A 1AA</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center opacity-50">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Moving To</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                      <p className="font-semibold text-lg">45 Park Lane, Manchester, M1 1AB</p>
                    </div>
                  </div>

                  <div className="flex-1 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                    <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Move Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 opacity-80" />
                      <p className="font-bold text-xl">15 April 2025</p>
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
                <Button variant="outline" size="sm">Add Provider</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProviderCard 
                  name="Manchester City Council"
                  type="council"
                  status="submitted"
                  lastUpdated="Today, 09:41 AM"
                />
                <ProviderCard 
                  name="Thames Water"
                  type="water"
                  status="action_required"
                  lastUpdated="Yesterday"
                  actionText="Upload ID"
                  onAction={() => handleAction('Thames Water')}
                />
                <ProviderCard 
                  name="TV Licence"
                  type="tv"
                  status="completed"
                  lastUpdated="2 days ago"
                />
                <ProviderCard 
                  name="Electoral Roll"
                  type="council"
                  status="pending"
                  lastUpdated="Today, 09:41 AM"
                />
              </div>

              {/* Deals area mixed into notifications */}
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-2">Exclusive Move Deals</h2>
                <p className="text-muted-foreground mb-6">You didn't select energy or broadband. Save money at your new place with our partners.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RecommendedProviderCard 
                    name="Octopus Energy"
                    type="100% Renewable Gas & Electric"
                    description="Join the UK's most awarded energy supplier. No exit fees, fair pricing, and excellent customer service."
                    features={["£50 credit when you switch", "100% renewable electricity", "Award-winning support"]}
                    logoText="octopus"
                    colorClass="bg-[#180044]"
                  />
                  <RecommendedProviderCard 
                    name="YouFibre"
                    type="Ultrafast Full Fibre Broadband"
                    description="Don't suffer buffering in your new home. Get symmetric gigabit speeds at incredible prices."
                    features={["Speeds up to 8000 Mbps", "No mid-contract price rises", "Free installation"]}
                    logoText="YouFibre"
                    colorClass="bg-[#E40046]"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Activity / Sidebar */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Activity Log</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {[
                      { title: "Account Created", time: "Oct 24, 10:00 AM", done: true },
                      { title: "Move Details Saved", time: "Oct 24, 10:15 AM", done: true },
                      { title: "Notifications Submitted", time: "Oct 24, 10:16 AM", done: true },
                      { title: "Water Co. requested info", time: "Oct 25, 09:00 AM", done: false, active: true },
                      { title: "All complete", time: "Pending", done: false }
                    ].map((log, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${log.done ? 'border-primary text-primary' : log.active ? 'border-orange-500' : 'border-muted-foreground'}`}>
                          {log.done && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0">
                          <div className={`p-3 rounded-lg border ${log.active ? 'bg-orange-50 border-orange-200' : 'bg-background border-border'}`}>
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
                  <h3 className="font-bold text-lg mb-2">Need help?</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">Our moving experts are available 9am-5pm.</p>
                  <Button variant="secondary" className="w-full text-primary hover:bg-white">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
