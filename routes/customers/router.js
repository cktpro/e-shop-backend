var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {createGoogle, getDetail,getList,search,create,update,softDelete,get_address,create_address,update_address,delete_address}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema,validationAddressSchema,validationUpdateAddressSchema,validationUpdateSchema} =require('./validation')
const {Authorization} =require('../../helper/jwtHelper')

// GET LIST & CREATE LIST
router.route('/create-google')
.post(createGoogle)

router.route('/')
.get(getList)
.post(validateSchema(validationCreateSchema),create)
// Address
router.route('/address')
.get(get_address)
.post(validateSchema(validationAddressSchema),create_address)

router.route('/address/:id')
.put(validateSchema(checkIdSchema),validateSchema(validationUpdateAddressSchema),update_address)
.delete(delete_address)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put( validateSchema(checkIdSchema),validateSchema(validationUpdateSchema), update)

router.patch('/delete/:id', softDelete);

module.exports= router
