import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusType } from "./StatusBadge";
import { Building2, LucideIcon, Zap, Wifi, Smartphone, Tv, Mail, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  name: string;
  type: "council" | "energy" | "water" | "broadband" | "mobile" | "tv" | "mail";
  status: StatusType;
  lastUpdated: string;
  isAffiliate?: boolean;
  actionText?: string;
  onAction?: () => void;
}

const typeIcons: Record<ProviderCardProps["type"], LucideIcon> = {
  council: Building2,
  energy: Zap,
  water: Droplets,
  broadband: Wifi,
  mobile: Smartphone,
  tv: Tv,
  mail: Mail,
};

export function ProviderCard({
  name,
  type,
  status,
  lastUpdated,
  isAffiliate,
  actionText,
  onAction,
}: ProviderCardProps) {
  const Icon = typeIcons[type];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              type === 'council' ? "bg-slate-100 text-slate-600" :
              type === 'energy' ? "bg-yellow-100 text-yellow-600" :
              type === 'water' ? "bg-blue-100 text-blue-600" :
              "bg-primary/10 text-primary"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                {name}
                {isAffiliate && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    Partner
                  </span>
                )}
              </h4>
              <p className="text-xs text-muted-foreground capitalize">{type.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div>
            <StatusBadge status={status} />
            <p className="text-[10px] text-muted-foreground mt-1.5">Updated {lastUpdated}</p>
          </div>
          
          {actionText && (
            <Button 
              size="sm" 
              variant={status === 'action_required' ? 'default' : 'outline'}
              className={cn("text-xs h-8", status === 'action_required' && "bg-orange-500 hover:bg-orange-600")}
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
