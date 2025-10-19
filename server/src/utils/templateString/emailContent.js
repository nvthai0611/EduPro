const dayjs = require('dayjs');
module.exports = {
    //   Email content for booking details
    //   Booking props:
    //   customerName: string
    //   customerPhone: string
    //   customerEmail: string
    //   services: string, VD: "Dịch vụ 1, Dịch vụ 2, Dịch vụ 3"
    //   dateTime: string, VD: "01/01/2025"
    //   startTime: string, VD: "10:00"
    //   duration: number, VD: 60
    //   totalPrice: string, format lại thành VNĐ VD: 100.000 VNĐ
    //   totalDiscount: string, format lại thành VNĐ VD: 100.000 VNĐ
    //   totalPay: string, format lại thành VNĐ VD: 90.000 VNĐ
    //   status: string,
    //   notes: string
    //   branchAddress: string, gộp từ address, ward, district, city VD: "123 Đường ABC, Quận XYZ, TP. HCM"

    getBookingDetailsEmailContent: (booking) => {
        return `<!DOCTYPE html>
  <html lang="vi">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chi tiết đặt lịch Spa</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
              <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                                  🌸 Haeispa 🌸
                              </h1>
                              <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                                  Thông tin chi tiết đặt lịch dịch vụ
                              </p>
                          </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                          <td style="padding: 40px 30px;">
                              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                                  Xin chào ${booking.customerName},
                              </h2>
                              
                              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                  Đây là thông tin chi tiết về lịch hẹn của bạn tại spa của chúng tôi:
                              </p>

                              <!-- Booking Details -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                                  <tr>
                                      <td style="padding: 25px;">
                                          <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                              📋 Thông tin đặt lịch
                                          </h3>
                                          
                                          <table width="100%" cellpadding="8" cellspacing="0">
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Dịch vụ:</td>
                                                  <td style="color: #333;">${booking.services
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Ngày:</td>
                                                  <td style="color: #333;">${booking.dateTime
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Thời gian bắt đầu:</td>
                                                  <td style="color: #333;">${booking.startTime
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Thời lượng dự kiến:</td>
                                                  <td style="color: #333;">${booking.duration
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Tổng tiền dịch vụ:</td>
                                                  <td style="color: #808080; font-weight: bold; font-size: 18px;">${booking.totalPrice
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Giảm giá:</td>
                                                  <td style="color: #e74c3c; font-weight: bold; font-size: 18px;">-${booking.totalDiscount
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Tổng tiền:</td>
                                                  <td style="color: #333; font-weight: bold; font-size: 18px;">${booking.totalPay
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Trạng thái:</td>
                                                  <td>
                                                      <span style="background-color: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                                                          ${booking.status}
                                                      </span>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>

                              <!-- Customer Info -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f4fd; border-radius: 8px; margin-bottom: 30px;">
                                  <tr>
                                      <td style="padding: 25px;">
                                          <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                              👤 Thông tin khách hàng
                                          </h3>
                                          
                                          <table width="100%" cellpadding="8" cellspacing="0">
                                              <tr>
                                                  <td style="color: #666; font-weight: bold; width: 40%;">Họ tên:</td>
                                                  <td style="color: #333;">${booking.customerName
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Số điện thoại:</td>
                                                  <td style="color: #333;">${booking.customerPhone
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Email:</td>
                                                  <td style="color: #333;">${booking.customerEmail
            }</td>
                                              </tr>
                                              <tr>
                                                  <td style="color: #666; font-weight: bold;">Ghi chú:</td>
                                                  <td style="color: #333;">${booking.notes || "Không có"
            }</td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>

                              <!-- Contact Info -->
                              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; text-align: center;">
                                  <h4 style="color: #333; margin: 0 0 15px 0;">Liên hệ với chúng tôi</h4>
                                  <p style="color: #666; margin: 5px 0;">
                                      📞 Hotline: <strong>1900 1234</strong>
                                  </p>
                                  <p style="color: #666; margin: 5px 0;">
                                      📧 Email: <strong>booking@spaconnect.com</strong>
                                  </p>
                                  <p style="color: #666; margin: 5px 0;">
                                      📍 Địa chỉ: <strong>${booking.branchAddress
            }</strong>
                                  </p>
                              </div>
                          </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                          <td style="background-color: #333; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
                              <p style="color: white; margin: 0; font-size: 14px;">
                                  © 2025 Haeispa. Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;
    },

    getBookingReminderEmailHTML: (booking) => {
        return `<!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nhắc nhở lịch hẹn</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 10px;
            width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #ff8259;
            color: white;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .content {
            padding: 24px;
            color: #333;
          }
          .info {
            background-color: #f2f2f2;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #999;
            padding: 12px;
            background-color: #fafafa;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Nhắc nhở lịch hẹn</h1>
        </div>
        <div class="content">
          <p>Chào <strong>${booking.customerName || "bạn"}</strong>,</p>
          <p>Bạn có lịch hẹn tại spa với thông tin sau:</p>
  
          <div class="info">
            <p><strong>⏰ Thời gian:</strong><br/> ${new Date(booking.dateTime).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
            
            ${booking.branchName ? `<p><strong>📍 Chi nhánh:</strong><br/> ${booking.branchName}</p>` : ""}
          </div>
  
          <p style="margin-top: 24px;">
            Vui lòng đến đúng giờ để được phục vụ tốt nhất. Nếu bạn cần hỗ trợ thay đổi lịch hẹn, liên hệ ngay với chúng tôi qua số: <a href="tel:${booking.phone}" style="color: #ff8259;">${booking.phone}</a>.
          </p>
        </div>
        <div class="footer">
          © 2025 Spa Booking. Hẹn gặp bạn sớm!
        </div>
      </div>
    </body>
    </html>`
    },

    sendOTPFormat: (OTP, expiryTime) => {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã Xác Minh OTP của bạn</title>
    <style type="text/css">
        /* Reset CSS */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        /* Global Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            font-family: 'Arial', sans-serif;
            color: #333333;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7f6;
            padding-bottom: 60px;
        }
        .main-content {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin: 0 auto;
            max-width: 600px;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #2196F3; /* Blue */
            padding: 30px 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            color: #ffffff;
            font-weight: bold;
        }
        .body-content {
            padding: 30px 40px;
            line-height: 1.6;
            font-size: 16px;
        }
        .otp-box {
            background-color: #e3f2fd; /* Light Blue */
            border: 1px solid #90CAF9; /* Medium Blue */
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1976D2; /* Darker Blue */
            letter-spacing: 5px;
            display: block;
            padding: 10px 0;
        }
        .instruction {
            font-size: 15px;
            color: #555555;
            margin-top: 20px;
        }
        .footer {
            padding: 20px 40px;
            text-align: center;
            font-size: 13px;
            color: #888888;
            background-color: #f9f9f9;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border-top: 1px solid #eeeeee;
        }
        .footer a {
            color: #2196F3;
            text-decoration: none;
        }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .main-content {
                width: 100% !important;
                border-radius: 0 !important;
                box-shadow: none !important;
            }
            .header {
                border-radius: 0 !important;
            }
            .body-content, .footer {
                padding: 20px !important;
            }
            .otp-code {
                font-size: 30px !important;
            }
        }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main-content" width="100%" cellpadding="0" cellspacing="0" border="0">
            <!-- Header -->
            <tr>
                <td class="header">
                    <h1>Mã Xác Minh của bạn</h1>
                </td>
            </tr>
            <!-- Body Content -->
            <tr>
                <td class="body-content">
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu mã xác minh một lần OTP để hoàn tất thao tác của mình. Vui lòng sử dụng mã dưới đây:</p>

                    <div class="otp-box">
                        <p style="margin: 0; font-size: 18px; color: #1976D2;">Mã OTP của bạn là:</p>
                        <span class="otp-code">${OTP}</span>
                        <p style="margin: 0; font-size: 14px; color: #555555;">Mã này sẽ hết hạn sau  ${expiryTime} phút.</p>
                    </div>

                    <p class="instruction">
                        Vui lòng nhập mã này vào trang web/ứng dụng để tiếp tục. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                    </p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Spa </p>
                </td>
            </tr>
            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p>&copy; 2025 Spa. Mọi quyền được bảo lưu.</p>
                    <p>
                        <a href="[Liên kết Chính sách bảo mật của bạn]" target="_blank" style="color: #2196F3;">Chính sách bảo mật</a> |
                        <a href="[Liên kết Điều khoản dịch vụ của bạn]" target="_blank" style="color: #2196F3;">Điều khoản dịch vụ</a>
                    </p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`
    },

    couponsGift: (couponCode, bodyContent, userName, discountType, discountValue, expireDate, couponLink) => {
        return `<!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tặng bạn voucher theo chương trình của Spa</title>
    <style>
      body { background: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0; }
      .container { background: #fff; max-width: 500px; margin: 40px auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 32px 0; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { padding: 32px 24px; color: #333; }
      .coupon-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; }
      .coupon-code { font-size: 22px; font-weight: bold; color: #764ba2; letter-spacing: 2px; }
      .expire { color: #e74c3c; font-weight: bold; }
      .footer { background: #f8f9fa; color: #888; text-align: center; padding: 18px; font-size: 14px; }
      .btn {
        display: inline-block;
        margin-top: 18px;
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
        transition: background 0.2s;
      }
      .btn:hover { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎁 Ưu đãi mới của bạn!</h1>
      </div>
      <div class="content">
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>${bodyContent}</p>
        <div class="coupon-box">
          <div class="coupon-code">Mã: ${couponCode}</div>
          <div>Giá trị: <strong>${discountType === 'percentage' ? discountValue + '%' : discountValue.toLocaleString('vi-VN') + ' VNĐ'}</strong></div>
          <div>Hạn sử dụng: <span class="expire">${dayjs(expireDate).format('DD/MM/YYYY')}</span></div>
          <a class="btn" href="${couponLink}" target="_blank">Sử dụng ngay</a>
        </div>
        <p>Hãy sử dụng mã này trước khi hết hạn để nhận ưu đãi từ chúng tôi!</p>
      </div>
      <div class="footer">
        © 2025 Spa Booking. Cảm ơn bạn đã đồng hành cùng chúng tôi!
      </div>
    </div>
  </body>
  </html>`
    },

    generateConfirmPasswordEmail: (email, tempPassword, confirmLink) => {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Xác nhận mật khẩu tạm thời</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2>Xin chào ${email},</h2>
    <p>Bạn đã được cấp một mật khẩu tạm thời để đăng nhập vào hệ thống:</p>
    <p><strong>Mật khẩu tạm thời: ${tempPassword}</strong></p>
    <p>Để kích hoạt mật khẩu này, vui lòng nhấn vào liên kết bên dưới:</p>
    <p><a href="${confirmLink}" style="padding: 10px 20px; background: #4CAF50; color: white; border-radius: 4px; text-decoration: none;">Xác nhận mật khẩu</a></p>
    <p>Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email.</p>
  </div>
</body>
</html>
`;
    },
    sendEmailBanUser: (fullName) => {
        return `
    <!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }
      .header {
        background-color: #f44336;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
        color: #333;
        font-size: 16px;
        line-height: 1.6;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #777;
        background-color: #f1f1f1;
      }
      .highlight {
        font-weight: bold;
        color: #f44336;
      }
      a.button {
        display: inline-block;
        margin-top: 20px;
        background-color: #f44336;
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Tài khoản của bạn đã bị khóa
      </div>
      <div class="content">
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>
          Hệ thống phát hiện bạn đã <span class="highlight">hủy lịch hẹn quá nhiều lần</span> trong thời gian ngắn.
          Vì lý do đảm bảo chất lượng dịch vụ và công bằng với các khách hàng khác, tài khoản của bạn đã bị tạm thời khóa.
        </p>
        <p>
          Để mở khóa tài khoản và tiếp tục sử dụng dịch vụ, vui lòng liên hệ bộ phận
          <strong>Chăm sóc khách hàng</strong> qua hotline hoặc email bên dưới.
        </p>

        <a href="mailto:nguyenbaha0805@gmail.com" class="button">Liên hệ ngay</a>

        <p style="margin-top: 20px;">
          Nếu bạn cho rằng đây là sự nhầm lẫn, hãy phản hồi cho chúng tôi để được hỗ trợ sớm nhất.
        </p>
        <p>Trân trọng,<br />Đội ngũ Spa Booking</p>
      </div>
      <div class="footer">
        📞 Hotline: 0382657962 &nbsp; | &nbsp; ✉ Email: nguyenbaha0805@gmail.com
      </div>
    </div>
  </body>
</html>
`
    }

};
