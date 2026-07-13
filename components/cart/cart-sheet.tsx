"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useCart } from "@/components/cart/cart-provider"
import { useI18n } from "@/components/i18n/language-provider"
import { formatPrice } from "@/lib/format"
import { interpolate } from "@/lib/i18n"

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const { dictionary } = useI18n()

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>{interpolate(dictionary.cart.shoppingCart, { count: totalItems })}</SheetTitle>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">{dictionary.cart.emptyShort}</p>
          <SheetClose asChild>
            <Button asChild>
              <Link href="/products">{dictionary.home.viewAllProducts}</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.product.id} className="py-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.product.imageURL} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium">
                            <SheetClose asChild>
                              <Link href={`/products/${item.product.id}`}>{item.product.name}</Link>
                            </SheetClose>
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.product.id)} aria-label={interpolate(dictionary.cart.removeFromCart, { name: item.product.name })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label={dictionary.products.decreaseQuantity}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label={dictionary.products.increaseQuantity}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-base font-medium">
              <p>{dictionary.common.subtotal}</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{dictionary.cart.shippingTaxes}</p>
            <div className="mt-4 space-y-2">
              <SheetClose asChild>
                <Button asChild className="w-full"><Link href="/checkout">{dictionary.cart.checkout}</Link></Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" asChild className="w-full"><Link href="/cart">{dictionary.cart.viewCart}</Link></Button>
              </SheetClose>
            </div>
          </div>
        </>
      )}
    </SheetContent>
  )
}
