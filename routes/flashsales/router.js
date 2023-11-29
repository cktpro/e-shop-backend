var express = require('express');
var router = express.Router();

const { validateSchema } = require('../../helper');
const { getAll, create, checkFlashsale } = require('./controller')
const checkIdSchema = require('../validationId')
const { validationCreateSchema, getDetailSchema } = require('./validation')

router.route('/check-flashsale')
  .get(validateSchema(getDetailSchema), checkFlashsale)
router.route('/')
  .get(getAll)
  .post(validateSchema(validationCreateSchema), create)

module.exports = router
