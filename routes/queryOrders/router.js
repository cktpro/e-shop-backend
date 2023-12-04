var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getRevenue, getOrder,getTotalOrder,getRevenueOfYear}=require('./controller')

router.route('/getRevenue')
.get(getRevenue)

router.route('/getOrder')
.get(getOrder)
router.get("/getTotalOrder",getTotalOrder)
router.get("/getRevenueOfYear",getRevenueOfYear)


module.exports= router
