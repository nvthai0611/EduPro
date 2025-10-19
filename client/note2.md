bug check số lần lịch hẹn


              <div className="text-center mb-6">
                <h2 className="font-medium text-gray-900 mb-4">
                  MỜI ANH ĐÁNH GIÁ TRẢI NGHIỆM DỊCH VỤ TẠI SpaConnect SPA
                </h2>
                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="p-1 bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
                {rating > 0 && <p className="text-xl text-gray-600 mb-6">{getRatingMessage(rating)}</p>}
              </div>