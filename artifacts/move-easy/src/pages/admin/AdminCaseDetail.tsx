import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminGetCase } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, Calendar, User, Building2, Clock, CheckCircle2, AlertTriangle, XCircle, Send } from "lucide-react";
import { Link } from "wouter";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
  submitted: { label: "Submitted", icon: Send, color: "text-blue-600 bg-blue-100" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 bg-red-100" },
  action_required: { label: "Action Required", icon: AlertTriangle, color: "text-orange-600 bg-orange-100" },
};

const CATEGORY_LABELS: Record<string, string> = {
  council: "Council",
  energy: "Energy",
  water: "Water",
  broadband: "Broadband",
  mobile: "Mobile",
  tv: "TV",
  postal: "Postal",
};

export default function AdminCaseDetail({ id }: { id: string }) {
  const caseId = parseInt(id, 10);

  const { data: caseDetail, isLoading } = useAdminGetCase(caseId, {
    request: { credentials: "include" },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!caseDetail) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-muted-foreground">Case not found.</p>
          <Link href="/admin/cases">
            <Button variant="outline" className="mt-4">Back to cases</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const moveStatusConfig = {
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/cases">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Cases
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Case #{caseDetail.id}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Created {new Date(caseDetail.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${moveStatusConfig[caseDetail.status as keyof typeof moveStatusConfig] ?? "bg-slate-100 text-slate-600"}`}>
            {caseDetail.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-semibold">{caseDetail.userFullName}</p>
              <p className="text-muted-foreground text-sm">{caseDetail.userEmail}</p>
              <p className="text-muted-foreground text-xs">User ID: {caseDetail.userId}</p>
            </CardContent>
          </Card>

          {/* Move date */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Move Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">
                {new Date(caseDetail.moveDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>

          {/* Old address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Moving From
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <p className="font-medium">{caseDetail.oldAddressLine1}</p>
              {caseDetail.oldAddressLine2 && <p>{caseDetail.oldAddressLine2}</p>}
              <p>{caseDetail.oldCity}</p>
              <p className="font-mono text-sm">{caseDetail.oldPostcode}</p>
            </CardContent>
          </Card>

          {/* New address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Moving To
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <p className="font-medium">{caseDetail.newAddressLine1}</p>
              {caseDetail.newAddressLine2 && <p>{caseDetail.newAddressLine2}</p>}
              <p>{caseDetail.newCity}</p>
              <p className="font-mono text-sm">{caseDetail.newPostcode}</p>
            </CardContent>
          </Card>
        </div>

        {/* Provider statuses */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Provider Notifications
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {caseDetail.providers.length} provider{caseDetail.providers.length !== 1 ? "s" : ""}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {caseDetail.providers.length === 0 ? (
              <p className="p-6 text-muted-foreground text-sm">No providers selected for this move.</p>
            ) : (
              <div className="divide-y">
                {caseDetail.providers.map(p => {
                  const config = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = config.icon;
                  return (
                    <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="flex-1">
                        <p className="font-medium">{p.providerName}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {CATEGORY_LABELS[p.providerCategory] ?? p.providerCategory}
                          {p.isAffiliate && " · Affiliate"}
                        </p>
                        {p.notes && <p className="text-xs text-muted-foreground mt-1 italic">{p.notes}</p>}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                      <p className="text-xs text-muted-foreground w-28 text-right">
                        Updated {new Date(p.updatedAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
