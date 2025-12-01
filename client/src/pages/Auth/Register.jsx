"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"
import { resendOTP, sendOTP, verifyOTP } from "../../services/user/userService"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import authService from "../../services/auth/authService"
import { isValidEmail, isValidName, isValidPhone } from "../../utils/validation"

// ✅ THÊM: Constants cho localStorage
const STORAGE_KEY = "haei_spa_registration_data"
const STORAGE_STEP_KEY = "haei_spa_registration_step"
const STORAGE_OTP_KEY = "haei_spa_otp_data"

export default function ModernRegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [countdown, setCountdown] = useState(0)

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  })

  // Validation states
  const [errors, setErrors] = useState({})
  const [validFields, setValidFields] = useState({})

  // ✅ THÊM: Functions để quản lý localStorage
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log("💾 Đã lưu dữ liệu vào localStorage:", data)
    } catch (error) {
      console.error("❌ Lỗi khi lưu vào localStorage:", error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        console.log("📂 Đã tải dữ liệu từ localStorage:", parsedData)
        return parsedData
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải từ localStorage:", error)
    }
    return null
  }

  const saveStepToLocalStorage = (step) => {
    try {
      localStorage.setItem(STORAGE_STEP_KEY, step.toString())
    } catch (error) {
      console.error("❌ Lỗi khi lưu step vào localStorage:", error)
    }
  }

  const loadStepFromLocalStorage = () => {
    try {
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY)
      return savedStep ? Number.parseInt(savedStep) : 1
    } catch (error) {
      console.error("❌ Lỗi khi tải step từ localStorage:", error)
      return 1
    }
  }

  const saveOtpDataToLocalStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_OTP_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("❌ Lỗi khi lưu OTP data vào localStorage:", error)
    }
  }

  const loadOtpDataFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_OTP_KEY)
      return savedData ? JSON.parse(savedData) : null
    } catch (error) {
      console.error("❌ Lỗi khi tải OTP data từ localStorage:", error)
      return null
    }
  }

  const clearAllLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_STEP_KEY)
      localStorage.removeItem(STORAGE_OTP_KEY)
      console.log("🗑️ Đã xóa tất cả dữ liệu localStorage")
    } catch (error) {
      console.error("❌ Lỗi khi xóa localStorage:", error)
    }
  }

  // Countdown timer for OTP
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // ✅ THÊM: useEffect để load dữ liệu khi component mount
  useEffect(() => {
    // Load form data từ localStorage
    const savedFormData = loadFromLocalStorage()
    if (savedFormData) {
      setFormData(savedFormData)
      // Validate lại các fields đã lưu
      Object.keys(savedFormData).forEach((key) => {
        if (savedFormData[key]) {
          validateField(key, savedFormData[key])
        }
      })
    }

    // Load step từ localStorage
    const savedStep = loadStepFromLocalStorage()
    if (savedStep > 1) {
      setCurrentStep(savedStep)
    }

    // Load OTP data nếu đang ở step OTP
    if (savedStep === 2) {
      const savedOtpData = loadOtpDataFromLocalStorage()
      if (savedOtpData) {
        setRegistrationData(savedOtpData.registrationData)
        setShowOtpModal(savedOtpData.showOtpModal)
        setCountdown(savedOtpData.countdown || 0)
      }
    }

    console.log("🔄 Đã khôi phục dữ liệu từ localStorage")
  }, [])

  // const isValidEmail = (email) => {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  //   return emailRegex.test(email)
  // }

  // const isValidPhone = (phone) => {
  //   const phoneRegex = /^[0-9]{10,11}$/
  //   return phoneRegex.test(phone.replace(/\s/g, ""))
  // }

  // ✅ SỬA: Update handleInputChange để lưu vào localStorage
  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newFormData = {
      ...formData,
      [name]: value,
    }

    setFormData(newFormData)

    // ✅ THÊM: Lưu vào localStorage mỗi khi có thay đổi
    saveToLocalStorage(newFormData)

    // Real-time validation
    validateField(name, value)
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }
    const newValidFields = { ...validFields }

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors[name] = "Vui lòng nhập họ và tên"
          delete newValidFields[name]
        } else if (!/^[\p{L}\s]+$/u.test(value)) {
          newErrors[name] = "Họ và tên không được chứa số hoặc ký tự đặc biệt"
          delete newValidFields[name]
        } else {
          delete newErrors[name]
          newValidFields[name] = true
        }
        break

      case "email":
        if (!value.trim()) {
          newErrors[name] = "Email không được để trống"
          delete newValidFields[name]
        } else if (!isValidEmail(value)) {
          newErrors[name] = "Email không đúng định dạng"
          delete newValidFields[name]
        } else {
          delete newErrors[name]
          newValidFields[name] = true
        }
        break

      case "phone":
        if (!value.trim()) {
          newErrors[name] = "Số điện thoại không được để trống"
          delete newValidFields[name]
        } else if (!isValidPhone(value)) {
          newErrors[name] = "Số điện thoại không đúng định dạng"
          delete newValidFields[name]
        } else {
          delete newErrors[name]
          newValidFields[name] = true
        }
        break

      case "password":
        if (!value) {
          newErrors[name] = "Mật khẩu không được để trống"
          delete newValidFields[name]
        } else if (value.length < 8) {
          newErrors[name] = "Mật khẩu phải có ít nhất 8 ký tự"
          delete newValidFields[name]
        } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
          newErrors[name] = "Mật khẩu phải có chữ hoa, chữ thường và số"
          delete newValidFields[name]
        } else {
          delete newErrors[name]
          newValidFields[name] = true
        }
        break

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors[name] = "Mật khẩu xác nhận không khớp"
          delete newValidFields[name]
        } else if (value) {
          delete newErrors[name]
          newValidFields[name] = true
        }
        break

      case "birthDate":
        if (!value) {
          newErrors[name] = "Vui lòng chọn ngày sinh"
          delete newValidFields[name]
        } else {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          if (age < 12) {
            newErrors[name] = "Bạn phải từ 12 tuổi trở lên"
            delete newValidFields[name]
          } else {
            delete newErrors[name]
            newValidFields[name] = true
          }
        }
        break
    }

    setErrors(newErrors)
    setValidFields(newValidFields)
  }

  // ✅ SỬA LỖI: Hàm validation mới - không dựa vào state errors
  const validateAllFields = () => {
    const newErrors = {}

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên"
    } else if (isValidName(formData.fullName) === false) {
      newErrors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt"
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống"
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không đúng định dạng"
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống"
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng"
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống"
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      newErrors.password = "Mật khẩu phải có chữ hoa, chữ thường và số"
    }

    // Validate confirmPassword
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    // Validate birthDate
    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh"
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 12) {
        newErrors.birthDate = "Bạn phải từ 12 tuổi trở lên"
      }
    }

    // Update errors state nếu có lỗi
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    return true
  }

  // ✅ SỬA: Update handleSendOtp để lưu step và OTP data
  const handleSendOtp = async (e) => {
    // Ngăn chặn mọi form submission
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    console.log("🚀 Bắt đầu gửi OTP...") // Debug log

    // Validate form trước khi gửi
    if (!validateAllFields()) {
      toast.error("Vui lòng kiểm tra lại thông tin")
      console.log("❌ Validation failed") // Debug log
      return
    }

    setIsLoading(true)
    const checkExistEmailOrPhone = await authService.checkExistEmailOrPhone(formData.email, formData.phone)
    if (!checkExistEmailOrPhone.success) {
      toast.error(checkExistEmailOrPhone.message)
      setIsLoading(false)
      console.log("❌ Kết quả checkExistEmailOrPhone:", checkExistEmailOrPhone) // Debug log
      return
    }
    setCurrentStep(2)

    // ✅ THÊM: Lưu step vào localStorage
    saveStepToLocalStorage(2)

    try {
      console.log("📧 Đang gửi OTP đến:", formData.email) // Debug log

      // ✅ FIXED: Gọi API với proper error handling
      const resOTP = await sendOTP(formData.email, "register")

      console.log("📨 Kết quả API:", resOTP) // Debug log

      if (resOTP && resOTP.success) {
        setRegistrationData(formData)
        setShowOtpModal(true)
        setCountdown(60)

        // ✅ THÊM: Lưu OTP data vào localStorage
        saveOtpDataToLocalStorage({
          registrationData: formData,
          showOtpModal: true,
          countdown: 60,
          timestamp: Date.now(),
        })

        toast.success("Mã OTP đã được gửi đến email của bạn!")
        console.log("✅ Gửi OTP thành công") // Debug log
      } else {
        // ✅ FIXED: Xử lý khi API trả về success = false
        const errorMessage = resOTP?.message || "Có lỗi xảy ra khi gửi OTP"
        toast.error(errorMessage)
        console.log("❌ API trả về lỗi:", errorMessage) // Debug log
        setCurrentStep(1) // Quay lại step 1 nếu có lỗi

        // ✅ THÊM: Reset step trong localStorage khi có lỗi
        saveStepToLocalStorage(1)
      }
    } catch (error) {
      // ✅ FIXED: Xử lý lỗi API call
      console.error("💥 Lỗi khi gửi OTP:", error) // Debug log

      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi gửi OTP"

      toast.error(errorMessage)
      setCurrentStep(1) // Quay lại step 1 nếu có lỗi

      // ✅ THÊM: Reset step trong localStorage khi có lỗi
      saveStepToLocalStorage(1)
    } finally {
      setIsLoading(false)
      console.log("🏁 Kết thúc quá trình gửi OTP") // Debug log
    }
  }

  const handleOtpChange = (value) => {
    setOtpCode(value)
  }

  const handleOtpModalChange = (open) => {
    setShowOtpModal(open);
    if (!open) {
      setCurrentStep(1);
      saveStepToLocalStorage(1); // nếu muốn lưu lại step mới
      setOtpCode("");
      setIsVerifyingOtp(false);
      // Có thể reset thêm các state khác nếu muốn
    }
  };

  // ✅ SỬA: Update handleVerifyOtp để xóa localStorage khi thành công
  const handleVerifyOtp = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (otpCode.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP")
      return
    }

    setIsVerifyingOtp(true)

    try {
      console.log("🔐 Đang xác minh OTP:", otpCode) // Debug log

      const resVerify = await verifyOTP(registrationData.email, otpCode, "register")

      console.log("✅ Kết quả verify OTP:", resVerify) // Debug log

      if (resVerify && resVerify.success) {
        const resRegister = await authService.register(registrationData)
        console.log("✅ Kết quả register:", resRegister);

        if (resRegister && resRegister.success) {
          toast.success("Đăng ký thành công! 🎉, di chuyển đến trang đăng nhập")
          setShowOtpModal(false)
          setCurrentStep(3)

          // ✅ THÊM: Lưu step thành công vào localStorage
          saveStepToLocalStorage(3)

          // ✅ THÊM: Xóa tất cả dữ liệu localStorage sau khi thành công
          clearAllLocalStorage()

          // Reset form
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            birthDate: "",
            password: "",
            confirmPassword: "",
          })
          setOtpCode("")
          setCurrentStep(1)
          setErrors({})
          setValidFields({})
          setRegistrationData(null)
          setTimeout(() => {
            window.location.href = "/dang-nhap"
          }, 1000)
          console.log("🎉 Đăng ký hoàn tất, đã xóa localStorage")
        }
      } else {
        const errorMessage = resVerify?.message || "Mã OTP không chính xác"
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("💥 Lỗi khi verify OTP:", error) // Debug log

      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi xác minh OTP"

      toast.error(errorMessage)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // ✅ SỬA LỖI: Thêm error handling cho resend OTP
  const handleResendOtp = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      console.log("🔄 Đang gửi lại OTP...") // Debug log

      const resResend = await resendOTP(registrationData.email, "register")

      console.log("📨 Kết quả resend OTP:", resResend) // Debug log

      if (resResend && resResend.success) {
        setCountdown(60)
        setOtpCode("")
        toast.success("Mã OTP mới đã được gửi!")
      } else {
        const errorMessage = resResend?.message || "Có lỗi xảy ra khi gửi lại OTP"
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("💥 Lỗi khi resend OTP:", error) // Debug log

      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi gửi lại OTP"

      toast.error(errorMessage)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // ✅ THÊM: Function để clear localStorage thủ công (cho debug)
  const handleClearStorage = () => {
    clearAllLocalStorage()
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    })
    setCurrentStep(1)
    setErrors({})
    setValidFields({})
    setRegistrationData(null)
    setShowOtpModal(false)
    setOtpCode("")
    toast.info("Đã xóa tất cả dữ liệu đã lưu")
  }

  return (
    <>
      <ToastContainer position="top-right" />

      {/* Background with animated gradient */}
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Success State */}
            {currentStep === 3 && (
              <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
                  <p className="text-gray-600 mb-6">Chào mừng bạn đến với EduPro</p>
                  <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Link to="/dang-nhap" className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Đăng nhập ngay
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Registration Form */}
            {currentStep === 1 && (
              <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Tạo tài khoản mới
                    </h1>
                    <p className="text-gray-600 mt-2">Đăng ký để trải nghiệm các dịch vụ của EduPro</p>
                  </div>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Họ và tên
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Nguyễn Văn A"
                          className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.fullName
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.fullName
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                        />
                        {validFields.fullName && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.fullName && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.email
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.email
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                        />
                        {validFields.email && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.email && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0123456789"
                          className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.phone
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.phone
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                        />
                        {validFields.phone && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.phone && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                        Ngày sinh
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.birthDate
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.birthDate
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                          max={(() => {
                            const today = new Date()
                            const maxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
                            return maxDate.toISOString().split("T")[0]
                          })()}
                        />
                        {validFields.birthDate && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.birthDate && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.birthDate}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Tối thiểu 8 ký tự"
                          className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.password
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.password
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        {validFields.password && (
                          <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.password && (
                          <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Nhập lại mật khẩu"
                          className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.confirmPassword
                            ? "border-red-300 focus:border-red-500 bg-red-50"
                            : validFields.confirmPassword
                              ? "border-green-300 focus:border-green-500 bg-green-50"
                              : "border-gray-200 focus:border-purple-500 bg-white"
                            }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        {validFields.confirmPassword && (
                          <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                        {errors.confirmPassword && (
                          <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* ✅ FIXED: Submit Button với proper event handling */}
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang gửi OTP...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Gửi mã xác minh
                        </div>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
                      </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                      <span className="text-gray-600">Đã có tài khoản? </span>
                      <Link
                        to="/dang-nhap"
                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
                      >
                        Đăng nhập ngay
                      </Link>
                    </div>
                    {/* ✅ THÊM: Clear Storage Button (chỉ hiển thị khi có dữ liệu đã lưu) */}
                    {loadFromLocalStorage() && (
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClearStorage}
                          className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                          Xóa dữ liệu đã lưu
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {currentStep === 2 && (
              <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang gửi mã OTP</h2>
                  <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={handleOtpModalChange}>
        <DialogContent className="sm:max-w-md backdrop-blur-lg bg-white/95 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Xác minh OTP
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600">Chúng tôi đã gửi mã xác minh đến email:</p>
              <p className="font-semibold text-gray-800 mt-1">{registrationData?.email}</p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={handleOtpChange} className="gap-2">
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Countdown */}
            {countdown > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Mã OTP sẽ hết hạn sau: <span className="font-semibold text-purple-600">{formatTime(countdown)}</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xác minh...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Xác minh
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {countdown > 0 ? `Gửi lại sau ${formatTime(countdown)}` : "Gửi lại mã OTP"}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Không nhận được mã? Kiểm tra thư mục spam hoặc nhấn "Gửi lại mã OTP"
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
