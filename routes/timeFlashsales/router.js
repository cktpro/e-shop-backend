var express = require('express');
var router = express.Router();

const { validateSchema } = require('../../helper');
const { create, checkFlashsale } = require('./controller')
const checkIdSchema = require('../validationId')
// const { validationCreateSchema, getDetailSchema } = require('./validation')

router.route('/')
  .get(checkFlashsale)
  .post(create)

module.exports = router
