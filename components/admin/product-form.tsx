"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { useI18n } from "@/components/i18n/language-provider"
import type { Product, Category, Attribute, CreateProductRequest, UpdateProductRequest } from "@/lib/types"
import { toast } from "sonner"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const { dictionary } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [imageURL, setImageURL] = useState(product?.imageURL || "")
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "")
  const [inStock, setInStock] = useState(product?.inStock !== false)
  const [attributes, setAttributes] = useState<Attribute[]>(product?.attributes || [{ name: "", value: "" }])

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
      toast.error(dictionary.admin.fillRequired)
      return
    }

    const filteredAttributes = attributes.filter((attr) => attr.name.trim() && attr.value.trim())
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
        toast.success(dictionary.admin.productCreated)
      } else if (product) {
        await api.updateProduct(product.id, data)
        toast.success(dictionary.admin.productUpdated)
      }
      router.push("/admin/products")
      router.refresh()
    } catch {
      toast.error(mode === "create" ? dictionary.admin.productCreateFailed : dictionary.admin.productUpdateFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.admin.basicInfo}</CardTitle>
          <CardDescription>{dictionary.admin.basicInfoText}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{dictionary.common.name} *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={dictionary.admin.productName} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{dictionary.common.description} *</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={dictionary.admin.productDescription} rows={4} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">{dictionary.common.price} *</Label>
              <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{dictionary.common.category} *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder={dictionary.admin.selectCategory} /></SelectTrigger>
                <SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageURL">{dictionary.admin.imageUrl}</Label>
            <Input id="imageURL" type="url" value={imageURL} onChange={(e) => setImageURL(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} />
            <Label htmlFor="inStock">{dictionary.admin.inStock}</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.admin.specifications}</CardTitle>
          <CardDescription>{dictionary.admin.specificationsText}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`attr-name-${index}`}>{dictionary.admin.attributeName}</Label>
                <Input id={`attr-name-${index}`} value={attr.name} onChange={(e) => updateAttribute(index, "name", e.target.value)} placeholder={dictionary.admin.attributeNamePlaceholder} />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`attr-value-${index}`}>{dictionary.admin.value}</Label>
                <Input id={`attr-value-${index}`} value={attr.value} onChange={(e) => updateAttribute(index, "value", e.target.value)} placeholder={dictionary.admin.valuePlaceholder} />
              </div>
              <Button type="button" variant="ghost" size="icon" className="mt-8 text-destructive hover:text-destructive" onClick={() => removeAttribute(index)} disabled={attributes.length === 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAttribute}><Plus className="mr-2 h-4 w-4" />{dictionary.admin.addAttribute}</Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>{loading ? (mode === "create" ? dictionary.admin.creating : dictionary.admin.saving) : (mode === "create" ? dictionary.admin.createProduct : dictionary.admin.saveChanges)}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>{dictionary.common.cancel}</Button>
      </div>
    </form>
  )
}
