
"use client";
import { usePathname, useRouter } from "next/navigation"; 
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"; 
import {
  Shield,
  LayoutDashboard,
  SearchCode,
  IterationCcw,
  Fuel,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  LifeBuoy,
  FlaskConical, // Added FlaskConical for Testing Type
} from "lucide-react";
import { cn } from "@/lib/utils";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/testing-type", label: "Testing Type Analyzer", icon: FlaskConical }, // New item
  { href: "/scanner", label: "Vulnerability Scanner", icon: SearchCode },
  { href: "/simulator", label: "Transaction Simulator", icon: IterationCcw },
  { href: "/gas-estimator", label: "Gas Estimator", icon: Fuel },
  { href: "/address-reputation", label: "Address Reputation", icon: UserCheck },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/visualizations", label: "Visualizations", icon: BarChart3 },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Support", icon: LifeBuoy },
];


export default function AppSidebarContent() {
  const pathname = usePathname();
  const router = useRouter(); 

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {/* Updated NextLink to use SidebarMenuButton's href directly if needed, but keeping it simple */}
        <SidebarMenuButton
            href="/dashboard"
            className={cn(
                "text-lg font-semibold text-sidebar-primary group-data-[collapsible=icon]:justify-center !p-0 hover:!bg-transparent focus-visible:!ring-0",
            )}
            tooltip={{ children: "BlockArmor Dashboard", className: "text-xs" }}
            variant="ghost" // Ensure it looks like a link/header
            size="lg" // Adjust size if needed
            >
            <Shield className="h-7 w-7 shrink-0 text-primary" />
            <span className="font-mono group-data-[collapsible=icon]:hidden">BlockArmor</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                className={cn(
                  "justify-start",
                  (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                tooltip={{ children: item.label, className: "text-xs" }}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
             <SidebarMenuItem key={item.href}>
               <SidebarMenuButton
                 href={item.href}
                 isActive={pathname === item.href}
                 className={cn(
                   "justify-start",
                   pathname === item.href
                     ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                     : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                 )}
                 tooltip={{ children: item.label, className: "text-xs" }}
               >
                 <item.icon className="h-5 w-5 shrink-0" />
                 <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
               </SidebarMenuButton>
           </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    console.log("Log Out Clicked - redirecting to /login");
                    router.push('/login'); 
                  }}
                  className="justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  tooltip={{children: "Log Out", className: "text-xs"}}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

