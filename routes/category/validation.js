const yup = require("yup");
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên quá dài")
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    description: yup.string().max(500, "Mô tả quá dài"),
    isDeleted: yup.boolean(),
  }),
});
const validationVarianSchema = yup.object().shape({
  body: yup.object({
    categoryId: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    name: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    valueOption: yup.array().of(
      yup.object().shape({
        value: yup.string().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

      })
    ),
  }),
});
module.exports = {
  validationCreateSchema,
  validationVarianSchema
};
