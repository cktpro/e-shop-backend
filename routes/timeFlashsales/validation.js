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
  body: yup.object(
    {
      expirationTime: yup.date().required("expirationTime is required"),

      isOpenFlashsale: yup.boolean().required("isOpenFlashsale is required"),
    }
  ),
});

module.exports = {
  validationCreateSchema,
  getDetailSchema,
};
