import Link from "next/link";
import { CineFolioLogo, TmdbIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Facebook, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-card text-muted-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Branding and Newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-2 mb-4">
              <CineFolioLogo className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">CineFolio</span>
            </div>
            <p className="text-sm max-w-sm">
              Your ultimate guide to the world of movies and television. Discover, track, and share your journey through cinema.
            </p>
            <form className="mt-6 flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-secondary border-border"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="secondary" size="icon" aria-label="Subscribe to newsletter">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-8 lg:grid-cols-4">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground mb-1">CineFolio</h4>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/discover" className="hover:text-primary transition-colors">Discover</Link>
              <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
              <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground mb-1">Legal</h4>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground mb-1">Social</h4>
              <div className="flex items-center gap-4">
                <Link href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5"/></Link>
                <Link href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5"/></Link>
                <Link href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5"/></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center sm:text-left">
            &copy; {currentYear} CineFolio. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <TmdbIcon className="h-5 w-auto" />
            <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
