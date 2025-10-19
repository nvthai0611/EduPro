import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductList({ products, formatPrice }) {
    if (!products || products.length === 0) {
        return (
            <div>
                <h5 className="text-lg font-bold text-gray-900">Loading....</h5>
            </div>
        )
    }
    return (
        <Card className="animate-in slide-in-from-left-5 duration-1000">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    Sản Phẩm
                </CardTitle>
            </CardHeader>
            <CardContent>
                {products?.map((product) => (
                    <div key={product?._id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                            src={product?.product?.images[0] || "/placeholder.svg?height=80&width=80"}
                            alt={product?.name}
                            className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-2">{product?.product?.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-lg font-bold text-red-600">{formatPrice(product?.price)}</span>
                                <span className="text-gray-600">x{product?.quantity}</span>
                                <span className="text-lg font-bold text-red-600">{formatPrice(product?.price * product?.quantity)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
