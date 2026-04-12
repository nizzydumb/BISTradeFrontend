import type { 
  Category, 
  Product, 
  OrderRequest, 
  OrderResponse, 
  PaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || ""
}

class ApiClient {
  private getBaseUrl(): string {
    return getApiBaseUrl()
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const baseUrl = this.getBaseUrl()
    if (!baseUrl) {
      throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
    }
    
    const url = `${baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { message: errorText || `HTTP ${response.status}` }
      }
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    // Handle empty responses (204 No Content or empty body)
    const contentLength = response.headers.get("content-length")
    if (response.status === 204 || contentLength === "0") {
      return undefined as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as T
    }

    return JSON.parse(text)
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.fetch<Category[]>("/category/all")
  }

  async getCategory(id: number): Promise<Category> {
    return this.fetch<Category>(`/category/${id}`)
  }

  // Products - paginated endpoint
  async getProducts(params?: { 
    categoryId?: number | null
    page?: number
    size?: number 
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams()
    if (params?.categoryId != null) {
      searchParams.set("categoryId", params.categoryId.toString())
    }
    searchParams.set("page", (params?.page ?? 0).toString())
    searchParams.set("size", (params?.size ?? 20).toString())
    
    return this.fetch<PaginatedResponse<Product>>(`/product/all?${searchParams.toString()}`)
  }

  async getProduct(id: number): Promise<Product> {
    return this.fetch<Product>(`/product/${id}`)
  }

  // Orders - paginated endpoint
  async getOrders(params?: {
    page?: number
    size?: number
  }): Promise<PaginatedResponse<OrderResponse>> {
    const searchParams = new URLSearchParams()
    searchParams.set("page", (params?.page ?? 0).toString())
    searchParams.set("size", (params?.size ?? 50).toString())
    
    return this.fetch<PaginatedResponse<OrderResponse>>(`/order/all?${searchParams.toString()}`)
  }

  async createOrder(order: OrderRequest): Promise<OrderResponse> {
    return this.fetch<OrderResponse>("/order", {
      method: "POST",
      body: JSON.stringify(order),
    })
  }

  async processOrder(id: number): Promise<OrderResponse> {
    return this.fetch<OrderResponse>(`/order/${id}/process`, {
      method: "PATCH",
    })
  }

  async deleteOrder(id: number): Promise<void> {
    await this.fetch<void>(`/order/${id}`, {
      method: "DELETE",
    })
  }

  // Admin - Products
  async createProduct(product: CreateProductRequest): Promise<Product> {
    return this.fetch<Product>("/product", {
      method: "POST",
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
    return this.fetch<Product>(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: number): Promise<void> {
    await this.fetch<void>(`/product/${id}`, {
      method: "DELETE",
    })
  }

  // Admin - Categories
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    return this.fetch<Category>("/category", {
      method: "POST",
      body: JSON.stringify(category),
    })
  }

  async updateCategory(id: number, category: UpdateCategoryRequest): Promise<Category> {
    return this.fetch<Category>(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: number): Promise<void> {
    await this.fetch<void>(`/category/${id}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiClient()
