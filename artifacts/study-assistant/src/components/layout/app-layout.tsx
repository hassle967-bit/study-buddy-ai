import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  BrainCircuit, 
  CalendarDays,
  LogOut,
  Menu
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "To-Do List",
    url: "/todos",
    icon: CheckSquare,
  },
  {
    title: "AI Summarizer",
    url: "/summarize",
    icon: FileText,
  },
  {
    title: "Quiz Generator",
    url: "/quiz",
    icon: BrainCircuit,
  },
  {
    title: "Study Planner",
    url: "/study-plan",
    icon: CalendarDays,
  },
];

function AppSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-primary">Athena</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Study Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url} onClick={() => setOpenMobile(false)}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Basic auth guard
    if (!isAuthenticated) {
      setLocation("/login");
    } else {
      setIsReady(true);
    }
  }, [isAuthenticated, setLocation]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-background min-h-[100dvh] flex flex-col">
        <div className="md:hidden p-4 border-b border-border flex items-center bg-card">
          <SidebarTrigger />
          <span className="ml-4 font-serif text-xl text-primary">Athena</span>
        </div>
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
