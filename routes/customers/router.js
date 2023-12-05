var express = require('express');
const passport = require('passport');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {createGoogle, getDetail,getList,search,create,update,softDelete,get_address,create_address,update_address,delete_address,change_password}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema,validationAddressSchema,validationPasswordSchema,validationUpdateAddressSchema,validationUpdateSchema} =require('./validation')
// const {
//   passportVerifyTokenAdmin,
// } = require('../../middlewares/passportAdmin');

// passport.use('jwtAdmin', passportVerifyTokenAdmin);
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
// Password
router.post("/change-password/:id",validateSchema(validationPasswordSchema),change_password)

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
