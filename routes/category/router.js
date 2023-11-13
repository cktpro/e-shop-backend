var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getDetail,getList,search,create,update,softDelete,createVarian}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema,validationVarianSchema} =require('./validation')

// GET LIST & CREATE LIST
router.route('/')
.get(getList)
.post(validateSchema(validationCreateSchema),create)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.route('/varian')
.post(validateSchema(validationVarianSchema),createVarian)
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put( validateSchema(checkIdSchema),validateSchema(validationCreateSchema), update)

router.patch('/delete/:id', softDelete);

module.exports= router
