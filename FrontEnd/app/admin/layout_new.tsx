"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  GraduationCapIcon,
  UsersIcon,
  UserIcon,
  ClipboardCheckIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronRightIcon,
  SparklesIcon,
  ShieldIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { authApi, clearSession, getStoredAdmin } from "@/lib/api"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [admin, setAdmin] = useState(getStoredAdmin())
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
    if (!token) {
      router.replace("/login")
      return
    }
    const storedAdmin = getStoredAdmin()
    if (storedAdmin) {
      setAdmin(storedAdmin)
    }
  }, [router])

  const initials = useMemo(() => {
    if (!admin) return "AD"
    const [first, second] = admin.name.split(" ")
    const firstInitial = first?.[0] || "A"
    const secondInitial = second?.[0] || admin.name.slice(1, 2) || "D"
    return `${firstInitial}${secondInitial}`.toUpperCase()
  }, [admin])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authApi.logout()
      toast.success("Logged out successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed"
      toast.error(message)
    } finally {
      clearSession()
      setLoggingOut(false)
      router.push("/login")
    }
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/admin/admins", label: "Admins", icon: ShieldIcon },
    { href: "/admin/students", label: "Students", icon: UsersIcon },
    { href: "/admin/teachers", label: "Teachers", icon: UserIcon },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheckIcon },
  ]

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="hidden md:flex border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
      >
        <SidebarHeader className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 px-1">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 group-data-[collapsible=icon]:mx-auto">
              <GraduationCapIcon className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                EduAdmin
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Management
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "group h-10 rounded-lg transition-all",
                      isActive &&
                        "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-200 dark:border-blue-800",
                      !isActive && "hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    <Link href={item.href} className="flex items-center w-full">
                      <div
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          isActive && "bg-blue-100 dark:bg-blue-950",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4 transition-colors",
                            isActive && "text-blue-600 dark:text-blue-400",
                            !isActive && "text-slate-600 dark:text-slate-400",
                          )}
                          strokeWidth={2.5}
                        />
                      </div>

                      <span
                        className={cn(
                          "font-semibold text-sm ml-2.5",
                          isActive && "text-slate-900 dark:text-slate-100",
                          !isActive && "text-slate-700 dark:text-slate-300",
                        )}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRightIcon className="size-4 ml-auto text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <Avatar className="size-9 ring-2 ring-blue-500/20 dark:ring-blue-400/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{admin?.name || "Admin User"}</p>
                <SparklesIcon className="size-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              </div>
              <div className="mt-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium select-all truncate">
                  {admin?.email || "admin@edu.com"}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full h-9 justify-start group-data-[collapsible=icon]:justify-center hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold rounded-lg"
          >
            <LogOutIcon className="size-4" strokeWidth={2.5} />
            <span className="group-data-[collapsible=icon]:hidden ml-2">{loggingOut ? "Logging out..." : "Logout"}</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-4">
          <SidebarTrigger className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 rounded-lg" />
          <Separator orientation="vertical" className="h-5 bg-slate-300 dark:bg-slate-700 hidden sm:block" />
          <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent truncate">
            Student Management System
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-slate-950 dark:to-slate-900/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
