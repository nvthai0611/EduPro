import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">KINH PHÍ HẠN HẸP NHƯNG LẠI MUỐN DA ĐẸP</h1>
            <p className="text-lg md:text-xl">SỮA RỬA MẶT CHẤT LƯỢNG</p>
            <button onClick={() => {
              navigate(`/shop/685d6119bbf20e8cd1ef5391`)
              window.scrollTo(0, 'smooth')
            }} className="bg-white text-red-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition">
              Mua ngay
            </button>
          </div>
          <div className="relative  top-10 left-10 h-full">
            <img
              src="https://res.cloudinary.com/dgqkmqkdz/image/upload/v1753463643/WDP_SpaBooking/iqhw8xskqrc5cidoir1i.jpg"
              alt="Glanzen Hair Product"
              className="w-6/12/12 object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  )
}
