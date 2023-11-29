const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const cartDetailSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products", require: true },
    quantity: { type: Number, require: true, min: 0 },
  },
  {
    versionKey: false,
  }
);
// Virtual with Populate
cartDetailSchema.virtual("details", {
  ref: "products",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});
// Virtuals in console.log()
cartDetailSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
cartDetailSchema.set("toJSON", { virtuals: true });

cartDetailSchema.plugin(mongooseLeanVirtuals);
// -----------------------------------------------\
const cartSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", require: true },
    product: [cartDetailSchema],
  },
  {
    versionKey: false,
  }
);
// Virtual with Populate
cartSchema.virtual('customer',{
    ref:'Customer',
    localField:'customerId',
    foreignField:'_id',
    justOne:true,
})
// Virtuals in console.log()
cartSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
cartSchema.set("toJSON", { virtuals: true });

cartSchema.plugin(mongooseLeanVirtuals);

const Cart = model('carts', cartSchema);
module.exports = Cart;