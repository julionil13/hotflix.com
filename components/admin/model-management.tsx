"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModelForm } from "./model-form"

interface Model {
  id: string
  name: string
  bio: string
  profile_image_url: string
  created_at: string
  contents: Array<{ count: number }>
}

interface ModelManagementProps {
  models: Model[]
}

export function ModelManagement({ models }: ModelManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<Model | null>(null)

  const handleEdit = (model: Model) => {
    setEditingModel(model)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingModel(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingModel(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Model Management</h1>
          <p className="text-gray-400 mt-1">Manage content creators and models</p>
        </div>

        <Button onClick={handleAdd} className="bg-[#f40088] hover:bg-[#d1006f] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Models Table */}
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Models ({models.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Model</TableHead>
                <TableHead className="text-gray-300">Bio</TableHead>
                <TableHead className="text-gray-300">Content Count</TableHead>
                <TableHead className="text-gray-300">Join Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={model.profile_image_url || "/placeholder.svg"} alt={model.name} />
                        <AvatarFallback className="bg-[#f40088] text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">{model.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">{model.bio || "No bio"}</TableCell>
                  <TableCell className="text-gray-300">{model.contents?.[0]?.count || 0} videos</TableCell>
                  <TableCell className="text-gray-300">{new Date(model.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(model)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Model Form Modal */}
      {isFormOpen && (
        <ModelForm
          model={editingModel}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm()
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
