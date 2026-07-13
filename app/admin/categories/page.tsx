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
import type { Category } from "@/lib/types"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/language-provider"

export default function AdminCategoriesPage() {
  const { dictionary } = useI18n()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const data = await api.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    try {
      await api.deleteCategory(id)
      setCategories(categories.filter((c) => c.id !== id))
      toast.success(dictionary.admin.categoryDeleted)
    } catch (error) {
      toast.error(dictionary.admin.categoryDeleteFailed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.admin.categories}</h1>
          <p className="text-muted-foreground">
            {dictionary.admin.manageCategories}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.admin.addCategory}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.admin.allCategories}</CardTitle>
          <CardDescription>
            {categories.length} {dictionary.admin.categories.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">{dictionary.admin.loadingCategories}</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{dictionary.admin.noCategoriesFound}</p>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {dictionary.admin.addFirstCategory}
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{dictionary.common.image}</TableHead>
                  <TableHead>{dictionary.common.name}</TableHead>
                  <TableHead>{dictionary.common.description}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                        {category.imageURL && (
                          <Image
                            src={category.imageURL}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/categories/${category.id}/edit`}>
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
                              <AlertDialogTitle>{dictionary.admin.deleteCategory}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {dictionary.admin.deleteCategoryConfirm.replace("{name}", category.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{dictionary.common.cancel}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id)}
                                disabled={deleting === category.id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleting === category.id ? dictionary.admin.deleting : dictionary.common.delete}
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
