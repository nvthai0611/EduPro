import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import { CircleX, Filter, Search } from "lucide-react";
import { courseService } from "../../../services/admin/courseService";
import { orderService } from "../../../services/admin/orderService";
import { getAllUsers, revokePaidCourse } from "../../../services/admin/userService";
import { Input } from "@/components/ui/input";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const CourseAssign = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [paidCouse, setPaidCouse] = useState([]);
  const [searchCourseTerm, setSearchCourseTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [dataDelete, setDataDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submited, setSubmited] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedUser, submited]);

  const fetchData = async () => {
    try {

      const responseCourses = await courseService.getCourses();
      const responseUsers = await getAllUsers();
      const responseOrder = await orderService.getPaidCourses();

      setPaidCouse(responseOrder);

      if (responseCourses) {
        if (selectedUser) {
          if (selectedUser?.purchasedCourses?.length > 0) {
            const purchasedIds = new Set(selectedUser.purchasedCourses.map(p => p.courseId));

            const notPurchasedCourses = responseCourses.filter(c => !purchasedIds.has(c._id));

            setCourses(notPurchasedCourses);
          } else {
            setCourses(responseCourses);
          }
        } else {
          setCourses(responseCourses);
        }
      }

      if (responseUsers?.data) {
        setUsers(responseUsers?.data);
      }

    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      setUsers([]);
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedUser || !selectedCourse) {
      toast.error("Vui lòng chọn học viên và khóa học!");
      return;
    }

    await courseService.addPaidCourse({
      userId: selectedUser._id,
      courseId: selectedCourse._id,
      courseTitle: selectedCourse.title,
      price: selectedCourse.salePrice,
      paymentMethod: "sepay",
      statusOrder: "completed",
      paymentStatus: "paid",
    });

    toast.success(`Cấp khóa học ${selectedCourse.title} cho ${selectedUser.fullName} thành công!`);
    setSelectedUser(null);
    setSelectedCourse(null);
  };

  const formatPrice = (price) => {
    if (price === 0 || price === undefined) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const confirmDelete = () => {
    console.log(dataDelete);
    // Xóa order
    orderService.deleteOrder(dataDelete._id);

    // Xóa purchasedCourse trong user
    revokePaidCourse(dataDelete?.userId?._id, dataDelete?.courseId?._id);

    toast.success(`Thu hồi khóa học ${dataDelete?.courseId?.title} của ${dataDelete?.userId?.fullName} thành công!`);
    setIsDeleteDialogOpen(false);
    setSubmited(!submited);
  }

  const filteredPaidCourses = paidCouse.filter((course) => {
    const text = `${course?.courseId?.title} ${course?.courseId?.description} ${course?.userId?.fullName} ${course?.userId?.email}`.toLowerCase();

    return (
      text.includes(searchCourseTerm.toLowerCase()) && text.includes(searchUserTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Cấp Khóa Học</h1>
      <p className="text-gray-600">Chọn học viên và khóa học để cấp</p>

      <div className="flex w-full gap-6">
        {/* Chọn User */}
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
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} - {u.email}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Chọn Course */}
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-semibold">Chọn Khóa Học</h3>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded"
              value={selectedCourse?._id || ""}
              onChange={(e) => {
                const course = courses.find((c) => c._id === e.target.value);
                setSelectedCourse(course);
              }}
            >
              <option value="">Chọn khóa học</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} - {formatPrice(c.salePrice)}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAssignCourse}>
          Cấp Khóa Học
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchCourseTerm}
                onChange={(e) => setSearchCourseTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm học viên..."
                value={searchUserTerm}
                onChange={(e) => setSearchUserTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" onClick={() => {
              setSearchCourseTerm('');
              setSearchUserTerm('');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

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
                {filteredPaidCourses.map(course => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course?.courseId?.thumbnail || 'https://via.placeholder.com/60x40'}
                          alt={course?.courseId?.title || 'Course'}
                          className="w-15 h-10 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{course?.courseId?.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {course?.courseId?.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {formatPrice(course.price || 0)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {course?.userId?.fullName || 'N/A'}
                        </div>
                        <div className="text-gray-500">
                          {course?.userId?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Thu hồi khóa học"
                          onClick={() => {
                            setDataDelete(course);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <CircleX className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xác nhận xóa */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default CourseAssign;
