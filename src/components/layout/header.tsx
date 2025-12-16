
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  LogIn,
  UserPlus,
  Home,
  Compass,
  User,
  Users,
} from 'lucide-react';
import { CineFolioLogo } from '@/components/icons';
import { UserAvatar } from '../cinefolio/user-avatar';
import { useUser } from '@/firebase/provider';
import { useMemo } from 'react';

const baseNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
];

export function Header() {
  const { user, isUserLoading } = useUser();

  const navLinks = useMemo(() => {
    const links = [...baseNavLinks];
    if (user) {
      links.push({ href: '/community', label: 'Community', icon: Users });
    }
    return links;
  }, [user]);

  const profileLink = user ? `/profile/${user.uid}` : '/profile';
  const mobileNavLinks = useMemo(() => {
    const links = [...navLinks];
    if (user) {
      links.push({ href: profileLink, label: 'Profile', icon: User });
    }
    return links;
  }, [navLinks, user, profileLink]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <CineFolioLogo className="h-8 w-8 text-primary" />
            <span className="hidden text-xl font-bold sm:inline-block">CineFolio</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
             {user && (
              <Link
                href={profileLink}
                className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 pt-12">
            <Link
              href="/"
              className="mb-8 flex items-center"
            >
              <CineFolioLogo className="mr-2 h-8 w-8 text-primary" />
              <span className="font-bold text-xl">CineFolio</span>
            </Link>
            <div className="flex flex-col space-y-4">
              {mobileNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground hover:text-primary flex items-center gap-3">
                   <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* Search can be implemented here */}
          </div>
          <nav className="flex items-center">
            {isUserLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : user ? (
                <UserAvatar />
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4"/>
                            Login
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                        </Link>
                    </Button>
                </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
