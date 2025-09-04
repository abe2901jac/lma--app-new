"use client";

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Building, Shield, LogOut, LifeBuoy, Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";


export function UserNav() {
  const router = useRouter();
  const { userData } = useAuth();
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  }

  const getAvatarSrc = () => {
    return userData?.photoURL || '';
  }

  const getFallback = () => {
    if (userData?.role === 'admin') return <Shield className="w-5 h-5" />;
    if (userData?.role === 'brand') return <Building className="w-5 h-5" />;
    if (userData?.role === 'promoter') return <Megaphone className="w-5 h-5" />;
    return <User className="w-5 h-5" />
  }

  const getUsername = () => {
    if (userData?.role === 'brand') return userData?.companyName || userData?.name || 'Brand User';
    return userData?.name || 'User';
  }

  const getEmail = () => {
    return userData?.email || '';
  }

  if (!userData) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-full justify-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarSrc()} alt="@user" />
            <AvatarFallback>{getFallback()}</AvatarFallback>
          </Avatar>
          <div className="text-left hidden group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium leading-none">{getUsername()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getEmail()}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUsername()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getEmail()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>??P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>?S</DropdownMenuShortcut>
          </DropdownMenuItem>
           <Link href="/help">
            <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Help / User Guide
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        {userData.role === 'admin' && (
           <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Switch Dashboard</DropdownMenuLabel>
              <Link href="/brand">
                <DropdownMenuItem>
                  Brand View
                </DropdownMenuItem>
              </Link>
              <Link href="/promoter">
                <DropdownMenuItem>
                  Promoter View
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
           </>
        )}
        <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
            <DropdownMenuShortcut>??Q</DropdownMenuShortcut>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
