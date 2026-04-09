"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/lib/types"
import { toast } from "sonner"

interface CategoryFormProps {
  category?: Category
  mode: "create" | "edit"
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [imageURL, setImageURL] = useState(category?.imageURL || "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name) {
      toast.error("Please enter a category name")
      return
    }

    const data: CreateCategoryRequest | UpdateCategoryRequest = {
      name,
      description: description || undefined,
      imageURL: imageURL || undefined,
    }

    setLoading(true)
    try {
      if (mode === "create") {
        await api.createCategory(data as CreateCategoryRequest)
        toast.success("Category created successfully")
      } else if (category) {
        await api.updateCategory(category.id, data)
        toast.success("Category updated successfully")
      }
      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Category submit error:", error)
      toast.error(mode === "create" ? "Failed to create category" : "Failed to update category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>Name and details for this category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description (optional)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageURL">Image URL</Label>
            <Input
              id="imageURL"
              type="url"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Category"
              : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
