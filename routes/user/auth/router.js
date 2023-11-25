var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../../helper');
const {login,getMe, checkRefreshToken}=require('./controller')
const passport = require('passport');
const {validationLoginSchema,validationRefreshTokenSchema} =require('./validation')
const {validationCreateSchema} = require('../../customers/validation')
const {create} = require('../../customers/controller')
const {Authorization} =require('../../../helper/jwtHelper')
// LOGIN
router.route('/login')
  .post(
    validateSchema(validationLoginSchema),
    login,
  );
  router.route('/register')
  .post(
    validateSchema(validationCreateSchema),
    create,
  );
  // router.route('/basic')
  // .post(
  //   passport.authenticate('basic', { session: false }),
  //   basicLogin
  // );
  router.route('/check_refresh_token')
  .post(
    validateSchema(validationRefreshTokenSchema),
    checkRefreshToken
  );

router.route('/get_profile')
  .get(
    getMe,
  );

module.exports= router
