import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle, Send } from "lucide-react";

export type StatusType = "pending" | "submitted" | "completed" | "failed" | "action_required";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      classes: "bg-amber-50 text-amber-700 border-amber-200",
    },
    submitted: {
      label: "Submitted",
      icon: Send,
      classes: "bg-blue-50 text-blue-700 border-blue-200",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      classes: "bg-green-50 text-green-700 border-green-200",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      classes: "bg-red-50 text-red-700 border-red-200",
    },
    action_required: {
      label: "Action Needed",
      icon: AlertCircle,
      classes: "bg-orange-50 text-orange-700 border-orange-200",
    }
  };

  const { label, icon: Icon, classes } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      classes,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
