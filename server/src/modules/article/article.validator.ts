import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = () =>
  yup
    .string()
    .matches(objectIdRegex, "Giá trị phải là ObjectId hợp lệ")
    .required("Trường này là bắt buộc");

export const createArticleLessonSchema = yup
  .object({
    courseId: objectIdSchema().label("courseId"),
    sectionId: objectIdSchema().label("sectionId"),
    title: yup.string().trim().min(3).max(255).required("Tiêu đề là bắt buộc"),
    description: yup.string().trim().max(2000).optional(),
    content: yup.string().trim().min(20, "Nội dung tối thiểu 20 ký tự").required("Nội dung là bắt buộc"),
    readingTime: yup
      .number()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string" && originalValue.trim() === "") {
          return undefined;
        }
        return value;
      })
      .integer("Thời lượng đọc phải là số nguyên")
      .min(1, "Thời lượng đọc tối thiểu 1 phút")
      .max(240, "Thời lượng đọc tối đa 240 phút")
      .optional(),
    order: yup
      .number()
      .integer("Thứ tự phải là số nguyên")
      .min(1, "Thứ tự tối thiểu là 1")
      .optional(),
    isFree: yup.boolean().default(false),
    isPublished: yup.boolean().default(false),
    isPreviewed: yup.boolean().default(false),
  })
  .noUnknown(true, "Payload chứa trường không hợp lệ")
  .strict(false);

export const updateArticleLessonSchema = yup
  .object({
    title: yup.string().trim().min(3).max(255).optional(),
    description: yup.string().trim().max(2000).optional(),
    content: yup.string().trim().min(20, "Nội dung tối thiểu 20 ký tự").optional(),
    readingTime: yup
      .number()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string" && originalValue.trim() === "") {
          return undefined;
        }
        return value;
      })
      .integer("Thời lượng đọc phải là số nguyên")
      .min(1, "Thời lượng đọc tối thiểu 1 phút")
      .max(240, "Thời lượng đọc tối đa 240 phút")
      .optional(),
    order: yup
      .number()
      .integer("Thứ tự phải là số nguyên")
      .min(1, "Thứ tự tối thiểu là 1")
      .optional(),
    isFree: yup.boolean().optional(),
    isPublished: yup.boolean().optional(),
    isPreviewed: yup.boolean().optional(),
  })
  .noUnknown(true, "Payload chứa trường không hợp lệ")
  .strict(false)
  .test(
    "at-least-one",
    "Phải cung cấp ít nhất một trường để cập nhật",
    (value) => !!value && Object.keys(value).length > 0
  );

export type CreateArticleLessonPayload = yup.InferType<typeof createArticleLessonSchema>;
export type UpdateArticleLessonPayload = yup.InferType<typeof updateArticleLessonSchema>;
