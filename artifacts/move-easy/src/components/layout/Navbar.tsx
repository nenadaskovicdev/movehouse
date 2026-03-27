import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/" || location === "";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-border"
          : "bg-slate-800 border-slate-700"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img src="/images/logo-junctionn.png" alt="" className="h-full w-auto" style={{ maxWidth: "none" }} />
            </div>
            <span className={cn("font-display font-bold text-xl tracking-tight", isScrolled || !isHome ? "text-foreground" : "text-white")}>
              Move<span className="text-primary">Easy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#how-it-works" className={cn("text-sm font-medium transition-colors", isScrolled || !isHome ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white")}>
              How it works
            </a>
            <a href="/#benefits" className={cn("text-sm font-medium transition-colors", isScrolled || !isHome ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white")}>
              Features
            </a>
            <a href="/#faq" className={cn("text-sm font-medium transition-colors", isScrolled || !isHome ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white")}>
              FAQs
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className={cn("font-semibold gap-2", isScrolled || !isHome ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white hover:bg-white/10")}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="font-semibold rounded-full px-6"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={cn("font-semibold", isScrolled || !isHome ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white hover:bg-white/10")}>
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all rounded-full px-6">
                    Start Your Move
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg">
            How it works
          </a>
          <a href="/#benefits" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg">
            Features
          </a>
          <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg">
            FAQs
          </a>
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg">
                Dashboard
              </Link>
              <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg">
                Log in
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-2 rounded-full">Start Your Move</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
