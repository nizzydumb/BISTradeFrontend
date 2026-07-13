import { ProductForm } from "@/components/admin/product-form"
import { getServerDictionary } from "@/lib/i18n-server"

export default async function NewProductPage() {
  const dictionary = await getServerDictionary()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.admin.addProduct}</h1>
        <p className="text-muted-foreground">{dictionary.admin.manageProducts}</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
