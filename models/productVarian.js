const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productVarianSchema = new Schema(
  {
    productItemId: { type: Schema.Types.ObjectId, ref: "ProductItem", require: true },

    varianOptionId:{type:Schema.Types.ObjectId,require:true},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
productVarianSchema.set("toJSON", { virtuals: true });
productVarianSchema.set("toObject", { virtuals: true });
//
productVarianSchema.plugin(mongooseLeanVirtuals);
const ProductVarians = model("productVarians", productVarianSchema);
module.exports = ProductVarians;
