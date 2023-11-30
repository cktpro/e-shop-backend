const yup = require("yup");
const ObjectId = require('mongodb').ObjectId;

const getDetailSchema = yup.object({
  query: yup.object({
    productId: yup.string().test('validationID', 'invalid ID', (value) => {
      return ObjectId.isValid(value);
    }),
  }),
});

const validationCreateSchema = yup.object().shape({
  body: yup.array().of(
    yup.object().shape({
      productId: yup.string().test('validationID', 'invalid ID', (value) => {
        return ObjectId.isValid(value);
      }),

      discount: yup.number().min(0, "Discount cannot be negative").max(100, "Discount is too big").integer().required(({ path }) => `${path.split(".")[1]} is required`),

      flashsaleStock: yup.number().min(0, "Invalid stock").integer().required(({ path }) => `${path.split(".")[1]} is required`),
    })
  ),
});

module.exports = {
  validationCreateSchema,
  getDetailSchema,
};
