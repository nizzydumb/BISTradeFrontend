import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { ProductGrid } from "@/components/products/product-grid"
import { CategoryCard } from "@/components/categories/category-card"
import { getServerDictionary } from "@/lib/i18n-server"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const dictionary = await getServerDictionary()

  const [categories, productsResponse] = await Promise.all([
    api.getCategories(),
    api.getProducts({ size: 8 }),
  ])

  const featuredProducts = productsResponse.content || []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              {dictionary.home.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              {dictionary.home.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/products">
                  {dictionary.home.shopNow}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">{dictionary.home.browseCategories}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {dictionary.home.shopByCategory}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {dictionary.home.categorySubtitle}
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center text-sm font-medium transition-colors hover:text-muted-foreground sm:flex"
          >
            {dictionary.common.viewAll}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/categories">{dictionary.home.viewAllCategories}</Link>
          </Button>
        </div>
      </section>

      {/* {dictionary.home.featuredProducts} Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {dictionary.home.featuredProducts}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {dictionary.home.featuredSubtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center text-sm font-medium transition-colors hover:text-muted-foreground sm:flex"
          >
            {dictionary.common.viewAll}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/products">{dictionary.home.viewAllProducts}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{dictionary.home.fastShipping}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {dictionary.home.fastShippingText}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{dictionary.home.secureCheckout}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {dictionary.home.secureCheckoutText}
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{dictionary.home.support}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {dictionary.home.supportText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center sm:px-16">
          <h2 className="text-2xl font-bold tracking-tight text-background sm:text-3xl">
            {dictionary.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-background/80">
            {dictionary.home.ctaText}
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link href="/products">
                {dictionary.home.browseAllProducts}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
