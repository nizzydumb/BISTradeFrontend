import { Suspense } from "react"
import { api } from "@/lib/api"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductsFilter } from "@/components/products/products-filter"
import { ProductGridSkeleton } from "@/components/products/product-skeleton"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Products - Catalog",
  description: "Browse our complete collection of quality products.",
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

async function ProductsContent({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const categoryId = searchParams.category ? parseInt(searchParams.category) : null
  
  const [productsResponse, categories] = await Promise.all([
    api.getProducts({ categoryId, size: 50 }),
    api.getCategories(),
  ])

  return (
    <>
      <ProductsFilter categories={categories} selectedCategoryId={searchParams.category} />
      <ProductGrid products={productsResponse.content || []} />
    </>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our complete collection of quality products.
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  )
}
