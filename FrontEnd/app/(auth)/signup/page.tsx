"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { GraduationCapIcon, LoaderIcon, UserIcon, MailIcon, LockIcon, ArrowRightIcon, CheckCircle2Icon, SparklesIcon } from "lucide-react"
import { authApi } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await authApi.register({ name, email, password })
      setSuccess(true)
      toast.success(res.message || "Account created successfully!", {
        duration: 3000,
      })
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed"
      setError(message)
      toast.error(message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 size-96 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-500/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-20 size-96 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 border border-blue-200/50 dark:border-blue-800/30 relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 animate-in fade-in-0 zoom-in-95 duration-500">
        {success ? (
          <div className="p-12 text-center space-y-6 animate-in fade-in-0 zoom-in-95 duration-700">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl shadow-blue-500/50">
                  <CheckCircle2Icon className="size-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <SparklesIcon className="size-5 text-blue-500 animate-pulse" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Success!
                </h2>
                <SparklesIcon className="size-5 text-indigo-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Account Created Successfully!
              </p>
              
              <p className="text-base text-slate-600 dark:text-slate-400">
                Welcome to our platform, <span className="font-bold text-blue-600 dark:text-blue-400">{name}</span>!
              </p>
              
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Redirecting to login page...</span>
                </div>
                <div className="flex justify-center gap-1">
                  <div className="size-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="size-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="size-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/50 transform group-hover:scale-105 transition-transform duration-300">
                <GraduationCapIcon className="size-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-400">
            Join us to manage your educational institution
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <div className="relative group">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <div className="relative group">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-slate-950"
                />
              </div>
            </div>
            {error ? <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline underline-offset-4 transition-all inline-flex items-center gap-1 group"
            >
              Sign in
              <ArrowRightIcon className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
        </>
        )}
      </Card>
    </div>
  )
}
