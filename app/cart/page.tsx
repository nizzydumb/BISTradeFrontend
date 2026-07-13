"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { useI18n } from "@/components/i18n/language-provider"
import { formatPrice } from "@/lib/format"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const { dictionary } = useI18n()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.cart.title}</h1>
          <p className="mt-4 text-muted-foreground">{dictionary.cart.empty}</p>
          <Button asChild className="mt-8">
            <Link href="/products">
              {dictionary.home.viewAllProducts}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.cart.title}</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>{dictionary.cart.clearCart}</Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.product.id} className="py-6">
                <div className="flex gap-4 sm:gap-6">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32">
                    <Image src={item.product.imageURL} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          <Link href={`/products/${item.product.id}`} className="transition-colors hover:text-muted-foreground">{item.product.name}</Link>
                        </h3>
                        {item.product.category && <p className="mt-1 text-sm text-muted-foreground">{item.product.category.name}</p>}
                      </div>
                      <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label={dictionary.products.decreaseQuantity}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label={dictionary.products.increaseQuantity}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => removeItem(item.product.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        {dictionary.common.remove}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">{dictionary.cart.orderSummary}</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{dictionary.common.subtotal}</span><span className="font-medium">{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{dictionary.common.shipping}</span><span className="font-medium">{dictionary.cart.calculatedAtCheckout}</span></div>
              <div className="border-t border-border pt-4"><div className="flex justify-between"><span className="font-semibold">{dictionary.common.total}</span><span className="font-semibold">{formatPrice(totalPrice)}</span></div></div>
            </div>
            <Button asChild className="mt-6 w-full" size="lg"><Link href="/checkout">{dictionary.cart.proceedToCheckout}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button variant="link" asChild className="mt-2 w-full"><Link href="/products">{dictionary.home.viewAllProducts}</Link></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
