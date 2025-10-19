export const COUPON_FORM_ERRORS = {
  CODE_REQUIRED: "Code không được để trống",
  DISCOUNT_REQUIRED: "Giảm giá không được để trống",
  DISCOUNT_GREATER_THAN_0: "Giảm giá phải lớn hơn 0",
  DISCOUNT_LESS_THAN_100: "Giảm giá phải nhỏ hơn 100%", // for percentage type
  DISCOUNT_TYPE_REQUIRED: "Loại giảm giá không được để trống",
  DISCOUNT_TYPE_INVALID: "Loại giảm giá phải là % hoặc cố định",
  START_DATE_REQUIRED: "Ngày bắt đầu không được để trống",
  END_DATE_REQUIRED: "Ngày kết thúc không được để trống",
  MAX_USES_REQUIRED: "Số lần sử dụng tối đa không được để trống",
  MAX_USES_GREATER_THAN_0: "Số lần sử dụng tối đa phải lớn hơn 0",
  MIN_ORDER_AMOUNT_REQUIRED: "Số tiền tối thiểu không được để trống",
  MIN_ORDER_AMOUNT_GREATER_THAN_0: "Số tiền tối thiểu phải lớn hơn 0",
  END_DATE_AFTER_START_DATE: "Ngày kết thúc phải sau ngày bắt đầu",
  END_DATE_TODAY_OR_LATER: "Ngày kết thúc phải là ngày hiện tại hoặc sau ngày hiện tại",
};

export const COUPON_TYPE = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};
