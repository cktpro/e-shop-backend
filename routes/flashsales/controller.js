const { Flashsale, Product } = require('../../models');
const { fuzzySearch, asyncForEach } = require('../../helper');
const { insertDocuments } = require('../../helper/MongoDbHelper');

module.exports = {
  getAll: async (req, res, next) => { // NOTE

    try {
      const { page, pageSize } = req.query;

      const total = await Flashsale.countDocuments();

      const limit = pageSize || total;

      const skip = limit * page - limit || 0;

      let results = await Flashsale.find()
        .populate({
          path: 'product',
          populate: {
            path: 'image',
            model: 'media',
          },
        })
        .skip(skip)
        .limit(limit)
      // .lean();

      const numOfShow = results.length;

      return res.send(200, {
        statusCode: 200,
        total,
        numOfShow,
        page: parseInt(page || 1),
        pageSize: parseInt(pageSize || limit),
        payload: results,
      });
    } catch (err) {
      return res.send(500, {
        statusCode: 500,
        message: "Internal Server Error",
        errors: err.message,
      });
    }
  },

  create: async (req, res, next) => {
    try {
      const data = req.body;

      let errors = [];

      await asyncForEach(data, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
        });

        if (!product) errors.push(` Product ${item.productId} is not available !!!,`);

        if (product && product.stock < item.stock) errors.push(`Stock of product ${item.productId} is invalid !!!,`);

        // const flaseSale = await Flashsale.findOne({
        //   productId: item.productId,
        // });

        // if (flaseSale) {
        //   errors.push(` Product ${item.productId} is existed on Flash Sale model !!!,`);
        // }
      });

      if (errors.length > 0) {
        return res.send(400, {
          statusCode: 400,
          message: "Add products failed",
          errors,
        });
      }

      await Flashsale.deleteMany();

      let result = await insertDocuments(data, 'flashsale');

      return res.send(200, {
        statusCode: 200,
        message: "Add products to flashsale success",
        payload: result,
      });
    } catch (err) {
      return res.send(500, {
        statusCode: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
  },

  checkFlashsale: async (req, res, next) => {
    try {
      const { productId } = req.query;

      const checkItem = await Flashsale.findOne({ productId });

      if (checkItem) {
        return res.send(200, { statusCode: 200, message: "found", flashsaleStock: checkItem.flashsaleStock, discount: checkItem.discount });
      } else {
        return res.send(200, { statusCode: 200, message: "not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      let status;

      const result = await Flashsale.deleteMany();

      if (result) {
        status = "Deleted success"
        return res.send(200, { statusCode: 200, message: status });
      }

    } catch (error) {
      console.log('««««« error »»»»»', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
