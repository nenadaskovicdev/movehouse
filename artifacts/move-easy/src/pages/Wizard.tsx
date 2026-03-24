import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepWizard } from "@/components/ui/StepWizard";
import { Search, MapPin, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { useListProviders, useCreateMove } from "@workspace/api-client-react";
import type { Provider } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Old Address", "New Address", "Dates", "Services", "Confirm"];

const CATEGORY_LABELS: Record<string, string> = {
  council: "Local Council (Tax & Electoral Roll)",
  energy: "Gas & Electricity",
  water: "Water Supplier",
  broadband: "Broadband",
  mobile: "Mobile",
  tv: "TV Licence / Services",
  postal: "Post / Mail Redirection",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  council: "We'll automatically find your old and new councils based on postcodes.",
  energy: "Notify your current supplier. We can also help you switch to a better deal.",
  water: "Notify your regional water authority.",
  broadband: "Transfer or cancel your broadband contract.",
  mobile: "Update your address with your mobile provider.",
  tv: "Transfer your TV licence to the new property.",
  postal: "Set up mail redirection from your old address.",
};

export default function Wizard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    oldAddressLine1: "",
    oldCity: "",
    oldPostcode: "",
    newAddressLine1: "",
    newCity: "",
    newPostcode: "",
    moveDate: "",
    selectedProviderIds: new Set<number>(),
    consent: false,
    signature: "",
  });

  const { data: providers = [], isLoading: loadingProviders } = useListProviders({
    request: { credentials: "include" },
  });

  const { mutate: doCreateMove, isPending: isSubmitting } = useCreateMove({
    mutation: {
      onSuccess() {
        setLocation("/dashboard");
      },
      onError(err: any) {
        const message = err?.data?.error ?? err?.message ?? "Failed to submit move";
        toast({ title: "Submission failed", description: message, variant: "destructive" });
      },
    },
    request: { credentials: "include" },
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleProvider = (id: number) => {
    setFormData(prev => {
      const next = new Set(prev.selectedProviderIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, selectedProviderIds: next };
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const submitForm = () => {
    doCreateMove({
      data: {
        oldAddressLine1: formData.oldAddressLine1,
        oldCity: formData.oldCity,
        oldPostcode: formData.oldPostcode,
        newAddressLine1: formData.newAddressLine1,
        newCity: formData.newCity,
        newPostcode: formData.newPostcode,
        moveDate: formData.moveDate,
        providerIds: Array.from(formData.selectedProviderIds),
      },
    });
  };

  const groupedProviders = providers.reduce<Record<string, Provider[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground text-center mb-8">Setup Your Move</h1>
          <StepWizard steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 sm:p-8 shadow-lg border-border/50">

                {/* STEP 1: OLD ADDRESS */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Where are you moving from?</h2>
                      <p className="text-muted-foreground">We need your current address to notify providers to close your accounts.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Postcode</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="e.g. SW1A 1AA"
                            className="pl-10 h-12"
                            value={formData.oldPostcode}
                            onChange={e => updateForm({ oldPostcode: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input
                          placeholder="e.g. 123 High Street"
                          className="h-12"
                          value={formData.oldAddressLine1}
                          onChange={e => updateForm({ oldAddressLine1: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City / Town</Label>
                        <Input
                          placeholder="e.g. London"
                          className="h-12"
                          value={formData.oldCity}
                          onChange={e => updateForm({ oldCity: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: NEW ADDRESS */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Where are you moving to?</h2>
                      <p className="text-muted-foreground">This is where your new accounts and redirects will be setup.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Postcode</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="e.g. M1 1AB"
                            className="pl-10 h-12"
                            value={formData.newPostcode}
                            onChange={e => updateForm({ newPostcode: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input
                          placeholder="e.g. 45 Park Lane"
                          className="h-12"
                          value={formData.newAddressLine1}
                          onChange={e => updateForm({ newAddressLine1: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City / Town</Label>
                        <Input
                          placeholder="e.g. Manchester"
                          className="h-12"
                          value={formData.newCity}
                          onChange={e => updateForm({ newCity: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DATES */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">When are you moving?</h2>
                      <p className="text-muted-foreground">This determines when your services will switch over.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Move Date</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-10 h-12"
                            value={formData.moveDate}
                            onChange={e => updateForm({ moveDate: e.target.value })}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          We recommend setting this at least 14 days in the future to ensure providers have time to process your request.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: SERVICES */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Which providers should we notify?</h2>
                      <p className="text-muted-foreground">Select the services you want us to handle for you.</p>
                    </div>

                    {loadingProviders ? (
                      <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(groupedProviders).map(([category, catProviders]) => (
                          <div key={category}>
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                              {CATEGORY_LABELS[category] ?? category}
                            </h3>
                            <div className="space-y-2">
                              {catProviders.map(provider => (
                                <div
                                  key={provider.id}
                                  className={`flex items-start space-x-3 p-4 border rounded-xl transition-colors cursor-pointer ${
                                    provider.isAffiliate
                                      ? "border-primary/30 bg-primary/5"
                                      : "hover:bg-muted/50"
                                  }`}
                                  onClick={() => toggleProvider(provider.id)}
                                >
                                  <Checkbox
                                    id={`p-${provider.id}`}
                                    className="mt-1"
                                    checked={formData.selectedProviderIds.has(provider.id)}
                                    onCheckedChange={() => toggleProvider(provider.id)}
                                    onClick={e => e.stopPropagation()}
                                  />
                                  <div className="grid gap-1 leading-none flex-1">
                                    <div className="flex items-center justify-between">
                                      <label
                                        htmlFor={`p-${provider.id}`}
                                        className="font-semibold text-base cursor-pointer"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        {provider.name}
                                      </label>
                                      {provider.isAffiliate && (
                                        <span className="text-[10px] uppercase font-bold bg-primary text-white px-2 py-0.5 rounded">
                                          Partner
                                        </span>
                                      )}
                                    </div>
                                    {provider.description && (
                                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {formData.selectedProviderIds.size} provider{formData.selectedProviderIds.size !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}

                {/* STEP 5: CONFIRM */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Review & Consent</h2>
                      <p className="text-muted-foreground">Please review your details before we send off the notifications.</p>
                    </div>

                    <div className="bg-muted p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Moving From</p>
                          <p className="text-sm font-medium">{formData.oldAddressLine1 || "—"}</p>
                          <p className="text-sm">{formData.oldCity} {formData.oldPostcode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Moving To</p>
                          <p className="text-sm font-medium">{formData.newAddressLine1 || "—"}</p>
                          <p className="text-sm">{formData.newCity} {formData.newPostcode}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Move Date</p>
                        <p className="text-sm font-medium">{formData.moveDate || "Not set"}</p>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Providers to notify</p>
                        <p className="text-sm font-medium">
                          {formData.selectedProviderIds.size === 0
                            ? "None selected"
                            : providers
                                .filter(p => formData.selectedProviderIds.has(p.id))
                                .map(p => p.name)
                                .join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mt-8">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="consent"
                          className="mt-1"
                          checked={formData.consent}
                          onCheckedChange={(c) => updateForm({ consent: c as boolean })}
                        />
                        <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                          I authorise MoveEasy to act as an agent on my behalf to notify the selected utility providers, local authorities, and services of my change of address. I confirm the details provided are accurate.
                        </label>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label>Type your full name to electronically sign</Label>
                        <Input
                          placeholder="e.g. John Smith"
                          className="h-12"
                          value={formData.signature}
                          onChange={e => updateForm({ signature: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="w-32"
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={
              isSubmitting ||
              (currentStep === 4 && (!formData.consent || formData.signature.length < 3))
            }
            className="w-40 shadow-md shadow-primary/20"
          >
            {isSubmitting ? "Processing..." : currentStep === STEPS.length - 1 ? (
              <>Submit <CheckCircle2 className="w-5 h-5 ml-2" /></>
            ) : "Next"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
