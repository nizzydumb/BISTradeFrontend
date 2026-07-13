import { api } from "@/lib/api"
import { CategoryCard } from "@/components/categories/category-card"
import { getServerDictionary } from "@/lib/i18n-server"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Categories - Catalog",
  description: "Browse products by category.",
}

export default async function CategoriesPage() {
  const [categories, dictionary] = await Promise.all([
    api.getCategories(),
    getServerDictionary(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.categoriesPage.title}</h1>
        <p className="mt-2 text-muted-foreground">{dictionary.categoriesPage.description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
