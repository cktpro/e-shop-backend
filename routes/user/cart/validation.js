const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validationCreateSchema = yup.object().shape({
  body: yup.object({
        productId: yup
          .string()
          .test("validationProductID", "ID sai định dạng", (value) => {
            return ObjectId.isValid(value);
          }),
        quantity: yup.number().required().min(0),


      }
    
  ),
})
const validationUpdateSchema = yup.object().shape({
  body: yup.object({
        quantity: yup.number().required().min(0),


      }
    
  ),
})


module.exports = {
  validationCreateSchema,
  validationUpdateSchema
};
