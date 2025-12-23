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
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, UserIcon, MailIcon, ShieldIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { adminsApi, AdminProfile } from "@/lib/api"

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", role: "", password: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Load admins
  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      setLoading(true)
      const res = await adminsApi.list()
      setAdmins(res.admins || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load admins"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingAdmin) {
        await adminsApi.update(editingAdmin.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password }),
        })
        toast.success("Admin updated successfully")
      } else {
        await adminsApi.create({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        })
        toast.success("Admin added successfully")
      }

      setIsOpen(false)
      setFormData({ name: "", email: "", role: "", password: "" })
      setEditingAdmin(null)
      await loadAdmins()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (admin: AdminProfile) => {
    setEditingAdmin(admin)
    setFormData({ name: admin.name, email: admin.email, role: admin.role, password: "" })
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return

    try {
      await adminsApi.remove(id)
      toast.success("Admin deleted successfully")
      await loadAdmins()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      toast.error(message)
    }
  }

  const handleDialogClose = () => {
    setIsOpen(false)
    setFormData({ name: "", email: "", role: "", password: "" })
    setEditingAdmin(null)
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-cyan-700 to-blue-700 dark:from-slate-100 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Administrators
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Manage administrator accounts and permissions
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleDialogClose}
              className="h-11 md:h-12 px-4 md:px-6 w-full sm:w-auto bg-gradient-to-r from-cyan-600 via-cyan-600 to-blue-600 hover:from-cyan-700 hover:via-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 font-bold text-sm md:text-base"
            >
              <PlusIcon className="size-4 md:size-5" strokeWidth={2.5} />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                {editingAdmin ? "Edit Administrator" : "Add New Administrator"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingAdmin ? "Update admin information below" : "Enter admin details to add to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                    <Input
                      id="name"
                      placeholder="Enter admin name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </Label>
                  <div className="relative group">
                    <ShieldIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                    <Input
                      id="role"
                      placeholder="e.g., admin, super-admin"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                      disabled={submitting}
                      className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                </div>
                {!editingAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password (min 6 chars)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Set initial password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingAdmin}
                      disabled={submitting}
                      minLength={6}
                      className="pl-4 h-12 border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-all"
                    />
                  </div>
                )}
                {editingAdmin && formData.password && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ✓ Password will be updated (leave empty to keep current password)
                  </p>
                )}
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
                  className="h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 font-semibold"
                >
                  {submitting ? "..." : editingAdmin ? "Update Admin" : "Add Admin"}
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
                <div className="p-2 md:p-2.5 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900 shadow-sm">
                  <ShieldIcon className="size-4 md:size-5 text-cyan-600 dark:text-cyan-400" strokeWidth={2.5} />
                </div>
                Admin Directory
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">
                View and manage all administrators in the system
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 w-fit"
            >
              Total: {admins.length} admins
            </Badge>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-11 md:h-12 border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm md:text-base"
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
                    Role
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
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm md:text-base"
                    >
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow
                      key={admin.id}
                      className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-colors"
                    >
                      <TableCell className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100">
                        {admin.name}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                        {admin.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-semibold border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300">
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(admin)}
                            disabled={submitting}
                            className="h-8 w-8 md:h-9 md:w-9 hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-950 dark:hover:text-cyan-300 transition-all hover:scale-110"
                          >
                            <PencilIcon className="size-3.5 md:size-4" strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(admin.id)}
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
