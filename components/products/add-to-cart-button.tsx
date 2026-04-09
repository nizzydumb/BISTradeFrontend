"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingBag, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, isInCart } = useCart()
  const inCart = isInCart(product.id)
  const isInStock = product.inStock !== false

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`Added ${product.name} to cart`, {
      description: `Quantity: ${quantity}`,
    })
    setQuantity(1)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex items-center rounded-lg border border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-none rounded-l-lg"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={!isInStock}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="flex h-12 w-16 items-center justify-center text-center font-medium">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-none rounded-r-lg"
          onClick={() => setQuantity(quantity + 1)}
          disabled={!isInStock}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        size="lg"
        className="h-12 flex-1 gap-2"
        onClick={handleAddToCart}
        disabled={!isInStock}
      >
        {inCart ? (
          <>
            <Check className="h-5 w-5" />
            Add More to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
