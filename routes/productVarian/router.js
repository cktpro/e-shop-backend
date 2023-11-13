var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getDetail,getList,search,create,update,softDelete,create_varian}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationVarianSchema} =require('./validation')

// GET LIST & CREATE LIST
router.route('/')
.get(getList)
.post(validateSchema(validationVarianSchema),create)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.post("/create_varian",create_varian)
router.put("/:id",update)
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  
  // .patch(updatePatch)
  // .delete(hardDelete)

router.patch('/delete/:id',softDelete);

module.exports= router
