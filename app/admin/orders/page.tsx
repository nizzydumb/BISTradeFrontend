"use client"

import { useEffect, useState } from "react"
import { Package, Mail, Phone, User, Calendar, CheckCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/format"
import type { OrderResponse } from "@/lib/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await api.getOrders({ size: 100 })
      setOrders(response.content || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Failed to load orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  async function handleProcessOrder(id: number) {
    try {
      await api.processOrder(id)
      toast.success("Order marked as processed")
      fetchOrders()
    } catch (error) {
      console.error("Failed to process order:", error)
      toast.error("Failed to process order")
    }
  }

  async function handleDeleteOrder(id: number) {
    try {
      await api.deleteOrder(id)
      toast.success("Order deleted")
      fetchOrders()
    } catch (error) {
      console.error("Failed to delete order:", error)
      toast.error("Failed to delete order")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-lg border">
          <div className="p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Badge variant="secondary" className="text-sm">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders will appear here when customers place them.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {order.name} {order.surname}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.productOrders?.length || 0} {(order.productOrders?.length || 0) === 1 ? "item" : "items"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.productOrders?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === "COMPLETED" ? "default" :
                        order.status === "CANCELLED" ? "destructive" :
                        order.status === "PROCESSING" ? "secondary" :
                        "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.createdAt ? formatDate(order.createdAt) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order #{order.id}</DialogTitle>
                          <DialogDescription>
                            Order details and customer information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Customer Info */}
                          <div className="space-y-3">
                            <h4 className="font-semibold">Customer Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{order.name} {order.surname}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{order.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{order.phone}</span>
                              </div>
                              {order.createdAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <Badge 
                                  variant={
                                    order.status === "COMPLETED" ? "default" :
                                    order.status === "CANCELLED" ? "destructive" :
                                    order.status === "PROCESSING" ? "secondary" :
                                    "outline"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="font-semibold">Order Items</h4>
                            <div className="space-y-2">
                              {order.productOrders?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                >
                                  <div>
                                    <span className="text-muted-foreground">
                                      Product #{item.productId}
                                    </span>
                                    <span className="mx-2">×</span>
                                    <span>{item.quantity}</span>
                                  </div>
                                  <span className="font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between border-t pt-4">
                            <span className="font-semibold">Total</span>
                            <span className="text-lg font-bold">
                              {formatPrice(order.productOrders?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0)}
                            </span>
                          </div>
                        </div>
                      </DialogContent>
                      </Dialog>
                      
                      {order.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcessOrder(order.id)}
                          title="Mark as processed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" title="Delete order">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order #{order.id}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
