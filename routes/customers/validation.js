const yup = require("yup");
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    firstName: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    lastName: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    // phoneNumber: yup.string().max(50, ({ path }) => `${path.split(".")[1]} quá dài`).matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
    // address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    password: yup
      .string()
      .min(3, ({ path }) => `${path.split(".")[1]} quá ngắn`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    birthday: yup.date().max(new Date(), "Ngày sinh không hợp lệ"),
    isDeleted: yup.boolean(),
  }),
});
const validationUpdateSchema = yup.object().shape({
  body: yup.object({
    firstName: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    lastName: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    phoneNumber: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ"),
    // address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    birthday: yup.date().max(new Date(), "Ngày sinh không hợp lệ"),
    isDeleted: yup.boolean(),
  }),
});
const validationPasswordSchema = yup.object().shape({
  body: yup.object({
    currentPassword: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    newPassword: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    confirmPassword: yup
      .string()
      .min(6, ({ path }) => `${path.split(".")[1]} quá ngắn`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`)
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
  }),
});
const validationAddressSchema = yup.object().shape({
  body: yup.object({
    customerId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    provinceId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    provinceName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    // address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    districtId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    districtName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    wardId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    wardName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    streetAddress: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
const validationUpdateAddressSchema = yup.object().shape({
  body: yup.object({
    provinceId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    provinceName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    // address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    districtId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    districtName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    wardId: yup
      .string()
      .max(50, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    wardName: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    streetAddress: yup
      .string()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
module.exports = {
  validationCreateSchema,
  validationAddressSchema,
  validationUpdateSchema,
  validationUpdateAddressSchema,
  validationPasswordSchema,
};
