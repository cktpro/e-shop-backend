const mongoose = require("mongoose");
const {
  Product,
  Category,
  Supplier,
  ProductVarians,
} = require("../../models/");
const {
  fuzzySearch,
  // combineObjects,
} = require("../../helper");

module.exports = {
  getList: async (req, res, next) => {
    try {
      const { page, pageSize, categoryId,supplierId } = req.query;
      const pages = page || 1;
      const limit = pageSize || 20;
      const skip = (pages - 1) * limit;
      const conditionFind = { isDeleted: false };
      if (categoryId) conditionFind.categoryId = categoryId;
      if (supplierId) conditionFind.supplierId = supplierId;
      const result = await Product.find(conditionFind)
        .populate("image")
        .populate("category")
        .populate("supplier")
        .skip(skip)
        .limit(limit);
      const total = await Product.countDocuments(conditionFind);

      return res.send(200, {
        message: "Thành công",
        payload: result,
        total: total,
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  search: async (req, res, next) => {
    try {
      const { name, priceEnd, priceStart, discountStart, discountEnd } =
        req.query;
      const conditionFind = { isDeleted: false };

      if (name) conditionFind.name = fuzzySearch(name);
      if (discountStart && discountEnd) {
        const compareStart = { $lte: ["$discount", discountEnd] }; // '$field'
        const compareEnd = { $gte: ["$discount", discountStart] };
        conditionFind.$expr = { $and: [compareStart, compareEnd] };
      } else if (discountStart) {
        conditionFind.discount = { $gte: parseFloat(discountStart) };
      } else if (discountEnd) {
        conditionFind.discount = { $lte: parseFloat(discountEnd) };
      }
      if (priceEnd && priceStart) {
        const compareStart = { $lte: ["$price", priceEnd] }; // '$field'
        const compareEnd = { $gte: ["$price", priceStart] };
        conditionFind.$expr = { $and: [compareStart, compareEnd] };
      } else if (priceStart) {
        conditionFind.price = { $gte: parseFloat(priceStart) };
      } else if (priceEnd) {
        conditionFind.price = { $lte: parseFloat(priceEnd) };
      }
      const result = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        .lean();
      if (result) {
        return res.send(200, {
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send(404, {
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(404, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const objId = new mongoose.Types.ObjectId(id);
    // const obj= new objId(id)
    // console.log('◀◀◀ obj ▶▶▶',obj);

    try {
      const result = await Product.findOne({ _id: id ,isDeleted:false})
        .populate("category")
        .populate("supplier")
        .populate("image");
      // const result = await Product.aggregate()
      //   .match({ _id: objId })
      //   .lookup({
      //     from: "productvarians",
      //     localField: "_id",
      //     foreignField: "productId",
      //     as: "productVarians",
      //   })
      //   .lookup({
      //     from: "categories",
      //     localField: "categoryId",
      //     foreignField: "_id",
      //     as: "category",
      //   })
      //   .lookup({
      //     from: "suppliers",
      //     localField: "supplierId",
      //     foreignField: "_id",
      //     as: "supplier",
      //   })
      //   .lookup({
      //     from: "media",
      //     localField: "mediaId",
      //     foreignField: "_id",
      //     as: "image",
      //   })
      //   .unwind("category", "supplier", "image");
      if (result) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }
      return res.send(400, {
        message: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(404, {
        message: "Thất bại",
        errorL: err,
      });
    }
  },
  create: async (req, res, next) => {
    const {
      name,
      price,
      stock,
      width,
      height,
      length,
      weight,
      discount,
      categoryId,
      supplierId,
      description,
      coverImg,
      imageList,
      isDeleted,
    } = req.body;
    try {
      // const { color, memory, price, stock, width, height, length, weight } =
      //   productVarians;
      // const newVarian = new ProductVarians({
      //   color,
      //   memory,
      //   price,
      //   stock,
      //   width,
      //   height,
      //   length,
      //   weight,
      // });
      const newRecord = new Product({
        name,
        price,
        stock,
        width,
        height,
        length,
        weight,
        discount,
        categoryId,
        supplierId,
        description,
        coverImg,
        imageList,
        isDeleted,
      });
      const result = await newRecord.save();
      // const varianResult = await newVarian.save()
      return res.status(200).json({
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const {
      name,
      price,
      stock,
      width,
      height,
      length,
      weight,
      discount,
      categoryId,
      supplierId,
      description,
      mediaId,
      isDeleted,
    } = req.body;
    try {
      const result = await Product.findByIdAndUpdate(
        id,
        {
          name,
          price,
          stock,
          width,
          height,
          length,
          weight,
          discount,
          categoryId,
          supplierId,
          description,
          mediaId,
          isDeleted,
        },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          message: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 400,
        message: "Thất bại",
      });
    } catch (err) {
      return res.send({ code: 400, message: "Thất bại", error: err });
    }
  },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Product.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          message: "Thành công xóa",
        });
      }
      return res.send({
        code: 400,
        message: "Thất bại",
      });
    } catch (err) {
      return res.send({
        code: 400,
        message: "Thất bại",
        error: err,
      });
    }
  },
  // hardDelete: async(req,res,next)=>{
  //   const {id} =req.params;
  //   const newProductList=products.filter((item)=>item.id.toString()!==id.toString())
  //   await writeFileSync(patch,newProductList)
  //   return res.send(200, {
  //       message: "Thành công xóa",
  //     });
  // }
};
