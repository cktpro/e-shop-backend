const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products", require: true },

    SKU: {
      type: String,
      require: [true, "SKU không được để trống"],
      maxLength: [50, "SKUkhông được vượt quá 50 ký tự"],
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
    mediaId:{type:Schema.Types.ObjectId,ref:"Media",require:true},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
productItemSchema.virtual('product', {
    ref: 'products',
    localField: 'productId',
    foreignField: '_id',
    justOne: true,
  });
  productItemSchema.set("toJSON", { virtuals: true });
productItemSchema.set("toObject", { virtuals: true });
//
productItemSchema.plugin(mongooseLeanVirtuals);
const ProductItem = model("productItems", productItemSchema);
module.exports = ProductItem;
