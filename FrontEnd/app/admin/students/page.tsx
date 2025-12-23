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
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, UserIcon, MailIcon, CakeIcon, BookOpenIcon, PhoneIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { studentsApi, StudentPayload } from "@/lib/api"

type Student = StudentPayload & { id: number }

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<StudentPayload>({
    name: "",
    email: "",
    age: 0,
    grade: "",
    department: "",
    phon: "",
    teacher_id: null,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const res = await studentsApi.list()
      setStudents((res.students || []) as Student[])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load students"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, formData)
        toast.success("Student updated successfully")
      } else {
        await studentsApi.create(formData)
        toast.success("Student added successfully")
      }

      setIsOpen(false)
      setFormData({
        name: "",
        email: "",
        age: 0,
        grade: "",
        department: "",
        phon: "",
        teacher_id: null,
      })
      setEditingStudent(null)
      await loadStudents()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    const { id, ...rest } = student
    setFormData(rest)
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return

    try {
      await studentsApi.remove(id)
      toast.success("Student deleted successfully")
      await loadStudents()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      toast.error(message)
    }
  }

  const handleDialogClose = () => {
    setIsOpen(false)
    setFormData({
      name: "",
      email: "",
      age: 0,
      grade: "",
      department: "",
      phon: "",
      teacher_id: null,
    })
    setEditingStudent(null)
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Students
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Manage student records and information
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleDialogClose}
              className="h-11 md:h-12 px-4 md:px-6 w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-bold text-sm md:text-base"
            >
              <PlusIcon className="size-4 md:size-5" strokeWidth={2.5} />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {editingStudent ? "Edit Student" : "Add New Student"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingStudent ? "Update student information below" : "Enter student details to add to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email *
                  </Label>
                  <div className="relative group">
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Age *
                  </Label>
                  <div className="relative group">
                    <CakeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="age"
                      type="number"
                      placeholder="16"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      required
                      disabled={submitting}
                      min="1"
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Grade *
                  </Label>
                  <div className="relative group">
                    <BookOpenIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="grade"
                      placeholder="10A"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Department *
                  </Label>
                  <Input
                    id="department"
                    placeholder="Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    disabled={submitting}
                    className="pl-4 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phon" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone *
                  </Label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="phon"
                      placeholder="+1234567890"
                      value={formData.phon}
                      onChange={(e) => setFormData({ ...formData, phon: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Teacher ID (optional)
                  </Label>
                  <Input
                    id="teacher_id"
                    type="number"
                    placeholder="Leave blank if none"
                    value={formData.teacher_id || ""}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value ? Number(e.target.value) : null })}
                    disabled={submitting}
                    className="pl-4 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                  />
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
                  className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 font-semibold"
                >
                  {submitting ? "..." : editingStudent ? "Update Student" : "Add Student"}
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
                <div className="p-2 md:p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 shadow-sm">
                  <UserIcon className="size-4 md:size-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
                Student Directory
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">
                View and manage all students in the system
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 w-fit"
            >
              Total: {students.length} students
            </Badge>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-11 md:h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm md:text-base"
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
                    Grade
                  </TableHead>
                  <TableHead className="font-black text-xs md:text-sm text-slate-900 dark:text-slate-100 hidden md:table-cell">
                    Age
                  </TableHead>
                  <TableHead className="text-right font-black text-xs md:text-sm text-slate-900 dark:text-slate-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm md:text-base"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                    >
                      <TableCell className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-semibold border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                          {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs md:text-sm text-slate-600 dark:text-slate-400">
                        {student.age}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(student)}
                            disabled={submitting}
                            className="h-8 w-8 md:h-9 md:w-9 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition-all hover:scale-110"
                          >
                            <PencilIcon className="size-3.5 md:size-4" strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
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
