"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/api"
import type { Product, Category } from "@/lib/types"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/language-provider"

export default function AdminProductsPage() {
  const { dictionary } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [productsResponse, categoriesData] = await Promise.all([
        api.getProducts({ size: 100 }),
        api.getCategories(),
      ])
      setProducts(productsResponse.content || [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  function getCategoryName(categoryId: number): string {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "-"
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    try {
      await api.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast.success(dictionary.admin.productDeleted)
    } catch (error) {
      toast.error(dictionary.admin.productDeleteFailed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.admin.products}</h1>
          <p className="text-muted-foreground">
            {dictionary.admin.manageProducts}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.admin.addProduct}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.admin.allProducts}</CardTitle>
          <CardDescription>
            {products.length} {dictionary.admin.products.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">{dictionary.admin.loadingProducts}</p>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{dictionary.admin.noProductsFound}</p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {dictionary.admin.addFirstProduct}
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{dictionary.common.image}</TableHead>
                  <TableHead>{dictionary.common.name}</TableHead>
                  <TableHead>{dictionary.common.price}</TableHead>
                  <TableHead>{dictionary.common.category}</TableHead>
                  <TableHead>{dictionary.admin.attributes}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                        {product.imageURL && (
                          <Image
                            src={product.imageURL}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category?.name || getCategoryName(product.categoryId)}</TableCell>
                    <TableCell>{product.attributes?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">{dictionary.common.edit}</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">{dictionary.common.delete}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{dictionary.admin.deleteProduct}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {dictionary.admin.deleteProductConfirm.replace("{name}", product.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{dictionary.common.cancel}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                disabled={deleting === product.id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleting === product.id ? dictionary.admin.deleting : dictionary.common.delete}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
