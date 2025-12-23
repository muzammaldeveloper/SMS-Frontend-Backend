import type { RequestInit } from "next/dist/server/web/spec-extension/request";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "")

const TOKEN_KEY = "authToken"
const ADMIN_KEY = "adminProfile"

const isBrowser = typeof window !== "undefined"

const buildUrl = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`

const getStoredToken = () => (isBrowser ? window.localStorage.getItem(TOKEN_KEY) : null)

export const setSession = (token: string, admin?: AdminProfile) => {
  if (!isBrowser) return
  window.localStorage.setItem(TOKEN_KEY, token)
  if (admin) {
    window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
  }
}

export const clearSession = () => {
  if (!isBrowser) return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(ADMIN_KEY)
}

export const getStoredAdmin = (): AdminProfile | null => {
  if (!isBrowser) return null
  const raw = window.localStorage.getItem(ADMIN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminProfile
  } catch (error) {
    return null
  }
}

type ApiRequestInit = Omit<RequestInit, "body"> & { auth?: boolean; body?: any }

async function apiFetch<T>(path: string, { auth = true, headers, body, ...init }: ApiRequestInit = {}): Promise<T> {
  const url = buildUrl(path)
  const normalizedHeaders = new Headers(headers || {})

  const isFormData = body instanceof FormData
  if (!isFormData) {
    normalizedHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getStoredToken()
    if (token) {
      normalizedHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: normalizedHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = (data as any)?.error || (data as any)?.message || response.statusText
    throw new Error(message)
  }

  return data as T
}

export type AdminProfile = {
  id: number
  name: string
  email: string
}

export type StudentPayload = {
  name: string
  age: number
  grade: string
  department: string
  email: string
  phon: string
  teacher_id?: number | null
}

export type TeacherPayload = {
  name: string
  email: string
  subject: string
}

export type AttendancePayload = {
  student_id: number
  status: boolean
  date?: string
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiFetch<{ token: string; admin: AdminProfile; message: string }>("/login", {
      method: "POST",
      body: payload,
      auth: false,
    }),
  register: (payload: { name: string; email: string; password: string }) =>
    apiFetch<{ admin_id: number; message: string }>("/register", {
      method: "POST",
      body: payload,
      auth: false,
    }),
  logout: () => apiFetch<{ message: string; user: string | number }>("/logout", { method: "POST" }),
}

export const adminsApi = {
  list: () => apiFetch<{ admins: AdminProfile[] }>("/get-admins"),
  create: (payload: { name: string; email: string; password: string }) =>
    apiFetch<{ admin_id: number; message: string }>("/add-admin", { method: "POST", body: payload }),
  update: (id: number, payload: Partial<{ name: string; email: string; password: string }>) =>
    apiFetch<{ message: string }>(`/update-admin/${id}`, { method: "PUT", body: payload }),
  remove: (id: number) => apiFetch<{ message: string }>(`/delete-admin/${id}`, { method: "DELETE" }),
}

export const studentsApi = {
  list: () => apiFetch<{ students: Array<StudentPayload & { id: number }> }>("/get-students"),
  create: (payload: StudentPayload) => apiFetch<{ message: string }>("/add-students", { method: "POST", body: payload }),
  update: (id: number, payload: Partial<StudentPayload>) =>
    apiFetch<{ message: string }>(`/update-student/${id}`, { method: "PUT", body: payload }),
  remove: (id: number) => apiFetch<{ message: string }>(`/delete-student/${id}`, { method: "DELETE" }),
}

export const teachersApi = {
  list: () => apiFetch<{ teachers: Array<TeacherPayload & { id: number }> }>("/get-teachers"),
  create: (payload: TeacherPayload) => apiFetch<{ message: string; teacher_id: number }>("/add-teacher", { method: "POST", body: payload }),
  update: (id: number, payload: Partial<TeacherPayload>) =>
    apiFetch<{ message: string }>(`/update-teacher/${id}`, { method: "PUT", body: payload }),
  remove: (id: number) => apiFetch<{ message: string }>(`/delete-teacher/${id}`, { method: "DELETE" }),
}

export type AttendanceRecord = {
  id: number
  student_id: number
  date: string
  status: boolean
}

export const attendanceApi = {
  list: () => apiFetch<{ attendance: AttendanceRecord[] }>("/get-attendance"),
  create: (payload: AttendancePayload) => apiFetch<{ attendance_id: number; message: string }>("/mark-attendance", { method: "POST", body: payload }),
  update: (id: number, payload: Partial<AttendancePayload>) =>
    apiFetch<{ message: string }>(`/update-attendance/${id}`, { method: "PUT", body: payload }),
  remove: (id: number) => apiFetch<{ message: string }>(`/delete-attendance/${id}`, { method: "DELETE" }),
}
