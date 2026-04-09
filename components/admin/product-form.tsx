"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import type { Product, Category, Attribute, CreateProductRequest, UpdateProductRequest } from "@/lib/types"
import { toast } from "sonner"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [imageURL, setImageURL] = useState(product?.imageURL || "")
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "")
  const [inStock, setInStock] = useState(product?.inStock !== false)
  const [attributes, setAttributes] = useState<Attribute[]>(
    product?.attributes || [{ name: "", value: "" }]
  )

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories()
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("[v0] Failed to fetch categories:", error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  function addAttribute() {
    setAttributes([...attributes, { name: "", value: "" }])
  }

  function removeAttribute(index: number) {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  function updateAttribute(index: number, field: "name" | "value", value: string) {
    const updated = [...attributes]
    updated[index] = { ...updated[index], [field]: value }
    setAttributes(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name || !description || !price || !categoryId) {
      toast.error("Please fill in all required fields")
      return
    }

    const filteredAttributes = attributes.filter(
      (attr) => attr.name.trim() && attr.value.trim()
    )

    const data: CreateProductRequest | UpdateProductRequest = {
      name,
      description,
      price: parseFloat(price),
      imageURL,
      categoryId: parseInt(categoryId),
      attributes: filteredAttributes,
      inStock,
    }

    setLoading(true)
    try {
      if (mode === "create") {
        await api.createProduct(data as CreateProductRequest)
        toast.success("Product created successfully")
      } else if (product) {
        await api.updateProduct(product.id, data)
        toast.success("Product updated successfully")
      }
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast.error(mode === "create" ? "Failed to create product" : "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Product name, description, and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={4}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={inStock}
              onCheckedChange={setInStock}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attributes (Specifications)</CardTitle>
          <CardDescription>
            Add custom specifications like size, weight, color, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`attr-name-${index}`}>Attribute Name</Label>
                <Input
                  id={`attr-name-${index}`}
                  value={attr.name}
                  onChange={(e) => updateAttribute(index, "name", e.target.value)}
                  placeholder="e.g., Weight, Color, Material"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`attr-value-${index}`}>Value</Label>
                <Input
                  id={`attr-value-${index}`}
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, "value", e.target.value)}
                  placeholder="e.g., 1.5kg, Black, Aluminum"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8 text-destructive hover:text-destructive"
                onClick={() => removeAttribute(index)}
                disabled={attributes.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAttribute}>
            <Plus className="mr-2 h-4 w-4" />
            Add Attribute
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
