const { Flashsale, Product } = require('../../models');
const { fuzzySearch, asyncForEach } = require('../../helper');
const { insertDocuments } = require('../../helper/MongoDbHelper');
// const ObjectId = require('mongodb').ObjectId;

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

  // getDetail: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;

  //     let result = await Flashsale.findOne({
  //       _id: id,
  //       isDeleted: false,
  //     })
  //       .populate('category')
  //       .populate('supplier');

  //     if (result) {
  //       return res.send(200, { message: "Tìm kiếm thành công", payload: result });
  //     }

  //     return res.status(200).send({ message: `Không tìm thấy sản phẩm có ID: ${id}` });
  //   } catch (err) {
  //     res.status(500).json({
  //       message: 'Tìm kiếm thất bại',
  //       errors: err.message,
  //     });
  //   }
  // },

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

        const flaseSale = await Flashsale.findOne({
          productId: item.productId,
        });

        if (flaseSale) {
          errors.push(` Product ${item.productId} is existed on Flash Sale model !!!,`);
        }
      });

      if (errors.length > 0) {
        return res.send(400, {
          statusCode: 400,
          message: "Add products failed",
          errors,
        });
      }

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
        res.send(200, { statusCode: 200, message: "found", stock: checkItem.stock, discount: checkItem.discount });
      } else {
        res.send(200, { statusCode: 200, message: "not found" });
      }
    } catch (error) {
      res.satus(500).json({ error: "Internal server error" });
    }
  }

  // update: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const dataUpdate = req.body;

  //     const findSupplier = Supplier.findOne({ _id: dataUpdate.supplierId, isDeleted: false });
  //     const findCategory = Category.findOne({ _id: dataUpdate.categoryId, isDeleted: false });

  //     const [doFindSupplier, doFindCategory] = await Promise.all([findSupplier, findCategory]);

  //     const errors = [];
  //     if (!doFindSupplier) {
  //       errors.push(' Nhà cung cấp không khả dụng');
  //     }
  //     if (!doFindCategory) {
  //       errors.push(' Danh mục không khả dụng');
  //     }

  //     if (errors.length > 0) {
  //       return res.send(200, { message: `Cập nhật sản phẩm thất bại,${errors}` })
  //     }

  //     // Update the product
  //     const updatedFlashSale = await Flashsale.findOneAndUpdate(
  //       { _id: id, isDeleted: false },
  //       dataUpdate,
  //       { new: true }
  //     );

  //     if (updatedFlashSale) {
  //       return res.status(200).json({
  //         message: "Cập nhật sản phẩm thành công",
  //         payload: updatedFlashSale,
  //       });
  //     }

  //     return res.status(404).json({ message: `Không tìm thấy sản phẩm có ID: ${id}` });
  //   } catch (error) {
  //     console.log('««««« error »»»»»', error);
  //     return res.send(500, {
  //       message: "Có lỗi",
  //       error,
  //     });
  //   }
  // },

  // delete: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;

  //     const conditionFind = {
  //       _id: id,
  //       isDeleted: false,
  //     }

  //     const result = await Flashsale.findOneAndUpdate(
  //       conditionFind,
  //       { isDeleted: true },
  //       { new: true },
  //     );

  //     if (result) {
  //       return res.send(200, {
  //         message: "Xóa thành công",
  //         payload: result,
  //       });
  //     }

  //     return res.send(404, {
  //       message: `Không tìm thấy sản phẩm có ID: ${id}`,
  //     });
  //   } catch (err) {
  //     return res.send(500, {
  //       message: "Thất bại",
  //       errors: err.message,
  //     });
  //   }
  // },
};
