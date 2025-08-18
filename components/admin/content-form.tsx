"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContentFormProps {
  content?: {
    id: string
    title: string
    description: string
    models: { id: string; name: string } | null
    categories: { id: string; name: string } | null
  } | null
  models: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess: () => void
}

export function ContentForm({ content, models, categories, onClose, onSuccess }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: content?.title || "",
    description: content?.description || "",
    model_id: content?.models?.id || "",
    category_id: content?.categories?.id || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would implement the actual save logic
    console.log("Saving content:", formData)
    onSuccess()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{content ? "Edit Content" : "Add New Content"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-[#1c1c1c] border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-300">
                Model
              </Label>
              <Select
                value={formData.model_id}
                onValueChange={(value) => setFormData({ ...formData, model_id: value })}
              >
                <SelectTrigger className="bg-[#1c1c1c] border-gray-600 text-white">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d2d2d] border-gray-600">
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-700">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger className="bg-[#1c1c1c] border-gray-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d2d2d] border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white hover:bg-gray-700">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="bg-[#1c1c1c] border-gray-600 text-white"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Video File</Label>
              <Input type="file" accept="video/*" className="bg-[#1c1c1c] border-gray-600 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Cover Image</Label>
              <Input type="file" accept="image/*" className="bg-[#1c1c1c] border-gray-600 text-white" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#f40088] hover:bg-[#d1006f] text-white">
              {content ? "Update Content" : "Add Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
