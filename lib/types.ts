// Attribute (dynamic key-value for product specifications)
export interface Attribute {
  name: string // e.g., "Weight", "Color", "Material"
  value: string // e.g., "1.5kg", "Black", "Aluminum"
}

// Category
export interface Category {
  id: number
  name: string
  description?: string
  imageURL?: string
}

// Product
export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageURL: string
  categoryId: number
  category?: Category
  attributes: Attribute[] // Dynamic specs from admin
  inStock?: boolean
}

// Cart Item
export interface CartItem {
  product: Product
  quantity: number
}

// Product Order Item (for order requests)
export interface ProductOrder {
  productId: number
  quantity: number
  price: number
}

// Order Request - matches backend expected format
export interface OrderRequest {
  name: string
  surname: string
  phone: string
  email: string
  productOrders: ProductOrder[]
}

// Order Response
export interface OrderResponse {
  id: number
  name: string
  surname: string
  phone: string
  email: string
  productOrders: ProductOrder[]
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  createdAt?: string
}

// API Response types - matches backend Spring paginated response
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number // current page number (0-indexed)
  first: boolean
  last: boolean
  empty: boolean
}

export interface ApiError {
  message: string
  code?: string
}

// Admin - Create/Update requests
export interface CreateProductRequest {
  name: string
  description: string
  price: number
  imageURL: string
  categoryId: number
  attributes: Attribute[]
  inStock?: boolean
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  imageURL?: string
  categoryId?: number
  attributes?: Attribute[]
  inStock?: boolean
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  imageURL?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  imageURL?: string
}
