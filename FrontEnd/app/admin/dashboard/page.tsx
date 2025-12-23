"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, UserIcon, ClipboardCheckIcon, TrendingUpIcon, ArrowUpIcon, BookOpenIcon, ShieldIcon } from "lucide-react"
import { toast } from "sonner"
import { adminsApi, attendanceApi, studentsApi, teachersApi } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState({
    students: 0,
    teachers: 0,
    admins: 0,
    attendanceTotal: 0,
    attendanceRate: 0,
  })
  const [recentActivity, setRecentActivity] = useState<
    Array<{ action: string; detail: string; time: string; icon: typeof UsersIcon }>
  >([
    { action: "Welcome back", detail: "Loading latest insights...", time: "Just now", icon: TrendingUpIcon },
  ])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [studentsRes, teachersRes, attendanceRes, adminsRes] = await Promise.all([
          studentsApi.list(),
          teachersApi.list(),
          attendanceApi.list(),
          adminsApi.list(),
        ])

        const totalAttendance = attendanceRes.attendance.length
        const presentCount = attendanceRes.attendance.filter((entry) => entry.status).length
        const attendanceRate = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0

        setSummary({
          students: studentsRes.students.length,
          teachers: teachersRes.teachers.length,
          admins: adminsRes.admins.length,
          attendanceTotal: totalAttendance,
          attendanceRate,
        })

        const activity = attendanceRes.attendance.slice(0, 4).map((entry) => ({
          action: entry.status ? "Marked present" : "Marked absent",
          detail: `Student #${entry.student_id} on ${new Date(entry.date).toLocaleDateString()}`,
          time: "Recent",
          icon: ClipboardCheckIcon,
        }))

        setRecentActivity(
          activity.length
            ? activity
            : [
                { action: "System ready", detail: "No attendance records yet", time: "Now", icon: TrendingUpIcon },
              ],
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard"
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const statCards = [
    {
      title: "Students",
      value: summary.students,
      icon: UsersIcon,
      trend: loading ? "Loading" : `${summary.students || 0} total`,
      color: "text-blue-600 dark:text-blue-400",
      href: "/admin/students",
    },
    {
      title: "Teachers",
      value: summary.teachers,
      icon: UserIcon,
      trend: loading ? "Loading" : `${summary.teachers || 0} total`,
      color: "text-purple-600 dark:text-purple-400",
      href: "/admin/teachers",
    },
    {
      title: "Admins",
      value: summary.admins,
      icon: ShieldIcon,
      trend: loading ? "Loading" : `${summary.admins || 0} total`,
      color: "text-cyan-600 dark:text-cyan-400",
      href: "/admin/admins",
    },
    {
      title: "Attendance Rate",
      value: `${summary.attendanceRate}%`,
      icon: ClipboardCheckIcon,
      trend: loading ? "Loading" : `${summary.attendanceTotal} records`,
      color: "text-green-600 dark:text-green-400",
      href: "/admin/attendance",
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 font-medium">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const bgClass =
            stat.color.includes("blue")
              ? "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900"
              : stat.color.includes("purple")
                ? "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900"
                : stat.color.includes("cyan")
                  ? "from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900"
                  : "from-green-100 to-green-50 dark:from-green-950 dark:to-green-900"
          return (
            <Card
              key={stat.title}
              onClick={() => router.push(stat.href)}
              className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in fade-in-0 zoom-in-95 overflow-hidden relative cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 md:p-2.5 rounded-xl bg-gradient-to-br ${bgClass} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className={`size-4 md:size-5 ${stat.color}`} strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent className="relative space-y-1">
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">{loading ? "..." : stat.value}</div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                  <ArrowUpIcon className="size-3 md:size-3.5" strokeWidth={3} />
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-white dark:bg-slate-900">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUpIcon className="size-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              onClick={() => router.push("/admin/students")}
              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors cursor-pointer">
              <UsersIcon className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium">Manage student records</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove students</div>
              </div>
            </div>
            <div 
              onClick={() => router.push("/admin/teachers")}
              className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors cursor-pointer">
              <UserIcon className="size-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <div className="font-medium">Update teacher information</div>
                <div className="text-sm text-muted-foreground">Manage teacher profiles and subjects</div>
              </div>
            </div>
            <div 
              onClick={() => router.push("/admin/attendance")}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors cursor-pointer">
              <ClipboardCheckIcon className="size-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <div className="font-medium">Track daily attendance</div>
                <div className="text-sm text-muted-foreground">Mark and monitor student presence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-white dark:bg-slate-900">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardCheckIcon className="size-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex gap-3 items-start group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-sm group-hover:text-primary transition-colors">
                        {activity.action}
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.detail}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
