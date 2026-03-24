import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepWizardProps {
  steps: string[];
  currentStep: number;
}

export function StepWizard({ steps, currentStep }: StepWizardProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10" />
      <div 
        className="absolute top-4 left-0 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 shadow-sm",
                  isCompleted ? "bg-primary text-white" : 
                  isCurrent ? "bg-primary text-white ring-4 ring-primary/20" : 
                  "bg-white text-muted-foreground border-2 border-muted"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={cn(
                "text-xs font-medium mt-2 max-w-[80px] text-center hidden sm:block transition-colors duration-300",
                isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
