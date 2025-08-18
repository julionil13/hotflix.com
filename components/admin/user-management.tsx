"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Ban, Calendar } from "lucide-react"

interface User {
  id: string
  email: string
  access_expires_at: string | null
  created_at: string
}

interface UserManagementProps {
  users: User[]
}

export function UserManagement({ users }: UserManagementProps) {
  const getAccessStatus = (expiresAt: string | null) => {
    if (!expiresAt) return { status: "No Access", variant: "secondary" as const }

    const now = new Date()
    const expiry = new Date(expiresAt)

    if (expiry > now) {
      return { status: "Active", variant: "default" as const }
    } else {
      return { status: "Expired", variant: "destructive" as const }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">Manage user accounts and access</p>
      </div>

      {/* Users Table */}
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Registration Date</TableHead>
                <TableHead className="text-gray-300">Access Status</TableHead>
                <TableHead className="text-gray-300">Expiration Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const accessStatus = getAccessStatus(user.access_expires_at)

                return (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{user.email}</TableCell>
                    <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={accessStatus.variant}
                        className={accessStatus.variant === "default" ? "bg-green-600" : ""}
                      >
                        {accessStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {user.access_expires_at ? new Date(user.access_expires_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
