"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { api } from "@/lib/api"
import type { OrderRequest } from "@/lib/types"

const checkoutSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  surname: z.string().min(1, "Please enter your surname"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number"),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    try {
      const orderRequest: OrderRequest = {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        email: data.email,
        productOrders: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }
      
      await api.createOrder(orderRequest)

      setIsSuccess(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-4 text-muted-foreground">
            Your cart is empty. Add some items before checking out.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Thank you for your order. We&apos;ll contact you shortly with confirmation details.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll use this information to contact you about your order.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="First name"
                    {...register("name")}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname">
                    Surname <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Last name"
                    {...register("surname")}
                    aria-invalid={errors.surname ? "true" : "false"}
                  />
                  {errors.surname && (
                    <p className="text-sm text-destructive">{errors.surname.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="mt-6 divide-y divide-border">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.imageURL}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated after order</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
