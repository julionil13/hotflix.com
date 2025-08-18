"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Loader2, CreditCard, CheckCircle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: string
    priceValue: number
    durationDays: number
  }
}

type PaymentStatus = "pending" | "processing" | "success" | "error"

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [pixCode, setPixCode] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [copied, setCopied] = useState(false)

  // Generate PIX code and payment ID when modal opens
  useEffect(() => {
    if (isOpen) {
      const generatedPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const generatedPixCode = `00020126580014BR.GOV.BCB.PIX0136${generatedPaymentId}520400005303986540${plan.priceValue.toFixed(2)}5802BR5925HOTFLIX STREAMING LTDA6009SAO PAULO62070503***6304`

      setPaymentId(generatedPaymentId)
      setPixCode(generatedPixCode)
      setPaymentStatus("pending")
    }
  }, [isOpen, plan.priceValue])

  // Simulate payment processing
  useEffect(() => {
    if (paymentStatus === "processing") {
      const timer = setTimeout(() => {
        setPaymentStatus("success")
      }, 3000) // Simulate 3 second processing

      return () => clearTimeout(timer)
    }
  }, [paymentStatus])

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy PIX code:", err)
    }
  }

  const handleSimulatePayment = () => {
    setPaymentStatus("processing")
  }

  const handleClose = () => {
    if (paymentStatus === "success") {
      // Refresh the page to update user access status
      window.location.reload()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            {paymentStatus === "success" ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Payment Approved!
              </>
            ) : (
              <>
                <CreditCard className="h-6 w-6 text-[#f40088]" />
                PIX Payment
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {paymentStatus === "success" ? (
            // Success State
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Access Granted!</h3>
                <p className="text-gray-300">Your {plan.name} has been activated successfully.</p>
                <p className="text-sm text-gray-400">You now have full access to all premium content.</p>
              </div>

              <Button onClick={handleClose} className="w-full bg-[#f40088] hover:bg-[#d1006f] text-white py-3">
                Start Watching
              </Button>
            </div>
          ) : (
            // Payment Flow
            <>
              {/* Plan Summary */}
              <div className="bg-[#1c1c1c] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-400">Payment ID: {paymentId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#f40088]">{plan.price}</div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG value={pixCode} size={200} />
                </div>
                <p className="text-sm text-gray-400">Scan the QR code with your banking app</p>
              </div>

              {/* PIX Code */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Or copy the PIX code:</label>
                <div className="flex gap-2">
                  <Input
                    value={pixCode}
                    readOnly
                    className="bg-[#1c1c1c] border-gray-600 text-white text-xs font-mono"
                  />
                  <Button
                    onClick={handleCopyPixCode}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent px-3"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Payment Status */}
              <div className="text-center space-y-4">
                {paymentStatus === "processing" ? (
                  <div className="flex items-center justify-center gap-2 text-[#f40088]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing payment...</span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>Awaiting payment...</span>
                    </div>
                    <p className="text-xs">Payment will be confirmed automatically</p>
                  </div>
                )}
              </div>

              {/* Demo Button (for testing) */}
              {paymentStatus === "pending" && (
                <Button
                  onClick={handleSimulatePayment}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-sm"
                >
                  Simulate Payment (Demo)
                </Button>
              )}

              {/* Cancel Button */}
              <Button
                onClick={handleClose}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                disabled={paymentStatus === "processing"}
              >
                Cancel Payment
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
