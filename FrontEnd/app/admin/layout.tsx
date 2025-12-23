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
    if (storedAdmin) setAdmin(storedAdmin)
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
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, color: "blue" as const },
    { href: "/admin/students", label: "Students", icon: UsersIcon, color: "indigo" as const },
    { href: "/admin/teachers", label: "Teachers", icon: UserIcon, color: "purple" as const },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheckIcon, color: "green" as const },
  ]

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900"
      >
        <SidebarHeader className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl shadow-blue-600/40 group-data-[collapsible=icon]:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <GraduationCapIcon className="size-6 text-white relative z-10" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-black text-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                  EduAdmin
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">
                  Pro Dashboard
                </span>
              </div>
            </div>
            <SidebarTrigger className="hidden md:inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition" />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-6">
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.href

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-300 h-12 rounded-xl",
                      isActive && "bg-gradient-to-r shadow-lg",
                      isActive && item.color === "blue" &&
                        "from-blue-500/15 via-blue-500/10 to-transparent dark:from-blue-500/25 dark:via-blue-500/15 shadow-blue-500/20 border border-blue-200 dark:border-blue-800",
                      isActive && item.color === "indigo" &&
                        "from-indigo-500/15 via-indigo-500/10 to-transparent dark:from-indigo-500/25 dark:via-indigo-500/15 shadow-indigo-500/20 border border-indigo-200 dark:border-indigo-800",
                      isActive && item.color === "purple" &&
                        "from-purple-500/15 via-purple-500/10 to-transparent dark:from-purple-500/25 dark:via-purple-500/15 shadow-purple-500/20 border border-purple-200 dark:border-purple-800",
                      isActive && item.color === "green" &&
                        "from-green-500/15 via-green-500/10 to-transparent dark:from-green-500/25 dark:via-green-500/15 shadow-green-500/20 border border-green-200 dark:border-green-800",
                      !isActive && "hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:shadow-md hover:scale-[1.02]",
                      "group-data-[collapsible=icon]:px-2",
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                    >
                      {(isActive || isHovered) && (
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-r opacity-0 animate-in fade-in-0 duration-300",
                            isActive && "opacity-100",
                            item.color === "blue" && "from-blue-500/5 to-transparent",
                            item.color === "indigo" && "from-indigo-500/5 to-transparent",
                            item.color === "purple" && "from-purple-500/5 to-transparent",
                            item.color === "green" && "from-green-500/5 to-transparent",
                          )}
                        />
                      )}

                      <div
                        className={cn(
                          "relative p-2 rounded-lg transition-all duration-300 group-data-[collapsible=icon]:mx-auto",
                          isActive && item.color === "blue" && "bg-blue-100 dark:bg-blue-950",
                          isActive && item.color === "indigo" && "bg-indigo-100 dark:bg-indigo-950",
                          isActive && item.color === "purple" && "bg-purple-100 dark:bg-purple-950",
                          isActive && item.color === "green" && "bg-green-100 dark:bg-green-950",
                          isHovered && !isActive && "scale-110",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5 transition-colors duration-300",
                            isActive && item.color === "blue" && "text-blue-700 dark:text-blue-400",
                            isActive && item.color === "indigo" && "text-indigo-700 dark:text-indigo-400",
                            isActive && item.color === "purple" && "text-purple-700 dark:text-purple-400",
                            isActive && item.color === "green" && "text-green-700 dark:text-green-400",
                            !isActive && "text-slate-600 dark:text-slate-400",
                          )}
                          strokeWidth={2.5}
                        />
                      </div>

                      <span
                        className={cn(
                          "font-bold text-base transition-colors duration-300 ml-1",
                          isActive && "text-slate-900 dark:text-slate-100",
                          !isActive && "text-slate-700 dark:text-slate-300",
                          "group-data-[collapsible=icon]:hidden",
                        )}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRightIcon
                          className={cn(
                            "size-4 ml-auto animate-in slide-in-from-left-2 duration-300",
                            item.color === "blue" && "text-blue-600 dark:text-blue-400",
                            item.color === "indigo" && "text-indigo-600 dark:text-indigo-400",
                            item.color === "purple" && "text-purple-600 dark:text-purple-400",
                            item.color === "green" && "text-green-600 dark:text-green-400",
                          )}
                          strokeWidth={3}
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-300" />
            <Avatar className="size-11 ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-lg relative z-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden relative z-10 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{admin?.name || "Admin User"}</p>
                <SparklesIcon className="size-3 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">{admin?.email || "admin@edu.com"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full h-11 justify-start group-data-[collapsible=icon]:justify-center hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 dark:hover:from-red-950/20 dark:hover:to-red-950/10 hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 font-bold rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-900 hover:shadow-md hover:shadow-red-500/10"
          >
            <LogOutIcon className="size-5" strokeWidth={2.5} />
            <span className="group-data-[collapsible=icon]:hidden ml-2">{loggingOut ? "Logging out..." : "Logout"}</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 md:h-18 items-center gap-3 md:gap-4 border-b-2 border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 md:px-6 shadow-sm">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 rounded-lg transition-all hover:scale-110" />
          <Separator orientation="vertical" className="h-6 bg-slate-300 dark:bg-slate-700 hidden sm:block" />
          <h1 className="text-base md:text-lg font-black bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Student Management System
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950/50 dark:to-slate-900/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
