const {
  Order,
  Cart,
} = require("../../../models");
const { asyncForEach, fuzzySearch } = require("../../../helper");
const { mongoose } = require("mongoose");
const { array } = require("yup");
module.exports = {
  getList: async (req, res, next) => {
    const { id } = req.user;
    const objId = new mongoose.Types.ObjectId(id);
    try {
      const result = await Cart.aggregate()
        .match({ customerId: objId })
        // .lookup({
        //   from:"customers",
        //   as:"customer",
        //   localField:"customerId",
        //   foreignField:"_id"
        // })
        .unwind("product")
        .lookup(
          {
          from:"products",
          as:"productDetail",
          localField:"product.productId",
          foreignField:"_id"
          }
        )
        .unwind("productDetail")
        .lookup(
          {
          from:"media",
          as:"image",
          localField:"productDetail.coverImg",
          foreignField:"_id"
          }
        ).unwind("image")
        
      // .find({customerId:id});
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
      });
    }
  },
  // search: async (req, res, next) => {
  //   try {
  //     const { name } = req.query;
  //     const conditionFind = { isDeleted: false };
  //     if (name) conditionFind.name = fuzzySearch(name);
  //     const result = Order.find(conditionFind);
  //     if (result) {
  //       return res.send({
  //         code: 200,
  //         mesage: "Thành công",
  //         payload: result,
  //       });
  //     }
  //     return res.send({
  //       code: 404,
  //       mesage: "Không tìm thấy",
  //     });
  //   } catch (error) {
  //     return res.send({
  //       code: 400,
  //       mesage: "Thất bại",
  //       error: error,
  //     });
  //   }
  // },
  // getDetail: async (req, res, next) => {
  //   const { id } = req.params;
  //   try {
  //     const result = await Order.findOne({ _id: id });
  //     if (result) {
  //       return res.send({
  //         code: 200,
  //         mesage: "Thành công",
  //         payload: result,
  //       });
  //     }
  //     return res.send({
  //       code: 404,
  //       mesage: "Thất bại",
  //     });
  //   } catch (err) {
  //     return res.send({
  //       code: 400,
  //       mesage: "Thất bại",
  //       error: err,
  //     });
  //   }
  // },
  create: async function (req, res, next) {
    try {
      const { id } = req.user;
      const data = req.body;
      const exitCart = await Cart.findOne({ customerId: id });
      if (!exitCart) {
        const newRecord = new Cart({
          customerId: id,
          product: data,
        });
        const ress = await newRecord.save();
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: ress,
        });
      }
      // if(!exitCart.product.length>0){
      //   return res.send({
      //   code: 200,

      //   });
      // }

      // if (!customer || customer.isDelete)
      //   errors.push('Khách hàng không tồn tại');
      // if (!employee || employee.isDelete)
      //   errors.push('Nhân viên không tồn tại');
      // if (errors.length > 0) {
      //   return res.status(404).json({
      //     code: 404,
      //     message: 'Lỗi',
      //     errors,
      //   });
      // }
      // const newItem =new Cart({
      //   customerId:id,
      //   product

      // })
      //       // const newItem = new Order(data);

      //       let result = await newItem.save();

      // await asyncForEach(result.orderDetails, async (item) => {
      //   await Product.findOneAndUpdate(
      //     { _id: item.productId },
      //     { $inc: { stock: -item.quantity } }
      //     );
      // });
      const exitItem = await Cart.findOne({
        "product.productId": data.productId,
      });
      if (!exitItem) {
        await Cart.updateOne(
          { customerId: id },
          { $push: { product: data } },
          { upsert: true }
        );
      } else {
        await Cart.updateOne(
          { customerId: id, "product.productId": data.productId },
          { $inc: { "product.$.quantity": data.quantity } }
        );
      }

      const final = await Cart.findOne({customerId:id});
      return res.send({
        code: 203,
        message: "Tạo thành công",
        payload: final,
      });
    } catch (err) {
      console.log("◀◀◀ err ▶▶▶", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  update: async (req, res, next) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    try {
      const result = await Cart.updateOne(
        { customerId: userId, "product.productId": productId },
        { $set: { "product.$.quantity": quantity } },
        { upsert: true }
      );

      const final = await Cart.find({customerId:userId});

      return res.send({
        code: 200,
        payload: final,
        message: "Cập nhật giỏ hàng thành công",
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  softDelete: async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;
    try {
      const result = await Cart.updateOne(
        { customerId: userId },
        { $pull: { product: { productId: productId } } }
      );
      console.log("◀◀◀ result ▶▶▶", result);
      const result2 = await Cart.find();
      //   id,
      //   { isDeleted: true },
      //   { new: true }
      // );
      // if (result) {
      //   return res.send({
      //     code: 200,
      //     mesage: "Thành công xóa",
      //   });
      // }
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result2,
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  deleteCart: async (req, res, next) => {
    const userId = req.user.id;
    try {
      await Cart.findOneAndDelete(
        { customerId: userId },
      );
      const result2 = await Cart.find();
      //   id,
      //   { isDeleted: true },
      //   { new: true }
      // );
      // if (result) {
      //   return res.send({
      //     code: 200,
      //     mesage: "Thành công xóa",
      //   });
      // }
      return res.send({
        code: 200,
        mesage: "Thành công",
        payload: result2,
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
