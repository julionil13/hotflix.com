"use client"

import { useState } from "react"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AccessRequiredModal } from "@/components/payment/access-required-modal"
import { PaymentModal } from "@/components/payment/payment-modal"

interface AccessPlansProps {
  className?: string
}

const plans = [
  {
    id: "monthly",
    name: "Monthly Pass",
    price: "R$ 29,90",
    priceValue: 29.9,
    period: "per month",
    description: "Full access to all premium content",
    features: [
      "Unlimited streaming",
      "HD quality videos",
      "All exclusive content",
      "Mobile & desktop access",
      "Cancel anytime",
    ],
    popular: false,
    durationDays: 30,
  },
  {
    id: "annual",
    name: "Annual Pass",
    price: "R$ 199,90",
    priceValue: 199.9,
    period: "per year",
    description: "Best value - Save 44%",
    features: [
      "Everything in Monthly",
      "4K ultra HD quality",
      "Early access to new content",
      "Exclusive behind-the-scenes",
      "Priority customer support",
      "Download for offline viewing",
    ],
    popular: true,
    durationDays: 365,
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    price: "R$ 499,90",
    priceValue: 499.9,
    period: "one-time payment",
    description: "Never pay again",
    features: [
      "Everything in Annual",
      "Lifetime access guarantee",
      "VIP member status",
      "Exclusive member events",
      "Direct model interaction",
      "Custom content requests",
    ],
    popular: false,
    durationDays: 36500, // 100 years
  },
]

export function AccessPlans({ className }: AccessPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null)
  const [showAccessRequired, setShowAccessRequired] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const handlePlanSelect = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan)
    setShowAccessRequired(true)
  }

  const handleProceedToPayment = () => {
    setShowAccessRequired(false)
    setShowPayment(true)
  }

  const handleCloseModals = () => {
    setShowAccessRequired(false)
    setShowPayment(false)
    setSelectedPlan(null)
  }

  return (
    <>
      <section className={cn("container mx-auto px-4", className)} id="access-plans">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Access Plan</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get unlimited access to premium content with our flexible pricing options. No recurring subscriptions - pay
            once, enjoy until expiration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative bg-[#2d2d2d] border-gray-700 text-white transition-transform duration-300 hover:scale-105",
                plan.popular && "border-[#f40088] ring-2 ring-[#f40088]/20",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#f40088] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-black text-[#f40088]">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-[#f40088] flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={cn(
                    "w-full py-6 text-lg font-semibold transition-colors",
                    plan.popular
                      ? "bg-[#f40088] hover:bg-[#d1006f] text-white"
                      : "bg-white text-black hover:bg-gray-200",
                  )}
                >
                  Get {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">Secure payment via PIX • Instant access • 7-day money-back guarantee</p>
        </div>
      </section>

      {/* Payment Modals */}
      {selectedPlan && (
        <>
          <AccessRequiredModal
            isOpen={showAccessRequired}
            onClose={handleCloseModals}
            onProceed={handleProceedToPayment}
            plan={selectedPlan}
          />

          <PaymentModal isOpen={showPayment} onClose={handleCloseModals} plan={selectedPlan} />
        </>
      )}
    </>
  )
}
