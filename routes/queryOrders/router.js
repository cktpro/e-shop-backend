var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getRevenue, getOrder}=require('./controller')

router.route('/getRevenue')
.get(getRevenue)

router.route('/getOrder')
.get(getOrder)


module.exports= router
