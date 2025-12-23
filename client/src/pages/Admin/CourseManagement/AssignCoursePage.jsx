import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleX, Filter, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify"

import { Input } from "@/components/ui/input";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

import { courseService } from "../../../services/admin/courseService";
import { orderService } from "../../../services/admin/orderService";
import { getAllUsers, revokePaidCourse } from "../../../services/admin/userService";

const CourseAssign = () => {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  const [searchUserTerm, setSearchUserTerm] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dataDelete, setDataDelete] = useState(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getCourses(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const { data: paidCourses = [] } = useQuery({
    queryKey: ["paidCourses"],
    queryFn: () => orderService.getPaidCourses(),
  });

  const filteredCourses = useMemo(() => {
    if (!selectedUser) return courses;

    const purchasedIds = new Set(
      selectedUser?.purchasedCourses?.map((p) => p.courseId)
    );

    return courses.filter((c) => !purchasedIds.has(c._id));
  }, [courses, selectedUser]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.fullName} ${u.email}`
        .toLowerCase()
        .includes(searchUserTerm.toLowerCase())
    );
  }, [users, searchUserTerm]);

  const filteredPaidCourses = useMemo(() => {
    return paidCourses.filter((c) => {
      const text = `${c?.courseId?.title} ${c?.courseId?.description} ${c?.userId?.fullName} ${c?.userId?.email}`.toLowerCase();

      return (
        text.includes(searchCourseTerm.toLowerCase()) &&
        text.includes(searchUserTerm.toLowerCase())
      );
    });
  }, [paidCourses, searchCourseTerm, searchUserTerm]);

  const assignMutation = useMutation({
    mutationFn: async () => {
      return courseService.addPaidCourse({
        userId: selectedUser._id,
        courseId: selectedCourse._id,
        courseTitle: selectedCourse.title,
        price: selectedCourse.salePrice || selectedCourse.price || 1,
        paymentMethod: "sepay",
        statusOrder: "completed",
        paymentStatus: "paid",
      });
    },
    onSuccess: () => {
      toast.success(
        `Cấp khóa học ${selectedCourse.title} cho ${selectedUser.fullName} thành công!`
      );

      // reload lại danh sách:
      queryClient.invalidateQueries(["paidCourses"]);
      queryClient.invalidateQueries(["users"]);

      setSelectedCourse(null);
      setSelectedUser(null);
    },
  });

  const handleAssignCourse = () => {
    if (!selectedUser || !selectedCourse) {
      toast.error("Vui lòng chọn học viên và khóa học!");
      return;
    }
    assignMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (dataDelete) => {
      await orderService.deleteOrder(dataDelete._id);
      await revokePaidCourse(
        dataDelete?.userId?._id,
        dataDelete?.courseId?._id
      );
    },
    onSuccess: () => {
      toast.success(
        `Thu hồi khóa học ${dataDelete?.courseId?.title} của ${dataDelete?.userId?.fullName} thành công!`
      );

      queryClient.invalidateQueries(["paidCourses"]);
      queryClient.invalidateQueries(["users"]);

      setIsDeleteDialogOpen(false);
    },
  });

  const confirmDelete = () => {
    deleteMutation.mutate(dataDelete);
  };

  // ================================
  const formatPrice = (price) => {
    if (!price) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cấp Khóa Học</h1>
        <p className="text-gray-600 mt-2">Chọn học viên và khóa học để cấp</p>
      </div>

      <ToastContainer />

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchCourseTerm}
                onChange={(e) => setSearchCourseTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm học viên..."
                value={searchUserTerm}
                onChange={(e) => setSearchUserTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearchCourseTerm("");
                setSearchUserTerm("");
                setSelectedCourse(null);
                setSelectedUser(null);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>

            <div className="flex justify-end">
              <Button onClick={handleAssignCourse} disabled={assignMutation.isPending}>
                Cấp Khóa Học
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selects */}
      <div className="flex w-full gap-6">
        {/* Users */}
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-semibold">Chọn Học Viên</h3>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded"
              value={selectedUser?._id || ""}
              onChange={(e) => {
                const user = users.find((u) => u._id === e.target.value);
                setSelectedUser(user);
              }}
            >
              <option value="">Chọn học viên</option>
              {filteredUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} - {u.email}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-semibold">Chọn Khóa Học</h3>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded"
              value={selectedCourse?._id || ""}
              onChange={(e) => {
                const course = filteredCourses.find((c) => c._id === e.target.value);
                setSelectedCourse(course);
              }}
            >
              <option value="">Chọn khóa học</option>
              {filteredCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} - {formatPrice(c.salePrice)}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Danh sách học viên</h3>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Khóa học</th>
                  <th className="text-left p-4">Giá</th>
                  <th className="text-left p-4">Học viên</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredPaidCourses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course?.courseId?.thumbnail}
                          alt={course?.courseId?.title}
                          className="w-15 h-10 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {course?.courseId?.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {course?.courseId?.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-medium">
                        {formatPrice(course.price)}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {course?.userId?.fullName}
                        </div>
                        <div className="text-gray-500">{course?.userId?.email}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDataDelete(course);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <CircleX className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Delete */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CourseAssign;