import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Film,
} from 'lucide-react';

const CourseInfoSidebar = ({ 
  course, 
  totalSections, 
  totalLessons, 
  totalDuration, 
  formatDuration, 
  onAddSection 
}) => {
  return (
    <div className="space-y-6">
      {/* Course Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trạng thái khóa học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Trạng thái</span>
            <Badge variant={course?.status === 'published' ? 'default' : 'secondary'}>
              {course?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              {totalSections > 0 && totalLessons > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">Nội dung khóa học</p>
                <p className="text-xs text-gray-500">
                  {totalSections > 0 && totalLessons > 0
                    ? 'Đã có nội dung'
                    : 'Cần thêm chương và bài học'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thống kê</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tổng số chương</span>
            <span className="text-sm font-semibold">{totalSections}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tổng số bài học</span>
            <span className="text-sm font-semibold">{totalLessons}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Thời lượng</span>
            <span className="text-sm font-semibold">{formatDuration(totalDuration)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddSection}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm chương mới
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={totalSections === 0}
          >
            <Film className="w-4 h-4 mr-2" />
            Upload video hàng loạt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseInfoSidebar;
