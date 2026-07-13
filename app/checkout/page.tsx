"use client"

import { useMemo, useState } from "react"
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
import { useI18n } from "@/components/i18n/language-provider"
import { formatPrice } from "@/lib/format"
import { api } from "@/lib/api"
import type { OrderRequest } from "@/lib/types"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { dictionary } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const checkoutSchema = useMemo(() => z.object({
    name: z.string().min(1, dictionary.checkout.validationName),
    surname: z.string().min(1, dictionary.checkout.validationSurname),
    email: z.string().email(dictionary.checkout.validationEmail),
    phone: z.string().min(10, dictionary.checkout.validationPhone).regex(/^[+]?[-()\d\s]+$/, dictionary.checkout.validationPhone),
  }), [dictionary])

  type CheckoutFormData = z.infer<typeof checkoutSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderRequest: OrderRequest = {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        email: data.email,
        productOrders: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price })),
      }
      await api.createOrder(orderRequest)
      setIsSuccess(true)
      clearCart()
      toast.success(dictionary.checkout.orderSuccessToast)
    } catch {
      toast.error(dictionary.checkout.orderErrorToast)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.checkout.title}</h1>
        <p className="mt-4 text-muted-foreground">{dictionary.checkout.empty}</p>
        <Button asChild className="mt-8"><Link href="/products">{dictionary.home.viewAllProducts}</Link></Button>
      </div></div>
    )
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{dictionary.checkout.orderConfirmed}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{dictionary.checkout.successText}</p>
        <Button asChild className="mt-8"><Link href="/products">{dictionary.home.viewAllProducts}</Link></Button>
      </div></div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="mr-1 h-4 w-4" />{dictionary.checkout.backToCart}</Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{dictionary.checkout.title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7"><div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">{dictionary.checkout.contactInfo}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{dictionary.checkout.contactText}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="name">{dictionary.common.name} <span className="text-destructive">*</span></Label><Input id="name" type="text" placeholder={dictionary.checkout.firstNamePlaceholder} {...register("name")} aria-invalid={errors.name ? "true" : "false"} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
              <div className="space-y-2"><Label htmlFor="surname">{dictionary.checkout.surname} <span className="text-destructive">*</span></Label><Input id="surname" type="text" placeholder={dictionary.checkout.lastNamePlaceholder} {...register("surname")} aria-invalid={errors.surname ? "true" : "false"} />{errors.surname && <p className="text-sm text-destructive">{errors.surname.message}</p>}</div>
            </div>
            <div className="space-y-2"><Label htmlFor="email">{dictionary.checkout.email} <span className="text-destructive">*</span></Label><Input id="email" type="email" placeholder={dictionary.checkout.emailPlaceholder} {...register("email")} aria-invalid={errors.email ? "true" : "false"} />{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="phone">{dictionary.checkout.phone} <span className="text-destructive">*</span></Label><Input id="phone" type="tel" placeholder={dictionary.checkout.phonePlaceholder} {...register("phone")} aria-invalid={errors.phone ? "true" : "false"} />{errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}</div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? dictionary.checkout.placingOrder : dictionary.checkout.placeOrder}</Button>
          </form>
        </div></div>
        <div className="lg:col-span-5"><div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">{dictionary.cart.orderSummary}</h2>
          <ul className="mt-6 divide-y divide-border">{items.map((item) => (<li key={item.product.id} className="flex gap-4 py-4"><div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted"><Image src={item.product.imageURL} alt={item.product.name} fill className="object-cover" /></div><div className="flex flex-1 flex-col"><h3 className="text-sm font-medium">{item.product.name}</h3><p className="mt-1 text-sm text-muted-foreground">{dictionary.checkout.qty}: {item.quantity}</p></div><p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p></li>))}</ul>
          <div className="mt-6 space-y-4 border-t border-border pt-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">{dictionary.common.subtotal}</span><span className="font-medium">{formatPrice(totalPrice)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">{dictionary.common.shipping}</span><span className="font-medium">{dictionary.cart.calculatedAfterOrder}</span></div><div className="border-t border-border pt-4"><div className="flex justify-between"><span className="font-semibold">{dictionary.common.total}</span><span className="font-semibold">{formatPrice(totalPrice)}</span></div></div></div>
        </div></div>
      </div>
    </div>
  )
}
