// components/stats-card.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsCard({ title, value, description, icon: Icon }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
