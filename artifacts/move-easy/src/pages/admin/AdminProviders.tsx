import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAdminListProviders,
  useAdminUpdateProvider,
  type Provider,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminListProvidersQueryKey } from "@workspace/api-client-react";
import { Building2, Link2, Pencil, ToggleLeft, ToggleRight, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_LABELS: Record<string, string> = {
  council: "Council",
  energy: "Energy",
  water: "Water",
  broadband: "Broadband",
  mobile: "Mobile",
  tv: "TV",
  postal: "Postal",
};

const CATEGORY_COLORS: Record<string, string> = {
  council: "bg-blue-100 text-blue-700",
  energy: "bg-orange-100 text-orange-700",
  water: "bg-cyan-100 text-cyan-700",
  broadband: "bg-purple-100 text-purple-700",
  mobile: "bg-green-100 text-green-700",
  tv: "bg-red-100 text-red-700",
  postal: "bg-yellow-100 text-yellow-700",
};

type EditState = {
  name: string;
  description: string;
  affiliateUrl: string;
  isAffiliate: boolean;
};

function ProviderRow({ provider }: { provider: Provider }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    name: provider.name,
    description: provider.description ?? "",
    affiliateUrl: provider.affiliateUrl ?? "",
    isAffiliate: provider.isAffiliate,
  });

  const { mutate: updateProvider, isPending } = useAdminUpdateProvider({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: getAdminListProvidersQueryKey() });
        setEditing(false);
        toast({ title: "Provider updated" });
      },
      onError(err: any) {
        toast({
          title: "Update failed",
          description: err?.message ?? "Something went wrong",
          variant: "destructive",
        });
      },
    },
    request: { credentials: "include" },
  });

  const handleToggleActive = () => {
    updateProvider({ id: provider.id, data: { isActive: !provider.isActive } });
  };

  const handleSave = () => {
    updateProvider({
      id: provider.id,
      data: {
        name: editState.name,
        description: editState.description || null,
        affiliateUrl: editState.affiliateUrl || null,
        isAffiliate: editState.isAffiliate,
      },
    });
  };

  return (
    <div className={`px-4 py-3 ${!provider.isActive ? "opacity-50" : ""}`}>
      {editing ? (
        <div className="space-y-3 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input
                value={editState.name}
                onChange={e => setEditState(s => ({ ...s, name: e.target.value }))}
                className="h-8 text-sm mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                value={editState.description}
                onChange={e => setEditState(s => ({ ...s, description: e.target.value }))}
                className="h-8 text-sm mt-1"
                placeholder="Optional"
              />
            </div>
            <div>
              <Label className="text-xs">Affiliate URL</Label>
              <Input
                value={editState.affiliateUrl}
                onChange={e => setEditState(s => ({ ...s, affiliateUrl: e.target.value }))}
                className="h-8 text-sm mt-1"
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id={`aff-${provider.id}`}
                checked={editState.isAffiliate}
                onChange={e => setEditState(s => ({ ...s, isAffiliate: e.target.checked }))}
                className="accent-primary"
              />
              <label htmlFor={`aff-${provider.id}`} className="text-sm">Is affiliate</label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isPending} className="h-7 text-xs gap-1">
              <Check className="w-3 h-3" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-7 text-xs gap-1">
              <X className="w-3 h-3" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{provider.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[provider.category] ?? "bg-slate-100 text-slate-600"}`}>
                {CATEGORY_LABELS[provider.category] ?? provider.category}
              </span>
              {provider.isAffiliate && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium flex items-center gap-0.5">
                  <Link2 className="w-3 h-3" /> Affiliate
                </span>
              )}
              {!provider.isActive && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Inactive</span>
              )}
            </div>
            {provider.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{provider.description}</p>
            )}
            {provider.affiliateUrl && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">{provider.affiliateUrl}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleToggleActive}
              disabled={isPending}
              title={provider.isActive ? "Deactivate" : "Activate"}
            >
              {provider.isActive ? (
                <ToggleRight className="w-4 h-4 text-green-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProviders() {
  const { data: providers = [], isLoading } = useAdminListProviders({
    request: { credentials: "include" },
  });

  const grouped = providers.reduce<Record<string, Provider[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Providers</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading…" : `${providers.length} providers across ${categories.length} categories`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 animate-pulse space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-muted rounded w-3/4" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(cat => (
              <Card key={cat}>
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </h2>
                    <span className="text-xs text-muted-foreground ml-1">
                      {grouped[cat].length} provider{grouped[cat].length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <CardContent className="p-0 divide-y">
                  {grouped[cat].map(p => (
                    <ProviderRow key={p.id} provider={p} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
