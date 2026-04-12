"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { api } from "@/lib/api"
import type { Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.getProduct(parseInt(id))
        setProduct(data)
      } catch (error) {
        console.error("[v0] Failed to fetch product:", error)
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update {product.name}
        </p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  )
}
