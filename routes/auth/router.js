var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {checkLogin,basicLogin,getMe, checkRefreshToken}=require('./controller')
const passport = require('passport');
const {validationLoginSchema,validationRefreshTokenSchema} =require('./validation')
const {Authorization} =require('../../helper/jwtHelper')

const {
  passportVerifyTokenUser,
  passportVerifyAccountUser,
} = require('../../middlewares/passportUser');

passport.use('jwtUser', passportVerifyTokenUser);
passport.use('localUser', passportVerifyAccountUser);

// LOGIN
router.route('/login')
  .post(
    validateSchema(validationLoginSchema),
    checkLogin,
  );
  router.route('/basic')
  .post(
    passport.authenticate('basic', { session: false }),
    basicLogin
  );
  router.route('/checkrefreshtoken')
  .post(
    validateSchema(validationRefreshTokenSchema),
    checkRefreshToken
  );

router.route('/profile')
  .get(
    passport.authenticate('jwtUser', { session: false }),
    getMe,
  );

module.exports= router
