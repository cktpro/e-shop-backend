const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const flashsaleSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },

    flashsaleStock: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

flashsaleSchema.virtual('product', {
  ref: 'products',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

flashsaleSchema.virtual("image", {
  ref: "Media",
  localField: "product.coverImg",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in console.log()
flashsaleSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
flashsaleSchema.set("toJSON", { virtuals: true });

flashsaleSchema.plugin(mongooseLeanVirtuals);

const Flashsale = model('flashsale', flashsaleSchema);
module.exports = Flashsale;