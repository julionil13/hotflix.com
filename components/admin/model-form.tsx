"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ModelFormProps {
  model?: {
    id: string
    name: string
    bio: string
    profile_image_url: string
  } | null
  onClose: () => void
  onSuccess: () => void
}

export function ModelForm({ model, onClose, onSuccess }: ModelFormProps) {
  const [formData, setFormData] = useState({
    name: model?.name || "",
    bio: model?.bio || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would implement the actual save logic
    console.log("Saving model:", formData)
    onSuccess()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{model ? "Edit Model" : "Add New Model"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-[#1c1c1c] border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="bg-[#1c1c1c] border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Profile Picture</Label>
            <Input type="file" accept="image/*" className="bg-[#1c1c1c] border-gray-600 text-white" />
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
              {model ? "Update Model" : "Add Model"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
