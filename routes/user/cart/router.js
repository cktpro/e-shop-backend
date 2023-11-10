var express = require("express");
var router = express.Router();
const { validateSchema } = require("../../../helper");
const {
  getList,
  search,
  create,
  update,
  softDelete,
} = require("./controller");
const checkIdSchema = require("../../validationId");
const { validationCreateSchema,validationUpdateSchema } = require("./validation");
const {Authorization} =require("../../../helper/jwtHelper")

// GET LIST & CREATE LIST
router
  .route("/")
  .get(Authorization(),getList)
  // .post(validateSchema(validationCreateSchema), create);
  .post(Authorization(),validateSchema(validationCreateSchema), create)
  .put(Authorization(),validateSchema(validationUpdateSchema),update)
router.delete("/:id",Authorization(),validateSchema(checkIdSchema),softDelete)
// SEARCH LIST
router.get("/search", search);
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
