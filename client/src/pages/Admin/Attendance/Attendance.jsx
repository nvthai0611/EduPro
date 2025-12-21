import { useEffect, useState } from "react";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useCourses } from "../../../hooks/useCourseQueries";
import { orderService } from "../../../services/admin/orderService"
import { changeAttendance, createAttendance, getAttendanceByCourse } from "../../../services/admin/attendanceService";
import { toast, ToastContainer } from "react-toastify";

export default function AttendanceManage() {
  const [step, setStep] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState("");
  const [absentStudents, setAbsentStudents] = useState([]);
  const [missingHomeworkStudents, setMissingHomeworkStudents] = useState([]);
  const [reload, setReload] = useState(false);

  const { data: courses = [] } = useCourses();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getPaidCourses,
  });

  const { data: attendanceSessions = [], refetch } = useQuery({
    queryKey: ["attendance", selectedCourse?._id],
    queryFn: () => getAttendanceByCourse(selectedCourse._id),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (!selectedCourse || !orders?.length) return;

    const mappedStudents = orders
      .filter(o => o?.courseId?._id === selectedCourse._id)
      .map(o => ({
        studentId: { _id: o.userId._id, fullName: o.userId.fullName, email: o.userId.email },
        name: o.userId.fullName,
        email: o.userId.email,
        attendance: false,
        homework: false,
        note: "",
      }));

    setStudents(mappedStudents);
  }, [selectedCourse, orders, reload]);

  useEffect(() => {
    setAbsentStudents(studentAttendance.filter(s => s.attendance === false));
    setMissingHomeworkStudents(studentAttendance.filter(s => s.homework === false));
  }, [studentAttendance])

  const toggleAttendance = (studentId, value) => {
    if (step === "check") {
      setStudents(prev =>
        prev.map(s =>
          s.studentId._id === studentId
            ? { ...s, attendance: value }
            : s
        )
      );
    }
    if (step === "change") {
      setStudentAttendance(prev =>
        prev.map(s =>
          s.studentId._id === studentId
            ? { ...s, attendance: value }
            : s
        )
      );
    }
  };

  const toggleHomework = (studentId, value) => {
    if (step === "check") {
      setStudents(prev =>
        prev.map(s =>
          s.studentId._id === studentId
            ? { ...s, homework: value }
            : s
        )
      );
    }
    if (step === "change") {
      setStudentAttendance(prev =>
        prev.map(s =>
          s.studentId._id === studentId
            ? { ...s, homework: value }
            : s
        )
      );
    }
  };

  const handleSubmit = async () => {
    try {
      if (step === "check") {
        if (!students || students.length === 0) {
          toast.error("Không có học viên để lưu");
          return;
        }
        const dataFinal = {
          courseId: selectedCourse?._id,
          records: students
        }

        const respone = await createAttendance(dataFinal);  

        setStudentAttendance(dataFinal.records || []);
        setSelectedSession(respone.data);
        setDate(new Date(respone.data.createdAt));
        toast.success("Lưu điểm danh thành công");
        setReload(!reload);
      }

      if (step === "change") {
        const dataFinal = {
          records: studentAttendance
        }

        await changeAttendance(selectedSession?._id, dataFinal);
        toast.success("Cập nhật điểm danh thành công");
      }

      await refetch();
      setStep("sessions");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
      console.error(error);
      toast.error(msg);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />

      {step === "courses" && (
        <>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Điểm danh</h1>
            <p className="text-gray-600 mt-2">Điểm danh và kiểm tra BTVN mỗi buổi học</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lớp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courses.map((c, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCourse(c);
                    setStep("sessions");
                  }}
                >
                  {c.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {step === "sessions" && selectedCourse && (
        <>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">
                  {selectedCourse.title}
                </h2>
                <p className="text-muted-foreground pt-3">
                  Tổng số {students.length || 0} học viên
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("courses")}>
                  Quay lại
                </Button>
                <Button onClick={() => setStep("check")}>Điểm danh</Button>
              </div>
            </div>

            {/* Lịch sử điểm danh */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử điểm danh</CardTitle>
              </CardHeader>

              <CardContent>
                <Select
                  value={selectedSession?._id || ""}
                  onValueChange={(id) => {
                    const session = attendanceSessions.find(x => x._id === id);
                    if (session) {
                      setStudentAttendance(session.records || []);
                      setSelectedSession(session);
                      setDate(new Date(session.createdAt));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn buổi học" />
                  </SelectTrigger>
                  <SelectContent>
                    {attendanceSessions.map((s) => (
                      <SelectItem key={s?._id} value={s?._id}>
                        {format(new Date(s?.createdAt), "dd/MM/yyyy")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Thống kê */}
            {studentAttendance.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Thống kê buổi học ngày {format(new Date(date), "dd/MM/yyyy")}</CardTitle>
                    <Button onClick={() => setStep("change")}>Sửa</Button>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vắng */}
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Học viên vắng ({absentStudents.length})
                    </p>

                    {absentStudents.length === 0 ? (
                      <p className="text-sm text-green-600">
                        Không có học viên vắng
                      </p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {absentStudents.map((s) => (
                          <li key={s._id} className="text-red-600">
                            • {s.studentId.fullName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Chưa nộp BTVN */}
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Học viên chưa nộp BTVN ({missingHomeworkStudents.length})
                    </p>

                    {missingHomeworkStudents.length === 0 ? (
                      <p className="text-sm text-green-600">
                        Tất cả học viên đã nộp bài
                      </p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {missingHomeworkStudents.map((s) => (
                          <li key={s._id} className="text-red-600">
                            • {s.studentId.fullName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {step === "check" && selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>
              Điểm danh ngày {format(new Date(), "dd/MM/yyyy")}
            </CardTitle>
          </CardHeader>

          {students.length > 0 ? (
            <CardContent className="divide-y">
              {students.map((s) => (
                <div
                  key={s.studentId._id}
                  className="grid grid-cols-4 items-center py-3"
                >
                  <span className="col-span-2">{s.name}</span>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={s.attendance === true}
                      onCheckedChange={(v) =>
                        toggleAttendance(s.studentId._id, v === true)
                      }
                    />
                    <span className="text-sm">Đã điểm danh</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={s.homework === true}
                      onCheckedChange={(v) =>
                        toggleHomework(s.studentId._id, v === true)
                      }
                    />
                    <span className="text-sm">Đã nộp BTVN</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("sessions")}>
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}>
                  Lưu điểm danh
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="divide-y">
              <div>Chưa có học viên nào tham gia lớp học</div>
            </CardContent>
          )}
        </Card>
      )}

      {step === "change" && selectedCourse && studentAttendance && (
        <Card>
          <CardHeader>
            <CardTitle>
              Điểm danh ngày {format(date, "dd/MM/yyyy")}
            </CardTitle>
          </CardHeader>

          {studentAttendance.length > 0 ? (
            <CardContent className="divide-y">
              {studentAttendance.map((s) => (
                <div
                  key={s._id}
                  className="grid grid-cols-4 items-center py-3"
                >
                  <span className="col-span-2">{s.studentId.fullName}</span>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={s.attendance}
                      onCheckedChange={() =>
                        toggleAttendance(s.studentId._id, !s.attendance)
                      }
                    />
                    <span className="text-sm">Đã điểm danh</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={s.homework}
                      onCheckedChange={() =>
                        toggleHomework(s.studentId._id, !s.homework)
                      }
                    />
                    <span className="text-sm">Đã nộp BTVN</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("sessions")}>
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}>
                  Lưu điểm danh
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="divide-y">
              <div>Chưa có học viên nào tham gia lớp học</div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}