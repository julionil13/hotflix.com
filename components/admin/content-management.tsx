"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ContentForm } from "./content-form"

interface ContentItem {
  id: string
  title: string
  description: string
  view_count: number
  created_at: string
  models: { id: string; name: string } | null
  categories: { id: string; name: string } | null
}

interface ContentManagementProps {
  content: ContentItem[]
  models: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
}

export function ContentManagement({ content, models, categories }: ContentManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)

  const handleEdit = (item: ContentItem) => {
    setEditingContent(item)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingContent(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingContent(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400 mt-1">Manage videos and photoshoots</p>
        </div>

        <Button onClick={handleAdd} className="bg-[#f40088] hover:bg-[#d1006f] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Content Table */}
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Content ({content.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Model</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Views</TableHead>
                <TableHead className="text-gray-300">Upload Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.models ? (
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {item.models.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">No model</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.categories ? (
                      <Badge className="bg-[#f40088] text-white">{item.categories.name}</Badge>
                    ) : (
                      <span className="text-gray-500">No category</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">{item.view_count.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
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

      {/* Content Form Modal */}
      {isFormOpen && (
        <ContentForm
          content={editingContent}
          models={models}
          categories={categories}
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
