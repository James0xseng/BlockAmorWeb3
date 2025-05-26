"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppHeaderInternal() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:h-20 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="21" x2="3" y1="6" y2="6"></line><line x1="15" x2="3" y1="12" y2="12"></line><line x1="17" x2="3" y1="18" y2="18"></line></svg>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SidebarTrigger>
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary md:text-xl">
          <Shield className="h-7 w-7 text-primary" />
          <span className="font-mono">BlockArmor</span>
        </Link>
      </div>
      <div className="ml-auto">
        {/* Placeholder for User Profile / Actions, e.g., Connect Wallet button */}
        {/* <Button variant="outline">Connect Wallet</Button> */}
      </div>
    </header>
  );
}
