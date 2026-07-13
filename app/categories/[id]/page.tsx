import { notFound } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { api } from "@/lib/api"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductGridSkeleton } from "@/components/products/product-skeleton"

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { id } = await params
  try {
    const category = await api.getCategory(Number(id))
    return {
      title: `${category.name} - Catalog`,
      description: category.description || `Browse ${category.name} products.`,
    }
  } catch {
    return { title: "Category Not Found - Catalog" }
  }
}

async function CategoryProducts({ id }: { id: number }) {
  let category
  try {
    category = await api.getCategory(id)
  } catch {
    notFound()
  }

  if (!category) {
    notFound()
  }

  const productsResponse = await api.getProducts({ categoryId: id, size: 50 })
  const categoryProducts = productsResponse.content || []

  return (
    <>
      <div className="mb-8">
        <Link
          href="/categories"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          All Categories
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <ProductGrid products={categoryProducts} />
    </>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<ProductGridSkeleton />}>
        <CategoryProducts id={Number(id)} />
      </Suspense>
    </div>
  )
}
