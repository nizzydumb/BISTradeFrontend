import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Category</h1>
        <p className="text-muted-foreground">
          Create a new product category
        </p>
      </div>
      <CategoryForm mode="create" />
    </div>
  )
}
