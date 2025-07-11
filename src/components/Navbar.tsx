
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.apartments, path: "/apartments" },
    { name: t.nav.blog, path: "/blog" },
    { name: t.nav.gallery, path: "/gallery" },
    { name: t.nav.contact, path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/80 backdrop-blur-lg py-3 shadow-md" : "bg-transparent py-5")}>
    <nav className="container flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="VitallCheck-Up" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-8">
        {navLinks.map(link => <li key={link.name} className="relative">
          <Link to={link.path} className="font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
            {link.name}
          </Link>
        </li>)}
      </ul>

      <div className="hidden md:flex items-center space-x-2">
        <Button
          className="btn-primary"
          onClick={() => window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20o%20mais%20breve%20poss%C3%ADvel%2C%20pode%20me%20ajudar%3F", '_blank')}
        >
          {t.nav.bookNow}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </nav>

    {/* Mobile Menu */}
    <div className={cn("fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <div className={cn("fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card shadow-xl p-6 transition-transform duration-300 ease-in-out", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ul className="space-y-6">
              {navLinks.map(link => <li key={link.name}>
                <Link to={link.path} className="text-lg font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              </li>)}
            </ul>
          </div>

          <Button
            className="w-full btn-primary mt-6"
            onClick={() => {
              setMobileMenuOpen(false);
              window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20o%20mais%20breve%20poss%C3%ADvel%2C%20pode%20me%20ajudar%3F", '_blank');
            }}
          >
            {t.nav.bookNow}
          </Button>
        </div>
      </div>
    </div>
  </header>;
}
