var express = require("express");
var router = express.Router();
const { validateSchema } = require("../../../helper");
const {
  getList,
  // search,
  create,
  update,
  softDelete,
  deleteCart,
  getListFlashsale,
} = require("./controller");
const checkIdSchema = require("../../validationId");
const { validationCreateSchema, validationUpdateSchema } = require("./validation");

router.route("/get-cart-flashsale")
  .get(getListFlashsale),

// GET LIST & CREATE LIST
router
  .route("/")
  .get(getList)
  // .post(validateSchema(validationCreateSchema), create);
  .post(validateSchema(validationCreateSchema), create)
  .put(validateSchema(validationUpdateSchema), update)
  .delete(deleteCart)
router.delete("/:id", validateSchema(checkIdSchema), softDelete)
// SEARCH LIST
// router.get("/search", search);
// GET DETAIL UPDATE DELETE
// router
//   .route("/:id")
//   .get(validateSchema(checkIdSchema), getDetail)
// .put(
//   validateSchema(checkIdSchema),
//   validateSchema(validationCreateSchema),
//   update
// );



module.exports = router;
