"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart()
  const inCart = isInCart(product.id)
  const isInStock = product.inStock !== false

  return (
    <Card className="group overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.imageURL}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
          {!isInStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="px-0 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="truncate text-sm font-medium transition-colors hover:text-muted-foreground">
                {product.name}
              </h3>
            </Link>
            {product.category && (
              <p className="mt-1 text-sm text-muted-foreground">{product.category.name}</p>
            )}
            <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
          </div>
          <Button
            variant={inCart ? "secondary" : "outline"}
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={() => addItem(product)}
            disabled={!isInStock}
            aria-label={inCart ? "Added to cart" : "Add to cart"}
          >
            {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
