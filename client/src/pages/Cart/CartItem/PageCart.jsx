"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { CartProvider, useCart } from "./context/CartContext"
import CartItem from "./components/CartItem"
import CheckoutSummary from "./components/CheckoutSummary"

function CartPage() {
    const { cart, selectAll, getTotalItems } = useCart()
    const allSelected = cart.items.length > 0 && cart.items.every((item) => item.selected)
    return (
        <div className="min-h-screen bg-gray-50">
            {/* MODIFIED: Simplified header for cart page only */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <Badge variant="secondary" className="animate-pulse">
                                Demo
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 text-gray-600" />
                                {getTotalItems() > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce">
                                        {getTotalItems()}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MODIFIED: Removed tabs, showing only cart content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* KEPT: Select all functionality for cart items */}
                        {cart.items.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Checkbox className="bg-gray-300 hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 rounded-md h-5 w-5 flex items-center justify-center" checked={allSelected} onCheckedChange={(checked) => selectAll(checked)} />
                                    <span className="font-medium">Select All ({cart.items.length} items)</span>
                                </div>
                                <Badge variant="outline">{cart.items.filter((item) => item.selected).length} selected</Badge>
                            </div>
                        )}

                        {/* KEPT: Cart items display */}
                        <div className="space-y-4">
                            {cart.items.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border">
                                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <div className="text-gray-400 text-lg">Your cart is empty</div>
                                    <p className="text-gray-500 mt-2">Add some products to get started</p>
                                </div>
                            ) : (
                                cart.items.map((item) => <CartItem key={item.product._id} item={item} />)
                            )}
                        </div>
                    </div>

                    {/* KEPT: Checkout summary */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function App() {
    return (
        <CartPage />
    )
}
