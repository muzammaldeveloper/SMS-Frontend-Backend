"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircleIcon, XCircleIcon, SaveIcon, TrendingUpIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { studentsApi, attendanceApi, AttendancePayload, AttendanceRecord as ApiAttendanceRecord } from "@/lib/api"

type Student = {
  id: number
  name: string
  grade: string
}

type AttendanceRecord = {
  studentId: number
  studentName: string
  status: boolean
  attendanceId?: number
}

export default function AttendancePage() {
  const [date, setDate] = useState<Date | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDate(new Date())
    loadStudents()
  }, [])

  useEffect(() => {
    if (date && students.length > 0) {
      loadAttendanceForDate()
    }
  }, [date, students])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const res = await studentsApi.list()
      const studentList = (res.students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        grade: s.grade || "",
      }))
      setStudents(studentList)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load students"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const loadAttendanceForDate = async () => {
    if (!date) return
    try {
      const res = await attendanceApi.list()
      const allAttendance = res.attendance || []
      const dateStr = format(date, "yyyy-MM-dd")

      // Create a map of existing attendance for this date
      const attendanceMap = new Map<number, ApiAttendanceRecord>()
      allAttendance.forEach((att: ApiAttendanceRecord) => {
        const attDate = att.date.split("T")[0] // Handle both "2024-01-01" and "2024-01-01T00:00:00"
        if (attDate === dateStr) {
          attendanceMap.set(att.student_id, att)
        }
      })

      // Build attendance records for all students
      const records: AttendanceRecord[] = students.map((student) => {
        const existingAtt = attendanceMap.get(student.id)
        return {
          studentId: student.id,
          studentName: student.name,
          status: existingAtt ? existingAtt.status : false,
          attendanceId: existingAtt?.id,
        }
      })

      setAttendance(records)
    } catch (error) {
      console.error("Error loading attendance:", error)
      // Initialize with all absent if loading fails
      const records: AttendanceRecord[] = students.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        status: false,
      }))
      setAttendance(records)
    }
  }

  const classes = [
    "Grade 1A",
    "Grade 1B",
    "Grade 2A",
    "Grade 2B",
    "Grade 3A",
    "Grade 3B",
    "Grade 4A",
    "Grade 4B",
    "Grade 5A",
    "Grade 5B",
    "Grade 6A",
    "Grade 6B",
    "Grade 7A",
    "Grade 7B",
    "Grade 8A",
    "Grade 8B",
    "Grade 9A",
    "Grade 9B",
    "Grade 10A",
    "Grade 10B",
    "Grade 11A",
    "Grade 11B",
    "Grade 12A",
    "Grade 12B",
  ]

  const filteredAttendance = selectedClass && selectedClass !== "all"
    ? attendance.filter((record) => {
        const student = students.find((s) => s.id === record.studentId)
        return student?.grade === selectedClass
      })
    : attendance

  const toggleAttendance = (studentId: number) => {
    setAttendance(
      attendance.map((record) =>
        record.studentId === studentId ? { ...record, status: !record.status } : record,
      ),
    )
  }

  const handleSave = async () => {
    if (!date) return
    try {
      setSaving(true)
      const dateStr = format(date, "yyyy-MM-dd")
      const recordsToSave = selectedClass && selectedClass !== "all"
        ? attendance.filter((record) => {
            const student = students.find((s) => s.id === record.studentId)
            return student?.grade === selectedClass
          })
        : attendance

      for (const record of recordsToSave) {
        const payload: AttendancePayload = {
          student_id: record.studentId,
          status: record.status,
          date: dateStr,
        }

        if (record.attendanceId) {
          await attendanceApi.update(record.attendanceId, payload)
        } else {
          const result = await attendanceApi.create(payload)
          // Update the attendance record with the new ID
          setAttendance((prev) =>
            prev.map((att) =>
              att.studentId === record.studentId ? { ...att, attendanceId: result.attendance_id } : att,
            ),
          )
        }
      }

      toast.success("Attendance saved successfully")
      await loadAttendanceForDate()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save attendance"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const presentCount = filteredAttendance.filter((r) => r.status).length
  const absentCount = filteredAttendance.filter((r) => !r.status).length
  const attendanceRate = filteredAttendance.length > 0 ? Math.round((presentCount / filteredAttendance.length) * 100) : 0

  if (!mounted || !date) {
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-green-700 to-emerald-700 dark:from-slate-100 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
          Attendance Management
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base font-medium">Track and manage student attendance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
          <CardHeader className="relative pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" strokeWidth={2.5} />
              </div>
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{presentCount}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Students marked present</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
          <CardHeader className="relative pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-red-900 group-hover:scale-110 transition-transform">
                <XCircleIcon className="size-4 text-red-600 dark:text-red-400" strokeWidth={2.5} />
              </div>
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">{absentCount}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Students marked absent</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
          <CardHeader className="relative pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 group-hover:scale-110 transition-transform">
                <TrendingUpIcon className="size-4 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
              </div>
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{attendanceRate}%</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Overall attendance today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-black/20 bg-white dark:bg-slate-900">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold">Mark Attendance</CardTitle>
          <CardDescription className="text-base">Select date and class to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-medium h-12 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="size-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-12 border-slate-300 dark:border-slate-700 font-medium">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-medium">
                    All Classes
                  </SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls} className="font-medium">
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100">Student Name</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-900 dark:text-slate-100">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-slate-500 dark:text-slate-400">
                      No students found. Please add students first.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((record) => (
                    <TableRow
                      key={record.studentId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        {record.studentName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status ? "default" : "destructive"}
                          className={cn(
                            "font-semibold shadow-sm",
                            record.status &&
                              "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
                          )}
                        >
                          {record.status ? (
                            <>
                              <CheckCircleIcon className="size-3.5" strokeWidth={2.5} />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="size-3.5" strokeWidth={2.5} />
                              Absent
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={record.status ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleAttendance(record.studentId)}
                          disabled={saving}
                          className={cn(
                            "transition-all hover:scale-105 font-semibold h-9",
                            !record.status &&
                              "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm",
                          )}
                        >
                          Mark {record.status ? "Absent" : "Present"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving || loading || filteredAttendance.length === 0}
              className="h-12 px-8 bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 hover:from-green-700 hover:via-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold text-base disabled:opacity-50"
            >
              <SaveIcon className="size-5" strokeWidth={2.5} />
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
