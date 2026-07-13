import { CategoryForm } from "@/components/admin/category-form"
import { getServerDictionary } from "@/lib/i18n-server"

export default async function NewCategoryPage() {
  const dictionary = await getServerDictionary()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.admin.addCategory}</h1>
        <p className="text-muted-foreground">{dictionary.admin.manageCategories}</p>
      </div>
      <CategoryForm mode="create" />
    </div>
  )
}
