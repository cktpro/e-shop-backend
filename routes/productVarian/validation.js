const yup = require("yup");
const validationVarianSchema = yup.object().shape({
  body: yup.object({
    productId: yup
      .string()
      // .test("validationProductID", "ID sai định dạng", (value) => {
      //   return ObjectId.isValid(value);
      // })
      .required("ID sản phẩm không được để trống"),
    SKU: yup
      .string()
      .max(20, "SKU phẩm quá dài")
      .required("SKU không được bỏ trống"),
    price: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    stock: yup
      .number()
      .min(0)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
module.exports = {
  validationVarianSchema,
};
