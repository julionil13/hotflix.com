import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Video, UserCheck, DollarSign, TrendingUp, Eye } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    totalContent: number
    totalModels: number
    todayRevenue: number
    monthRevenue: number
    todaySales: number
    monthSales: number
    topContent: Array<{ title: string; view_count: number }>
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#f40088]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Content</CardTitle>
            <Video className="h-4 w-4 text-[#f40088]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalContent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Models</CardTitle>
            <UserCheck className="h-4 w-4 text-[#f40088]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalModels.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#f40088]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {stats.monthRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#f40088]" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Today's Sales</span>
              <div className="text-right">
                <div className="text-white font-semibold">{stats.todaySales}</div>
                <div className="text-sm text-gray-400">R$ {stats.todayRevenue.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">This Month</span>
              <div className="text-right">
                <div className="text-white font-semibold">{stats.monthSales}</div>
                <div className="text-sm text-gray-400">R$ {stats.monthRevenue.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#f40088]" />
              Top Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm truncate flex-1 mr-2">{content.title}</span>
                  <span className="text-white font-medium text-sm">{content.view_count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
