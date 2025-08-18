"use client"

import { useState } from "react"
import { User, CreditCard, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signOut } from "@/lib/actions"
import { ProfileSettings } from "./profile-settings"
import { SubscriptionStatus } from "./subscription-status"
import { PurchaseHistory } from "./purchase-history"

interface Purchase {
  id: string
  plan_name: string
  amount_paid: number
  purchase_date: string
  expires_at: string
}

interface AccountDashboardProps {
  user: {
    id: string
    email: string
  }
  purchases: Purchase[]
  accessExpiresAt: string | null
}

export function AccountDashboard({ user, purchases, accessExpiresAt }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-gray-400 mt-1">Manage your profile and subscription</p>
          </div>

          <form action={signOut}>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#2d2d2d] border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#f40088] data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="data-[state=active]:bg-[#f40088] data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#f40088] data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionStatus accessExpiresAt={accessExpiresAt} />
          </TabsContent>

          <TabsContent value="history">
            <PurchaseHistory purchases={purchases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
