var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getDetail,getList,search,create,update,softDelete,get_address,create_address,update_address,delete_address}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema,validationAddressSchema,validationUpdateAddressSchema} =require('./validation')
const {Authorization} =require('../../helper/jwtHelper')

// GET LIST & CREATE LIST
router.route('/')
.get(getList)
.post(validateSchema(validationCreateSchema),create)
// Address
router.route('/address')
.get(Authorization(),get_address)
.post(Authorization(),validateSchema(validationAddressSchema),create_address)

router.route('/address/:id')
.put(Authorization(),validateSchema(checkIdSchema),validateSchema(validationUpdateAddressSchema),update_address)
.delete(Authorization(),delete_address)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put( validateSchema(checkIdSchema),validateSchema(validationCreateSchema), update)

router.patch('/delete/:id', softDelete);

module.exports= router
