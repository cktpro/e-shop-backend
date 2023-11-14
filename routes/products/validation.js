const yup = require("yup");
const validationSchema = yup.object().shape({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên sản phẩm quá dài")
      .required("Tên không được bỏ trống"),
    price: yup
      .number()
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    stock: yup
      .number()
      .min(0, "Stock không thể âm")
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    discount: yup
      .number()
      .min(0, "Giảm giá không thể âm")
      .max(75, "Giảm giá quá lớn")
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    description: yup
      .string()
      .max(3000, "Mô tả quá dài")
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    categoryId: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    supplierId: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    width: yup
      .number()
      .min(0, ({ path }) => `${path.split(".")[1]} must be greater than 0`)
      .required(({ path }) => `${path.split(".")[1]} is required`),
    height: yup
      .number()
      .min(0, ({ path }) => `${path.split(".")[1]} must be greater than 0`)
      .required(({ path }) => `${path.split(".")[1]} is required`),
    length: yup
      .number()
      .min(0, ({ path }) => `${path.split(".")[1]} must be greater than 0`)
      .required(({ path }) => `${path.split(".")[1]} is required`),
    weight: yup
      .number()
      .min(0, ({ path }) => `${path.split(".")[1]} must be greater than 0`)
      .required(({ path }) => `${path.split(".")[1]} is required`),
    isDeleted: yup.boolean(),
  }),
});

module.exports = {
  validationSchema,
};
