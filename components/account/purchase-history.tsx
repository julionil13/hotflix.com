"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, Calendar, DollarSign } from "lucide-react"

interface Purchase {
  id: string
  plan_name: string
  amount_paid: number
  purchase_date: string
  expires_at: string
}

interface PurchaseHistoryProps {
  purchases: Purchase[]
}

export function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  if (purchases.length === 0) {
    return (
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardContent className="py-12 text-center">
          <Receipt className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No purchases yet</h3>
          <p className="text-gray-400 text-sm">Your purchase history will appear here once you buy an access pass.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Purchase History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-lg border border-gray-700"
              >
                <div className="space-y-1">
                  <h4 className="text-white font-medium capitalize">{purchase.plan_name.replace("_", " ")} Pass</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      R$ {purchase.amount_paid.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">Expires</div>
                  <div className="text-white font-medium">{new Date(purchase.expires_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
