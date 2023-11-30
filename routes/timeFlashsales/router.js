var express = require('express');
var router = express.Router();

const { validateSchema } = require('../../helper');
const { create, checkFlashsale } = require('./controller')
const { validationCreateSchema } = require('./validation')

router.route('/')
  .get(checkFlashsale)
  .post(validateSchema(validationCreateSchema), create)

module.exports = router
