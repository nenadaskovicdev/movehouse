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

const STEPS = ["Old Address", "New Address", "Dates", "Services", "Confirm"];

export default function Wizard() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    oldPostcode: "",
    oldAddress: "",
    newPostcode: "",
    newAddress: "",
    moveDate: "",
    services: {
      council: true,
      water: true,
      energy: false, // Leave false to encourage switching
      broadband: false,
      tv: true,
    },
    consent: false,
    signature: "",
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateService = (service: keyof typeof formData.services, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: { ...prev.services, [service]: checked }
    }));
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
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1500);
  };

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
                        <Label>Postcode Search</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <Input 
                              placeholder="e.g. SW1A 1AA" 
                              className="pl-10 h-12"
                              value={formData.oldPostcode}
                              onChange={e => updateForm({ oldPostcode: e.target.value })}
                            />
                          </div>
                          <Button variant="secondary" className="h-12 px-6">Find</Button>
                        </div>
                      </div>
                      
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Address</Label>
                        <Input 
                          placeholder="Start typing your address..." 
                          className="h-12"
                          value={formData.oldAddress}
                          onChange={e => updateForm({ oldAddress: e.target.value })}
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
                        <Label>Postcode Search</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <Input 
                              placeholder="e.g. M1 1AB" 
                              className="pl-10 h-12"
                              value={formData.newPostcode}
                              onChange={e => updateForm({ newPostcode: e.target.value })}
                            />
                          </div>
                          <Button variant="secondary" className="h-12 px-6">Find</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label>Full Address</Label>
                        <Input 
                          placeholder="Start typing your address..." 
                          className="h-12"
                          value={formData.newAddress}
                          onChange={e => updateForm({ newAddress: e.target.value })}
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
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id="s-council" 
                          className="mt-1"
                          checked={formData.services.council}
                          onCheckedChange={(c) => updateService('council', c as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="s-council" className="font-semibold text-base cursor-pointer">Local Council (Tax & Electoral Roll)</label>
                          <p className="text-sm text-muted-foreground">We'll automatically find your old and new councils based on postcodes.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id="s-water" 
                          className="mt-1"
                          checked={formData.services.water}
                          onCheckedChange={(c) => updateService('water', c as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="s-water" className="font-semibold text-base cursor-pointer">Water Supplier</label>
                          <p className="text-sm text-muted-foreground">Notify regional water authorities.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-primary/30 bg-primary/5 rounded-xl">
                        <Checkbox 
                          id="s-energy" 
                          className="mt-1"
                          checked={formData.services.energy}
                          onCheckedChange={(c) => updateService('energy', c as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none w-full">
                          <div className="flex justify-between items-center w-full">
                            <label htmlFor="s-energy" className="font-semibold text-base cursor-pointer">Gas & Electricity</label>
                            <span className="text-[10px] uppercase font-bold bg-primary text-white px-2 py-0.5 rounded">Partner</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Notify current supplier. We can also help you switch to Octopus Energy for 100% renewable power.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id="s-tv" 
                          className="mt-1"
                          checked={formData.services.tv}
                          onCheckedChange={(c) => updateService('tv', c as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="s-tv" className="font-semibold text-base cursor-pointer">TV Licence</label>
                          <p className="text-sm text-muted-foreground">Transfer your licence to the new property.</p>
                        </div>
                      </div>
                    </div>
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
                          <p className="text-sm font-medium">{formData.oldAddress || "123 Old St, London"}</p>
                          <p className="text-sm">{formData.oldPostcode || "SW1A 1AA"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Moving To</p>
                          <p className="text-sm font-medium">{formData.newAddress || "45 New Rd, Manchester"}</p>
                          <p className="text-sm">{formData.newPostcode || "M1 1AB"}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Move Date</p>
                        <p className="text-sm font-medium">{formData.moveDate || "Select a date"}</p>
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
