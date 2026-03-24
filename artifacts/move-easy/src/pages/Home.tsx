import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, CheckSquare, Sparkles, Shield, Zap, Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                <span>The UK's #1 Moving Assistant</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
                Move home without <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  the admin stress
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Notify your council, water, energy, and broadband providers in one go. Entirely free. Takes less than 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/wizard">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all">
                    Start Your Move <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" /> No credit card required
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-none relative"
            >
              {/* hero abstract geometric representation */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-white p-2">
                 <img 
                  src={`${import.meta.env.BASE_URL}images/hero-abstract.png`}
                  alt="Abstract home representation" 
                  className="w-full h-auto rounded-xl object-cover"
                />
                
                {/* Floating UI Elements */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-border/50 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Council Notified</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">How MoveEasy Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three simple steps to sort out all your moving admin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10" />
            
            {[
              { icon: MapPin, title: "1. Tell us where", desc: "Enter your old address, new address, and move date securely." },
              { icon: CheckSquare, title: "2. Select services", desc: "Choose which councils, energy, and water companies to notify." },
              { icon: Zap, title: "3. We do the rest", desc: "We automatically send the updates and help you find better deals." }
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-background border-4 border-white shadow-lg rounded-full flex items-center justify-center text-primary mb-6 relative z-10">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-6">
                Why use MoveEasy?
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Zap, title: "100% Free Service", desc: "We don't charge you a penny. We make money if you choose to switch to one of our recommended partners." },
                  { icon: Shield, title: "Secure & Compliant", desc: "Your data is encrypted and only shared with the providers you explicitly select. GDPR compliant." },
                  { icon: HomeIcon, title: "Over 100+ Providers", desc: "We support notifications for all UK councils, major water suppliers, and energy companies." }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-white shadow-sm border border-border flex items-center justify-center text-primary">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* landing page features illustration */}
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                alt="Happy person moving boxes" 
                className="rounded-2xl shadow-xl object-cover h-[500px] w-full"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">Ready to make your move?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">Join thousands of UK residents who moved home without the headache.</p>
          <Link href="/wizard">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full text-primary hover:bg-white transition-colors">
              Start Now — It's Free
            </Button>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
