import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, NAV_ITEMS } from "@/lib/constants";
import logoImg from "@/assets/logo-lab-acrilicos.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-custom">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="Lab Acrílicos"
              className="h-10 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {"children" in item ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-1 p-2">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  className={cn(
                                    "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    isActive(child.href) && "bg-accent/50"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                          isActive(item.href) && "bg-accent/50"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${COMPANY.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              {COMPANY.phone}
            </a>
            <Button asChild>
              <Link to="/home/orcamento">Solicitar Orçamento</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {"children" in item ? (
                    <MobileDropdown item={item} onClose={() => setMobileMenuOpen(false)} />
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
                        isActive(item.href) && "bg-accent/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t px-4">
                <Button asChild className="w-full">
                  <Link to="/home/orcamento" onClick={() => setMobileMenuOpen(false)}>
                    Solicitar Orçamento
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

interface MobileDropdownProps {
  item: {
    label: string;
    children: readonly { label: string; href: string }[];
  };
  onClose: () => void;
}

function MobileDropdown({ item, onClose }: MobileDropdownProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                location.pathname === child.href && "bg-accent/50"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
