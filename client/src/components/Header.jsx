"use client"

import { ArrowLeft, User } from "lucide-react"

// eslint-disable-next-line react/prop-types
const Header = ({ onBackToOutline }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToOutline}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Quay lại tổng quan khóa học"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-sm font-bold">
              F8
            </div>
            <span className="font-semibold text-lg">Fullstack NodeJS</span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-200">Văn Tiến Hải Nguyễn</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
