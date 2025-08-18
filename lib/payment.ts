"use server"

import { createClient } from "@/lib/supabase/server"

export async function processPayment(userId: string, planId: string, amount: number, durationDays: number) {
  const supabase = createClient()

  try {
    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        plan_name: planId,
        amount_paid: amount,
        payment_id_gateway: `PIX_${Date.now()}`,
        purchase_date: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (purchaseError) {
      throw purchaseError
    }

    // Update user access
    const { error: userError } = await supabase
      .from("users")
      .update({ access_expires_at: expiresAt.toISOString() })
      .eq("id", userId)

    if (userError) {
      throw userError
    }

    return { success: true, purchase }
  } catch (error) {
    console.error("Payment processing error:", error)
    return { success: false, error: error.message }
  }
}

export async function checkPaymentStatus(paymentId: string) {
  // In a real implementation, this would check with the payment gateway
  // For demo purposes, we'll simulate a successful payment after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: "completed", paymentId })
    }, 2000)
  })
}
