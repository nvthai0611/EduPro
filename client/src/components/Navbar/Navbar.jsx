T     )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium bg-white border-t border-gray-200">
            {/* Search Bar - Mobile */}
            <div className="py-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900 mb-3 px-2">👤 {user?.name}</div>
                  {USER_MENU_ITEMS.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => openModal(item.path.replace("/", ""))}
                      className="flex items-center py-2 px-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors w-full text-left"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center py-2 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors w-full text-left"
                  >
                    <span className="mr-3 text-base">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <a
                  href={import.meta.env.VITE_SERVER_API_V1 + "/auth/google"}
                  className="block px-4 py-2 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-50 text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t("login")}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Thêm Modal Dialog */}
      <Dialog open={!!activeModal} onOpenChange={closeModal}>
        <DialogContent describedby="" className="max-w-7xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {activeModal === "history" && "Lịch sử làm đẹp"}
              {activeModal === "offers" && "Ưu đãi của bạn"}
              {activeModal === "skincare-tips" && "Bí kíp chăm sóc da"}
              {/* {activeModal === "orders" && "Đơn hàng đã mua"} */}
              {activeModal === "user-profile" && "Thông tin tài khoản"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[90vh] p-6">
            {activeModal === "history" && <HistoryPage bookings={bookings} closeModal={closeModal} />}
            {activeModal === "offers" && <OffersPage />}
            {activeModal === "skincare-tips" && <SkincareTipsPage />}
            {/* {activeModal === "orders" && <OrdersPage />} */}
            {activeModal === "user-profile" && (
              <UserProfileModal
                isOpen={activeModal === "user-profile"}
                onClose={closeModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Navbar;
