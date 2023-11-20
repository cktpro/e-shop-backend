const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const imageListSchema = new Schema(
  {
    mediaId:{ type: Schema.Types.ObjectId, ref: "Media", require: true },
    location: { type: String, required: true },
  },
  {
    versionKey: false,
  }
)
// Virtuals in console.log()
imageListSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
imageListSchema.set("toJSON", { virtuals: true });
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      maxLength: [50, "Product name must not exceed 50 characters"],
      unique: [true, "Product name is unique"],
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },

    discount: {
      type: Number,
      min: 0,
      max: 75,
      default: 0,
    },
    width: {type: Number,min: 0,default: 0,},
    height: {type: Number,min: 0,default: 0,},
    length: {type: Number,min: 0,default: 0,},
    weight: {type: Number,min: 0,default: 0,},
    coverImg: { type: Schema.Types.ObjectId, ref: "Media", require: true },
    imageList:[imageListSchema],
    categoryId: {
      type: Schema.Types.ObjectId,
      maxLength: [50, "CategoryId must not exceed 50 characters"],
      ref: "Category",
      require: true,
    },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", require: true },
    description: {
      type: String,
      maxLength: [3000, "Dscription must not exceed 3000 characters"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Virtual with Populate
productSchema.virtual("category", {
  ref: "Categories",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});
productSchema.virtual("image", {
  ref: "Media",
  localField: "coverImg",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("supplier", {
  ref: "Suppliers",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

// Config
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
//
productSchema.plugin(mongooseLeanVirtuals);
const Product = model("products", productSchema);
module.exports = Product;
