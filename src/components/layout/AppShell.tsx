import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import AppSidebarContent from "./AppSidebarContent";
import AppHeaderInternal from "./AppHeaderInternal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-md">
          <AppSidebarContent />
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col bg-background">
          <AppHeaderInternal />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
