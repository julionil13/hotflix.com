import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountDashboard } from "@/components/account/account-dashboard"

export default async function MyAccountPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Get user's purchase history
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  // Get user's current access status
  const { data: userData } = await supabase.from("users").select("access_expires_at").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20">
      <AccountDashboard user={user} purchases={purchases || []} accessExpiresAt={userData?.access_expires_at} />
    </div>
  )
}
