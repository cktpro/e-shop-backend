const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productVarianSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products", require: true },
    color: {
      type: String,
      require: [true, "Màu không được để trống"],
      maxLength: [50, "Màu không được vượt quá 50 ký tự"],
    },
    memory: {
      type: String,
      require: [true, "Dung lượng không được để trống"],
      maxLength: [50, "Dugn lượng không được vượt quá 50 ký tự"],
    },
    price: {
      type: Number,
      require: [true, "Giá không được để trống"],
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    width: {
      type: Number,
      min: 0,
      default: 0,
    },
    height: {
      type: Number,
      min: 0,
      default: 0,
    },
    length: {
        type: Number,
        min: 0,
        default: 0,
      },
      weight: {
        type: Number,
        min: 0,
        default: 0,
      },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
productVarianSchema.virtual('product', {
    ref: 'products',
    localField: 'productId',
    foreignField: '_id',
    justOne: true,
  });
productVarianSchema.set("toJSON", { virtuals: true });
productVarianSchema.set("toObject", { virtuals: true });
//
productVarianSchema.plugin(mongooseLeanVirtuals);
const ProductVarians = model("productVarians", productVarianSchema);
module.exports = ProductVarians;
