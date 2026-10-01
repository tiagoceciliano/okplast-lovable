import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { NAV_ITEMS } from "@/lib/constants";
import logoUrl from "@/assets/brand/okplast-logo.webp";

export function Header() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container-custom">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              alt="OK Plast - Distribuidora de Chapas Plásticas RJ"
              className="h-10 md:h-12 w-auto object-contain"
              width={290}
              height={140}
              style={{ aspectRatio: "290 / 140" }}
              decoding="async"
              loading="eager"
              src={logoUrl}
              {...({ fetchpriority: "high" } as Record<string, string>)}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Menu principal">
            {NAV_ITEMS.map((item) =>
              "children" in item && item.children ? (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-popover border border-border rounded-md shadow-lg py-1 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={"href" in item ? item.href : "/"}
                  className="px-3 py-2 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={() => openWhatsAppModal()}
              className="btn-whatsapp rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="hidden sm:inline">Orçamento via </span>WhatsApp
            </Button>

            <button
              className="lg:hidden text-primary-foreground p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-primary border-t border-primary-foreground/10 pb-4" aria-label="Menu mobile">
          <div className="container-custom space-y-1 pt-2">
            {NAV_ITEMS.map((item) =>
              "children" in item && item.children ? (
                <div key={item.label}>
                  <span className="block px-3 py-2 text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider">
                    {item.label}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className="block px-6 py-2.5 text-sm text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/5 rounded transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={"href" in item ? item.href : "/"}
                  className="block px-3 py-2.5 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/5 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
