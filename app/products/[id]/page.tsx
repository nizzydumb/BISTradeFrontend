import { notFound } from "next/navigation"
import { Suspense } from "react"
import { api } from "@/lib/api"
import { ProductImages } from "@/components/products/product-images"
import { ProductSpecifications } from "@/components/products/product-specifications"
import { ProductDetailSkeleton } from "@/components/products/product-skeleton"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductGrid } from "@/components/products/product-grid"
import { formatPrice } from "@/lib/format"
import Link from "next/link"

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  try {
    const product = await api.getProduct(Number(id))
    return {
      title: `${product.name} - Catalog`,
      description: product.description,
    }
  } catch {
    return { title: "Product Not Found - Catalog" }
  }
}

async function ProductDetail({ id }: { id: number }) {
  let product
  try {
    product = await api.getProduct(id)
  } catch {
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const productsResponse = await api.getProducts({ categoryId: product.categoryId, size: 5 })
  const related = (productsResponse.content || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
  const isInStock = product.inStock !== false

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <ProductImages imageURL={product.imageURL} productName={product.name} />

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            {product.category && (
              <Link
                href={`/categories/${product.category.id}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            {isInStock ? (
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                In Stock
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                Out of Stock
              </span>
            )}
          </div>

          <AddToCartButton product={product} />

          {/* Specifications */}
          <ProductSpecifications attributes={product.attributes} />
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail id={Number(id)} />
      </Suspense>
    </div>
  )
}
