import PromotionCard from "./PromotionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PromotionList({ promotions, onEdit, onToggleActive }) {
  if (promotions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground">
              Không tìm thấy Promotion nào
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách Promotion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion._id}
              promotion={promotion}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
