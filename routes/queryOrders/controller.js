const mongoose = require("mongoose");
const {
  Order,
  Product,
  Category,
  Supplier,
  ProductVarians,
} = require("../../models/");
const {
  fuzzySearch, getQueryDateTime,
  // combineObjects,
} = require("../../helper");

module.exports = {
  getRevenue: async (req, res, next) => {
    try {
      let { startDate, endDate } = req.query;
      const conditionFind = getQueryDateTime(startDate, endDate);

      console.log('««««« conditionFind »»»»»', conditionFind.$expr.$and);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: '$orderDetails',
          preserveNullAndEmptyArrays: true,
        })
        // .addFields({
        //   total: {
        //     $sum: {
        //       $divide: [
        //         {
        //           $multiply: [
        //             '$orderDetails.price',
        //             { $subtract: [100, '$orderDetails.discount'] },
        //             '$orderDetails.quantity',
        //           ],
        //         },
        //         100,
        //       ],
        //     },
        //   },
        // })
        .group({
          _id: null,
          total: { $sum: '$totalPrice' },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getOrder: async (req, res, next) => {
    try {
      let { status, startDate, endDate } = req.query;

      let conditionFind = {};

      if (startDate && !endDate) {
        startDate = new Date(startDate);

        conditionFind = {
          ...conditionFind,
          createdDate: { $gte: startDate }
        }
      } else if (!startDate && endDate) {
        // endDate = new Date(endDate);

        const tmpToDate = new Date(endDate);
        const date = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

        conditionFind = {
          ...conditionFind,
          createdDate: { $lte: date },
        }
      } else if (startDate && endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        if (startDate > endDate) {
          return res.send(400, { message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kếu thúc!" });
        }

        // const compareStartDate = { $lte: ['$createdDate', endDate] };
        // const compareEndDate = { $gte: ['$createdDate', startDate] };

        // conditionFind.$expr = { $and: [compareStartDate, compareEndDate] };

        conditionFind = getQueryDateTime(startDate, endDate);

        console.log('««««« conditionFind »»»»»', conditionFind.$expr.$and);
      }

      if (status) {
        conditionFind = {
          ...conditionFind,
          status: status
        }
      }

      console.log('««««« conditionFind »»»»»', conditionFind);

      let doQuery = await Order.aggregate()
        .lookup({
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        })
        .unwind('customer')
        .unwind({
          path: '$orderDetails',
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: 'products',
          localField: 'orderDetails.productId',
          foreignField: '_id',
          as: 'orderDetails.product',
        })
        .unwind('orderDetails.product')
        .lookup({
          from: 'media',
          localField: 'orderDetails.product.coverImg',
          foreignField: '_id',
          as: 'orderDetails.product.image',
        })
        .unwind('orderDetails.product.image')
        .lookup({
          from: 'categories',
          localField: 'orderDetails.product.categoryId',
          foreignField: '_id',
          as: 'orderDetails.product.category',
        })
        .unwind('orderDetails.product.category')
        .match(conditionFind)
        .group({
          _id: '$_id',
          createdDate: { $first: '$createdDate' },
          shippedDate: { $first: '$shippedDate' },
          paymentType: { $first: '$paymentType' },
          status: { $first: '$status' },
          customerId: { $first: '$customerId' },
          employeeId: { $first: '$employeeId' },
          orderDetails: { $push: '$orderDetails' },
          customer: { $first: '$customer' },
          totalPrice: { $first: '$totalPrice' },
        })
        .addFields({
          'customer.fullName': { $concat: ["$customer.firstName", " ", "$customer.lastName"] },
          // 'totalPrice': {
          //   $reduce: {
          //     input: '$orderDetails',
          //     initialValue: 0,
          //     in: {
          //       $add: [
          //         '$$value',
          //         { $multiply: ['$$this.quantity', '$$this.price'] }
          //       ]
          //     }
          //   }
          // },
        })

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: doQuery.length,
        payload: doQuery,
      });
    } catch (error) {
      console.log('««««« err »»»»»', error);
      return res.status(500).json({ code: 500, error: error });
    }
  },
};
