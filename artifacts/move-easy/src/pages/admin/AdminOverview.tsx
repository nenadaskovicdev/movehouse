import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminGetStats } from "@workspace/api-client-react";
import { Users, FolderOpen, Building2, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function AdminOverview() {
  const { data: stats, isLoading } = useAdminGetStats({
    request: { credentials: "include" },
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Platform-wide stats at a glance</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Moves"
              value={stats?.totalMoves}
              icon={FolderOpen}
              color="bg-blue-100 text-blue-600"
              href="/admin/cases"
            />
            <StatCard
              title="Active Moves"
              value={stats?.activeMoves}
              icon={Clock}
              color="bg-orange-100 text-orange-600"
              href="/admin/cases"
            />
            <StatCard
              title="Completed"
              value={stats?.completedMoves}
              icon={CheckCircle2}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="Action Required"
              value={stats?.actionRequired}
              icon={AlertTriangle}
              color="bg-red-100 text-red-600"
            />
            <StatCard
              title="Total Users"
              value={stats?.totalUsers}
              icon={Users}
              color="bg-purple-100 text-purple-600"
            />
            <StatCard
              title="Providers"
              value={stats?.totalProviders}
              icon={Building2}
              color="bg-slate-100 text-slate-600"
              href="/admin/providers"
            />
            <StatCard
              title="Pending Submissions"
              value={stats?.pendingSubmissions}
              icon={Clock}
              color="bg-yellow-100 text-yellow-600"
            />
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/cases" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <FolderOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">View all move cases</p>
                  <p className="text-xs text-muted-foreground">Search, filter, and manage every move case</p>
                </div>
              </Link>
              <Link href="/admin/providers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Manage providers</p>
                  <p className="text-xs text-muted-foreground">Enable / disable providers and edit affiliate links</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoading && stats && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active move rate</span>
                    <span className="font-medium">
                      {stats.totalMoves > 0
                        ? `${Math.round((stats.activeMoves / stats.totalMoves) * 100)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion rate</span>
                    <span className="font-medium">
                      {stats.totalMoves > 0
                        ? `${Math.round((stats.completedMoves / stats.totalMoves) * 100)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending provider notifications</span>
                    <span className="font-medium text-orange-600">{stats.pendingSubmissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cases needing attention</span>
                    <span className="font-medium text-red-600">{stats.actionRequired}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
