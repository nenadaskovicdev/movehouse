import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

interface RecommendedProviderCardProps {
  name: string;
  type: string;
  description: string;
  features: string[];
  logoText: string;
  colorClass: string;
}

export function RecommendedProviderCard({
  name,
  type,
  description,
  features,
  logoText,
  colorClass
}: RecommendedProviderCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
        <Star className="w-3 h-3 fill-current" /> Recommended
      </div>
      <CardContent className="p-0">
        <div className={`p-6 ${colorClass} text-white flex items-center justify-center min-h-[100px]`}>
          <h3 className="text-2xl font-display font-bold tracking-tight">{logoText}</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-bold text-lg text-foreground">{name}</h4>
            <p className="text-sm text-primary font-medium">{type}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
            {description}
          </p>
          <ul className="space-y-2 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full shadow-sm">
            Switch & Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
