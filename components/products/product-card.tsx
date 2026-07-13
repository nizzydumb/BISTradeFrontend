"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart/cart-provider"
import { useI18n } from "@/components/i18n/language-provider"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity, isInCart } = useCart()
  const { dictionary } = useI18n()
  const inCart = isInCart(product.id)
  const quantity = getItemQuantity(product.id)
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
              <span className="text-sm font-medium text-muted-foreground">{dictionary.products.outOfStock}</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <Link href={`/products/${product.id}`}>
              <h3 className="truncate text-sm font-medium transition-colors hover:text-muted-foreground">
                {product.name}
              </h3>
            </Link>
            {product.category && <p className="mt-1 text-sm text-muted-foreground">{product.category.name}</p>}
            <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
          </div>
          {inCart ? (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-lg rounded-r-none" onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={dictionary.products.decreaseQuantity}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none rounded-r-lg" onClick={() => addItem(product)} aria-label={dictionary.products.increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => addItem(product)} disabled={!isInStock} aria-label={dictionary.products.addToCart}>
              <Plus className="h-4 w-4" />
              {dictionary.products.addToCart}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
