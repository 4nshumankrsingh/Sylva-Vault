import Link from "next/link";
import { TreePine, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TreePine className="w-4 h-4 text-white" strokeWidth={1.8} />
              </div>
              <span className="font-display font-semibold text-foreground">
                Sylva Vault
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Golf meets generosity. Track your scores, win monthly prizes, and
              give back to causes that matter.
            </p>
          </div>


          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Platform</h4>
              {[
                { href: "/dashboard",  label: "Dashboard"     },
                { href: "/draws",      label: "Monthly Draws" },
                { href: "/charities",  label: "Charities"     },
                { href: "/subscribe",  label: "Subscribe"     },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              {[
                { href: "/about",   label: "About"          },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms",   label: "Terms of Service" },
                { href: "/contact", label: "Contact"        },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sylva Vault. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}