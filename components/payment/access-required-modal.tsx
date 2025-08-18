"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock, Star, Check } from "lucide-react"

interface AccessRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
  plan: {
    id: string
    name: string
    price: string
    description: string
    features: string[]
    popular: boolean
  }
}

export function AccessRequiredModal({ isOpen, onClose, onProceed, plan }: AccessRequiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Lock className="h-6 w-6 text-[#f40088]" />
            Premium Access Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Info */}
          <div className="text-center space-y-3">
            <div className="relative">
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#f40088] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}
              <div className="bg-[#1c1c1c] rounded-lg p-6 mt-4">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-[#f40088] mb-2">{plan.price}</div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">What you'll get:</h4>
            <ul className="space-y-2">
              {plan.features.slice(0, 3).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[#f40088] flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-sm text-gray-400 ml-6">+ {plan.features.length - 3} more features</li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onProceed}
              className="w-full bg-[#f40088] hover:bg-[#d1006f] text-white py-3 text-lg font-semibold"
            >
              Continue to Payment
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">Secure payment • Instant access • 7-day money-back guarantee</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
