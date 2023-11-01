const yup = require("yup");
const validationVarianSchema = yup.object().shape({
  body: yup.object({
    productId: yup
      .string()
      // .test("validationProductID", "ID sai định dạng", (value) => {
      //   return ObjectId.isValid(value);
      // })
      .required("ID sản phẩm không được để trống"),
    color: yup
      .string()
      .max(20, "Tên sản phẩm quá dài")
      .required("Tên không được bỏ trống"),
    memory: yup
      .string()
      .max(20, "Tên sản phẩm quá dài")
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    price: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    stock: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    width: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    height: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    weight: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    length: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
module.exports = {
  validationVarianSchema,
};
