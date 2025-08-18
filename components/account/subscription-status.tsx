"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Crown, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface SubscriptionStatusProps {
  accessExpiresAt: string | null
}

export function SubscriptionStatus({ accessExpiresAt }: SubscriptionStatusProps) {
  const hasAccess = accessExpiresAt && new Date(accessExpiresAt) > new Date()
  const expirationDate = accessExpiresAt ? new Date(accessExpiresAt) : null
  const daysUntilExpiration = expirationDate
    ? Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Access Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasAccess ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-medium">Active Premium Access</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  Your access expires on{" "}
                  {expirationDate?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {daysUntilExpiration <= 7 && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    Your access expires in {daysUntilExpiration} day{daysUntilExpiration !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-medium">No Active Access</span>
              </div>

              <p className="text-gray-400 text-sm">
                You don't have an active subscription. Purchase an access pass to enjoy premium content.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Link href="/#access-plans">
              <Button className="bg-[#f40088] hover:bg-[#d1006f] text-white">
                {hasAccess ? "Extend Access" : "Get Access Pass"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Premium Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#f40088] rounded-full"></div>
              Unlimited streaming of all premium content
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#f40088] rounded-full"></div>
              HD and 4K quality videos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#f40088] rounded-full"></div>
              Exclusive behind-the-scenes content
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#f40088] rounded-full"></div>
              Early access to new releases
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#f40088] rounded-full"></div>
              Mobile and desktop access
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
