import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { TopBar } from "@/components/shell/top-bar";
import { CommandPalette } from "@/components/shell/command-palette";
import { OrgProvider } from "@/lib/org-context";
import { DateRangeProvider } from "@/lib/date-range-context";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgProvider>
      <DateRangeProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TopBar />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
        <CommandPalette />
      </DateRangeProvider>
    </OrgProvider>
  );
}
