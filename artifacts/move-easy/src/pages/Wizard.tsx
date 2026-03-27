import { useState, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepWizard } from "@/components/ui/StepWizard";
import { Search, MapPin, Calendar as CalendarIcon, CheckCircle2, Loader2, AlertCircle, CheckCheck, ShieldCheck, UserPlus } from "lucide-react";
import { useListProviders, useCreateMove, useRegister } from "@workspace/api-client-react";
import type { Provider } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const STEPS_BASE = ["Old Address", "New Address", "Dates", "Services", "Confirm"];

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

type PostcodeStatus = "idle" | "loading" | "valid" | "invalid";

interface PostcodeState {
  status: PostcodeStatus;
  town: string;
  error: string;
}

function normalisePostcode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, " ");
}

function isPostcodeFormat(pc: string): boolean {
  return /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(pc.replace(/\s+/g, " ").trim());
}

function deriveTown(result: any): string {
  const district: string = result.admin_district ?? "";
  if (district.startsWith("London Borough of ")) return district.replace("London Borough of ", "");
  if (district.startsWith("Royal Borough of ")) return district.replace("Royal Borough of ", "");
  if (district === "City of London") return "City of London";
  if (district) return district;
  return result.admin_ward ?? "";
}

export default function Wizard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const needsAccount = !user;
  const STEPS = needsAccount ? [...STEPS_BASE, "Your Account"] : STEPS_BASE;

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

  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [oldPc, setOldPc] = useState<PostcodeState>({ status: "idle", town: "", error: "" });
  const [newPc, setNewPc] = useState<PostcodeState>({ status: "idle", town: "", error: "" });

  const oldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { mutate: doRegister, isPending: isRegistering } = useRegister({
    mutation: {
      onSuccess(newUser) {
        setUser(newUser);
        submitMove();
      },
      onError(err: any) {
        const message = err?.data?.error ?? err?.message ?? "Registration failed";
        toast({ title: "Could not create account", description: message, variant: "destructive" });
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

  const lookupPostcode = useCallback(async (
    raw: string,
    setter: React.Dispatch<React.SetStateAction<PostcodeState>>,
    cityField: "oldCity" | "newCity",
  ) => {
    const pc = normalisePostcode(raw);
    if (!pc) { setter({ status: "idle", town: "", error: "" }); return; }
    if (!isPostcodeFormat(pc)) {
      setter({ status: "invalid", town: "", error: "Enter a valid UK postcode (e.g. SW1A 1AA)" });
      return;
    }
    setter(prev => ({ ...prev, status: "loading", error: "" }));
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      const json = await res.json();
      if (json.status === 200 && json.result) {
        const town = deriveTown(json.result);
        setter({ status: "valid", town, error: "" });
        setFormData(prev => ({ ...prev, [cityField]: town }));
      } else {
        setter({ status: "invalid", town: "", error: "Postcode not found — please check and try again" });
      }
    } catch {
      setter({ status: "invalid", town: "", error: "Could not validate postcode — please check your connection" });
    }
  }, []);

  const handleOldPostcodeChange = (val: string) => {
    updateForm({ oldPostcode: val });
    if (oldTimerRef.current) clearTimeout(oldTimerRef.current);
    setOldPc(prev => ({ ...prev, status: "idle", error: "" }));
    if (val.trim().length >= 5) {
      oldTimerRef.current = setTimeout(() => lookupPostcode(val, setOldPc, "oldCity"), 600);
    }
  };

  const handleNewPostcodeChange = (val: string) => {
    updateForm({ newPostcode: val });
    if (newTimerRef.current) clearTimeout(newTimerRef.current);
    setNewPc(prev => ({ ...prev, status: "idle", error: "" }));
    if (val.trim().length >= 5) {
      newTimerRef.current = setTimeout(() => lookupPostcode(val, setNewPc, "newCity"), 600);
    }
  };

  const handleOldPostcodeBlur = () => {
    if (formData.oldPostcode.trim()) lookupPostcode(formData.oldPostcode, setOldPc, "oldCity");
  };

  const handleNewPostcodeBlur = () => {
    if (formData.newPostcode.trim()) lookupPostcode(formData.newPostcode, setNewPc, "newCity");
  };

  const isStep0Valid = oldPc.status === "valid" && formData.oldAddressLine1.trim().length >= 3;
  const isStep1Valid = newPc.status === "valid" && formData.newAddressLine1.trim().length >= 3;
  const isStep2Valid = !!formData.moveDate;
  const isStep3Valid = formData.selectedProviderIds.size > 0;
  const isStep4Valid = formData.consent && formData.signature.trim().length >= 3;
  const isStep5Valid =
    accountData.fullName.trim().length >= 2 &&
    accountData.email.includes("@") &&
    accountData.password.length >= 8 &&
    accountData.password === accountData.confirmPassword;

  const stepValid = needsAccount
    ? [isStep0Valid, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, isStep5Valid]
    : [isStep0Valid, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid];

  const lastStep = STEPS.length - 1;

  const submitMove = () => {
    doCreateMove({
      data: {
        oldAddressLine1: formData.oldAddressLine1,
        oldCity: formData.oldCity,
        oldPostcode: normalisePostcode(formData.oldPostcode),
        newAddressLine1: formData.newAddressLine1,
        newCity: formData.newCity,
        newPostcode: normalisePostcode(formData.newPostcode),
        moveDate: formData.moveDate,
        providerIds: Array.from(formData.selectedProviderIds),
      },
    });
  };

  const handleNext = () => {
    if (currentStep < lastStep) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      if (needsAccount) {
        if (accountData.password !== accountData.confirmPassword) {
          toast({ title: "Passwords don't match", description: "Please check your password.", variant: "destructive" });
          return;
        }
        doRegister({ data: { fullName: accountData.fullName, email: accountData.email, password: accountData.password } });
      } else {
        submitMove();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const groupedProviders = providers.reduce<Record<string, Provider[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  function PostcodeIcon({ state }: { state: PostcodeState }) {
    if (state.status === "loading") return <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground animate-spin" />;
    if (state.status === "valid") return <CheckCheck className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />;
    if (state.status === "invalid") return <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-destructive" />;
    return null;
  }

  const isProcessing = isSubmitting || isRegistering;

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

                {/* STEP 0: OLD ADDRESS */}
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
                          <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="e.g. SW1A 1AA"
                            className={`pl-10 pr-10 h-12 ${oldPc.status === "invalid" ? "border-destructive focus-visible:ring-destructive" : oldPc.status === "valid" ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                            value={formData.oldPostcode}
                            onChange={e => handleOldPostcodeChange(e.target.value)}
                            onBlur={handleOldPostcodeBlur}
                          />
                          <PostcodeIcon state={oldPc} />
                        </div>
                        {oldPc.status === "invalid" && <p className="text-sm text-destructive">{oldPc.error}</p>}
                        {oldPc.status === "valid" && oldPc.town && <p className="text-sm text-green-600 font-medium">{oldPc.town}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input placeholder="e.g. 123 High Street" className="h-12" value={formData.oldAddressLine1} onChange={e => updateForm({ oldAddressLine1: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>City / Town</Label>
                        <Input placeholder="Auto-filled from postcode" className="h-12" value={formData.oldCity} onChange={e => updateForm({ oldCity: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: NEW ADDRESS */}
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
                          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="e.g. M1 1AB"
                            className={`pl-10 pr-10 h-12 ${newPc.status === "invalid" ? "border-destructive focus-visible:ring-destructive" : newPc.status === "valid" ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                            value={formData.newPostcode}
                            onChange={e => handleNewPostcodeChange(e.target.value)}
                            onBlur={handleNewPostcodeBlur}
                          />
                          <PostcodeIcon state={newPc} />
                        </div>
                        {newPc.status === "invalid" && <p className="text-sm text-destructive">{newPc.error}</p>}
                        {newPc.status === "valid" && newPc.town && <p className="text-sm text-green-600 font-medium">{newPc.town}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input placeholder="e.g. 45 Park Lane" className="h-12" value={formData.newAddressLine1} onChange={e => updateForm({ newAddressLine1: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>City / Town</Label>
                        <Input placeholder="Auto-filled from postcode" className="h-12" value={formData.newCity} onChange={e => updateForm({ newCity: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATES */}
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
                          <CalendarIcon className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                          <Input type="date" className="pl-10 h-12" value={formData.moveDate} onChange={e => updateForm({ moveDate: e.target.value })} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">We recommend setting this at least 14 days in the future so providers have time to process your request.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SERVICES */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Which providers should we notify?</h2>
                      <p className="text-muted-foreground">Select the services you want us to handle for you.</p>
                    </div>

                    {loadingProviders ? (
                      <div className="space-y-3">
                        {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
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
                                    provider.isAffiliate ? "border-primary/30 bg-primary/5" : "hover:bg-muted/50"
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
                                      <label htmlFor={`p-${provider.id}`} className="font-semibold text-base cursor-pointer" onClick={e => e.stopPropagation()}>
                                        {provider.name}
                                      </label>
                                      {provider.isAffiliate && (
                                        <span className="text-[10px] uppercase font-bold bg-primary text-white px-2 py-0.5 rounded">Partner</span>
                                      )}
                                    </div>
                                    {provider.description && <p className="text-sm text-muted-foreground">{provider.description}</p>}
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

                {/* STEP 4: CONFIRM */}
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
                          <p className="text-sm">{formData.oldCity} {normalisePostcode(formData.oldPostcode)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Moving To</p>
                          <p className="text-sm font-medium">{formData.newAddressLine1 || "—"}</p>
                          <p className="text-sm">{formData.newCity} {normalisePostcode(formData.newPostcode)}</p>
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
                            : providers.filter(p => formData.selectedProviderIds.has(p.id)).map(p => p.name).join(", ")}
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

                {/* STEP 5: CREATE ACCOUNT (non-logged-in users only) */}
                {currentStep === 5 && needsAccount && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <UserPlus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Almost there — create your account</h2>
                        <p className="text-muted-foreground">Your move details are saved. Create a free account to submit and track everything from your dashboard.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="acc-name">Full Name</Label>
                        <Input
                          id="acc-name"
                          placeholder="John Smith"
                          className="h-12"
                          value={accountData.fullName}
                          onChange={e => setAccountData(p => ({ ...p, fullName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acc-email">Email</Label>
                        <Input
                          id="acc-email"
                          type="email"
                          placeholder="john@example.com"
                          className="h-12"
                          value={accountData.email}
                          onChange={e => setAccountData(p => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acc-password">Password</Label>
                        <Input
                          id="acc-password"
                          type="password"
                          placeholder="At least 8 characters"
                          className="h-12"
                          value={accountData.password}
                          onChange={e => setAccountData(p => ({ ...p, password: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acc-confirm">Confirm Password</Label>
                        <Input
                          id="acc-confirm"
                          type="password"
                          placeholder="Repeat your password"
                          className="h-12"
                          value={accountData.confirmPassword}
                          onChange={e => setAccountData(p => ({ ...p, confirmPassword: e.target.value }))}
                        />
                        {accountData.confirmPassword && accountData.password !== accountData.confirmPassword && (
                          <p className="text-sm text-destructive">Passwords don't match</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 p-3 rounded-lg border border-orange-100">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <p>Your data is encrypted and never sold. Free forever.</p>
                    </div>

                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                    </p>
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
            disabled={currentStep === 0 || isProcessing}
            className="w-32"
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!stepValid[currentStep] || isProcessing}
            className="w-48"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
            ) : currentStep === lastStep ? (
              needsAccount ? "Create Account & Submit" : "Submit My Move"
            ) : currentStep === lastStep - 1 && needsAccount ? (
              "Review Details"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
