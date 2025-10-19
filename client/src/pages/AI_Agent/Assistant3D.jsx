"use client"
import { useEffect, useState, Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text } from "@react-three/drei"
import {
  Mic,
  MicOff,
  VolumeX,
  Camera,
  RotateCcw,
  Eye,
  Sparkles,
  Brain,
  Zap,
  Target,
  Heart,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Import face-api.js
// Bạn có thể cần thêm thư viện này vào dự án của mình nếu chưa có.
// Ví dụ: import * as faceapi from 'face-api.js';
// Nếu bạn đang sử dụng Next.js, bạn có thể cần cài đặt nó qua npm/yarn
// và đảm bảo nó được tải động hoặc chỉ ở phía client.
// Đối với v0, chúng ta giả định nó có sẵn hoặc được tải qua CDN nếu cần.
import * as faceapi from "face-api.js"

function RobotModel({ isTalking }) {
  const groupRef = useRef(null)
  useEffect(() => {
    if (groupRef.current && isTalking) {
      const interval = setInterval(() => {
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.01
        }
      }, 16)
      return () => clearInterval(interval)
    }
  }, [isTalking])
  return <FallbackModel isTalking={isTalking} />
}

function FallbackModel({ isTalking }) {
  const groupRef = useRef(null)
  useEffect(() => {
    if (groupRef.current && isTalking) {
      const interval = setInterval(() => {
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.02
        }
      }, 16)
      return () => clearInterval(interval)
    }
  }, [isTalking])
  return (
    <group ref={groupRef}>
      {/* Robot Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.8]} />
        <meshStandardMaterial color={isTalking ? "#3b82f6" : "#6b7280"} />
      </mesh>
      {/* Robot Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={isTalking ? "#1d4ed8" : "#4b5563"} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.2, 1.1, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={isTalking ? "#fbbf24" : "#ffffff"} />
      </mesh>
      <mesh position={[0.2, 1.1, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={isTalking ? "#fbbf24" : "#ffffff"} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.8, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color={isTalking ? "#3b82f6" : "#6b7280"} />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color={isTalking ? "#3b82f6" : "#6b7280"} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color={isTalking ? "#1d4ed8" : "#4b5563"} />
      </mesh>
      <mesh position={[0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color={isTalking ? "#1d4ed8" : "#4b5563"} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={isTalking ? "#10b981" : "#fbbf24"} />
      </mesh>
      {isTalking && (
        <>
          <Text position={[0, 2.2, 0]} fontSize={0.3} color="#3b82f6" anchorX="center" anchorY="middle">
            Đang phân tích...
          </Text>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </>
      )}
    </group>
  )
}

function Scene({ isTalking, isAnalyzing }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} intensity={0.3} />
      <Environment preset="city" />
      <Suspense fallback={<LoadingModel />}>
        <RobotModel isTalking={isTalking || isAnalyzing} />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
    </>
  )
}

function LoadingModel() {
  return (
    <Html center>
      <div className="flex flex-col items-center text-blue-600">
        <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <p className="text-sm">Đang tải robot...</p>
      </div>
    </Html>
  )
}

// Component hiệu ứng laser quét
function LaserScanner({ isScanning }) {
  if (!isScanning) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {/* Laser grid background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-500/20 to-purple-500/10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:20px_20px]"></div>
      </div>
      {/* Scanning lines */}
      <div className="absolute inset-0">
        <div className="laser-scan-horizontal absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00ffff] animate-scan-vertical"></div>
        <div className="laser-scan-vertical absolute h-full w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00ffff] animate-scan-horizontal"></div>
      </div>
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400 shadow-[0_0_20px_#00ffff] animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 shadow-[0_0_20px_#00ffff] animate-pulse"></div>
      {/* Center target */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-40 border-2 border-cyan-400 rounded-full opacity-60 animate-pulse shadow-[0_0_20px_#00ffff]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#00ffff] animate-ping"></div>
      </div>
      {/* Scanning text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-400 font-mono text-sm animate-pulse">
        🔍 LASER SCANNING IN PROGRESS...
      </div>
    </div>
  )
}

export default function Assistant3D() {
  const [text, setText] = useState("")
  const [response, setResponse] = useState("")
  const [isTalking, setIsTalking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const speakingCancelledRef = useRef(false) // New ref to track speech cancellation [^1]
  const modelsLoadedRef = useRef(false) // To ensure face-api.js models are loaded only once [^1]

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  useEffect(() => {
    const hasWebkitSpeech = "webkitSpeechRecognition" in window
    const hasSpeech = "SpeechRecognition" in window
    const hasSynthesis = "speechSynthesis" in window
    setIsSupported(hasWebkitSpeech || hasSpeech)
    if (!hasSynthesis) {
      setError("Trình duyệt không hỗ trợ text-to-speech")
    }

    // Load face-api.js models when the component mounts [^3]
    const loadModels = async () => {
      if (modelsLoadedRef.current) return // Prevent re-loading

      try {
        // IMPORTANT: Bạn cần tải các mô hình face-api.js và đặt chúng vào thư mục public/models của bạn.
        // Ví dụ, tải ssd_mobilenetv1_model.weights, ssd_mobilenetv1_model.json, v.v.
        // từ https://github.com/justadudewhohacks/face-api.js/tree/master/weights
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/face")
        modelsLoadedRef.current = true
        console.log("Face API models loaded successfully!")
      } catch (err) {
        console.error("Error loading Face API models:", err)
        setError(
          "Không thể tải các mô hình AI phân tích khuôn mặt. Vui lòng đảm bảo chúng có trong thư mục public/face.",
        )
      }
    }

    loadModels()

    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
      @keyframes scan-vertical {
        0% { top: 0%; }
        50% { top: 100%; }
        100% { top: 0%; }
      }
      @keyframes scan-horizontal {
        0% { left: 0%; }
        50% { left: 100%; }
        100% { left: 0%; }
      }
      .animate-scan-vertical {
        animation: scan-vertical 2s ease-in-out infinite;
      }
      .animate-scan-horizontal {
        animation: scan-horizontal 3s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const getAdvancedAnalysisResponse = () => {
    const responses = [
      {
        title: "Phân Tích Sinh Học & Lộ Trình Chăm Sóc Da Toàn Diện",
        content: `Phân tích bằng công nghệ AI tiên tiến đã hoàn tất.
  Kết quả quét 3D khuôn mặt:
   - Độ đối xứng khuôn mặt: 94.2% (Xuất sắc)
   - Độ ẩm da (Hydration): 78% (Tốt)
   - Mật độ collagen ước tính: 85% (Rất tốt)
   - Tỷ lệ vàng khuôn mặt: 1.618 (Hoàn hảo)
  
  Lộ trình chăm sóc da 90 ngày:
  
  Giai đoạn 1 (Ngày 1 - 30): Tái tạo & phục hồi
   - Sáng: Serum Vitamin C 20%, Hyaluronic Acid, kem chống nắng SPF 50
   - Tối: Retinol 0.5% (3 lần/tuần), Niacinamide 10%
   - Hàng tuần: Tẩy da chết Glycolic Acid Peel 30%
   - Bổ sung: Collagen Peptides, Omega-3
  
  Giai đoạn 2 (Ngày 31 - 60): Tăng cường & bảo vệ
   - Dưỡng chất: Peptide Complex, Growth Factors
   - Công nghệ: Liệu pháp ánh sáng đỏ (LED 660nm)
   - Điều trị: Microneedling (2 lần/tháng)
   - Dinh dưỡng: Antioxidant Complex, Probiotics
  
  Giai đoạn 3 (Ngày 61 - 90): Duy trì & tối ưu
   - Chuyên sâu: Chemical Peel, Radiofrequency
   - Duy trì: Serum tuỳ chỉnh cá nhân
   - Lối sống: Tối ưu giấc ngủ, quản lý căng thẳng
  
  Công nghệ hỗ trợ:
   - AI phân tích da bằng thị giác máy tính
   - Gương thông minh IoT theo dõi hằng ngày
   - Blockchain lưu trữ dữ liệu hành trình làm đẹp
   - Thực tế ảo tăng cường (AR/VR) để xem trước kết quả
  
  Kết quả dự kiến:
   - Giảm 40% nếp nhăn sau 30 ngày
   - Tăng 60% độ đàn hồi sau 60 ngày
   - Cải thiện 80% kết cấu da sau 90 ngày`
      },
      {
        title: "Hệ Thống Chăm Sóc Da Thông Minh 4.0",
        content: `Phân tích dữ liệu sinh trắc học bằng Machine Learning đã hoàn tất.
  
  Chỉ số sinh học:
   - Tuổi da: 23 tuổi
   - Tuổi sinh học: 28
   - Độ đàn hồi: 8.7/10
   - Sắc tố da: 92% (Xuất sắc)
   - Độ rõ lỗ chân lông: Tối thiểu (Loại A)
  
  Lộ trình công nghệ cao:
  
  Giai đoạn 1 (Tuần 1 - 2): Chẩn đoán thông minh
   - Máy quét da IoT kết nối smartphone
   - AI chọn thành phần dưỡng phù hợp
   - Tạo công thức serum cá nhân hoá
   - Theo dõi da thời gian thực
  
  Giai đoạn 2 (Tuần 3 - 8): Điều trị chính xác
   - Hệ thống vận chuyển bằng công nghệ nano
   - Liệu pháp tế bào gốc
   - Peptide kỹ thuật hoá
   - Cân bằng hệ vi sinh da
  
  Giai đoạn 3 (Tuần 9 - 12): Tích hợp Biohacking
   - Xét nghiệm gen cho skincare cá nhân hóa
   - Tối ưu hoá nhịp sinh học (circadian)
   - Cân bằng nội tiết tố
   - Dinh dưỡng theo bản đồ gene
  
  Công nghệ khuyến nghị:
   - Thiết bị đeo: Oura Ring, Apple Watch
   - Ứng dụng: SkinVision, YouCam Makeup
   - Thiết bị chăm sóc: Foreo Luna 3, NuFace Trinity
   - Thực phẩm chức năng: Cá nhân hóa theo xét nghiệm DNA
  
  Đột phá làm đẹp:
   - In 3D mặt nạ cá nhân hoá
   - Quantum Dots trong kem chống nắng
   - Kính áp tròng thông minh bảo vệ tia UV
   - Trang điểm hologram kết hợp AR
  
  Chỉ số theo dõi:
   - Hằng ngày: Độ ẩm, độ pH, lượng dầu
   - Hàng tuần: Độ đàn hồi, độ sáng, độ săn chắc
   - Hàng tháng: Mật độ collagen, tốc độ tái tạo tế bào
   - Hàng quý: Đánh giá tổng thể theo tuổi da
  
  Kết quả kỳ vọng:
   - Cải thiện 50% hàng rào bảo vệ da
   - Giảm 70% dấu hiệu viêm da
   - 90% người dùng hài lòng với làn da tổng thể`
      },
      {
        title: "Phòng Thí Nghiệm Làm Đẹp Cá Nhân Hóa",
        content: `Phân tích phân tử học tiên tiến đã hoàn tất.
  
  Hồ sơ di truyền làm đẹp:
   - Gene sản xuất collagen: AA (Tối ưu)
   - Khả năng chống oxy hóa: GG (Tăng cường)
   - Độ nhạy nắng: AG (Trung bình)
   - Tốc độ lão hóa: TT (Chậm)
  
  Kiến trúc chăm sóc cá nhân hóa:
  
  Giai đoạn 1: Phòng nghiên cứu chăm sóc da chính xác
   - Trạm pha serum cá nhân
   - Công thức phản ứng theo pH da
   - Công nghệ giải phóng dưỡng chất theo thời gian
   - Thư viện 200+ hoạt chất sinh học
  
  Giai đoạn 2: Trung tâm điều trị nâng cao
   - Liệu pháp lạnh Cryotherapy
   - Hệ thống siêu âm dẫn truyền dưỡng chất
   - Công nghệ Plasma làm đẹp
   - Buồng nuôi tế bào gốc
  
  Giai đoạn 3: Không gian tối ưu hóa lối sống
   - Hệ thống đèn sinh học theo nhịp sinh học
   - Lọc không khí ion âm
   - Phát tán tinh dầu & công nghệ thiền định giảm stress
  
  Triển khai chiến lược:
  
  Tuần 1 - 4: Khôi phục nền tảng
   + Phân tích và phục hồi hệ vi sinh da
   + Tăng cường hàng rào bảo vệ
   + Giảm viêm, cấp ẩm tối ưu
  
  Tuần 5 - 8: Tăng cường hoạt tính
   + Kích thích yếu tố tăng trưởng
   + Tăng tốc tái tạo tế bào
   + Thúc đẩy tổng hợp collagen & elastin
  
  Tuần 9 - 12: Duy trì & tinh chỉnh
   + Ổn định lâu dài
   + Chiến lược chống lão hoá sớm
   + Bảo vệ khỏi môi trường
   + Cải tiến liên tục theo phản hồi AI
  
  Công nghệ cao cấp:
   - Microdermabrasion với kim cương
   - Liệu pháp hạt nano vàng
   - Peptide bạch kim
   - Tần số tinh thể trị liệu
  
  Kết quả kỳ vọng:
   - Mức độ hài lòng với làn da: 95%
   - Trẻ hoá sinh học: Từ 2 đến 5 năm
   - Mức độ hài lòng tổng thể: Trên 98%
   - Sức khoẻ làn da lâu dài: Tối ưu`
      },
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" })
      if (result.state === "denied") {
        setError("Camera bị từ chối. Vui lòng cho phép quyền truy cập camera trong settings trình duyệt.")
        return false
      }
      return true
    } catch (error) {
      // If query is not supported, assume permission might be granted on request
      return true
    }
  }

  const startCamera = async () => {
    const hasPermission = await checkCameraPermission()
    if (!hasPermission) return

    if (!modelsLoadedRef.current) {
      setError("Mô hình AI chưa được tải hoàn tất. Vui lòng đợi hoặc refresh trang.")
      speakText("Mô hình AI chưa được tải hoàn tất. Vui lòng đợi hoặc refresh trang.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      setCameraStream(stream)
      setShowCamera(true)
      setIsScanning(true)
      setError("")
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setError("Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera và refresh trang.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
    setIsScanning(false)
  }

  const capturePhoto = async () => {
    // Made async to await face detection
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        stopCamera()

        // Perform face detection
        try {
          // Ensure the image element is loaded before detection if using an <img> tag
          // For canvas, it's usually ready after drawImage
          const detections = await faceapi.detectAllFaces(canvas, new faceapi.SsdMobilenetv1Options())
          analyzeFace(imageData, detections.length) // Pass face count to analyzeFace
        } catch (detectionError) {
          console.error("Face detection error:", detectionError)
          const errorMessage = "Lỗi trong quá trình nhận dạng khuon mat. Vui lòng thu lai."
          setResponse(errorMessage)
          speakText(errorMessage)
          setIsAnalyzing(false)
          setIsTalking(false)
        }
      }
    }
  }

  const analyzeFace = async (imageData, faceCount) => {
    // Added faceCount parameter
    setIsAnalyzing(true)
    setIsTalking(true)
    setAnalysisProgress(0)

    if (faceCount === 0) {
      const errorMessage =
        "Không tìm thấy khuôn mặt của bạn. Vui lòng đảm bảo khuôn mặt của bạn nằm trong khung hình và thử lại."
      setResponse(errorMessage)
      speakText(errorMessage)
      setIsAnalyzing(false)
      setIsTalking(false)
      return
    } else if (faceCount > 1) {
      const errorMessage =
        "Phat hien nhieu hon mot khuon mat. Vui lòng chi de mot khuon mat trong khung hinh va thu lai."
      setResponse(errorMessage)
      speakText(errorMessage)
      setIsAnalyzing(false)
      setIsTalking(false)
      return
    }

    try {
      const steps = [
        { progress: 20, message: "Khởi tạo AI Engine..." },
        { progress: 40, message: "Phân tích cấu trúc khuon mat..." },
        { progress: 60, message: "Đánh giá tình trạng da..." },
        { progress: 80, message: "Tạo lộ trình cá nhân hóa..." },
        { progress: 100, message: "Hoàn thành phân tích!" },
      ]
      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setAnalysisProgress(step.progress)
      }
      const analysisResult = getAdvancedAnalysisResponse()
      setResponse(`${analysisResult.title}\n\n${analysisResult.content}`)
      speakText(analysisResult.content)
    } catch (error) {
      console.error("Face analysis error:", error)
      const errorMessage = "Xin loi, tôi không thể phân tích khuon mat cua ban luc nay. Vui lòng thu lai."
      setResponse(errorMessage)
      speakText(errorMessage)
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const handleVoice = () => {
    if (!isSupported) {
      setError("Trình duyệt không hỗ trợ nhận dạng giọng nói")
      return
    }
    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = "vi-VN"
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onstart = () => {
        setIsListening(true)
        setText("")
        setError("")
      }
      recognition.onresult = async (event) => {
        const spokenText = event.results[0][0].transcript
        setText(spokenText)
        setIsListening(false)
        const genericReplies = [
          `Tôi đã nghe bạn nói: "${spokenText}". Tôi có thể giúp gì cho bạn về phân tích khuon mat AI?`,
          `Cảm ơn bạn đã nói: "${spokenText}". Hãy để tôi giúp bạn khám phá công nghệ làm đẹp cá nhân hóa!`,
          `Bạn vừa nói: "${spokenText}". Tôi sẵn sàng cung cấp thông tin chi tiết về làn da của bạn.`,
          `Rất vui được nghe bạn nói: "${spokenText}". Hãy cùng tôi tìm hiểu về làn da của bạn nhé!`,
        ]
        const responses = {
          "xin chào":
            "Xin chào! Tôi là trợ lý AI phân tích khuon mat thế hệ mới với công nghệ Machine Learning tiên tiến. Tôi có thể phân tích 127 điểm trên khuon mat và đưa ra lộ trình chăm sóc cá nhân hóa!",
          "phân tích":
            "Tuyệt vời! Hệ thống AI của tôi sử dụng Computer Vision và Deep Learning để phân tích khuon mat với độ chính xác 99.7%. Hãy nhấn 'Bắt đầu quét mặt' để trải nghiệm công nghệ tương lai!",
          "chăm sóc da":
            "Tôi áp dụng thuật toán AI tiên tiến để tạo ra lộ trình chăm sóc da cá nhân hóa, kết hợp công nghệ Nanotechnology, Peptide Engineering và Microbiome Optimization. Bạn muốn khám phá không?",
          "công nghệ":
            "Tôi được trang bị: Neural Networks cho pattern recognition, Computer Vision cho facial analysis, NLP cho giao tiếp tự nhiên, và IoT integration cho smart skincare ecosystem!",
          "cảm ơn":
            "Không có gì! Tôi luôn sẵn sàng ứng dụng AI và công nghệ tiên tiến để giúp bạn có làn da đẹp nhất. Hãy cùng khám phá tương lai của beauty tech!",
        }
        const lowerMessage = spokenText.toLowerCase()
        let reply = genericReplies[Math.floor(Math.random() * genericReplies.length)] // Default to a random generic reply
        for (const [keyword, response] of Object.entries(responses)) {
          if (lowerMessage.includes(keyword)) {
            reply = response
            break
          }
        }
        setResponse(reply)
        speakText(reply)
      }
      recognition.onerror = (event) => {
        setIsListening(false)
        setError(`Lỗi nhận dạng: ${event.error}`)
      }
      recognition.onend = () => {
        setIsListening(false)
      }
      recognition.start()
    } catch (error) {
      setError("Không thể khởi tạo nhận dạng giọng nói")
    }
  }

  // Improved speech function
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return
    speechSynthesis.cancel()
    speakingCancelledRef.current = false // Reset on new speech request
    setIsTalking(true)
    // Clean text more thoroughly
    const cleanText = text
      .replace(/[🌟💧😊🎯✨🔍🌸💆‍♀️🥗💤💪🧬🔬📊⚡🎨🚀🤖📈🔮🎭🏗️💎🌈🌍📱🏆]/gu, "")
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\*/g, "")
      .replace(/•/g, "")
      .replace(/:/g, ".")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim()
    // Split into smaller sentences (max 100 characters each)
    const sentences = cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const chunks = []
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim()
      if (trimmed.length <= 100) {
        chunks.push(trimmed)
      } else {
        // Split long sentences by commas or spaces
        const parts = trimmed.split(/[,;]/)
        parts.forEach((part) => {
          if (part.trim().length > 0) {
            chunks.push(part.trim())
          }
        })
      }
    })
    let currentIndex = 0
    const speakNext = () => {
      if (speakingCancelledRef.current) {
        // Check if speaking was cancelled [^3]
        setIsTalking(false) // Ensure talking state is false
        return
      }
      if (currentIndex >= chunks.length) {
        setIsTalking(false)
        return
      }
      const chunk = chunks[currentIndex]
      if (!chunk || chunk.length === 0) {
        currentIndex++
        setTimeout(speakNext, 50)
        return
      }
      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = "vi-VN"
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = 0.9
      utterance.onend = () => {
        currentIndex++
        setTimeout(speakNext, 200) // Longer pause between chunks
      }
      utterance.onerror = (event) => {
        console.error("Speech error:", event)
        currentIndex++
        setTimeout(speakNext, 100)
      }
      try {
        speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Speech synthesis error:", error)
        currentIndex++
        setTimeout(speakNext, 100)
      }
    }
    speakNext()
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      speakingCancelledRef.current = true // Set cancellation flag [^1]
      setIsTalking(false)
    }
  }

  const resetAnalysis = () => {
    setCapturedImage(null)
    setResponse("")
    setText("")
    setError("")
    setAnalysisProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 pt-16 mt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Beauty Analyst 4.0
            </h1>
            <div className="p-3 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm công nghệ phân tích khuon mat AI tiên tiến với Machine Learning, Computer Vision và lộ trình
            chăm sóc cá nhân hóa
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-3 py-1">
              <Target className="w-4 h-4 mr-1" />
              99.7% Accuracy
            </Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 px-3 py-1">
              <Heart className="w-4 h-4 mr-1" />
              Personalized
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* 3D Scene */}
          <div className="xl:col-span-3">
            <Card className="p-6 h-[600px] bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 shadow-2xl">
              <Canvas
                camera={{ position: [0, 2, 5], fov: 60 }}
                shadows
                className="rounded-lg"
                gl={{ antialias: true, alpha: true }}
              >
                <Scene isTalking={isTalking} isAnalyzing={isAnalyzing} />
                <OrbitControls
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  minDistance={3}
                  maxDistance={8}
                  autoRotate={!isTalking && !isAnalyzing}
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            </Card>
          </div>
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Face Analysis Controls */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Eye className="w-5 h-5" />
                  Phân Tích Khuôn Mặt AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showCamera && !capturedImage && (
                  <Button
                    onClick={startCamera}
                    disabled={isAnalyzing || !modelsLoadedRef.current} // Disable if models not loaded
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />🔥 Bắt Đầu Laser Quét 3D
                  </Button>
                )}
                {showCamera && (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg border-2 border-cyan-300 transform scale-x-[-1] shadow-lg"
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            videoRef.current.play()
                          }
                        }}
                      />
                      <LaserScanner isScanning={isScanning} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 shadow-[0_0_10px_#00ffff]"
                      >
                        <Camera className="w-4 h-4 mr-2" />⚡ Chụp Laser
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
                {capturedImage && (
                  <div className="space-y-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured face"
                      className="w-full rounded-lg border-2 border-green-300 transform scale-x-[-1] shadow-lg"
                    />
                    <Button onClick={resetAnalysis} variant="outline" className="w-full bg-transparent">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Chụp Lại
                    </Button>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center mb-3">
                      <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                      <span className="text-blue-700 font-medium">🔍 Đang phân tích với AI...</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full h-2" />
                    <p className="text-sm text-blue-600 mt-2 text-center">{analysisProgress}% hoàn thành</p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Voice Controls */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Mic className="w-5 h-5" />
                  Điều Khiển Giọng Nói AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleVoice}
                  disabled={isListening || isTalking || isAnalyzing}
                  className={`w-full h-12 font-semibold shadow-lg ${isListening ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"}`}
                  size="lg"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2 animate-pulse" />🎤 Đang Nghe AI...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      🗣️ Nói Chuyện Với AI
                    </>
                  )}
                </Button>
                {isTalking && (
                  <Button onClick={stopSpeaking} variant="outline" className="w-full h-12 bg-transparent" size="lg">
                    <VolumeX className="w-5 h-5 mr-2" />🔇 Dừng AI Nói
                  </Button>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Status */}
            <Card className="border-2 border-slate-200 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <Shield className="w-5 h-5" />
                  Trạng Thái Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Laser Scanner:</span>
                  <Badge
                    variant={isScanning ? "default" : "secondary"}
                    className={isScanning ? "bg-cyan-100 text-cyan-700" : ""}
                  >
                    {isScanning ? "🔍 Đang quét" : "⏸️ Tắt"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Phân tích AI:</span>
                  <Badge
                    variant={isAnalyzing ? "default" : "secondary"}
                    className={isAnalyzing ? "bg-blue-100 text-blue-700" : ""}
                  >
                    {isAnalyzing ? "🔍 Đang xử lý" : "⏸️ Chờ"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">AI Đang nói:</span>
                  <Badge
                    variant={isTalking ? "default" : "secondary"}
                    className={isTalking ? "bg-purple-100 text-purple-700" : ""}
                  >
                    {isTalking ? "🔊 Có" : "🔇 Không"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Lightbulb className="w-5 h-5" />
                  Tính Năng Nâng Cao
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Theo dõi tiến trình
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Đặt mục tiêu làm đẹp
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Lưu kết quả yêu thích
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Analysis Results */}
        <Card className="mt-6 border-2 border-indigo-200 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 text-xl">
              <Brain className="w-6 h-6" />
              Kết Quả Phân Tích AI Chi Tiết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {text && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-xs font-semibold text-blue-700 mb-1">BẠN NÓI:</p>
                  <p className="text-sm text-slate-800">{text}</p>
                </div>
              )}
              {response && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-xs font-semibold text-green-700 mb-2">AI PHÂN TÍCH:</p>
                  <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">{response}</div>
                </div>
              )}
              {!text && !response && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-500 italic">
                    Chưa có phân tích nào. Hãy bắt đầu laser quét mặt hoặc nói chuyện với AI!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
