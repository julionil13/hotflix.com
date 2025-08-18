"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#f40088] hover:bg-[#d1006f] text-white py-3 text-lg font-semibold"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
  onSuccess?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignUp, onSuccess }: LoginModalProps) {
  const [state, formAction] = useActionState(signIn, null)

  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
      onClose()
      window.location.reload() // Refresh to update auth state
    }
  }, [state, onSuccess, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                required
                className="bg-[#1c1c1c] border-gray-600 text-white"
              />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToSignUp} className="text-[#f40088] hover:underline font-medium">
              Sign up
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
