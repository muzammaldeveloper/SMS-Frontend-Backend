"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  GraduationCapIcon,
  UserIcon,
  MailIcon,
  BookOpenIcon,
} from "lucide-react"
import { toast } from "sonner"
import { teachersApi, TeacherPayload } from "@/lib/api"

type Teacher = TeacherPayload & { id: number }

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState<TeacherPayload>({ name: "", email: "", subject: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const res = await teachersApi.list()
      setTeachers((res.teachers || []) as Teacher[])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load teachers"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingTeacher) {
        await teachersApi.update(editingTeacher.id, formData)
        toast.success("Teacher updated successfully")
      } else {
        await teachersApi.create(formData)
        toast.success("Teacher added successfully")
      }

      setIsOpen(false)
      setFormData({ name: "", email: "", subject: "" })
      setEditingTeacher(null)
      await loadTeachers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    const { id, ...rest } = teacher
    setFormData(rest)
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return

    try {
      await teachersApi.remove(id)
      toast.success("Teacher deleted successfully")
      await loadTeachers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      toast.error(message)
    }
  }

  const handleDialogClose = () => {
    setIsOpen(false)
    setFormData({ name: "", email: "", subject: "", role: "" })
    setEditingTeacher(null)
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-purple-700 to-indigo-700 dark:from-slate-100 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Teachers
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Manage teacher records and information
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleDialogClose}
              className="h-11 md:h-12 px-4 md:px-6 w-full sm:w-auto bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 hover:from-purple-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-bold text-sm md:text-base"
            >
              <PlusIcon className="size-4 md:size-5" strokeWidth={2.5} />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingTeacher ? "Update teacher information below" : "Enter teacher details to add to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="name"
                      placeholder="Dr. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Subject *
                  </Label>
                  <div className="relative group">
                    <BookOpenIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="subject"
                      placeholder="Mathematics"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={submitting}
                  className="h-11 font-medium bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 font-semibold"
                >
                  {submitting ? "..." : editingTeacher ? "Update Teacher" : "Add Teacher"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2">
                <div className="p-2 md:p-2.5 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 shadow-sm">
                  <GraduationCapIcon
                    className="size-4 md:size-5 text-purple-600 dark:text-purple-400"
                    strokeWidth={2.5}
                  />
                </div>
                Teacher Directory
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">
                View and manage all teachers in the system
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 w-fit"
            >
              Total: {teachers.length} teachers
            </Badge>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-11 md:h-12 border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-sm md:text-base"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="rounded-lg border-2 border-slate-200 dark:border-slate-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                  <TableHead className="font-black text-xs md:text-sm text-slate-900 dark:text-slate-100">
                    Name
                  </TableHead>
                  <TableHead className="font-black text-xs md:text-sm text-slate-900 dark:text-slate-100 hidden sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="font-black text-xs md:text-sm text-slate-900 dark:text-slate-100">
                    Subject
                  </TableHead>
                  <TableHead className="text-right font-black text-xs md:text-sm text-slate-900 dark:text-slate-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm md:text-base"
                    >
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow
                      key={teacher.id}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      <TableCell className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100">
                        {teacher.name}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                        {teacher.email}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold shadow-sm text-xs">
                          {teacher.subject}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(teacher)}
                            disabled={submitting}
                            className="h-8 w-8 md:h-9 md:w-9 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300 transition-all hover:scale-110"
                          >
                            <PencilIcon className="size-3.5 md:size-4" strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(teacher.id)}
                            disabled={submitting}
                            className="h-8 w-8 md:h-9 md:w-9 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300 transition-all hover:scale-110"
                          >
                            <TrashIcon className="size-3.5 md:size-4" strokeWidth={2.5} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
